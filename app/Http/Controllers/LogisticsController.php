<?php

namespace App\Http\Controllers;

use App\Enums\ItemStatus;
use App\Enums\LogisticsPriority;
use App\Enums\LogisticsStatus;
use App\Enums\LogisticsType;
use App\Http\Requests\StoreLogisticsRequest;
use App\Models\Item;
use App\Models\LogisticsRequest;
use App\Support\ReferenceCode;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LogisticsController extends Controller
{
    private const TYPE_DEFAULTS = [
        'Inbound' => ['origin' => 'Supplier Hub', 'destination' => 'Main Warehouse'],
        'Outbound' => ['origin' => 'Main Warehouse', 'destination' => 'Branch A'],
        'Transfer' => ['origin' => 'Main Warehouse', 'destination' => 'Branch B'],
        'Return' => ['origin' => 'Branch A', 'destination' => 'Main Warehouse'],
    ];

    public function index(Request $request): View
    {
        $allRequests = LogisticsRequest::query()->get();

        return view('pages.logistics', [
            'items' => Item::query()
                ->where('status', '!=', ItemStatus::Disposed)
                ->orderBy('code')
                ->get(),
            'requests' => $this->filteredQuery($request)
                ->with('items')
                ->latest('updated_at')
                ->get(),
            'filters' => [
                'search' => $request->string('search')->toString(),
                'status' => $request->string('status')->toString() ?: 'All',
            ],
            'typeDefaults' => self::TYPE_DEFAULTS,
            'types' => LogisticsType::values(),
            'priorities' => LogisticsPriority::values(),
            'statuses' => LogisticsStatus::values(),
            'counts' => [
                'total' => $allRequests->count(),
                'pending' => $allRequests->where('status', LogisticsStatus::Requested)->count(),
                'approved' => $allRequests->whereIn('status', [LogisticsStatus::Approved, LogisticsStatus::Packed])->count(),
                'approved_only' => $allRequests->where('status', LogisticsStatus::Approved)->count(),
                'packed' => $allRequests->where('status', LogisticsStatus::Packed)->count(),
                'in_transit' => $allRequests->where('status', LogisticsStatus::InTransit)->count(),
                'completed' => $allRequests->whereIn('status', [LogisticsStatus::Delivered, LogisticsStatus::Returned])->count(),
                'cancelled' => $allRequests->where('status', LogisticsStatus::Cancelled)->count(),
            ],
        ]);
    }

    public function store(StoreLogisticsRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $lineItems = collect($validated['line_items']);
        $items = Item::query()
            ->whereIn('code', $lineItems->pluck('item_code'))
            ->get()
            ->keyBy('code');

        foreach ($lineItems as $index => $lineItem) {
            $item = $items->get($lineItem['item_code']);

            if (! $item) {
                return back()->withInput()->with('flash', [
                    'type' => 'error',
                    'message' => 'Select a valid inventory item for row '.($index + 1).'.',
                ]);
            }

            if ($item->status === ItemStatus::Disposed) {
                return back()->withInput()->with('flash', [
                    'type' => 'error',
                    'message' => 'Disposed items cannot be used in logistics requests. Row '.($index + 1)." is {$item->code}.",
                ]);
            }
        }

        $logisticsRequest = LogisticsRequest::query()->create([
            'code' => ReferenceCode::next(LogisticsRequest::class, 'code', 'LGX'),
            'type' => $validated['type'],
            'origin' => trim($validated['origin']),
            'destination' => trim($validated['destination']),
            'requested_by_user_id' => $request->user()?->id,
            'requested_by_name' => $request->user()?->name ?? 'Unknown',
            'handler' => trim($validated['handler']),
            'priority' => $validated['priority'],
            'status' => LogisticsStatus::Requested->value,
            'scheduled_date' => $validated['scheduled_date'],
            'notes' => $validated['notes'] ?: null,
        ]);

        $logisticsRequest->items()->createMany($lineItems->map(function (array $lineItem) use ($items): array {
            $item = $items->get($lineItem['item_code']);

            return [
                'item_id' => $item->id,
                'item_code' => $item->code,
                'item_name' => $item->name,
                'quantity' => $lineItem['quantity'],
            ];
        })->all());

        return redirect()->route('logistics.index')->with('flash', [
            'type' => 'success',
            'message' => sprintf(
                'Batch request %s created with %d item(s).',
                $logisticsRequest->code,
                $lineItems->count(),
            ),
        ]);
    }

    public function advance(LogisticsRequest $logisticsRequest): RedirectResponse
    {
        $nextStatus = $logisticsRequest->nextStatus();
        $currentStatus = $logisticsRequest->status;

        if (! $nextStatus) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => "{$logisticsRequest->code} cannot advance from {$currentStatus->value}.",
            ]);
        }

        $logisticsRequest->update([
            'status' => $nextStatus->value,
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => "{$logisticsRequest->code} moved from {$currentStatus->value} to {$nextStatus->value}.",
        ]);
    }

    public function cancel(LogisticsRequest $logisticsRequest): RedirectResponse
    {
        if ($logisticsRequest->isTerminal()) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => "{$logisticsRequest->code} can no longer be cancelled.",
            ]);
        }

        $logisticsRequest->update([
            'status' => LogisticsStatus::Cancelled->value,
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => "{$logisticsRequest->code} was cancelled.",
        ]);
    }

    private function filteredQuery(Request $request): Builder
    {
        $search = trim($request->string('search')->toString());
        $status = $request->string('status')->toString();

        return LogisticsRequest::query()
            ->when($status && $status !== 'All', fn (Builder $query) => $query->where('status', $status))
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $nested) use ($search): void {
                    $nested
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('origin', 'like', "%{$search}%")
                        ->orWhere('destination', 'like', "%{$search}%")
                        ->orWhere('handler', 'like', "%{$search}%")
                        ->orWhere('requested_by_name', 'like', "%{$search}%")
                        ->orWhereHas('items', function (Builder $items) use ($search): void {
                            $items
                                ->where('item_code', 'like', "%{$search}%")
                                ->orWhere('item_name', 'like', "%{$search}%")
                                ->orWhere('quantity', 'like', "%{$search}%");
                        });
                });
            });
    }
}

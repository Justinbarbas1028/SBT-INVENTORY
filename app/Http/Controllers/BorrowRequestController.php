<?php

namespace App\Http\Controllers;

use App\Enums\BorrowRequestStatus;
use App\Enums\ItemStatus;
use App\Http\Requests\StoreBorrowRequest;
use App\Models\BorrowRequest;
use App\Models\Item;
use App\Models\User;
use App\Support\ReferenceCode;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;

class BorrowRequestController extends Controller
{
    public function create(): View
    {
        return view('pages.request-item', [
            'items' => Item::query()
                ->where('status', '!=', ItemStatus::Disposed)
                ->orderBy('code')
                ->get(),
        ]);
    }

    public function store(StoreBorrowRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $lineItems = collect($validated['line_items']);
        $items = Item::query()
            ->whereIn('code', $lineItems->pluck('item_code'))
            ->get()
            ->keyBy('code');

        foreach ($lineItems as $index => $lineItem) {
            $item = $items->get($lineItem['item_code']);

            if (! $item || $item->status === ItemStatus::Disposed) {
                return back()->withInput()->with('flash', [
                    'type' => 'error',
                    'message' => 'Select a valid inventory item for row '.($index + 1).'.',
                ]);
            }
        }

        $matchedUser = User::query()
            ->active()
            ->where(function (Builder $query) use ($validated): void {
                $query
                    ->where('employee_number', $validated['employee_number'])
                    ->orWhere('email', $validated['employee_email']);
            })
            ->first();

        $borrowRequest = BorrowRequest::query()->create([
            'code' => ReferenceCode::next(BorrowRequest::class, 'code', 'BRQ'),
            'employee_number' => $validated['employee_number'],
            'employee_email' => $validated['employee_email'],
            'requested_by_name' => $matchedUser?->name ?? $validated['employee_number'],
            'requested_by_user_id' => $matchedUser?->id,
            'status' => BorrowRequestStatus::Pending->value,
        ]);

        $borrowRequest->items()->createMany($lineItems->map(function (array $lineItem) use ($items): array {
            $item = $items->get($lineItem['item_code']);

            return [
                'item_id' => $item->id,
                'item_code' => $item->code,
                'item_name' => $item->name,
                'quantity' => $lineItem['quantity'],
            ];
        })->all());

        return redirect()->route('borrow-requests.create')->with('flash', [
            'type' => 'success',
            'message' => sprintf(
                'Request %s logged for %s with %d item(s).',
                $borrowRequest->code,
                $borrowRequest->requested_by_name,
                $lineItems->count(),
            ),
        ]);
    }
}

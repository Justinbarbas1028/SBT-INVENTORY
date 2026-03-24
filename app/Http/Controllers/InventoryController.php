<?php

namespace App\Http\Controllers;

use App\Enums\ItemCategory;
use App\Enums\ItemStatus;
use App\Http\Requests\InventoryBulkActionRequest;
use App\Models\Item;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InventoryController extends Controller
{
    public function index(Request $request): View
    {
        $sort = $this->resolveSort($request->string('sort')->toString());
        $direction = $request->input('direction') === 'desc' ? 'desc' : 'asc';

        return view('pages.inventory', [
            'items' => $this->filteredQuery($request)
                ->with('assignedUser')
                ->orderBy($sort, $direction)
                ->orderBy('code')
                ->get(),
            'categories' => ItemCategory::values(),
            'filters' => [
                'category' => $request->string('category')->toString() ?: 'All',
                'search' => $request->string('search')->toString(),
                'sort' => $request->string('sort')->toString() ?: 'code',
                'direction' => $direction,
            ],
        ]);
    }

    public function bulkUpdate(InventoryBulkActionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $items = Item::query()
            ->whereKey($validated['selected_ids'])
            ->withCount('transactions')
            ->get();

        if ($items->isEmpty()) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Select at least one inventory item.',
            ]);
        }

        return match ($validated['action']) {
            'mark_in_stock' => $this->markInStock($items),
            'mark_disposed' => $this->markDisposed($items),
            'delete' => $this->deleteItems($items),
        };
    }

    public function export(Request $request): StreamedResponse
    {
        $selectedIds = collect($request->input('selected_ids', []))
            ->filter(fn ($value) => is_numeric($value))
            ->map(fn ($value) => (int) $value)
            ->values();

        $items = $this->filteredQuery($request)
            ->when($selectedIds->isNotEmpty(), fn (Builder $query) => $query->whereKey($selectedIds))
            ->with('assignedUser')
            ->orderBy('code')
            ->get();

        return response()->streamDownload(function () use ($items): void {
            $output = fopen('php://output', 'wb');
            fputcsv($output, ['Item ID', 'Name', 'Category', 'Status', 'Employee ID', 'Date Added']);

            foreach ($items as $item) {
                fputcsv($output, [
                    $item->code,
                    $item->name,
                    $item->category->value,
                    $item->status->value,
                    $item->assignedUser?->employee_number ?? $item->assigned_reference,
                    optional($item->date_added)->toDateString(),
                ]);
            }

            fclose($output);
        }, 'inventory_export.csv');
    }

    private function filteredQuery(Request $request): Builder
    {
        $category = $request->string('category')->toString();
        $search = trim($request->string('search')->toString());

        return Item::query()
            ->when($category && $category !== 'All', fn (Builder $query) => $query->where('category', $category))
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $nested) use ($search): void {
                    $nested
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%")
                        ->orWhere('assigned_reference', 'like', "%{$search}%")
                        ->orWhereHas('assignedUser', function (Builder $assigned) use ($search): void {
                            $assigned
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('employee_number', 'like', "%{$search}%");
                        });
                });
            });
    }

    private function resolveSort(string $sort): string
    {
        return match ($sort) {
            'name', 'category', 'status', 'assigned_reference' => $sort,
            default => 'code',
        };
    }

    private function markInStock($items): RedirectResponse
    {
        Item::query()
            ->whereKey($items->pluck('id'))
            ->update([
                'status' => ItemStatus::InStock->value,
                'assigned_user_id' => null,
                'assigned_reference' => null,
            ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => sprintf('%d selected item(s) marked as In Stock.', $items->count()),
        ]);
    }

    private function markDisposed($items): RedirectResponse
    {
        Item::query()
            ->whereKey($items->pluck('id'))
            ->update([
                'status' => ItemStatus::Disposed->value,
                'assigned_user_id' => null,
                'assigned_reference' => null,
            ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => sprintf('%d selected item(s) marked as Disposed.', $items->count()),
        ]);
    }

    private function deleteItems($items): RedirectResponse
    {
        if ($items->contains(fn (Item $item): bool => $item->transactions_count > 0)) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Items with transaction history cannot be deleted. Mark them as disposed instead.',
            ]);
        }

        Item::query()->whereKey($items->pluck('id'))->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => sprintf('%d selected item(s) deleted.', $items->count()),
        ]);
    }
}

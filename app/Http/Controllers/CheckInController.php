<?php

namespace App\Http\Controllers;

use App\Enums\ItemCategory;
use App\Enums\ItemStatus;
use App\Enums\TransactionType;
use App\Http\Requests\CheckInItemRequest;
use App\Models\Item;
use App\Models\Transaction;
use App\Support\ReferenceCode;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;

class CheckInController extends Controller
{
    public function create(): View
    {
        return view('pages.check-in', [
            'categories' => ItemCategory::values(),
            'itemLookup' => Item::query()
                ->orderBy('code')
                ->get(['code', 'name', 'category', 'status'])
                ->map(fn (Item $item): array => [
                    'code' => $item->code,
                    'name' => $item->name,
                    'category' => $item->category->value,
                    'status' => $item->status->value,
                ]),
        ]);
    }

    public function store(CheckInItemRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $item = Item::query()->where('code', $validated['item_code'])->firstOrFail();

        if ($item->status === ItemStatus::Disposed) {
            return back()->withInput()->with('flash', [
                'type' => 'error',
                'message' => 'Disposed items cannot be checked in.',
            ]);
        }

        $item->update([
            'name' => trim($validated['name']),
            'category' => $validated['category'],
            'status' => ItemStatus::InStock->value,
            'assigned_user_id' => null,
            'assigned_reference' => null,
        ]);

        Transaction::query()->create([
            'code' => ReferenceCode::next(Transaction::class, 'code', 'TXN'),
            'item_id' => $item->id,
            'item_name' => $item->name,
            'type' => TransactionType::In->value,
            'transacted_at' => now(),
            'person_reference' => $request->user()?->name ?? 'Unknown',
            'performed_by_user_id' => $request->user()?->id,
            'notes' => $validated['notes'] ?: null,
        ]);

        return redirect()->route('check-in.create')->with('flash', [
            'type' => 'success',
            'message' => "Successfully checked in {$item->name} ({$item->code}).",
        ]);
    }
}

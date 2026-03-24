<?php

namespace App\Http\Controllers;

use App\Enums\ItemCategory;
use App\Enums\ItemStatus;
use App\Enums\TransactionType;
use App\Http\Requests\StoreItemRequest;
use App\Models\Item;
use App\Models\Transaction;
use App\Support\ReferenceCode;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;

class ItemRegistrationController extends Controller
{
    public function create(): View
    {
        return view('pages.register-item', [
            'categories' => ItemCategory::values(),
            'totalItems' => Item::query()->count(),
            'inStockCount' => Item::query()->where('status', ItemStatus::InStock)->count(),
            'suggestedCode' => ReferenceCode::next(Item::class, 'code', 'ITM'),
        ]);
    }

    public function store(StoreItemRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $item = Item::query()->create([
            'code' => $validated['code'] ?: ReferenceCode::next(Item::class, 'code', 'ITM'),
            'name' => trim($validated['name']),
            'category' => $validated['category'],
            'status' => ItemStatus::InStock->value,
            'date_added' => now()->toDateString(),
            'qr_code' => 'QR-'.($validated['code'] ?: ReferenceCode::next(Item::class, 'code', 'ITM')),
            'notes' => $validated['notes'] ?: null,
        ]);

        Transaction::query()->create([
            'code' => ReferenceCode::next(Transaction::class, 'code', 'TXN'),
            'item_id' => $item->id,
            'item_name' => $item->name,
            'type' => TransactionType::In->value,
            'transacted_at' => now(),
            'person_reference' => $request->user()?->name ?? 'Unknown',
            'performed_by_user_id' => $request->user()?->id,
            'notes' => filled($validated['notes'])
                ? 'Registered item: '.$validated['notes']
                : 'Registered new item',
        ]);

        return redirect()->route('items.create')->with('flash', [
            'type' => 'success',
            'message' => "Registered {$item->name} ({$item->code}) as a new inventory item.",
        ]);
    }
}

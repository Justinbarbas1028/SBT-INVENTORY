<?php

namespace App\Http\Controllers;

use App\Enums\ItemStatus;
use App\Enums\TransactionType;
use App\Http\Requests\CheckOutItemRequest;
use App\Models\Item;
use App\Models\Transaction;
use App\Models\User;
use App\Support\ReferenceCode;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;

class CheckOutController extends Controller
{
    public function create(): View
    {
        return view('pages.check-out', [
            'itemLookup' => Item::query()
                ->orderBy('code')
                ->get(['code', 'name', 'status'])
                ->map(fn (Item $item): array => [
                    'code' => $item->code,
                    'name' => $item->name,
                    'status' => $item->status->value,
                ]),
        ]);
    }

    public function store(CheckOutItemRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $item = Item::query()->where('code', $validated['item_code'])->firstOrFail();

        if ($item->status === ItemStatus::CheckedOut) {
            return back()->withInput()->with('flash', [
                'type' => 'error',
                'message' => 'Item is already checked out.',
            ]);
        }

        if ($item->status === ItemStatus::Disposed) {
            return back()->withInput()->with('flash', [
                'type' => 'error',
                'message' => 'Disposed items cannot be checked out.',
            ]);
        }

        $matchedUser = User::query()
            ->active()
            ->where(function ($query) use ($validated): void {
                $query
                    ->where('employee_number', $validated['assigned_reference'])
                    ->orWhere('email', strtolower($validated['assigned_reference']));
            })
            ->first();

        $item->update([
            'status' => ItemStatus::CheckedOut->value,
            'assigned_user_id' => $matchedUser?->id,
            'assigned_reference' => $validated['assigned_reference'],
        ]);

        Transaction::query()->create([
            'code' => ReferenceCode::next(Transaction::class, 'code', 'TXN'),
            'item_id' => $item->id,
            'item_name' => $item->name,
            'type' => TransactionType::Out->value,
            'transacted_at' => now(),
            'person_reference' => $matchedUser?->name ?? $validated['assigned_reference'],
            'performed_by_user_id' => $request->user()?->id,
            'notes' => $validated['notes'] ?: null,
        ]);

        $target = $matchedUser?->name ?? $validated['assigned_reference'];

        return redirect()->route('check-out.create')->with('flash', [
            'type' => 'success',
            'message' => "Successfully checked out {$item->name} to {$target}.",
        ]);
    }
}

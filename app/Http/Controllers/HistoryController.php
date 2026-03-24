<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class HistoryController extends Controller
{
    public function index(Request $request): View
    {
        return view('pages.history', [
            'transactions' => $this->filteredQuery($request)->latest('transacted_at')->get(),
            'filters' => [
                'search' => $request->string('search')->toString(),
                'type' => $request->string('type')->toString() ?: 'All',
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $transactions = $this->filteredQuery($request)->latest('transacted_at')->get();

        return response()->streamDownload(function () use ($transactions): void {
            $output = fopen('php://output', 'wb');
            fputcsv($output, ['Transaction ID', 'Item ID', 'Item Name', 'Type', 'Date', 'Employee ID', 'Notes']);

            foreach ($transactions as $transaction) {
                fputcsv($output, [
                    $transaction->code,
                    $transaction->item?->code,
                    $transaction->item_name,
                    $transaction->type->value,
                    optional($transaction->transacted_at)->format('Y-m-d H:i:s'),
                    $transaction->person_reference,
                    $transaction->notes,
                ]);
            }

            fclose($output);
        }, 'transaction_history.csv');
    }

    private function filteredQuery(Request $request): Builder
    {
        $search = trim($request->string('search')->toString());
        $type = $request->string('type')->toString();

        return Transaction::query()
            ->with('item')
            ->when($type && $type !== 'All', fn (Builder $query) => $query->where('type', $type))
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $nested) use ($search): void {
                    $nested
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('item_name', 'like', "%{$search}%")
                        ->orWhere('person_reference', 'like', "%{$search}%")
                        ->orWhereHas('item', fn (Builder $item) => $item->where('code', 'like', "%{$search}%"));
                });
            });
    }
}

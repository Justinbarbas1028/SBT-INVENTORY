<?php

namespace App\Http\Controllers;

use App\Enums\ItemStatus;
use App\Models\Item;
use App\Models\Transaction;
use Illuminate\Contracts\View\View;

class DashboardController extends Controller
{
    public function __invoke(): View
    {
        $totalItems = Item::query()->count();
        $inStockItems = Item::query()->where('status', ItemStatus::InStock)->count();
        $checkedOutItems = Item::query()->where('status', ItemStatus::CheckedOut)->count();

        return view('pages.dashboard', [
            'stats' => [
                ['label' => 'Total Items', 'value' => $totalItems, 'tone' => 'slate'],
                ['label' => 'In Stock', 'value' => $inStockItems, 'tone' => 'emerald'],
                ['label' => 'Checked Out', 'value' => $checkedOutItems, 'tone' => 'amber'],
                ['label' => 'Total Transactions', 'value' => Transaction::query()->count(), 'tone' => 'indigo'],
            ],
            'recentTransactions' => Transaction::query()
                ->latest('transacted_at')
                ->limit(5)
                ->get(),
            'inventoryBreakdown' => [
                'total' => $totalItems,
                'in_stock' => $inStockItems,
                'checked_out' => $checkedOutItems,
            ],
        ]);
    }
}

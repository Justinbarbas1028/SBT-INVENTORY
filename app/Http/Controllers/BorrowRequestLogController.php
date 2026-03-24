<?php

namespace App\Http\Controllers;

use App\Enums\BorrowRequestStatus;
use App\Http\Requests\ReviewBorrowRequestRequest;
use App\Models\BorrowRequest;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BorrowRequestLogController extends Controller
{
    public function index(Request $request): View
    {
        $allRequests = BorrowRequest::query()->get();

        return view('pages.request-logs', [
            'requests' => $this->filteredQuery($request)
                ->with('items')
                ->latest()
                ->get(),
            'filters' => [
                'search' => $request->string('search')->toString(),
                'status' => $request->string('status')->toString() ?: 'All',
            ],
            'counts' => [
                'total' => $allRequests->count(),
                'pending' => $allRequests->where('status', BorrowRequestStatus::Pending)->count(),
                'approved' => $allRequests->where('status', BorrowRequestStatus::Approved)->count(),
                'denied' => $allRequests->where('status', BorrowRequestStatus::Denied)->count(),
            ],
        ]);
    }

    public function review(ReviewBorrowRequestRequest $request, BorrowRequest $borrowRequest): RedirectResponse
    {
        if ($borrowRequest->status !== BorrowRequestStatus::Pending) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => "{$borrowRequest->code} has already been reviewed.",
            ]);
        }

        $validated = $request->validated();

        $borrowRequest->update([
            'status' => $validated['decision'],
            'reviewed_at' => now(),
            'reviewed_by_user_id' => $request->user()?->id,
            'reviewed_by_name' => $request->user()?->name ?? 'Super Admin',
            'review_note' => $validated['review_note'] ?: null,
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => "{$borrowRequest->code} was ".strtolower($validated['decision']).' successfully.',
        ]);
    }

    private function filteredQuery(Request $request): Builder
    {
        $search = trim($request->string('search')->toString());
        $status = $request->string('status')->toString();

        return BorrowRequest::query()
            ->when($status && $status !== 'All', fn (Builder $query) => $query->where('status', $status))
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $nested) use ($search): void {
                    $nested
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('employee_number', 'like', "%{$search}%")
                        ->orWhere('employee_email', 'like', "%{$search}%")
                        ->orWhere('requested_by_name', 'like', "%{$search}%")
                        ->orWhereHas('items', function (Builder $items) use ($search): void {
                            $items
                                ->where('item_code', 'like', "%{$search}%")
                                ->orWhere('item_name', 'like', "%{$search}%");
                        });
                });
            });
    }
}

<?php

namespace App\Models;

use App\Enums\BorrowRequestStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BorrowRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'employee_number',
        'employee_email',
        'requested_by_name',
        'requested_by_user_id',
        'status',
        'reviewed_at',
        'reviewed_by_user_id',
        'reviewed_by_name',
        'review_note',
    ];

    protected function casts(): array
    {
        return [
            'status' => BorrowRequestStatus::class,
            'reviewed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $request): void {
            if (empty($request->code)) {
                $nextId = ((int) self::query()->max('id')) + 1;
                $request->code = sprintf('BRQ-%03d', $nextId);
            }
        });
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by_user_id');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(BorrowRequestItem::class);
    }
}

<?php

namespace App\Models;

use App\Enums\ItemCategory;
use App\Enums\ItemStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'status',
        'qr_code',
        'date_added',
        'assigned_user_id',
        'assigned_reference',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'category' => ItemCategory::class,
            'status' => ItemStatus::class,
            'date_added' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $item): void {
            if (empty($item->code)) {
                $nextId = ((int) self::query()->max('id')) + 1;
                $item->code = sprintf('ITM-%03d', $nextId);
            }

            if ($item->code) {
                $item->code = strtoupper($item->code);
            }

            if ($item->code && empty($item->qr_code)) {
                $item->qr_code = 'QR-'.$item->code;
            }
        });
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function logisticsRequestItems(): HasMany
    {
        return $this->hasMany(LogisticsRequestItem::class);
    }

    public function borrowRequestItems(): HasMany
    {
        return $this->hasMany(BorrowRequestItem::class);
    }
}

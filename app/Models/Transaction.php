<?php

namespace App\Models;

use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'item_id',
        'item_name',
        'type',
        'transacted_at',
        'person_reference',
        'performed_by_user_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'type' => TransactionType::class,
            'transacted_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $transaction): void {
            if (empty($transaction->code)) {
                $nextId = ((int) self::query()->max('id')) + 1;
                $transaction->code = sprintf('TXN-%03d', $nextId);
            }
        });
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function performedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by_user_id');
    }
}

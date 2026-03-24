<?php

namespace App\Models;

use App\Enums\LogisticsPriority;
use App\Enums\LogisticsStatus;
use App\Enums\LogisticsType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LogisticsRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'origin',
        'destination',
        'requested_by_user_id',
        'requested_by_name',
        'handler',
        'priority',
        'status',
        'scheduled_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'type' => LogisticsType::class,
            'priority' => LogisticsPriority::class,
            'status' => LogisticsStatus::class,
            'scheduled_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $request): void {
            if (empty($request->code)) {
                $nextId = ((int) self::query()->max('id')) + 1;
                $request->code = sprintf('LGX-%03d', $nextId);
            }
        });
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by_user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(LogisticsRequestItem::class);
    }

    public function nextStatus(): ?LogisticsStatus
    {
        return match ($this->status) {
            LogisticsStatus::Requested => LogisticsStatus::Approved,
            LogisticsStatus::Approved => LogisticsStatus::Packed,
            LogisticsStatus::Packed => LogisticsStatus::InTransit,
            LogisticsStatus::InTransit => LogisticsStatus::Delivered,
            default => null,
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this->status, [
            LogisticsStatus::Delivered,
            LogisticsStatus::Returned,
            LogisticsStatus::Cancelled,
        ], true);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogisticsRequestItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'logistics_request_id',
        'item_id',
        'item_code',
        'item_name',
        'quantity',
    ];

    public function logisticsRequest(): BelongsTo
    {
        return $this->belongsTo(LogisticsRequest::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}

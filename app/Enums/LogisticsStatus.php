<?php

namespace App\Enums;

enum LogisticsStatus: string
{
    case Requested = 'Requested';
    case Approved = 'Approved';
    case Packed = 'Packed';
    case InTransit = 'In Transit';
    case Delivered = 'Delivered';
    case Returned = 'Returned';
    case Cancelled = 'Cancelled';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

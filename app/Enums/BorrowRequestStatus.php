<?php

namespace App\Enums;

enum BorrowRequestStatus: string
{
    case Pending = 'Pending';
    case Approved = 'Approved';
    case Denied = 'Denied';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

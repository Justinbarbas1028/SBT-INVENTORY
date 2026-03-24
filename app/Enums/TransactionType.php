<?php

namespace App\Enums;

enum TransactionType: string
{
    case In = 'IN';
    case Out = 'OUT';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

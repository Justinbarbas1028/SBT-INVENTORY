<?php

namespace App\Enums;

enum LogisticsType: string
{
    case Inbound = 'Inbound';
    case Outbound = 'Outbound';
    case Transfer = 'Transfer';
    case Return = 'Return';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

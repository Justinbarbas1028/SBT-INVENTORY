<?php

namespace App\Enums;

enum ItemStatus: string
{
    case InStock = 'In Stock';
    case CheckedOut = 'Checked Out';
    case Disposed = 'Disposed';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

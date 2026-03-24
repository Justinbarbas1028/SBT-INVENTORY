<?php

namespace App\Enums;

enum ItemCategory: string
{
    case OfficeSupplies = 'Office Supplies';
    case Devices = 'Devices';
    case Furniture = 'Furniture';
    case Tools = 'Tools';
    case Other = 'Other';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

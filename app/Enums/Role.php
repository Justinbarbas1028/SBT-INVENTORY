<?php

namespace App\Enums;

enum Role: string
{
    case SuperAdmin = 'Super Admin';
    case Admin = 'Admin';
    case Employee = 'Employee';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

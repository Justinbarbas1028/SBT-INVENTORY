<?php

namespace App\Support;

class ReferenceCode
{
    public static function next(string $modelClass, string $column, string $prefix, int $padLength = 3): string
    {
        $nextNumber = $modelClass::query()
            ->pluck($column)
            ->filter()
            ->map(function (string $code) use ($prefix): int {
                $normalized = strtoupper($code);
                $expectedPrefix = strtoupper($prefix).'-';

                if (! str_starts_with($normalized, $expectedPrefix)) {
                    return 0;
                }

                return (int) substr($normalized, strlen($expectedPrefix));
            })
            ->max();

        return sprintf('%s-%0'.$padLength.'d', strtoupper($prefix), ((int) $nextNumber) + 1);
    }
}

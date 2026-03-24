<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

trait AssignsReferenceCode
{
    protected static function bootAssignsReferenceCode(): void
    {
        static::created(function (Model $model): void {
            $column = $model->referenceCodeColumn();

            if (! empty($model->{$column})) {
                return;
            }

            $originalTimestamps = $model->timestamps;
            $model->timestamps = false;

            $model->forceFill([
                $column => sprintf(
                    '%s-%0'.$model->referenceCodePadLength().'d',
                    $model->referenceCodePrefix(),
                    $model->getKey(),
                ),
            ])->saveQuietly();

            $model->timestamps = $originalTimestamps;
            $model->afterReferenceCodeAssigned();
        });
    }

    abstract protected function referenceCodePrefix(): string;

    protected function referenceCodeColumn(): string
    {
        return 'code';
    }

    protected function referenceCodePadLength(): int
    {
        return 3;
    }

    protected function afterReferenceCodeAssigned(): void
    {
        //
    }
}

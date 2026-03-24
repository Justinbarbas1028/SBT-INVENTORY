<?php

namespace App\Http\Requests;

use App\Enums\LogisticsPriority;
use App\Enums\LogisticsType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLogisticsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(LogisticsType::values())],
            'priority' => ['required', Rule::in(LogisticsPriority::values())],
            'origin' => ['required', 'string', 'max:120'],
            'destination' => ['required', 'string', 'max:120'],
            'scheduled_date' => ['required', 'date'],
            'handler' => ['required', 'string', 'max:120'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'line_items' => ['required', 'array', 'min:1'],
            'line_items.*.item_code' => ['required', 'string', Rule::exists('items', 'code'), 'distinct:strict'],
            'line_items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'line_items' => collect($this->input('line_items', []))
                ->map(fn (array $line): array => [
                    'item_code' => strtoupper((string) ($line['item_code'] ?? '')),
                    'quantity' => (int) ($line['quantity'] ?? 1),
                ])
                ->values()
                ->all(),
        ]);
    }
}

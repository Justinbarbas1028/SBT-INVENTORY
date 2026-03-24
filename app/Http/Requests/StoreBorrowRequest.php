<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBorrowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_number' => ['required', 'string', 'max:50'],
            'employee_email' => ['required', 'email', 'max:255'],
            'line_items' => ['required', 'array', 'min:1'],
            'line_items.*.item_code' => ['required', 'string', Rule::exists('items', 'code')],
            'line_items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'employee_number' => strtoupper((string) $this->input('employee_number')),
            'employee_email' => strtolower((string) $this->input('employee_email')),
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

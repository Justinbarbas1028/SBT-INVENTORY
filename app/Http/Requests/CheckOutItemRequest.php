<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckOutItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_code' => ['required', 'string', Rule::exists('items', 'code')],
            'assigned_reference' => ['required', 'string', 'max:120'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'item_code' => strtoupper((string) $this->input('item_code')),
            'assigned_reference' => strtoupper((string) $this->input('assigned_reference')),
        ]);
    }
}

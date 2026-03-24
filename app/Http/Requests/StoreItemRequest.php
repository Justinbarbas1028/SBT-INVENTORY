<?php

namespace App\Http\Requests;

use App\Enums\ItemCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['nullable', 'string', 'max:30', 'regex:/^[A-Z0-9\-]+$/', Rule::unique('items', 'code')],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(ItemCategory::values())],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => strtoupper((string) $this->input('code')) ?: null,
        ]);
    }
}

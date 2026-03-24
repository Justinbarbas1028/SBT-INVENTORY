<?php

namespace App\Http\Requests;

use App\Enums\ItemCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckInItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_code' => ['required', 'string', Rule::exists('items', 'code')],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(ItemCategory::values())],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'item_code' => strtoupper((string) $this->input('item_code')),
        ]);
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InventoryBulkActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', Rule::in(['mark_in_stock', 'mark_disposed', 'delete'])],
            'selected_ids' => ['required', 'array', 'min:1'],
            'selected_ids.*' => ['integer', Rule::exists('items', 'id')],
        ];
    }
}

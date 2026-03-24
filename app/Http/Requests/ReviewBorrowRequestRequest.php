<?php

namespace App\Http\Requests;

use App\Enums\BorrowRequestStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewBorrowRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'decision' => ['required', Rule::in([
                BorrowRequestStatus::Approved->value,
                BorrowRequestStatus::Denied->value,
            ])],
            'review_note' => ['nullable', 'string', 'max:2000'],
        ];
    }
}

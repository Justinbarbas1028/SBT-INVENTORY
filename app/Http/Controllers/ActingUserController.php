<?php

namespace App\Http\Controllers;

use App\Http\Requests\SwitchActingUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ActingUserController extends Controller
{
    public function update(SwitchActingUserRequest $request): RedirectResponse
    {
        $user = User::query()->active()->findOrFail($request->validated('user_id'));

        Auth::login($user);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Switched active role to '.$user->role->value.'.',
        ]);
    }
}

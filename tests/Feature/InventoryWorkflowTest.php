<?php

use App\Models\Item;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('super admin can register a new inventory item', function () {
    $this->seed();

    $superAdmin = User::query()->where('email', 'alice@sbt.com')->firstOrFail();

    $response = $this->actingAs($superAdmin)->post(route('items.store'), [
        'code' => 'ITM-099',
        'name' => 'Conference Camera',
        'category' => 'Devices',
        'notes' => 'For executive room use',
    ]);

    $response
        ->assertRedirect(route('items.create'))
        ->assertSessionHas('flash');

    expect(Item::query()->where('code', 'ITM-099')->exists())->toBeTrue();
    expect(Transaction::query()->where('item_name', 'Conference Camera')->exists())->toBeTrue();
});

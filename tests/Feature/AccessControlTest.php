<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('dashboard renders with seeded inventory data', function () {
    $this->seed();

    $response = $this->get('/');

    $response
        ->assertOk()
        ->assertSee('Dashboard Overview')
        ->assertSee('Alice Admin')
        ->assertSee('Laptop ThinkPad');
});

test('super admin can view request logs', function () {
    $this->seed();

    $superAdmin = User::query()->where('email', 'alice@sbt.com')->firstOrFail();

    $this->actingAs($superAdmin)
        ->get(route('borrow-request-logs.index'))
        ->assertOk()
        ->assertSee('Track employee item requests in one place.');
});

test('employee cannot view request logs', function () {
    $this->seed();

    $employee = User::query()->where('email', 'bob@sbt.com')->firstOrFail();

    $this->actingAs($employee)
        ->get(route('borrow-request-logs.index'))
        ->assertForbidden();
});

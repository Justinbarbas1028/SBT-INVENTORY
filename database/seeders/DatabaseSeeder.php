<?php

namespace Database\Seeders;

use App\Enums\BorrowRequestStatus;
use App\Enums\ItemCategory;
use App\Enums\ItemStatus;
use App\Enums\LogisticsPriority;
use App\Enums\LogisticsStatus;
use App\Enums\LogisticsType;
use App\Enums\Role;
use App\Enums\TransactionType;
use App\Enums\UserStatus;
use App\Models\BorrowRequest;
use App\Models\Item;
use App\Models\LogisticsRequest;
use App\Models\Transaction;
use App\Models\User;
use App\Support\ReferenceCode;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $alice = User::factory()->create([
            'name' => 'Alice Admin',
            'email' => 'alice@sbt.com',
            'employee_number' => 'EMP-001',
            'role' => Role::SuperAdmin->value,
            'status' => UserStatus::Active->value,
            'password' => Hash::make('password'),
        ]);

        $carol = User::factory()->create([
            'name' => 'Carol Ops',
            'email' => 'carol@sbt.com',
            'employee_number' => 'EMP-003',
            'role' => Role::Admin->value,
            'status' => UserStatus::Active->value,
            'password' => Hash::make('password'),
        ]);

        $bob = User::factory()->create([
            'name' => 'Bob Staff',
            'email' => 'bob@sbt.com',
            'employee_number' => 'EMP-002',
            'role' => Role::Employee->value,
            'status' => UserStatus::Active->value,
            'password' => Hash::make('password'),
        ]);

        $laptop = Item::query()->create([
            'code' => 'ITM-001',
            'name' => 'Laptop ThinkPad',
            'category' => ItemCategory::Devices->value,
            'status' => ItemStatus::InStock->value,
            'qr_code' => 'QR-ITM-001',
            'date_added' => '2023-10-01',
        ]);

        $chair = Item::query()->create([
            'code' => 'ITM-002',
            'name' => 'Office Chair',
            'category' => ItemCategory::Furniture->value,
            'status' => ItemStatus::CheckedOut->value,
            'qr_code' => 'QR-ITM-002',
            'date_added' => '2023-10-05',
            'assigned_user_id' => $bob->id,
            'assigned_reference' => $bob->employee_number,
        ]);

        $drill = Item::query()->create([
            'code' => 'ITM-003',
            'name' => 'Hammer Drill',
            'category' => ItemCategory::Tools->value,
            'status' => ItemStatus::InStock->value,
            'qr_code' => 'QR-ITM-003',
            'date_added' => '2023-11-12',
        ]);

        Transaction::query()->create([
            'code' => 'TXN-001',
            'item_id' => $laptop->id,
            'item_name' => $laptop->name,
            'type' => TransactionType::In->value,
            'transacted_at' => '2023-10-01 09:00:00',
            'person_reference' => $alice->name,
            'performed_by_user_id' => $alice->id,
            'notes' => 'Initial stock',
        ]);

        Transaction::query()->create([
            'code' => 'TXN-002',
            'item_id' => $chair->id,
            'item_name' => $chair->name,
            'type' => TransactionType::In->value,
            'transacted_at' => '2023-10-05 10:00:00',
            'person_reference' => $alice->name,
            'performed_by_user_id' => $alice->id,
            'notes' => 'Initial stock',
        ]);

        Transaction::query()->create([
            'code' => 'TXN-003',
            'item_id' => $chair->id,
            'item_name' => $chair->name,
            'type' => TransactionType::Out->value,
            'transacted_at' => '2023-10-06 14:30:00',
            'person_reference' => $bob->name,
            'performed_by_user_id' => $alice->id,
            'notes' => 'Assigned to Bob for new desk',
        ]);

        $logisticsSeed = [
            [
                'type' => LogisticsType::Outbound->value,
                'origin' => 'Main Warehouse',
                'destination' => 'Branch A',
                'requested_by_user_id' => $alice->id,
                'requested_by_name' => $alice->name,
                'handler' => 'North Dispatch',
                'priority' => LogisticsPriority::High->value,
                'status' => LogisticsStatus::InTransit->value,
                'scheduled_date' => '2026-03-24',
                'created_at' => '2026-03-23 01:00:00',
                'updated_at' => '2026-03-23 04:00:00',
                'notes' => 'Deliver before 4 PM',
                'items' => [
                    ['item' => $laptop, 'quantity' => 1],
                ],
            ],
            [
                'type' => LogisticsType::Inbound->value,
                'origin' => 'Supplier Hub',
                'destination' => 'Main Warehouse',
                'requested_by_user_id' => $bob->id,
                'requested_by_name' => $bob->name,
                'handler' => 'Receiving Team',
                'priority' => LogisticsPriority::Medium->value,
                'status' => LogisticsStatus::Requested->value,
                'scheduled_date' => '2026-03-25',
                'created_at' => '2026-03-23 02:00:00',
                'updated_at' => '2026-03-23 02:00:00',
                'notes' => 'Awaiting pickup confirmation',
                'items' => [
                    ['item' => $chair, 'quantity' => 2],
                ],
            ],
            [
                'type' => LogisticsType::Transfer->value,
                'origin' => 'Field Site',
                'destination' => 'Main Warehouse',
                'requested_by_user_id' => $alice->id,
                'requested_by_name' => $alice->name,
                'handler' => 'City Fleet',
                'priority' => LogisticsPriority::Low->value,
                'status' => LogisticsStatus::Delivered->value,
                'scheduled_date' => '2026-03-20',
                'created_at' => '2026-03-19 08:00:00',
                'updated_at' => '2026-03-20 11:30:00',
                'notes' => 'Returned from site closeout',
                'items' => [
                    ['item' => $drill, 'quantity' => 1],
                ],
            ],
            [
                'type' => LogisticsType::Return->value,
                'origin' => 'Branch A',
                'destination' => 'Main Warehouse',
                'requested_by_user_id' => $bob->id,
                'requested_by_name' => $bob->name,
                'handler' => 'City Fleet',
                'priority' => LogisticsPriority::Medium->value,
                'status' => LogisticsStatus::Returned->value,
                'scheduled_date' => '2026-03-22',
                'created_at' => '2026-03-21 03:30:00',
                'updated_at' => '2026-03-22 10:15:00',
                'notes' => 'Damaged item collected for inspection',
                'items' => [
                    ['item' => $chair, 'quantity' => 1],
                ],
            ],
        ];

        foreach ($logisticsSeed as $seed) {
            $request = new LogisticsRequest([
                'code' => ReferenceCode::next(LogisticsRequest::class, 'code', 'LGX'),
                'type' => $seed['type'],
                'origin' => $seed['origin'],
                'destination' => $seed['destination'],
                'requested_by_user_id' => $seed['requested_by_user_id'],
                'requested_by_name' => $seed['requested_by_name'],
                'handler' => $seed['handler'],
                'priority' => $seed['priority'],
                'status' => $seed['status'],
                'scheduled_date' => $seed['scheduled_date'],
                'notes' => $seed['notes'],
            ]);

            $request->created_at = $seed['created_at'];
            $request->updated_at = $seed['updated_at'];
            $request->save();

            $request->items()->createMany(array_map(
                fn (array $line): array => [
                    'item_id' => $line['item']->id,
                    'item_code' => $line['item']->code,
                    'item_name' => $line['item']->name,
                    'quantity' => $line['quantity'],
                ],
                $seed['items'],
            ));
        }

        $borrowRequest = new BorrowRequest([
            'code' => 'BRQ-001',
            'employee_number' => $bob->employee_number,
            'employee_email' => $bob->email,
            'requested_by_name' => $bob->name,
            'requested_by_user_id' => $bob->id,
            'status' => BorrowRequestStatus::Pending->value,
        ]);

        $borrowRequest->created_at = '2026-03-23 06:00:00';
        $borrowRequest->updated_at = '2026-03-23 06:00:00';
        $borrowRequest->save();

        $borrowRequest->items()->create([
            'item_id' => $laptop->id,
            'item_code' => $laptop->code,
            'item_name' => $laptop->name,
            'quantity' => 1,
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->times(1)->create(['is_admin' => 1, 'owner' => 1, 'email' => 'Mo@gmail.com']);
        User::factory()->times(1)->create(['owner' => 1, 'email' => 'owner@gmail.com']);
        User::factory()->times(1)->create(['is_admin' => 1, 'email' => 'admin@gmail.com']);
        User::factory()->times(1)->create(['email' => 'user@gmail.com']);
        User::factory()->times(10)->create();

    }
}

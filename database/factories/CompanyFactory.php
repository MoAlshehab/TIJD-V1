<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // php artisan migrate:fresh --seed
            'owner_id' => User::factory(),
            'name' => $this->faker->title,
            'kind' => $this->faker->randomElement(['Werk', 'School', 'Familie', 'Anders']),
            'email' => fake()->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber,
            'address' => $this->faker->sentence,
            'city' => $this->faker->city,
            'zip' => $this->faker->postcode,

        ];
    }
}

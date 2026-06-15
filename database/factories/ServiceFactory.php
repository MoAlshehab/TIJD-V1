<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'company_id' => 1, // of gebruik Company::factory() als je die ook maakt
            'name' => $this->faker->word(),
            'price' => $this->faker->randomFloat(2, 10, 100),
            'duration' => $this->faker->numberBetween(15, 120),
            'description' => $this->faker->sentence(), // nieuwe kolom
        ];
    }
}

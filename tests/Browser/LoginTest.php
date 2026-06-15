<?php

namespace Tests\Browser;

use App\Models\User;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class LoginTest extends DuskTestCase
{
    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'Mo@gmail.com',
            'password' => bcrypt('password'),
        ]);

        $this->browse(function (Browser $browser) {
            $browser->visit('/registration')
                ->type('email', 'Mo@gmail.com')
                ->type('password', 'password')
                ->press('Login')
                ->assertPathIs('/home');
        });
    }
}

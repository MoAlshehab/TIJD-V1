<?php

namespace App\Listeners;

use App\Models\User;
use App\Notifications\NewUserNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Notification;

class SendNewUserNotificationToAdmins
{
    public function handle(Registered $event): void
    {
        $newUser = $event->user;

        $admins = User::where('is_admin', 1)->get();

        if ($admins->isEmpty()) {
            return;
        }

        Notification::send(
            $admins,
            new NewUserNotification($newUser)
        );
    }
}
<?php

namespace App\Listeners;

use App\Events\CompanyCreated;
use App\Models\User;
use App\Notifications\NewCompanyNotification;
use Illuminate\Support\Facades\Notification;

class SendNewCompanyNotification
{
    public function handle(CompanyCreated $event): void
    {
        $company = $event->company;

        // Alle admins ophalen
        $admins = User::where('is_admin', 1)->get();

        if ($admins->isEmpty()) {
            return;
        }

        Notification::send(
            $admins,
            new NewCompanyNotification($company)
        );
    }
}
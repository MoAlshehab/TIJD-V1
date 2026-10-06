<?php

namespace App\Listeners;

use App\Events\AppointmentCreated;
use App\Notifications\NewAppointmentNotification;

class SendNewAppointmentNotification
{
    public function handle(AppointmentCreated $event): void
    {
        $appointment = $event->appointment;

        $company = $appointment->company;

        if (! $company) {
            return;
        }

        $owner = $company->owner;

        if (! $owner) {
            return;
        }

        $owner->notify(
            new NewAppointmentNotification($appointment)
        );
    }
}
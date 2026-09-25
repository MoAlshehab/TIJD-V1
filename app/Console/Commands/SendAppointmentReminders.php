<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use App\Notifications\AppointmentReminderNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendAppointmentReminders extends Command
{
    protected $signature = 'appointments:send-reminders';

    protected $description =
        'Stuur pushherinneringen 24 uur en 1 uur voor afspraken';

    public function handle(): int
    {
        $now = Carbon::now();

        $appointments = Appointment::with([
            'user',
            'company',
            'service',
        ])
            ->where('accept', 1)
            ->where('done', 0)
            ->where('date', '>', $now)
            ->where(
                'date',
                '<=',
                $now->copy()->addHours(24)
            )
            ->get();

        foreach ($appointments as $appointment) {

            $appointmentDate =
                Carbon::parse($appointment->date);

            $customer = $appointment->user;

            if (! $customer) {
                continue;
            }

            // Gebruiker moet push hebben ingeschakeld
            if (! $customer->pushSubscriptions()->exists()) {
                continue;
            }

            /*
             * ===========================
             * 24 UUR HERINNERING
             * ===========================
             */
            if (
                ! $appointment->reminder_24h_sent &&
                $appointmentDate->gt(
                    $now->copy()->addHour()
                ) &&
                $appointmentDate->lte(
                    $now->copy()->addHours(24)
                )
            ) {
                $customer->notify(
                    new AppointmentReminderNotification(
                        $appointment,
                        24
                    )
                );

                $appointment->reminder_24h_sent = true;
                $appointment->save();

                $this->info(
                    "24h reminder verstuurd voor afspraak {$appointment->id}"
                );
            }

            /*
             * ===========================
             * 1 UUR HERINNERING
             * ===========================
             */
            if (
                ! $appointment->reminder_1h_sent &&
                $appointmentDate->gt($now) &&
                $appointmentDate->lte(
                    $now->copy()->addHour()
                )
            ) {
                $customer->notify(
                    new AppointmentReminderNotification(
                        $appointment,
                        1
                    )
                );

                $appointment->reminder_1h_sent = true;
                $appointment->save();

                $this->info(
                    "1h reminder verstuurd voor afspraak {$appointment->id}"
                );
            }
        }

        return self::SUCCESS;
    }
}
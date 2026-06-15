<?php

namespace App\Console\Commands;

namespace App\Console\Commands;

use App\Mail\AppointmentReminderMail;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendAppointmentReminders extends Command
{
    protected $signature = 'appointments:send-reminders';

    protected $description = 'Verstuur herinneringsmails voor afspraken over 6 uur';

    public function handle()
    {
        $now = Carbon::now();
        $reminderTime = $now->copy()->addHours(6);

        $appointments = Appointment::whereNull('deleted_at')
            ->whereBetween('date', [$reminderTime->copy()->subMinutes(10), $reminderTime->copy()->addMinutes(10)])
            ->with('user')
            ->get();

        foreach ($appointments as $appointment) {
            if ($appointment->user && $appointment->user->email) {
                Mail::to($appointment->user->email)->send(new AppointmentReminderMail($appointment));
                $this->info('Reminder gestuurd naar: '.$appointment->user->email.' voor afspraak op '.$appointment->date);
            }
        }
    }
}

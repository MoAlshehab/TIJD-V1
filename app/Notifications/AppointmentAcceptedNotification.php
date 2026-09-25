<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class AppointmentAcceptedNotification extends Notification
{
    public function __construct(
        public $appointment
    ) {
    }

    public function via($notifiable): array
    {
        return [
            WebPushChannel::class,
        ];
    }

    public function toWebPush(
        $notifiable,
        $notification
    ): WebPushMessage {
        $companyName =
            $this->appointment->company?->name
            ?? 'Het bedrijf';

        $appointmentDate = Carbon::parse(
            $this->appointment->date
        )->format('d-m-Y H:i');

        return (new WebPushMessage)
            ->title('Afspraak geaccepteerd ✅')
            ->body(
                $companyName .
                ' heeft je afspraak van ' .
                $appointmentDate .
                ' geaccepteerd.'
            )
            ->icon('/icon-192.png')
            ->badge('/icon-192.png')
            ->tag(
                'appointment-accepted-' .
                $this->appointment->id
            )
            ->data([
                'url' => '/myappointments',
                'appointment_id' =>
                    $this->appointment->id,
            ])
            ->options([
                'TTL' => 3600,
            ]);
    }
}
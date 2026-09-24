<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class NewAppointmentNotification extends Notification
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

        // Naam van de klant
        $customerName =
            $this->appointment->user?->name
            ?? 'Onbekende klant';

        // Datum + tijd
        $appointmentDate = Carbon::parse(
            $this->appointment->date
        )->format('d-m-Y H:i');

        return (new WebPushMessage)
            ->title('Nieuwe afspraak')
            ->body(
                $customerName .
                ' heeft een afspraak gemaakt op ' .
                $appointmentDate
            )
            ->icon('/icon-192.png')
            ->badge('/icon-192.png')
            ->tag(
                'appointment-' .
                $this->appointment->id
            )
            ->data([
                'url' => '/appointments',
                'appointment_id' =>
                    $this->appointment->id,
            ])
            ->options([
                'TTL' => 3600,
            ]);
    }
}
<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class AppointmentReminderNotification extends Notification
{
    public function __construct(
        public $appointment,
        public int $hoursBefore
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
            ?? 'het bedrijf';

        $date = Carbon::parse(
            $this->appointment->date
        )->format('d-m-Y H:i');

        $title = $this->hoursBefore === 24
            ? 'Afspraak morgen ⏰'
            : 'Afspraak over 1 uur ⏰';

        $body = $this->hoursBefore === 24
            ? "Je hebt morgen een afspraak bij {$companyName} op {$date}."
            : "Je afspraak bij {$companyName} begint over ongeveer 1 uur.";

        return (new WebPushMessage)
            ->title($title)
            ->body($body)
            ->icon('/icon-192.png')
            ->badge('/icon-192.png')
            ->tag(
                'appointment-reminder-' .
                $this->hoursBefore . '-' .
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
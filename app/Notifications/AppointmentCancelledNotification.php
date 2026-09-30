<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class AppointmentCancelledNotification extends Notification
{
    public function __construct(
        public string $companyName,
        public string $appointmentDate,
        public string $reason,
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
        return (new WebPushMessage)
            ->title('Afspraak geannuleerd ❌')
            ->body(
                'Je afspraak bij ' .
                $this->companyName .
                ' op ' .
                $this->appointmentDate .
                ' is geannuleerd. Reden: ' .
                $this->reason
            )
            ->icon('/icon-192.png')
            ->badge('/icon-192.png')
            ->tag('appointment-cancelled-' . time())
            ->data([
                'url' => '/myappointments',
            ])
            ->options([
                'TTL' => 3600,
            ]);
    }
}
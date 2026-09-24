<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class TestPushNotification extends Notification
{
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
            ->title('Test melding')
            ->body('Web Push vanuit Laravel werkt!')
            ->icon('/icon-192.png')
            ->badge('/icon-192.png')
            ->tag('test-push')
            ->data([
                'url' => '/settings',
            ])
            ->options([
                'TTL' => 3600,
            ]);
    }
}
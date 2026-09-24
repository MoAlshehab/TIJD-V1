<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class NewUserNotification extends Notification
{
    public function __construct(
        public $user
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
            ->title('Nieuwe gebruiker')
            ->body(
                $this->user->name .
                ' heeft een account aangemaakt.'
            )
            ->icon('/icon-192.png')
            ->badge('/icon-192.png')
            ->tag('user-' . $this->user->id)
            ->data([
                'url' => '/admin/users',
                'user_id' => $this->user->id,
            ])
            ->options([
                'TTL' => 3600,
            ]);
    }
}
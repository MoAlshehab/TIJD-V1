<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class AdminBroadcastNotification extends Notification
{
    public function __construct(
        public string $title,
        public string $message,
        public string $url = '/'
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
            ->title($this->title)
            ->body($this->message)
            ->icon('/icon-192.png')
            ->badge('/icon-192.png')
            ->tag('admin-broadcast-' . time())
            ->data([
                'url' => $this->url,
            ])
            ->options([
                'TTL' => 3600,
            ]);
    }
}
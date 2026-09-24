<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class NewCompanyNotification extends Notification
{
    public function __construct(
        public $company
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
            ->title('Nieuw bedrijf aangemaakt')
            ->body(
                $this->company->name .
                ' is toegevoegd.'
            )
            ->icon('/icon-192.png')
            ->badge('/icon-192.png')
            ->tag('company-' . $this->company->id)
            ->data([
                'url' => '/admin/companies',
                'company_id' => $this->company->id,
            ])
            ->options([
                'TTL' => 3600,
            ]);
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\AdminBroadcastNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class AdminPushNotificationController extends Controller
{
    // Naar ALLE gebruikers
    public function send(Request $request)
    {
        abort_unless(
            auth()->check() && auth()->user()->is_admin,
            403
        );

        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:100',
            ],
            'message' => [
                'required',
                'string',
                'max:500',
            ],
            'url' => [
                'nullable',
                'string',
                'max:500',
            ],
        ]);

        $users = User::whereHas('pushSubscriptions')
            ->get();

        Notification::send(
            $users,
            new AdminBroadcastNotification(
                $validated['title'],
                $validated['message'],
                $validated['url'] ?? '/'
            )
        );

        return back()->with(
            'success',
            'Melding verstuurd naar ' .
            $users->count() .
            ' gebruikers.'
        );
    }


    // Naar ALLEEN owners
    public function sendToOwners(Request $request)
    {
        abort_unless(
            auth()->check() && auth()->user()->is_admin,
            403
        );

        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:100',
            ],
            'message' => [
                'required',
                'string',
                'max:500',
            ],
            'url' => [
                'nullable',
                'string',
                'max:500',
            ],
        ]);

        $owners = User::where('owner', 1)
            ->whereHas('pushSubscriptions')
            ->get();

        if ($owners->isEmpty()) {
            return back()->with(
                'warning',
                'Er zijn geen owners met meldingen ingeschakeld.'
            );
        }

        Notification::send(
            $owners,
            new AdminBroadcastNotification(
                $validated['title'],
                $validated['message'],
                $validated['url'] ?? '/'
            )
        );

        return back()->with(
            'success',
            'Melding verstuurd naar ' .
            $owners->count() .
            ' owners.'
        );
    }
}
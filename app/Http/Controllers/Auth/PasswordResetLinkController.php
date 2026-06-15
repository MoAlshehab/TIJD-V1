<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function sendPasswordResetEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json(['message' => 'Gebruiker niet gevonden.'], 404);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($token),
                'created_at' => Carbon::now(),
            ]
        );

        $url = url("/reset-password-page/{$token}?email=".urlencode($user->email));

        Mail::send([], [], function ($message) use ($user, $url) {
            $html = "
            <div>
                <h2>Reset je wachtwoord</h2>
                <p>Hallo {$user->name},</p>
                <p>Klik op de knop om je wachtwoord te resetten.</p>
                <a href='{$url}'>Reset wachtwoord</a>
            </div>
        ";

            $message->to($user->email)
                ->subject('Reset je wachtwoord')
                ->html($html);
        });

        return redirect('/registration')->with('status', 'Ga naar je e-mail om je wachtwoord te resetten.');
    }

    public function showResetForm($token, Request $request)
    {
        $email = $request->query('email');

        return Inertia::render('ResetPassword', [
            'token' => $token,
            'email' => $email,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Notifications\CompanyCustomerNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class OwnerPushNotificationController extends Controller
{
    /**
     * Toon de pagina waar de owner
     * meldingen kan versturen.
     */
    public function index()
    {
        $companies = Company::where(
            'owner_id',
            auth()->id()
        )
            ->select('id', 'name')
            ->get();

        return Inertia::render(
            'Owner/Notifications',
            [
                'companies' => $companies,
            ]
        );
    }

    /**
     * Verstuur een melding naar alle gebruikers
     * die dit bedrijf als favoriet hebben.
     */
    public function send(
        Request $request,
        Company $company
    ) {
        /*
        |--------------------------------------------------------------------------
        | Security
        |--------------------------------------------------------------------------
        | Alleen de eigenaar van dit bedrijf mag
        | een melding versturen.
        */
        abort_unless(
            $company->owner_id === auth()->id(),
            403
        );

        /*
        |--------------------------------------------------------------------------
        | Validatie
        |--------------------------------------------------------------------------
        */
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
        ]);

        /*
        |--------------------------------------------------------------------------
        | Klanten ophalen uit favorites
        |--------------------------------------------------------------------------
        */
        $customerIds = DB::table('favorites')
            ->where(
                'company_id',
                $company->id
            )
            ->distinct()
            ->pluck('user_id');

        /*
        |--------------------------------------------------------------------------
        | Alleen gebruikers met push subscriptions
        |--------------------------------------------------------------------------
        */
        $customers = User::whereIn(
            'id',
            $customerIds
        )
            ->whereHas('pushSubscriptions')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Geen ontvangers gevonden
        |--------------------------------------------------------------------------
        */
        if ($customers->isEmpty()) {
            return back()->with(
                'warning',
                'Geen klanten met meldingen ingeschakeld.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Pushmelding versturen
        |--------------------------------------------------------------------------
        */
        Notification::send(
            $customers,
            new CompanyCustomerNotification(
                $validated['title'],
                $validated['message'],
                '/companies/' .
                $company->id .
                '/details'
            )
        );

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */
        return back()->with(
            'success',
            'Melding verstuurd naar ' .
            $customers->count() .
            ' klanten.'
        );
    }
}
<?php

namespace App\Providers;

use App\Models\Appointment;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

use App\Events\AppointmentCreated;
use App\Listeners\SendNewAppointmentNotification;
use Illuminate\Support\Facades\Event;
use App\Events\CompanyCreated;
use App\Listeners\SendNewCompanyNotification;
use App\Listeners\SendNewUserNotificationToAdmins;
use Illuminate\Auth\Events\Registered;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

     /*
        |--------------------------------------------------------------------------
        | Events
        |--------------------------------------------------------------------------
        |
        | Als een nieuwe afspraak wordt gemaakt,
        | wordt SendNewAppointmentNotification uitgevoerd.
        |
        */
        Event::listen(
            AppointmentCreated::class,
            SendNewAppointmentNotification::class
        );

        Event::listen(
            CompanyCreated::class,
            SendNewCompanyNotification::class
        );

        Event::listen(
            Registered::class,
            SendNewUserNotificationToAdmins::class
        );
        /*
        |--------------------------------------------------------------------------
        | Migration subfolders
        |--------------------------------------------------------------------------
        */
        /**
         * 👉 AUTOMATISCH ALLE MIGRATION SUBMAPPEN LADEN
         */
        $paths = [
            database_path('migrations'),
        ];

        foreach (glob(database_path('migrations/*'), GLOB_ONLYDIR) as $dir) {
            $paths[] = $dir;
        }

        $this->loadMigrationsFrom($paths);

        Inertia::share([
            'auth' => function () {
                return [
                    'user' => Auth::user(),
                ];
            },

            'pendingAppointmentsCount' => function () {
                if (! Auth::check()) {
                    return 0;
                }

                $user = Auth::user();

                // Als de user een eigenaar is
                if ($user->owner) {
                    $companyIds = Company::where('owner_id', $user->id)->pluck('id');

                    if ($companyIds->isEmpty()) {
                        return 0;
                    }

                    return Appointment::whereIn('company_id', $companyIds)
                        ->whereNull('accept')
                        ->count();
                }

                // Als de user een werknemer is
                if ($user->company_id) {
                    return Appointment::where('employee_id', $user->id)
                        ->whereNull('accept')
                        ->count();
                }

                return 0;
            },
        ]);
    }
}

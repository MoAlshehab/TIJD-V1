<?php

namespace App\Http\Middleware;

use App\Models\Appointment;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // 🔢 counts
        $pendingCount = 0;       // new appointments (accept = 0, done = 0)
        $appointmentsCount = 0;  // accepted but not done (accept = 1, done = 0)

        if ($user) {

            // =====================
            // OWNER
            // =====================
            if ($user->owner) {

                $companyIds = Company::where('owner_id', $user->id)->pluck('id');

                // New appointments
                $pendingCount = Appointment::whereIn('company_id', $companyIds)
                    ->where(function ($q) {
                        $q->whereNull('accept')->orWhere('accept', 0);
                    })
                    ->where(function ($q) {
                        $q->whereNull('done')->orWhere('done', 0);
                    })
                    ->count();

                // Accepted but not done
                $appointmentsCount = Appointment::whereIn('company_id', $companyIds)
                    ->where('accept', 1)
                    ->where(function ($q) {
                        $q->whereNull('done')->orWhere('done', 0);
                    })
                    ->count();
            }

            // =====================
            // EMPLOYEE
            // =====================
            elseif ($user->company_id) {

                // New appointments (only for this employee)
                $pendingCount = Appointment::where('employee_id', $user->id)
                    ->where(function ($q) {
                        $q->whereNull('accept')->orWhere('accept', 0);
                    })
                    ->where(function ($q) {
                        $q->whereNull('done')->orWhere('done', 0);
                    })
                    ->count();

                // Accepted but not done (only for this employee)
                $appointmentsCount = Appointment::where('employee_id', $user->id)
                    ->where('accept', 1)
                    ->where(function ($q) {
                        $q->whereNull('done')->orWhere('done', 0);
                    })
                    ->count();
            }
        }

        return array_merge(parent::share($request), [

            // ✅ current route name (voor badges logic)
            'route' => [
                'name' => fn () => Route::currentRouteName(),
            ],

            // ✅ flash messages (toast)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'warning' => fn () => $request->session()->get('warning'),
                'error' => fn () => $request->session()->get('error'),
            ],

            // ✅ auth user
            'auth.user' => fn () => $user
                ? $user->only('id', 'name', 'email', 'is_admin', 'owner', 'company_id')
                : null,

            // ✅ badges counts
            'pendingAppointmentsCount' => $pendingCount,
            'appointmentsCount' => $appointmentsCount,
        ]);
    }
}

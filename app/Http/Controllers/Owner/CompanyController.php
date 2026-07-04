<?php

namespace App\Http\Controllers\Owner;

use App\Exports\ComapniesExport;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Company;
use App\Models\CompanyClosedDay;
use App\Models\Service;
use App\Models\WorkDay;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;

class CompanyController extends Controller
{
    public function index()
    {
        return Inertia::render('Company', ['user' => auth()->user()]);
    }

    /**
     * @throws FileDoesNotExist
     * @throws FileIsTooBig
     */
    public function store(Request $request)
    {
        // Check the number of companies the owner already has
        $ownerId = Auth::id();
        $existingCompanyCount = Company::where('owner_id', $ownerId)->count();

        if ($existingCompanyCount >= 10) {
            return redirect()
                ->back()
                ->with('warning', 'You have reached the maximum limit of companies.');
        }

        // Validate the form data
        $validatedData = $request->validate([
            'name' => [
                'required',
                Rule::unique('companies')->where(fn ($query) => $query->where('owner_id', Auth::id())
                ),
            ],
            'kind' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'address' => 'required',
            'city' => 'required',
            'zip' => 'required',
            'files.*' => 'mimes:pdf,jpg,jpeg,png,gif|max:2048',
            'autaccept' => 'required|boolean',

        ]);

        // Create a new Company instance and fill it with validated data
        $company = new Company;
        $company->fill($validatedData);
        $company->slug = Str::slug($validatedData['name'].'-'.Str::random(6)); // ✅ nieuw toegevoegd
        $company->owner_id = Auth::id();
        $company->save();

        // Handle media uploads
        if ($request->file('files')) {
            foreach ($request->file('files') as $file) {
                // Use the media library of the $company instance
                $company->addMedia($file)->toMediaCollection('photo');

            }
        }

            return redirect()->route('owner.mycompany')->with('success', 'Bedrijf succesvol toegevoegd.');
        }

    // hier zie je de bedrijven in het home pagina
    public function showCompanies()
    {
        $companies = Company::with('owner', 'employees')->withCount('employees')->get();
        $files = $companies->flatMap->getMedia('photo');

        $favorites = Auth::user()?->favorites()->pluck('company_id') ?? collect();

        return Inertia::render('Company/Home', [
            'companies' => $companies,
            'files' => $files,
            'companiesCount' => $companies->count(),
            'favorites' => $favorites,
        ]);
    }

    public function showDetails(Company $company)
    {
        return Inertia::render('Company/CompanyDetailsPage', [
            'company' => $company,
        ]);
    }

    public function showAddCompany(Company $company)
    {
        return Inertia::render('Company/Company');
    }

    // hier zit het aan of uit dat de bedrijf oprn of dicht
    public function toggleOpenClose($id)
    {
        $company = Company::findOrFail($id);
        // Wissel de status om
        $company->open_close = ! $company->open_close;
        $company->save();

        return redirect()->back();
    }

    public function showEmployees(Company $company)
    {
        // Haal de medewerkers van het specifieke bedrijf op (relatie)
        $employees = $company->employees;

        return Inertia::render('Company/EmployeeList', [
            'company' => $company,       // handig voor naam en info
            'employees' => $employees,
        ]);
    }

    public function showEmployeesWithDatesAndHours(Request $request, Company $company)
    {
        /*
        |--------------------------------------------------------------------------
        | 1️⃣ Medewerkers + profielfoto
        |--------------------------------------------------------------------------
        */
        $employees = $company->employees->map(function ($employee) {
            $employee->profile_photo_url =
                $employee->getFirstMediaUrl('profile') ?: '/storage/images/default_profile.jpg';

            return $employee;
        });

        /*
        |--------------------------------------------------------------------------
        | 2️⃣ Services van dit bedrijf
        |--------------------------------------------------------------------------
        */
        $services = Service::where('company_id', $company->id)
            ->whereNull('deleted_at')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | 3️⃣ Werkdagen van medewerkers
        |--------------------------------------------------------------------------
        */
        $workDays = WorkDay::whereIn('employee_id', $employees->pluck('id'))->get();

        $employees = $company->employees->map(function ($employee) use ($workDays) {
            $employee->profile_photo_url =
                $employee->getFirstMediaUrl('profile') ?: '/storage/images/default_profile.jpg';

            $employee->work_days = $workDays
                ->where('employee_id', $employee->id)
                ->map(function ($day) {
                    return [
                        'day_of_week' => strtolower($day->day_of_week),
                        'start_time' => Carbon::parse($day->start_time)->format('H:i'),
                        'end_time' => Carbon::parse($day->end_time)->format('H:i'),
                    ];
                })
                ->values();

            return $employee;
        });

        /*
        |--------------------------------------------------------------------------
        | 4️⃣ Gesloten dagen van dit bedrijf (⭐ CRUCIAAL)
        |--------------------------------------------------------------------------
        */
        $closedDays = CompanyClosedDay::where('company_id', $company->id)
            ->pluck('date')
            ->map(fn ($date) => Carbon::parse($date)->toDateString())
            ->values()
            ->toArray();
        // voorbeeld: ["2026-02-21", "2026-03-01"]

        /*
        |--------------------------------------------------------------------------
        | 5️⃣ Beschikbare datums genereren (3 maanden vooruit)
        |--------------------------------------------------------------------------
        */
        $startDate = Carbon::now()->startOfDay();
        $endDate = $startDate->copy()->addMonths(3)->endOfMonth();
        $currentDate = $startDate->copy();
        $availableDates = [];

        while ($currentDate->lte($endDate)) {
            $dateString = $currentDate->toDateString();
            $dayName = strtolower($currentDate->translatedFormat('l'));

            $isWorkDay = $workDays->contains(function ($workDay) use ($dayName) {
                return strtolower($workDay->day_of_week) === $dayName;
            });

            if ($isWorkDay) {
                $availableDates[] = [
                    'date' => $dateString,          // ✅ YYYY-MM-DD
                    'day' => ucfirst($dayName),
                ];
            }

            $currentDate->addDay();
        }

        /*
        |--------------------------------------------------------------------------
        | 6️⃣ Bezette tijden per medewerker per datum
        |--------------------------------------------------------------------------
        */
        $unavailableTimes = [];

        $appointments = Appointment::whereIn('employee_id', $employees->pluck('id'))
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        foreach ($appointments as $appointment) {
            $employeeId = $appointment->employee_id;
            $date = Carbon::parse($appointment->date)->toDateString();
            $hour = Carbon::parse($appointment->date)->format('H:i');

            $unavailableTimes[$employeeId][$date][] = $hour;
        }

        /*
        |--------------------------------------------------------------------------
        | 7️⃣ Render naar Inertia (⭐ closedDays meegeven)
        |--------------------------------------------------------------------------
        */
        return Inertia::render('EmployeeDays', [
            'employees' => $employees,
            'services' => $services,
            'availableDates' => array_values($availableDates),
            'unavailableTimesPerEmployee' => $unavailableTimes,

            // ⭐ DIT MISSTE
            'closedDays' => $closedDays,
        ]);
    }

    //    public function showEmployeesWithDatesAndHours(Request $request, Company $company)
    //    {
    //        // Haal medewerkers op + profielfoto
    //        $employees = $company->employees->map(function ($employee) {
    //            $employee->profile_photo_url = $employee->getFirstMediaUrl('profile') ?: '/storage/images/default_profile.jpg';
    //            return $employee;
    //        });
    //
    //        // Haal alle services op
    //        $services = Service::where('company_id', $company->id)
    //            ->whereNull('deleted_at')
    //            ->get();
    //
    //        // Haal werkroosters op voor deze medewerkers
    //        $workDays = WorkDay::whereIn('employee_id', $employees->pluck('id'))->get();
    //
    //        $employees = $company->employees->map(function ($employee) use ($workDays) {
    //            $employee->profile_photo_url = $employee->getFirstMediaUrl('profile') ?: '/storage/images/default_profile.jpg';
    //
    //            $employee->work_days = $workDays
    //                ->where('employee_id', $employee->id)
    //                ->map(function ($day) {
    //                    return [
    //                        'day_of_week' => strtolower($day->day_of_week),
    //                        'start_time' => \Carbon\Carbon::parse($day->start_time)->format('H:i'),
    //                        'end_time' => \Carbon\Carbon::parse($day->end_time)->format('H:i'),
    //                    ];
    //                })
    //                ->values();
    //
    //            return $employee;
    //        });
    //
    //        // Genereer beschikbare datums
    //        $startDate = Carbon::now();
    //        $endDate = $startDate->copy()->addMonths(3)->endOfMonth();
    //        $currentDate = $startDate->copy();
    //        $availableDates = [];
    //
    //        while ($currentDate->lte($endDate)) {
    //            $dateString = $currentDate->toDateString();
    //            $dayName = strtolower($currentDate->translatedFormat('l'));
    //
    //            $isWorkDay = $workDays->contains(function ($workDay) use ($dayName) {
    //                return strtolower($workDay->day_of_week) === $dayName;
    //            });
    //
    //            if ($isWorkDay) {
    //                $availableDates[] = [
    //                    'date' => $dateString,
    //                    'day' => ucfirst($dayName),
    //                ];
    //            }
    //
    //            $currentDate->addDay();
    //        }
    //
    //        // Verzamel bezette tijden per medewerker per datum
    //        $unavailableTimes = [];
    //
    //        // Haal alle afspraken op binnen de beschikbare datums
    //        $appointments = Appointment::whereIn('employee_id', $employees->pluck('id'))
    //            ->whereBetween('date', [$startDate, $endDate])
    //            ->get();
    //
    //        foreach ($appointments as $appointment) {
    //            $employeeId = $appointment->employee_id;
    //            $date = Carbon::parse($appointment->date)->toDateString();
    //            $hour = Carbon::parse($appointment->date)->format('H:i');
    //
    //            if (!isset($unavailableTimes[$employeeId])) {
    //                $unavailableTimes[$employeeId] = [];
    //            }
    //
    //            if (!isset($unavailableTimes[$employeeId][$date])) {
    //                $unavailableTimes[$employeeId][$date] = [];
    //            }
    //
    //            if (!in_array($hour, $unavailableTimes[$employeeId][$date])) {
    //                $unavailableTimes[$employeeId][$date][] = $hour;
    //            }
    //        }
    //
    //        return Inertia::render('EmployeeDays', [
    //            'employees' => $employees,
    //            'services' => $services,
    //            'availableDates' => array_values($availableDates),
    //            'unavailableTimesPerEmployee' => $unavailableTimes,
    //        ]);
    //    }
    //
    //

    public function companiesArchive()
    {
        // Alleen admins mogen dit zien
        if (! auth()->user()->is_admin) {
            abort(403, 'Unauthorized');
        }

        // Haal alle soft-deleted bedrijven op met relaties
        $companies = Company::with('owner', 'employees')
            ->withCount('employees')
            ->onlyTrashed()
            ->get();

        return Inertia::render('Admin/CompaniesArchive', [
            'companies' => $companies,
            'companiesCount' => $companies->count(),
        ]);
    }

    public function ShowMyCompany()
    {
        // Eager load employees en services (inclusief soft-deleted services)
        $companies = Company::with([
            'employees',
            'services' => function ($query) {
                $query->withTrashed()->select('id', 'company_id', 'name', 'price', 'duration', 'description', 'status', 'deleted_at');
            },
        ])
            ->where('owner_id', Auth::id()) // Filter by owner
            ->get();

        // Pass companies to the Inertia component
        return Inertia::render('MyCompany', ['companies' => $companies]);
    }

    public function update(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        if ($company->owner_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'kind' => 'nullable|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:10',
            'photo' => 'nullable|image|max:2048',
        ]);

        $company->update($validated);

        if ($request->hasFile('photo')) {
            $company->clearMediaCollection('photo');
            $company->addMediaFromRequest('photo')->toMediaCollection('photo');
        }

        return back()->with('success', 'Bedrijf bijgewerkt!');
    }

    public function toggleAutaccept(Request $request, Company $company)
    {
        // Alleen eigenaar mag dit wijzigen
        if (Auth::id() !== $company->owner_id) {
            abort(403);
        }

        $validated = $request->validate([
            'autaccept' => 'required|boolean',
        ]);

        $company->autaccept = $validated['autaccept'];
        $company->save();

        return redirect()->back()->with('success', 'Status Appointmnet bijgewerkt!');
    }

    // for admin
    public function delete(Company $company)
    {
        $company->delete();

        return redirect()->back();

    }

    public function destroy(Company $company)
    {
        $user = auth()->user();

        // 🔐 Alleen eigenaar of admin mag verwijderen
        if (! $user->is_admin && $company->owner_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $company->delete();

        // ✅ SUCCESS toast
        return redirect()
            ->back()
            ->with('success', __('Company successfully deleted.'));
    }

    public function restore($id)
    {
        if (! auth()->user()->is_admin) {
            abort(403, 'Unauthorized');
        }

        $company = Company::onlyTrashed()->findOrFail($id);
        $company->restore();

        return redirect()->route('admin.companies.archive')->with('success', 'Bedrijf succesvol hersteld.');
    }

    public function forceDelete($id)
    {
        // Vind het soft-deleted bedrijf
        $company = Company::onlyTrashed()->findOrFail($id);
        // Permanent verwijderen
        $company->forceDelete();

        return redirect()->back()->with('success', 'Company permanently deleted.');
    }

    public function exportCompany()
    {
        return Excel::download(new ComapniesExport, 'companies.csv');
    }
}

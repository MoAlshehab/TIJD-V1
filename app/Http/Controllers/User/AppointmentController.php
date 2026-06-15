<?php

namespace App\Http\Controllers\User;

use App\Exports\AppointmentsExport;
use App\Exports\AppointmentsExportToMove;
use App\Exports\CompanyAppointmentsExport;
use App\Http\Controllers\Controller;
use App\Imports\AppointmentsImport;
use App\Models\Appointment;
use App\Models\Company;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::with('user', 'company')->get();

        // Voeg de dag van de week toe aan elk afspraakobject
        foreach ($appointments as $appointment) {
            $appointment->dayOfWeek = Carbon::parse($appointment->date)->dayName;
        }

        // Geef de afspraken en dagen van de week door aan de weergave
        return Inertia::render('Appointments', ['appointments' => $appointments]);
    }

    public function getAllAppointments()
    {
        $appointments = Appointment::with(['company', 'user', 'employee', 'service'])
            ->latest()
            ->get();

        return Inertia::render('Appointments/Appointments', [
            'appointments' => $appointments,
        ]);
    }

    public function AppointmentsArchives(): \Inertia\Response
    {
        // Haal alleen de soft-deleted afspraken op met de bijbehorende user en company relaties
        $appointments = Appointment::with('user', 'company')->onlyTrashed()->get();

        // Voeg de dag van de week toe aan elk afspraakobject
        foreach ($appointments as $appointment) {
            $appointment->dayOfWeek = Carbon::parse($appointment->date)->dayName;
        }

        // Geef de afspraken en dagen van de week door aan de weergave
        return Inertia::render('Appointments/Appointments', ['appointments' => $appointments]);
    }

    public function appointmentForm()
    {
        return Inertia::render('AppointmentForm');

    }

    public function updateDetails(Request $request, Appointment $appointment)
    {
        $appointment->custom_price = $request->custom_price;
        $appointment->custom_duration = $request->custom_duration;
        $appointment->save();

        return back()->with('success', 'Appointment details updated');
    }

    //    Dit werkt goed 3-2-2026

    public function storeAppointment(Request $request, $companyId)
    {
        $userId = Auth::id();

        // 1️⃣ Max aantal ACTIEVE afspraken per gebruiker
        $existingAppointmentCount = Appointment::where('user_id', $userId)
            ->whereNull('deleted_at')   // verwijderde tellen niet mee
            ->where('done', 0)          // afgeronde tellen niet mee
            ->count();

        if ($existingAppointmentCount >= 100) {
            return redirect()
                ->back()
                ->with('warning', __('max_active_appointments_reached'));
        }

        // 2️⃣ Validatie
        $data = $request->validate([
            'serviceId' => 'required|exists:services,id',
            'employeeId' => 'nullable',
            'date' => 'required|date|after_or_equal:today',
            'note' => 'nullable|string|max:500',
        ]);

        // 3️⃣ Check dubbele afspraak
        $conflictExists = Appointment::where('employee_id', $data['employeeId'])
            ->where('company_id', $companyId)
            ->where('date', $data['date'])
            ->exists();

        if ($conflictExists) {
            return redirect()
                ->back()
                ->with('error', __(
                    'This employee already has an appointment at :time on :date.',
                    [
                        'time' => \Carbon\Carbon::parse($data['date'])->format('H:i'),
                        'date' => \Carbon\Carbon::parse($data['date'])->format('d-m-Y'),
                    ]
                ));
        }

        // 4️⃣ Company ophalen
        $company = Company::findOrFail($companyId);

        // 5️⃣ Afspraak opslaan
        $appointment = new Appointment;
        $appointment->user_id = $userId;
        $appointment->company_id = $companyId;
        $appointment->employee_id = $data['employeeId'];
        $appointment->service_id = $data['serviceId'];
        $appointment->date = $data['date'];
        $appointment->note = $data['note'] ?? null;
        $appointment->accept = $company->autaccept ? 1 : 0;
        $appointment->save();

        // 6️⃣ JUISTE melding teruggeven
        if ($company->autaccept) {
            return redirect()
                ->back()
                ->with('success', __('appointment_confirmed'));
        }

        return redirect()
            ->back()
            ->with('warning', __('appointment_pending_approval'));
    }

    public function ShowMyAppointment()
    {
        $myappointments = Appointment::withTrashed()
            ->with(['user', 'company', 'employee']) // <--- employee toegevoegd
            ->where('user_id', Auth::id())
            ->get();

        foreach ($myappointments as $appointment) {
            $appointment->dayOfWeek = Carbon::parse($appointment->date)->locale(app()->getLocale())->dayName;
        }

        return Inertia::render('MyAppointments', ['myappointments' => $myappointments]);
    }

    // // this is a function only for the admin
    public function showAppointmentsByCompany($companyId)
    {
        if (! auth()->user()->is_admin) {
            abort(403, 'Unauthorized');
        }

        $company = Company::findOrFail($companyId);

        $appointments = Appointment::withTrashed()
            ->with('user', 'company', 'service', 'employee')
            ->where('company_id', $companyId)
            ->paginate(20);

        $totalAppointments = Appointment::withTrashed()
            ->where('company_id', $companyId)
            ->count();

        $allAppointments = Appointment::withTrashed()
            ->with('service')
            ->where('company_id', $companyId)
            ->get();

        // Totaal prijs van alle afspraken
        $totalPrice = $allAppointments->sum(fn ($a) => $a->service ? $a->service->price : 0);

        // Totaal prijs van afgeronde afspraken (done = true)
        $donePrice = $allAppointments
            ->where('done', true)
            ->sum(fn ($a) => $a->service ? $a->service->price : 0);

        // Totaal prijs van nog te doen afspraken (done = false)
        $pendingPrice = $allAppointments
            ->where('done', false)
            ->sum(fn ($a) => $a->service ? $a->service->price : 0);

        // Totaal duur van alle afspraken
        $totalDuration = $allAppointments->sum(fn ($a) => $a->service ? $a->service->duration : 0);

        return Inertia::render('Admin/CompanyAppointments', [
            'appointments' => $appointments,
            'company' => $company,
            'totalAppointments' => $totalAppointments,
            'totalPrice' => $totalPrice,
            'donePrice' => $donePrice,
            'pendingPrice' => $pendingPrice,
            'totalDuration' => $totalDuration,
        ]);
    }

    // dit werkt goed van alles maar alleen voor de owner niet voor emplyee ook

    public function ShowCompanyAppointment()
    {
        $user = auth()->user();

        // --- Bepaal aantal nieuwe afspraken (pending) ---
        if ($user->owner) {
            // Eigenaar → check alle bedrijven van hem
            $companies = Company::where('owner_id', $user->id)->pluck('id');

            $pendingAppointmentsCount = Appointment::whereIn('company_id', $companies)
                ->where('status', 'pending')
                ->count();
        } elseif ($user->company_id) {
            // Werknemer → check nieuwe afspraken voor werknemer
            $pendingAppointmentsCount = Appointment::where('employee_id', $user->id)
                ->where('status', 'pending')
                ->count();
        } else {
            $pendingAppointmentsCount = 0;
        }

        // --- AFSPRAKEN OPHALEN ---
        if ($user->owner) {
            $companies = Company::where('owner_id', $user->id)->pluck('id');

            if ($companies->isNotEmpty()) {
                $companyAppointments = Appointment::with(['user', 'company', 'service', 'employee'])
                    ->whereIn('company_id', $companies)
                    ->where('accept', 1)
                    ->paginate(20);

                return Inertia::render('Appointments/CompanyAppointments', [
                    'companyappointments' => $companyAppointments,
                    'pendingAppointmentsCount' => $pendingAppointmentsCount,
                ]);
            } else {
                return redirect()->back()->with('error', 'Je hebt geen bedrijven.');
            }

        } elseif ($user->company_id) {
            $employeeAppointments = Appointment::with(['user', 'company', 'service', 'employee'])
                ->where('employee_id', $user->id)
                ->where('accept', 1)
                ->paginate(20);

            return Inertia::render('Appointments/CompanyAppointments', [
                'companyappointments' => $employeeAppointments,
                'pendingAppointmentsCount' => $pendingAppointmentsCount,
            ]);

        } else {
            return redirect()->back()->with('error', 'Je hebt geen toegang tot deze afspraken.');
        }
    }

    public function ShowDeletedAppointments()
    {
        $user = auth()->user();

        // Alleen eigenaar mag verwijderde afspraken zien
        if (! $user->owner) {
            return redirect()->back()->with('error', 'Alleen de eigenaar kan verwijderde afspraken bekijken.');
        }

        // Haal de bedrijven op van deze eigenaar
        $companyIds = Company::where('owner_id', $user->id)->pluck('id');

        // Haal verwijderde afspraken op die horen bij de bedrijven van de eigenaar
        $deletedAppointments = Appointment::onlyTrashed()
            ->with(['user', 'company', 'service', 'employee'])
            ->whereIn('company_id', $companyIds)
            ->get(); // GEEN paginatie, zodat je appointments direct als array hebt

        return Inertia::render('Appointments/DeletedAppointments', [
            'appointments' => $deletedAppointments,
        ]);
    }

    public function RestoreAppointment($id)
    {
        $user = auth()->user();

        if (! $user->owner) {
            return redirect()->back()->with('error', 'Je hebt geen toestemming om deze afspraak te herstellen.');
        }

        $appointment = Appointment::onlyTrashed()->findOrFail($id);

        // Controleer of de eigenaar deze afspraak mag herstellen
        $companyIds = Company::where('owner_id', $user->id)->pluck('id');

        if (! $companyIds->contains($appointment->company_id)) {
            return redirect()->back()->with('error', 'Je hebt geen toegang tot deze afspraak.');
        }

        $appointment->restore();

        return redirect()->back()->with('success', 'Afspraak succesvol hersteld.');
    }

    public function ShowNewCompanyAppointment()
    {
        $user = auth()->user();

        // Als de user een eigenaar is
        if ($user->owner) {
            $companies = Company::where('owner_id', $user->id)->pluck('id');

            if ($companies->isNotEmpty()) {
                $companyAppointments = Appointment::with('user', 'company', 'service', 'employee')
                    ->whereIn('company_id', $companies)
                    ->whereNull('accept')
                    ->paginate(20);

                return Inertia::render('Appointments/NewCompanyAppointments', [
                    'companyappointments' => $companyAppointments,
                ]);
            } else {
                return redirect()->back()->with('error', 'You do not own any companies.');
            }

            // Als de user een werknemer is (heeft company_id)
        } elseif ($user->company_id) {
            $employeeAppointments = Appointment::with('user', 'company', 'service', 'employee')
                ->where('employee_id', $user->id)
                ->whereNull('accept')
                ->paginate(20);

            return Inertia::render('Appointments/NewCompanyAppointments', [
                'companyappointments' => $employeeAppointments,
            ]);
        }

        // Als de gebruiker geen eigenaar of werknemer is
        return redirect()->back()->with('error', 'Je hebt geen toegang tot deze afspraken.');
    }

    public function acceptAppointment(Appointment $appointment)
    {
        $appointment->accept = ! $appointment->accept;
        $appointment->save();

        return redirect()->back();
    }

    public function appointmentDone(Appointment $appointment)
    {
        $appointment->done = ! $appointment->done;
        $appointment->save();

        return redirect()->back();
    }

    // Hier wordt het verwijderd door de owner/ employee van het bedrijf maar het is niet echt weg
    public function softDelete(Request $request, Appointment $appointment)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        // Check of de gebruiker eigenaar is van het bedrijf
        if ($appointment->company->owner_id !== auth()->id()) {
            abort(403);
        }

        $appointment->deleted_reason = $request->reason;
        $appointment->save();
        $appointment->delete(); // Soft delete

        return back()->with('message', 'Appointment deleted with reason.');
    }

    // Hier kan ik als admin afspraken verwijdern
    public function deleteAppointment(Appointment $appointment)
    {
        $appointment->delete();

        return redirect()->back();
    }

    public function forceDeleteAppointment($id)
    {
        $appointment = Appointment::withTrashed()->findOrFail($id);
        $user = Auth::user();

        // =====================
        // AUTORISATIE
        // =====================

        // Employee → alleen eigen afspraak
        if ($user->company_id) {
            if ($appointment->employee_id !== $user->id) {
                abort(403, 'Niet jouw afspraak.');
            }
        }

        // Owner → afspraak van eigen bedrijf
        elseif ($user->owner) {
            if ($appointment->company->owner_id !== $user->id) {
                abort(403, 'Niet jouw bedrijf.');
            }
        }

        // =====================
        // BUSINESS REGEL
        // =====================
        if (! ($appointment->accept == 1 && $appointment->done == 1)) {
            return back()->with(
                'error',
                'Je kunt een afspraak alleen verwijderen als deze is geaccepteerd én afgerond.'
            );
        }

        // =====================
        // DELETE
        // =====================
        $appointment->forceDelete();

        return back()->with('success', 'Afspraak is permanent verwijderd.');
    }

    // Hier kan je in iedergeval verijderen ook als het niet done
    //    public function forceDeleteAppointment($id)
    //    {
    //        $appointment = Appointment::withTrashed()->findOrFail($id);
    //        $user = Auth::user();
    //
    //        // =====================
    //        // EMPLOYEE
    //        // =====================
    //        if ($user->company_id) {
    //            if ($appointment->employee_id !== $user->id) {
    //                abort(403, 'Niet jouw afspraak.');
    //            }
    //        }
    //
    //        // =====================
    //        // OWNER
    //        // =====================
    //        elseif ($user->owner) {
    //            if ($appointment->company->owner_id !== $user->id) {
    //                abort(403, 'Niet jouw bedrijf.');
    //            }
    //        }
    //
    //        // ⛔️ GEEN CHECK MEER OP done / accept
    //        // Afgeronde afspraken mogen nu ook weg
    //
    //        $appointment->forceDelete();
    //
    //        return back()->with('success', 'Afspraak is permanent verwijderd.');
    //    }

    public function export()
    {
        return Excel::download(new AppointmentsExport, 'appointments.csv');
    }

    public function exportCompanyAppointments()
    {
        $user = Auth::user();
        $company = $user->company ?? $user->owner ?? null;
        if (! $company) {
            return redirect()->back()->with('error', 'Geen gekoppeld bedrijf gevonden.');
        }

        return Excel::download(new CompanyAppointmentsExport, 'bedrijf_afspraken.csv');
    }

    // Hier word de bestand echt met xcel bedand gedownload
    //    public function exportA(Company $company)
    //    {
    //        $appointments = $company->appointments; // Haal alle afspraken van het bedrijf op
    //
    //        // Export logica (bijv. met Laravel Excel of een andere methode)
    //        return Excel::download(new AppointmentsExport($appointments), 'appointments.xlsx');
    //    }

    public function exportA(Request $request, Company $company)
    {
        $format = $request->query('format', 'xlsx'); // standaard naar xlsx
        $appointments = $company->appointments;

        $export = new AppointmentsExport($appointments);

        $filename = 'appointments.'.$format;

        // Ondersteunde formaten
        if ($format === 'csv') {
            return Excel::download($export, $filename, \Maatwebsite\Excel\Excel::CSV);
        }

        return Excel::download($export, $filename, \Maatwebsite\Excel\Excel::XLSX);
    }

    public function exportAToMove(Request $request, Company $company)
    {
        $format = $request->query('format', 'csv'); // standaard naar xlsx
        $appointments = $company->appointments;

        $export = new AppointmentsExportToMove($appointments);

        $filename = 'appointments.'.$format;

        // Ondersteunde formaten
        if ($format === 'csv') {
            return Excel::download($export, $filename, \Maatwebsite\Excel\Excel::CSV);
        }

        return Excel::download($export, $filename, \Maatwebsite\Excel\Excel::XLSX);
    }

    public function importA(Request $request, Company $company)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv', // ✅ Excel + CSV
        ]);

        try {
            Excel::import(new AppointmentsImport($company->id), $request->file('file'));

            return back()->with('success', 'Import succesvol voltooid.');
        } catch (\Exception $e) {
            return back()->with('error', 'Import mislukt: '.$e->getMessage());
        }
    }
}

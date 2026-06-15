<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\WorkDay;
use Inertia\Inertia;

class EmployeeDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('EmployeeDashboard', [
            'message' => 'Hallo werknemer!',
        ]);

    }

    public function mySchedule()
    {
        $user = auth()->user();
        $days = WorkDay::where('employee_id', $user->id)->get();

        return Inertia::render('MySchedule', [
            'user' => $user,
            'work_days' => $days,
        ]);
    }

    public function showEmployeeAppointments()
    {
        $user = auth()->user();

        // Controleer of de gebruiker gekoppeld is aan een bedrijf (dus een employee)
        if ($user->company_id !== null) {
            // Haal alleen afspraken op die aan deze werknemer zijn gekoppeld
            $appointments = Appointment::with('user', 'company', 'service', 'employee')
                ->where('employee_id', $user->id)
                ->get();

            return Inertia::render('Employee/EmployeeAppointments', [
                'appointments' => $appointments,
            ]);
        }

        return redirect()->back()->with('error', 'Je bent niet bevoegd om deze afspraken te bekijken.');
    }
}

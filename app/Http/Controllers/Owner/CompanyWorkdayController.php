<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyWorkdayController extends Controller
{
    public function showWorkdays(Company $company)
    {
        $workdays = $company->workdays()->whereNull('employee_id')->get();

        return Inertia::render('Company/WorkdaysPage', [
            'company' => $company,
            'workdays' => $workdays,
        ]);
    }

    public function edit(Company $company)
    {
        // Haal werkdagen op met alleen de benodigde velden
        $workdays = $company->workdays()->get(['day_of_week', 'start_time', 'end_time']);

        return Inertia::render('Company/CompanyWorkdays', [
            'company' => $company,
            'workdays' => $workdays,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        // Valideer de input
        $data = $request->validate([
            'workdays' => 'required|array',
            'workdays.*.day' => 'required|string',
            'workdays.*.start_time' => 'nullable|date_format:H:i',
            'workdays.*.end_time' => 'nullable|date_format:H:i',
        ]);

        // Verwijder oude werkdagen van deze company
        $company->workdays()->delete();

        foreach ($data['workdays'] as $workday) {
            // Sla alleen werkdagen op als start- en eindtijd zijn ingevuld
            if (! empty($workday['start_time']) && ! empty($workday['end_time'])) {
                $company->workdays()->create([
                    'day_of_week' => $workday['day'],  // let op: dag uit frontend heet 'day', DB-kolom 'day_of_week'
                    'start_time' => $workday['start_time'],
                    'end_time' => $workday['end_time'],
                ]);
            }
        }

        return redirect()->back()->with('success', 'Werkdagen succesvol bijgewerkt.');
    }
}

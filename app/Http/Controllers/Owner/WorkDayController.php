<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WorkDay;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WorkDayController extends Controller
{
    public function storeAvailableDay(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'exists:users,id'],
            'company_id' => ['required', 'exists:companies,id'],
            'day_of_week' => [
                'required',
                'string',
                Rule::unique('work_days')
                    ->where(fn ($q) => $q->where('employee_id', $request->employee_id)),
            ],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ], [
            'day_of_week.unique' => 'Deze dag is al toegevoegd voor deze medewerker.',
        ]);

        WorkDay::create($validated);

        return back()->with('success', 'Beschikbaarheid opgeslagen.');
    }

    public function showSchedule(User $employee)
    {
        $workDays = WorkDay::where('employee_id', $employee->id)->get();

        return Inertia::render('Employee/EmployeeSchedule', [
            'employee' => $employee,
            'work_days' => $workDays,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
        ]);

        $workDay = WorkDay::findOrFail($id);
        $workDay->update([
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        return redirect()->back();
    }

    public function deleteWorkDay($id)
    {
        $workDay = WorkDay::findOrFail($id);
        $workDay->delete();

        return redirect()->back();
    }
}

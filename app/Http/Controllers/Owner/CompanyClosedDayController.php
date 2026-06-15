<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\CompanyClosedDay;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyClosedDayController extends Controller
{
    public function index(Request $request, $companyId)
    {
        $company = Company::findOrFail($companyId);

        // 🔐 Security: company moet van deze user zijn
        abort_if($company->owner_id !== auth()->id(), 403);

        $closedDays = CompanyClosedDay::where('company_id', $company->id)
            ->orderBy('date')
            ->get(['id', 'date', 'reason']);

        return Inertia::render('owner/ClosedDays', [
            'company' => $company,
            'closedDays' => $closedDays,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $validated = $request->validate([
            'date' => ['required', 'date'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        // voorkomt duplicates door unique + updateOrCreate
        CompanyClosedDay::updateOrCreate(
            [
                'company_id' => $companyId,
                'date' => $validated['date'],
            ],
            [
                'reason' => $validated['reason'] ?? null,
            ]
        );

        return back()->with('success', 'Dag is gesloten');
    }

    public function destroy(Request $request, Company $company, CompanyClosedDay $closedDay)
    {
        // 🔐 Security 1: company moet van deze user zijn
        abort_if($company->owner_id !== auth()->id(), 403);

        // 🔐 Security 2: closed day moet bij deze company horen
        abort_if($closedDay->company_id !== $company->id, 403);

        $closedDay->delete();

        return back()->with('success', __('day_opened'));
    }
}

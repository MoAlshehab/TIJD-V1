<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Store a newly created service for a company.
     */
    public function store(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'description' => 'required|string|max:255',
            'status' => 'sometimes|boolean',

        ]);

        $company->services()->create($validated);

        return back()->with('success', 'Service succesvol toegevoegd');
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'description' => 'required|string|max:255',
            'status' => 'sometimes|boolean',

        ]);

        $service->update($validated);

        return redirect()->back()->with('success', 'Service bijgewerkt');
    }

    public function showCompanyServicesForUser($companyId)
    {
        $company = Company::with(['services' => function ($query) {
            $query->whereNull('deleted_at'); // Alleen actieve services
        }])->findOrFail($companyId);

        return Inertia::render('Company/Services', [  // let op hier: 'Services' component
            'company' => $company,
            'services' => $company->services,
        ]);
    }

    public function toggleStatus(Service $service)
    {
        $service->status = ! $service->status;
        $service->save();

        return redirect()->back()->with('success', 'Status bijgewerkt');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->back()->with('success', 'Service verwijderd');
    }

    public function restore($id)
    {
        $service = Service::withTrashed()->findOrFail($id);
        $service->restore();

        return back(); // of return response als je Inertia gebruikt
    }

    public function forceDelete($id)
    {
        $service = Service::withTrashed()->findOrFail($id);

        // Forceer verwijdering
        if ($service->trashed()) {
            $service->forceDelete();

            return back()->with('success', 'Service is permanent verwijderd.');
        }

        // Forceer verwijdering als de service niet soft deleted is
        $service->forceDelete();

        return back()->with('success', 'Service is permanent verwijderd.');
    }
}

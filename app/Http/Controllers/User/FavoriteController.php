<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function ShowMyFavorites()
    {
        $myfavorites = Favorite::with('user', 'company.media') // alleen company en media, geen employees
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('Company/FavoriteCompanies', [
            'myfavorites' => $myfavorites,
            'favorites' => Favorite::where('user_id', Auth::id())->pluck('company_id')->toArray(),
        ]);
    }

    public function CompanyEmployees($companyId)
    {
        $companyFans = Favorite::where('company_id', $companyId)
            ->with('user')
            ->get();

        $fansCount = $companyFans->count();

        return Inertia::render('CompanyEmployees', [
            'companyEmployees' => $companyFans,
            'CompanyEmployeesCount' => $fansCount,
        ]);
    }

    public function markAsFavorite($companyId)
    {
        $user = Auth::user();
        // Controleer of het bedrijf al als favoriet gemarkeerd is
        $existingFavorite = Favorite::where('user_id', $user->id)
            ->where('company_id', $companyId)
            ->first();

        if (! $existingFavorite) {
            // Markeer het bedrijf als favoriet
            Favorite::create([
                'user_id' => $user->id,
                'company_id' => $companyId,
            ]);

            return redirect()->back();
        }

        return response()->json(['message' => 'Company is already a favorite'], 422);
    }

    // Toevoegen aan de FavoriteController.php
    public function removeFromFavorites($companyId)
    {
        $user = Auth::user();

        // Zoek de favoriet op basis van de gebruiker en het bedrijf
        $favorite = Favorite::where('user_id', $user->id)
            ->where('company_id', $companyId)
            ->first();

        if ($favorite) {
            $favorite->delete();

            return redirect()->back();
        }

        return response()->json(['message' => 'Company is not in favorites'], 422);
    }
}

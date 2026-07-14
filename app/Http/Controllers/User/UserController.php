<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    // public function showProfile()
    // {
    //     // Haal de ingelogde gebruiker op
    //     $user = auth()->user();

    //     // Haal alle media uit de 'photo' collectie van de gebruiker
    //     $files = $user->getMedia('profile_photo');
    //     // Controleer of er een profielfoto is (bijv. 'profile' collectie) en haal de URL op
    //     $profileImageUrl = $user->getFirstMediaUrl('profile');

    //     // Zorg ervoor dat als er geen profielfoto is, je een standaard URL meegeeft
    //     if (! $profileImageUrl) {
    //         $profileImageUrl = '/storage/images/default_profile.jpg';
    //     }

    //     // Retourneer de gegevens naar de frontend via Inertia
    //     return Inertia::render('Profile/Profile', [
    //         'user' => $user,
    //         'files' => $files,
    //         'profileImageUrl' => $profileImageUrl,  // Zorg ervoor dat de URL van de profielfoto wordt doorgegeven
    //     ]);
    // }
public function showProfile()
{
    return Inertia::render('Profile/Profile', [
        'user' => auth()->user()->load('media'),
    ]);
}

    public function index()
    {
        $users = User::all();
        $usersCount = $users->count();

        return Inertia::render('User/Users', [
            'users' => $users,
            'usersCount' => $usersCount,
        ]);
    }

    public function archived()
    {
        // Haal alleen de gebruikers op die soft-deleted zijn
        $users = User::onlyTrashed()->get();
        $usersCount = $users->count();

        return Inertia::render('Admin/ArchivedUsersList', [
            'users' => $users,
            'usersCount' => $usersCount,
        ]);
    }

    public function restore($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        return back();
    }

    public function forceDelete($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->forceDelete();

        return back();
    }

    public function updateProfileImage(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20|unique:users,phone,'.$id,
            'profile_image' => 'nullable|image|max:2048',
        ]);

        $user = User::findOrFail($id);

        // 🔒 Beveiliging: alleen eigen profiel aanpassen
        if (auth()->id() !== $user->id) {
            abort(403);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;

        if ($request->hasFile('profile_image')) {
            $user->clearMediaCollection('profile_photo');
            $user->addMediaFromRequest('profile_image')->toMediaCollection('profile_photo','public');
        }

        $user->save();

        return back()->with('success', 'Gebruiker bijgewerkt');
    }

    public function delete(User $user)
    {
        // Controleer of de gebruiker die probeert te verwijderen niet de ingelogde admin is
        if (auth()->user()->id === $user->id && auth()->user()->is_admin) {
            return redirect()->back()->withErrors(['message' => 'You cannot delete your own admin account.']);
        }
        $user->delete();

        return redirect()->back();
    }
    // Admin function

    public function toggleIsAdmin(user $user, Request $request)
    {
        $user->is_admin = ! $user->is_admin;
        $user->save();

        return redirect()->back();

    }

    public function toggleOwner(user $user, Request $request)
    {
        $user->owner = ! $user->owner;
        $user->save();

        return redirect()->back();

    }

    public function toggleBlock(User $user)
    {
        $user->blocked = ! $user->blocked;
        $user->save();

        return redirect()->back();
    }

    // hier wordt de users door de admin verwijderd
    // TODO-MO : hier moet ik nog even nadenken of ik het wil dat dit function moet checken of ik een admin ben om dit te kunnen verwijderen.
    public function deleteUser(User $user)
    {
        $user->delete();

        return redirect()->back();

    }

    public function addEmployee($user_id, $companyId)
    {
        // Vind de gebruiker op basis van $user_id
        $user = User::find($user_id);

        // Controleer of de gebruiker bestaat
        if (! $user) {
            return redirect()->back()->with('error', "User with ID {$user_id} not found.");
        }

        // Voeg de company_id toe aan de gebruiker en sla op in de database
        $user->company_id = $companyId;
        $user->save();

        return redirect()->back()->with('success', "Company ID for user {$user_id} updated successfully.");
    }

    public function removeEmployee(User $user)
    {

        $user->update([
            'company_id' => null,
        ]);

        return back()->with('success', 'Employee succesvol verwijderd uit bedrijf.');
    }
}

<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\User;

class EmployeeController extends Controller
{
    public function remove(User $user)
    {
        // extra security: alleen owner mag dit
        // optioneel: check of user bij dit bedrijf hoort

        $user->update([
            'company_id' => null,
        ]);

        return back()->with('success', 'Employee removed');
    }
}

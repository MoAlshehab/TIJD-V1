<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        if (! Auth::user()) {
            abort(403);
        }

        return Inertia::render('General/Settings');
    }
}

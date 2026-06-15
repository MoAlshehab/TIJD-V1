<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Inertia\Response
     */

    //
    public function about()
    {
        return Inertia::render('General/About');

    }

    public function GetStarted()
    {
        return Inertia::render('GetStarted');

    }
}

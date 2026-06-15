<?php

//
// namespace App\Http\Controllers\Auth;
//
// use App\Http\Controllers\Controller;
// use App\Providers\RouteServiceProvider;
// use App\Models\User;
// use Illuminate\Foundation\Auth\RegistersUsers;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Mail;
// use Illuminate\Support\Facades\Validator;
//
// class RegisterController extends Controller
// {
//    /*
//    |--------------------------------------------------------------------------
//    | Register Controller
//    |--------------------------------------------------------------------------
//    |
//    | This controller handles the registration of new users as well as their
//    | validation and creation. By default this controller uses a trait to
//    | provide this functionality without requiring any additional code.
//    |
//    */
//
//    use RegistersUsers;
//
//    /**
//     * Where to redirect users after registration.
//     *
//     * @var string
//     */
//    protected $redirectTo = RouteServiceProvider::HOME;
//
//    /**
//     * Create a new controller instance.
//     *
//     * @return void
//     */
//    public function __construct()
//    {
//        $this->middleware('guest');
//    }
//
//    /**
//     * Get a validator for an incoming registration request.
//     *
//     * @param array $data
//     * @return \Illuminate\Contracts\Validation\Validator
//     */
//    protected function validator(array $data)
//    {
//        return Validator::make($data, [
//            'name' => ['required', 'string', 'max:255'],
//            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
//            'password' => ['required', 'string', 'min:8', 'confirmed'],
//        ]);
//    }
//
//    /**
//     * Create a new user instance after a valid registration.
//     *
//     * @param array $data
//     * @return \App\Models\User
//     */
//
//    protected function create(array $data)
//    {
//        $user = User::create([
//            'name' => $data['name'],
//            'email' => $data['email'],
//            'password' => Hash::make($data['password']),
//        ]);
//
//        $html = "
//        <div style='font-family: Arial, sans-serif; color: #333;'>
//            <h2 style='color: #2c3e50;'>Welkom bij onze app, {$user->name}!</h2>
//            <p>Je account is succesvol aangemaakt. We zijn blij dat je erbij bent!</p>
//            <p>Je kunt nu inloggen en beginnen met het gebruiken van onze diensten.</p>
//            <p>
//                <a href='" . url('/') . "' style='
//                    display: inline-block;
//                    background-color: #4CAF50;
//                    color: white;
//                    padding: 10px 20px;
//                    text-decoration: none;
//                    border-radius: 4px;
//                '>Ga naar de app</a>
//            </p>
//            <p style='margin-top: 30px;'>Met vriendelijke groet,<br>Het Team van Jouw App</p>
//        </div>
//    ";
//
//        Mail::send([], [], function ($message) use ($user, $html) {
//            $message->to($user->email)
//                ->subject('Welkom bij onze app!')
//                ->html($html);
//        });
//
//        return $user;
//    }
// }

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    use RegistersUsers;

    /**
     * Waar gebruikers na registratie naartoe worden gestuurd.
     *
     * @var string
     */
    protected $redirectTo = '/company/home';

    /**
     * Nieuwe controller-instantie.
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Valideer het registratieverzoek.
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'owner' => ['nullable', 'in:0,1'],

        ]);
    }

    /**
     * Maak een nieuwe gebruiker aan.
     */
    protected function create(array $data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'owner' => isset($data['owner']) ? (int) $data['owner'] : 0, // ✅ fix

        ]);

        // Verstuur welkomstmail
        $html = "
            <div style='font-family: Arial, sans-serif; color: #333;'>
                <h2 style='color: #2c3e50;'>Welkom bij onze app, {$user->name}!</h2>
                <p>Je account is succesvol aangemaakt. We zijn blij dat je erbij bent!</p>
                <p>Je kunt nu inloggen en beginnen met het gebruiken van onze diensten.</p>
                <p>
                    <a href='".url('/')."' style='
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 4px;
                    '>Ga naar de app</a>
                </p>
                <p style='margin-top: 30px;'>Met vriendelijke groet,<br>Het Team van Jouw App</p>
            </div>
        ";

        Mail::send([], [], function ($message) use ($user, $html) {
            $message->to($user->email)
                ->subject('Welkom bij onze app!')
                ->html($html);
        });

        return $user;
    }

    /**
     * Overschrijf registratie om event + redirect correct af te handelen.
     */
    public function register(Request $request)
    {
        $this->validator($request->all())->validate();

        event(new Registered($user = $this->create($request->all())));

        // Automatisch inloggen
        $this->guard()->login($user);

        return redirect($this->redirectPath());
    }
}

<?php

use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\Employee\EmployeeDashboardController;
use App\Http\Controllers\Owner\CompanyClosedDayController;
use App\Http\Controllers\Owner\CompanyController;
use App\Http\Controllers\Owner\CompanyWorkdayController;
use App\Http\Controllers\Owner\ServiceController;
use App\Http\Controllers\Owner\WorkDayController;
use App\Http\Controllers\User\AppointmentController;
use App\Http\Controllers\User\FavoriteController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\SettingsController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Woocommerce\WoocommerceController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware('guest')->group(function () {

    Route::get('/', [HomeController::class, 'GetStarted'])->name('GetStarted');
    Route::get('/registration', [RegistrationController::class, 'index'])->name('registration');
    Route::get('/about', [HomeController::class, 'about']);
    // For passwords
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'sendPasswordResetEmail']);
    Route::get('/reset-password-page/{token}', [PasswordResetLinkController::class, 'showResetForm'])->name('show');
    Route::post('/reset-password', [NewPasswordController::class, 'store']);

});

Auth::routes();
// Hier kan je zijn als je ingelogd heb
Route::middleware(['auth'])->group(function () {

    Route::get('/companies/{company}/services', [ServiceController::class, 'showCompanyServicesForUser'])
        ->name('companies.services');

    //    Route::post('/appointment/{companyId}', [Controllers\User\AppointmentController::class,'store']);
    Route::get('company/new_company', [CompanyController::class, 'showAddCompany']);

    Route::get('/appointmentForm', [AppointmentController::class, 'appointmentForm']);
    Route::get('company/home', [CompanyController::class, 'showCompanies']);
    Route::get('/CompanyArchive', [CompanyController::class, 'companiesArchive']);

    Route::post('/appointment/{companyId}', [AppointmentController::class, 'storeAppointment']);

    Route::get('/myappointments', [AppointmentController::class, 'ShowMyAppointment']);
    Route::get('company/favorites', [FavoriteController::class, 'ShowMyFavorites']);
    Route::get('/companies/{company}/employees', [AppointmentController::class, 'getAvailableDates']);
    Route::get('/available-hours', [AppointmentController::class, 'getAvailableHours']);

    Route::get('/company/{company}/employees-dates-hours', [CompanyController::class, 'showEmployeesWithDatesAndHours']);

    Route::get('/companies/{company}/employees', [CompanyController::class, 'showEmployees'])
        ->name('companies.employees');

    Route::get('/company/{company}/services', [ServiceController::class, 'showCompanyServicesForUser'])
        ->name('company.services');

    Route::get('/companies/{company}/details', [CompanyController::class, 'showDetails']);

    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');

    Route::get('/companies/{company}/workdays', [CompanyWorkdayController::class, 'showWorkdays'])
        ->name('companies.workdays');

    Route::post('/companies/{id}/open_close', [CompanyController::class, 'toggleOpenClose']);

    Route::post('/updateProfileImage/user/{id}', [UserController::class, 'updateProfileImage']);

    Route::get('/profile', [UserController::class, 'showProfile']);
    Route::post('/user/{user}', [UserController::class, 'update']);
    Route::post('/edit/user/{user}', [UserController::class, 'edit']);
    Route::delete('/user/{user}', [UserController::class, 'delete']);
    Route::delete('/appointment/{appointment}/force-delete', [AppointmentController::class, 'forceDeleteAppointment']);
    Route::post('/company/{companyId}', [FavoriteController::class, 'markAsFavorite']);
    Route::post('/favorite/{companyId}', [FavoriteController::class, 'removeFromFavorites']);
    Route::get('/settings', [SettingsController::class, 'index']);

    //    Route::get('/woocommerce/products/create', [WoocommerceController::class, 'create'])->name('products.create');
    //    Route::post('/woocommerce/products/store', [WoocommerceController::class, 'store'])->name('products.store');
    //    Route::get('/woocommerce/products', [WoocommerceController::class, 'showProducts'])->name('products.index');
    //    Route::get('/woocommerce', [WoocommerceController::class, 'index']);
    //    Route::get('/woocommerce/products', [WoocommerceController::class, 'fetchProducts']);

});

// ✅ Routes voor medewerkers (alleen toegankelijk als je ingelogd bent én employee bent)
Route::middleware(['auth', 'employee'])->group(function () {
    Route::get('/employee-dashboard/{company_id}', [EmployeeDashboardController::class, 'index'])
        ->name('employee.dashboard');

    Route::get('/employee/appointments', [EmployeeDashboardController::class, 'showEmployeeAppointments'])
        ->name('employee.appointments');

    Route::get('/my-schedule', [EmployeeDashboardController::class, 'mySchedule'])
        ->name('my.schedule');

    Route::get('/new-company-appointments', [AppointmentController::class, 'ShowNewCompanyAppointment']);

    Route::get('/company-appointments', [AppointmentController::class, 'ShowCompanyAppointment']);
    Route::post('/appointment/{appointment}/update-details', [AppointmentController::class, 'updateDetails']);

});

Route::middleware(['admin'])->prefix('admin')->group(function () {

    Route::delete('/company/{company}', [CompanyController::class, 'delete']);
    Route::get('/companies/archive', [CompanyController::class, 'companiesArchive'])->name('admin.companies.archive');
    Route::post('/companies/restore/{id}', [CompanyController::class, 'restore'])->name('admin.companies.restore');
    Route::delete('/companies/force-delete/{id}', [CompanyController::class, 'forceDelete'])->name('companies.forceDelete');
    Route::get('/allcompanies/export', [CompanyController::class, 'exportCompany'])->name('exportCompany');

    Route::get('/appointments', [AppointmentController::class, 'getAllAppointments']);
    Route::get('/appointments/company/{companyId}', [AppointmentController::class, 'showAppointmentsByCompany'])->name('admin.company.appointments');
    Route::get('/AppointmentArchive', [AppointmentController::class, 'AppointmentsArchives']);
    Route::delete('/appointment/{appointment}', [AppointmentController::class, 'deleteAppointment']);
    Route::get('/allapointments/export', [AppointmentController::class, 'export'])->name('export');

    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/user/{user}', [UserController::class, 'deleteUser']);
    Route::get('/users/archived', [UserController::class, 'archived'])->name('admin.users.archived');
    Route::post('/users/{id}/restore', [UserController::class, 'restore']);
    Route::delete('/users/{id}/force-delete', [UserController::class, 'forceDelete']);

});

Route::middleware(['owner'])->prefix('owner')->group(function () {

    Route::post('/companies', [CompanyController::class, 'store']);
    Route::delete('/company/{company}', [CompanyController::class, 'destroy']);
    Route::post('/appointment/{id}/status', [AppointmentController::class, 'updateStatus']);
    Route::get('/appointments/export', [AppointmentController::class, 'exportCompanyAppointments']);

    Route::put('/company/{id}', [CompanyController::class, 'update']);
    Route::post('/company/{company}/services', [ServiceController::class, 'store']);

    Route::get('/mycompany', [CompanyController::class, 'ShowMyCompany']);
    Route::get('/company', [CompanyController::class, 'index']);
    Route::get('/company/{companyId}/company_employees', [FavoriteController::class, 'CompanyEmployees']);

    Route::delete('/employee/{user}', [\App\Http\Controllers\Owner\EmployeeController::class, 'remove']);

    Route::post('/employee/availability', [WorkDayController::class, 'storeAvailableDay']);

    // Owner closed days management
    Route::post('/company/{company}/closed-days', [CompanyClosedDayController::class, 'store']);
    Route::delete('/company/{company}/closed-days/{closedDay}', [CompanyClosedDayController::class, 'destroy']);
    Route::get('/company/{company}/closed-days', [CompanyClosedDayController::class, 'index']);

    Route::post('/user/{user}/company/{companyId}', [UserController::class, 'addEmployee']);
    Route::delete('/user/{user}/company', [UserController::class, 'removeEmployee']);

    Route::get('/company-appointments', [AppointmentController::class, 'ShowCompanyAppointment']);

    Route::patch('/companies/{company}/autaccept', [CompanyController::class, 'toggleAutaccept']);

    Route::get('/company/{company}/opening-hours', [CompanyWorkdayController::class, 'edit'])
        ->name('company.workdays.edit');

    Route::post('/company/{company}/opening-hours', [CompanyWorkdayController::class, 'update'])
        ->name('company.workdays.update');

    Route::get('/deleted-appointments', [AppointmentController::class, 'ShowDeletedAppointments'])->name('appointments.deleted');
    Route::put('/appointments/{id}/restore', [AppointmentController::class, 'RestoreAppointment'])->name('appointments.restore');

    Route::get('/company/{company}/services', [ServiceController::class, 'getServices']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
    Route::put('/services/{service}/restore', [ServiceController::class, 'restore']);
    Route::delete('/services/{service}/force-delete', [ServiceController::class, 'forceDelete'])->name('services.forceDelete');
    Route::patch('/services/{service}/toggle-status', [ServiceController::class, 'toggleStatus']);

    Route::get('/company/{company}/appointments/export', [AppointmentController::class, 'exportA'])->name('appointments.export');
    Route::get('/company/{company}/appointments/exportToMove', [AppointmentController::class, 'exportAToMove'])->name('appointments.exportAToMove');

    Route::post('/company/{company}/appointments/import', [AppointmentController::class, 'importA'])->name('appointments.import');

    Route::post('/appointment/{appointment}/delete-with-reason', [AppointmentController::class, 'softDelete']);

    Route::get('/employees/{employee}/reserved-times/{date}', [AppointmentController::class, 'getReservedTimes']);

    Route::get('/{employee}/schedule', [WorkDayController::class, 'showSchedule'])
        ->name('employee.schedule');
    Route::put('/work-day/{id}', [WorkDayController::class, 'update'])
        ->name('work_day.update');
    Route::delete('/work-day/{id}', [WorkDayController::class, 'deleteWorkDay'])
        ->name('work_day.delete');
});

Route::fallback(function () {
    if (Auth::check()) {
        return redirect('/company/home');
    }

    return Inertia::render('Errors/NotFound');
});

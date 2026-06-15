<?php

use App\Http\Controllers\User\AppointmentController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Woocommerce\WoocommerceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Hier is de woocommerce routes
Route::get('/woocommerce', [WoocommerceController::class, 'index']);
Route::get('/woocommerce/products', [WoocommerceController::class, 'fetchProducts']);

Route::post('/user/{user}/is_admin', [UserController::class, 'toggleIsAdmin']);
Route::post('/user/{user}/owner', [UserController::class, 'toggleOwner']);
Route::post('/user/{user}/block', [UserController::class, 'toggleBlock']);
Route::post('/appointment/{appointment}/accept', [AppointmentController::class, 'acceptAppointment']);
Route::post('/appointment/{appointment}/done', [AppointmentController::class, 'appointmentDone']);

// Route::post('/user/{user}/company/{companyId}', [UserController::class, 'addEmployee']);
// Route::delete('/user/{user}/company', [UserController::class, 'removeEmployee']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();

});

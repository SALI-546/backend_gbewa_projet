<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\PaymentRequestController;
use App\Http\Controllers\PaymentOrderController;
use App\Http\Controllers\EngagementController;

// Route pour afficher la page d'accueil
Route::get('/', function () {
    return view('home');  // Vue de la page d'accueil
});

// Route pour afficher la liste des employés (vue Blade 'employees.index')
Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');

Route::get('/requests', [RequestController::class, 'show'])->name('requests.show');

Route::get('/trainings', [TrainingController::class, 'index'])->name('trainings.create');
Route::get('/payments', [PaymentRequestController::class, 'index'])->name('payments.page');
Route::get('/orderpayment', [PaymentOrderController::class, 'index'])->name('orderpayment.page2');
Route::get('/engagement', [EngagementController::class, 'index'])->name('engagement.page');

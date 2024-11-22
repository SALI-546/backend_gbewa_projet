<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EngagementController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\EngagementOperationController;
use App\Http\Controllers\Api\BudgetTrackingController;
use App\Http\Controllers\Api\AccountingImputationController;
use App\Http\Controllers\Api\ProjectInfosController;

Route::middleware('auth:sanctum')->group(function () {
    // Routes protégées par l'authentification si nécessaire
});

// Routes API publiques
Route::get('/engagements', [EngagementController::class, 'index']);
Route::post('/engagements', [EngagementController::class, 'store']);
Route::get('/engagements/{id}', [EngagementController::class, 'show']);
Route::put('/engagements/{id}', [EngagementController::class, 'update']);
Route::delete('/engagements/{id}', [EngagementController::class, 'destroy']);

Route::get('/projects', [ProjectInfosController::class, 'index']);
Route::get('/engagements/{engagement}/operations', [EngagementOperationController::class, 'index']);
Route::post('/engagements/{engagement}/operations', [EngagementOperationController::class, 'store']);


Route::get('/engagements/{engagement}/budget-tracking', [BudgetTrackingController::class, 'show']);
Route::post('/engagements/{engagement}/budget-tracking', [BudgetTrackingController::class, 'store']);
Route::put('/budget-trackings/{id}', [BudgetTrackingController::class, 'update']);



// Ajoutez d'autres routes API si nécessaire
Route::get('/engagements/{engagementId}/accounting-imputation', [AccountingImputationController::class, 'show']);
Route::post('/engagements/{engagementId}/accounting-imputation', [AccountingImputationController::class, 'store']);
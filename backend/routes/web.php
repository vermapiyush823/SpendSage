<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SpendingController;
use App\Http\Controllers\AiController;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\StripeController;


Route::get('/', function () {
    return view('welcome');
});

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::post('/register', [AuthController::class, 'register'])->name('register');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth:sanctum')->post('/spending', [SpendingController::class, 'store'])->name('spending');

Route::middleware('auth:sanctum')->get('/spending', [SpendingController::class, 'getUserSpendingThisMonth'])->name('userSpendingThisMonth');

Route::middleware('auth:sanctum')->post('/getSpending', [SpendingController::class, 'getUserSpending'])->name('userSpending');

Route::middleware('auth:sanctum')->get('/budget', [SpendingController::class, 'getUserBudgetThisMonth'])->name('userBudgetThisMonth');

Route::middleware('auth:sanctum')->post('/changebudget', [SpendingController::class, 'changeBudget'])->name('budget');

Route::middleware('auth:sanctum')->get('/monthlyspendingtrend', [SpendingController::class, 'getMonthlySpendingTrend'])->name('monthlySpendingTrend');

Route::middleware('auth:sanctum')->get('categoryspendingovertime', [SpendingController::class, 'categorySpendingOvertime'])->name('categorySpendingOvertime');

Route::middleware('auth:sanctum')->get('/hasUserPremium', [AiController::class, 'hasUserPremium'])->name('hasUserPremium');

Route::middleware('auth:sanctum')->post('/giveUserPremium', [AiController::class, 'giveUserPremium'])->name('giveUserPremium');


Route::middleware('auth:sanctum')->get('/getPredictiveSpendingInsights', [AiController::class, 'getPredictiveSpendingInsights'])->name('getPredictiveSpendingInsights');


Route::post('/api-completions', [AiController::class, 'getCompletions']);


Route::post('/stripe/payment', [StripeController::class, 'processPayment']);
Route::post('/stripe/webhook', function (Request $request) {
    // Handle the webhook payload
    $payload = @file_get_contents('php://input');
    $event = json_decode($payload, true);

    if ($event['type'] == 'payment_intent.succeeded') {
        // Handle successful payment
    }

    return response('Webhook handled', 200);
});

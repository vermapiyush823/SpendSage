<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\User;

class StripeController extends Controller
{
    public function processPayment(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
        $paymentIntent = PaymentIntent::create([
            'amount' => 100000, // Amount in indian paise
            'currency' => 'inr',
            'automatic_payment_methods' => [
                'enabled' => true,
                'allow_redirects' => 'never'
            ],
        ]);



        if ($paymentIntent->status === 'succeeded') {
            // Mark user as premium
            User::find($request->user_id)->update(['isPremiumUser' => true]);
        }

        return response()->json([
            'client_secret' => $paymentIntent->client_secret,
        ]);
    }
}

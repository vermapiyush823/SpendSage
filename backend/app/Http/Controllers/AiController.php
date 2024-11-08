<?php

namespace App\Http\Controllers;

use App\Models\Spending;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    //
    public function hasUserPremium(Request $request)
    {
        // Check if user is authenticated
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Get the authenticated user
        $user = Auth::guard('sanctum')->user();

        // Check if user has premium
        $prem =  User::where('id', $user->id)->where('isPremiumUser', true)->exists();
        return response()->json(['has_premium' =>   $prem]);
    }
    public function giveUserPremium(Request $request)
    {
        // Check if user is authenticated
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Get the authenticated user
        $user = Auth::guard('sanctum')->user();

        // Check if user has premium
        $prem =  User::where('id', $user->id)->where('isPremiumUser', true)->exists();
        if ($prem) {
            return response()->json(['error' => 'User already has premium'], 400);
        }
        User::where('id', $user->id)->update(['isPremiumUser' => true]);
        return response()->json(['has_premium' => true]);
    }

    public function getPredictiveSpendingInsights(Request $request)
    {
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $year = date('Y');
        $userId = Auth::id();

        // Retrieve monthly spending data grouped by category
        $spendings = Spending::where('user_id', $userId)
            ->whereYear('created_at', $year)
            ->orderBy('created_at', 'asc')
            ->get(['food', 'travel', 'shopping', 'personal', 'other', 'created_at'])
            ->groupBy(function ($spending) {
                return Carbon::parse($spending->created_at)->format('Y-m');
            });

        // Initialize arrays to store category data and anomalies
        $monthlyData = [];
        $anomalies = [];

        foreach ($spendings as $month => $records) {
            $totals = [
                'food' => $records->sum('food'),
                'travel' => $records->sum('travel'),
                'shopping' => $records->sum('shopping'),
                'personal' => $records->sum('personal'),
                'other' => $records->sum('other')
            ];

            // Check for anomalies
            foreach ($totals as $category => $amount) {
                $average = $spendings->flatten()->avg($category); // Average historical spending
                $threshold = $average * 1.5; // Set anomaly threshold at 150% of average
                if ($amount > $threshold) {
                    $anomalies[] = [
                        'month' => $month,
                        'category' => $category,
                        'amount' => $amount
                    ];
                }
            }

            // Store monthly spending
            $monthlyData[] = [
                'month' => $month,
                'data' => $totals
            ];
        }

        return response()->json([
            'monthlyData' => $monthlyData,
            'predictions' => $this->generatePredictions($monthlyData),
            'anomalies' => $anomalies
        ], 200);
    }

    // Helper function to generate predictions based on historical average
    private function generatePredictions($monthlyData)
    {
        $categoryAverages = [];
        $predictions = [];

        // Calculate averages for each category
        foreach ($monthlyData as $data) {
            foreach ($data['data'] as $category => $amount) {
                $categoryAverages[$category][] = $amount;
            }
        }

        foreach ($categoryAverages as $category => $values) {
            $average = array_sum($values) / count($values);
            $predictions[$category] = round($average, 2); // Simple prediction for next month
        }

        return $predictions;
    }
}

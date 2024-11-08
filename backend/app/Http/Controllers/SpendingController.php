<?php

namespace App\Http\Controllers;

use App\Models\Spending;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class SpendingController extends Controller
{
    // Method to store spending data
    public function store(Request $request)
    {
        // Check if user is authenticated
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Validate input data
        $validatedData = $request->validate([
            'travel' => 'nullable|numeric',
            'food' => 'nullable|numeric',
            'shopping' => 'nullable|numeric',
            'personal' => 'nullable|numeric',
            'other' => 'nullable|numeric',
        ]);

        // Create a spending record associated with the authenticated user
        Spending::create([
            'travel' => $validatedData['travel'] ?? 0,
            'food' => $validatedData['food'] ?? 0,
            'shopping' => $validatedData['shopping'] ?? 0,
            'personal' => $validatedData['personal'] ?? 0,
            'other' => $validatedData['other'] ?? 0,
            'user_id' => Auth::id(),  // Getting the authenticated user's ID
        ]);

        // Return success response
        return response()->json(['message' => 'Spending recorded successfully'], 201);
    }

    // Get authenticated user's spending for the current month
    public function getUserSpendingThisMonth(Request $request)
    {
        // Check if user is authenticated
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Get the authenticated user
        $user = Auth::guard('sanctum')->user();

        // Get the current date
        $currentYear = date('Y');
        $currentMonth = date('m');

        // Fetch spending records for the current month
        $spendings = Spending::where('user_id', $user->id)
            ->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)
            ->get(['id', 'travel', 'food', 'shopping', 'personal', 'other', 'created_at']);

        // Return spending data as a JSON response
        return response()->json($spendings, 200,);
    }

    public function getUserSpending(Request $request)
    {
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $validatedData = $request->validate([
            'viewType' => 'required|string',
            'year' => 'nullable|numeric',
            'month' => 'nullable|numeric',
        ]);

        if ($validatedData['viewType'] == 'monthly') {
            $year = $validatedData['year'] ?? date('Y');
            $month = $validatedData['month'] ?? date('m');
            $spendings = Spending::where('user_id', Auth::id())
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->get(['id', 'travel', 'food', 'shopping', 'personal', 'other', 'created_at']);

            return response()->json(
                [[
                    'food' => $spendings->sum('food'),
                    'travel' => $spendings->sum('travel'),
                    'shopping' => $spendings->sum('shopping'),
                    'personal' => $spendings->sum('personal'),
                    'other' => $spendings->sum('other'),
                ]],
                200
            );
        }

        $spendings = Spending::where('user_id', Auth::id())
            ->get(['id', 'travel', 'food', 'shopping', 'personal', 'other', 'created_at']);

        return response()->json(
            [[
                'food' => $spendings->sum('food'),
                'travel' => $spendings->sum('travel'),
                'shopping' => $spendings->sum('shopping'),
                'personal' => $spendings->sum('personal'),
                'other' => $spendings->sum('other'),
            ]],
            200
        );
    }

    // Get authenticated user's budget for the current month
    public function getUserBudgetThisMonth(Request $request)
    {
        // Check if user is authenticated
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Get the authenticated user
        $user = Auth::guard('sanctum')->user();

        // Fetch user's budget
        $budget = User::where('id', $user->id)->get(['id', 'budget', 'created_at']);

        // Return budget data as a JSON response
        return response()->json($budget, 200);
    }

    // Change the authenticated user's budget
    public function getMonthlySpendingTrend(Request $request)
    {
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Get current year and the last 12 months
        $currentYear = date('Y');
        $currentMonth = date('m');

        // Initialize an array to hold monthly totals
        $monthlyTotals = [];

        // Fetch spending data grouped by month and year
        $spendings = Spending::where('user_id', Auth::id())
            ->whereYear('created_at', $currentYear)
            ->get(['travel', 'food', 'shopping', 'personal', 'other', 'created_at'])
            ->groupBy(function ($spending) {
                return \Carbon\Carbon::parse($spending->created_at)->format('m'); // Group by month
            });

        // Populate monthly totals
        for ($i = 1; $i <=  $currentMonth; $i++) {
            $monthKey = str_pad($i, 2, '0', STR_PAD_LEFT); // Ensure month is two digits
            if (isset($spendings[$monthKey])) {
                $monthlyTotals[$monthKey] = $spendings[$monthKey]->sum(function ($spending) {
                    return $spending->travel + $spending->food + $spending->shopping + $spending->personal + $spending->other;
                });
            } else {
                $monthlyTotals[$monthKey] = 0; // No spending for that month
            }
        }

        // Prepare the response data
        $responseData = [
            'labels' => array_map(function ($month) {
                return \Carbon\Carbon::createFromFormat('m', $month)->format('F'); // Convert month number to month name
            }, array_keys($monthlyTotals)),
            'data' => array_values($monthlyTotals),
        ];

        return response()->json($responseData, 200);
    }


    public function categorySpendingOverTime(Request $request)
    {
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Validate the request data (optional: you can add a date range if needed)
        $validatedData = $request->validate([
            'year' => 'nullable|numeric', // Optional: Filter by year
        ]);

        $year = $validatedData['year'] ?? date('Y');
        // Retrieve spending data for the user, grouped by month and ordered by created_at
        $spendings = Spending::where('user_id', Auth::id())
            ->whereYear('created_at', $year)
            ->orderBy('created_at', 'asc')  // Order by created_at in ascending order
            ->get(['food', 'travel', 'shopping', 'personal', 'other', 'created_at'])
            ->groupBy(function ($spending) {
                return \Carbon\Carbon::parse($spending->created_at)->format('Y-m');
            });

        // Initialize the data structure to store monthly totals by category
        $monthlySpending = [];

        foreach ($spendings as $month => $records) {
            $monthlySpending[] = [
                'month' => $month,
                'category' => [
                    'food' => $records->sum('food'),
                    'travel' => $records->sum('travel'),
                    'shopping' => $records->sum('shopping'),
                    'personal' => $records->sum('personal'),
                    'other' => $records->sum('other'),
                ],
            ];
        }

        return response()->json($monthlySpending, 200);
    }

    public function changeBudget(Request $request)
    {
        // Check if user is authenticated
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Get the authenticated user
        $user = Auth::guard('sanctum')->user();

        // Validate the budget input
        $validatedData = $request->validate([
            'budget' => 'required|numeric',
        ]);

        // Update the user's budget
        $user->budget = $validatedData['budget'];
        $user->save();

        // Return success response
        return response()->json(['message' => 'Budget updated successfully'], 200);
    }
}

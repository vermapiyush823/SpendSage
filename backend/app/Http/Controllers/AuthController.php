<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    //
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return [
                'errors' => [
                    'email' => 'The provided email does not exist'
                ]
            ];
        }

        elseif(!Hash::check($request->password, $user->password)) {
            return [
                'errors' => [
                    'password' => 'The provided password is incorrect'
                ]
            ];
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'ok',
            'user' => $user,
            'token' => $token,
            
        ], 200);
    }
    public function logout(Request $request)
    {
        Auth::logout();
        return [
            'message' => 'Logged out'
        ];
    }

    public function register(Request $request)
    {
        $credentials =  $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);


        $user = User::create([
            'name' => $credentials['name'],
            'email' => $credentials['email'],
            'password' => Hash::make($credentials['password']),
        ]);
    
        $token = $user->createToken('auth-token')->plainTextToken;
        return response()->json([
            'message' => 'ok',
            'user' => $user,
            'token' => $token,
        ], 201);
    }
    
}

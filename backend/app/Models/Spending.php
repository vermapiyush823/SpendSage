<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Spending extends Model
{
    use HasFactory;

    // Defining the relationship: Spending belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Defining fillable fields
    protected $fillable = [
        'travel',
        'food',
        'shopping',
        'personal',
        'other',
        'user_id',
    ];

    // Optional: Casting attributes to specific types
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}

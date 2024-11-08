<?php
return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'spending',
        'budget',
        'changebudget',
        'getSpending',
        'monthlyspendingtrend',
        'categoryspendingovertime',
        'hasUserPremium',
        'giveUserPremium',
        'getPredictiveSpendingInsights',
        '/api-completions',
        '/stripe/payment',
        '/stripe/webhook',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];

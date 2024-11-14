<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountingImputation;
use Illuminate\Http\Request;

class AccountingImputationController extends Controller
{
    public function show($engagementId)
    {
        $imputation = AccountingImputation::with('entries')->where('engagement_id', $engagementId)->first();

        if (!$imputation) {
            return response()->json(null, 404);
        }

        return response()->json($imputation);
    }

    public function store(Request $request, $engagementId)
    {
        $data = $request->validate([
            'order_number' => 'nullable|string',
            'description' => 'nullable|string',
            'entries' => 'required|array',
            'entries.*.accountType' => 'required|in:Débit,Crédit',
            'entries.*.accountNumber' => 'required|string',
            'entries.*.amountType' => 'required|in:Débit,Crédit',
            'entries.*.amountPlaceholder' => 'nullable|string',
        ]);

        $imputation = AccountingImputation::create([
            'engagement_id' => $engagementId,
            'order_number' => $data['order_number'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        foreach ($data['entries'] as $entryData) {
            $imputation->entries()->create([
                'account_type' => $entryData['accountType'],
                'account_number' => $entryData['accountNumber'],
                'amount_type' => $entryData['amountType'],
                'amount_placeholder' => $entryData['amountPlaceholder'],
            ]);
        }

        return response()->json($imputation->load('entries'), 201);
    }
}

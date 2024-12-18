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

    /**
     * Met à jour une imputation comptable existante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id  ID de l'imputation comptable
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $imputation = AccountingImputation::with('entries')->findOrFail($id);

        $data = $request->validate([
            'order_number' => 'nullable|string',
            'description' => 'nullable|string',
            'entries' => 'sometimes|array',
            'entries.*.id' => 'sometimes|exists:accounting_imputation_entries,id',
            'entries.*.accountType' => 'required_with:entries|in:Débit,Crédit',
            'entries.*.accountNumber' => 'required_with:entries|string',
            'entries.*.amountType' => 'required_with:entries|in:Débit,Crédit',
            'entries.*.amountPlaceholder' => 'nullable|string',
        ]);

        // Mettre à jour l'imputation comptable
        $imputation->update([
            'order_number' => $data['order_number'] ?? $imputation->order_number,
            'description' => $data['description'] ?? $imputation->description,
        ]);

        if (isset($data['entries'])) {
            // Mettre à jour ou créer les entrées
            foreach ($data['entries'] as $entryData) {
                if (isset($entryData['id'])) {
                    // Mettre à jour une entrée existante
                    $entry = $imputation->entries()->findOrFail($entryData['id']);
                    $entry->update([
                        'account_type' => $entryData['accountType'],
                        'account_number' => $entryData['accountNumber'],
                        'amount_type' => $entryData['amountType'],
                        'amount_placeholder' => $entryData['amountPlaceholder'] ?? $entry->amount_placeholder,
                    ]);
                } else {
                    // Créer une nouvelle entrée
                    $imputation->entries()->create([
                        'account_type' => $entryData['accountType'],
                        'account_number' => $entryData['accountNumber'],
                        'amount_type' => $entryData['amountType'],
                        'amount_placeholder' => $entryData['amountPlaceholder'] ?? null,
                    ]);
                }
            }
        }

        return response()->json($imputation->load('entries'), 200);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BudgetTracking;
use Illuminate\Support\Facades\Log;

class BudgetTrackingController extends Controller
{
    /**
     * Afficher le suivi budgétaire pour un engagement spécifique.
     */
    public function show($engagementId)
    {
        $budgetTracking = BudgetTracking::where('engagement_id', $engagementId)->first();

        if (!$budgetTracking) {
            Log::error("Aucun suivi budgétaire trouvé pour l'engagement ID: {$engagementId}");
            return response()->json(['message' => 'Aucun suivi budgétaire trouvé.'], 404);
        }

        Log::info("Suivi budgétaire récupéré: ", $budgetTracking->toArray());

        return response()->json($budgetTracking);
    }

    /**
     * Stocker un nouveau suivi budgétaire pour un engagement spécifique.
     */
    public function store(Request $request, $engagementId)
    {
        $data = $request->validate([
            'budget_line' => 'nullable|string',
            'amount_allocated' => 'nullable|numeric',
            'amount_spent' => 'nullable|numeric',
            'amount_approved' => 'nullable|numeric',
            'old_balance' => 'nullable|numeric',
            'new_balance' => 'nullable|numeric',
            'fournisseurs_prestataire' => 'nullable|string',
            'moyens_de_paiement' => 'nullable|in:Caisse,Chèque,Virement',
        ]);

        $data['engagement_id'] = $engagementId;

        $budgetTracking = BudgetTracking::create($data);

        return response()->json($budgetTracking, 201);
    }

    /**
     * Mettre à jour un suivi budgétaire existant.
     */
    public function update(Request $request, $id)
    {
        $budgetTracking = BudgetTracking::findOrFail($id);

        $data = $request->validate([
            'budget_line' => 'nullable|string',
            'amount_allocated' => 'nullable|numeric',
            'amount_spent' => 'nullable|numeric',
            'amount_approved' => 'nullable|numeric',
            'old_balance' => 'nullable|numeric',
            'new_balance' => 'nullable|numeric',
            'fournisseurs_prestataire' => 'nullable|string',
            'moyens_de_paiement' => 'nullable|in:Caisse,Chèque,Virement',
        ]);

        $budgetTracking->update($data);

        return response()->json($budgetTracking);
    }
}

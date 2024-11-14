<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BudgetTracking;

class BudgetTrackingController extends Controller
{
    public function show($engagementId)
    {
        $budgetTracking = BudgetTracking::where('engagement_id', $engagementId)->first();

        return response()->json($budgetTracking);
    }

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
            'avis' => 'nullable|in:Favorable,Défavorable',
            'moyens_de_paiement' => 'nullable|in:Caisse,Chèque,Virement',
            'signature' => 'nullable|in:Visa Comptable,Visa Chef Comptable,Visa DAF,Visa DE',
        ]);

        $data['engagement_id'] = $engagementId;

        $budgetTracking = BudgetTracking::create($data);

        return response()->json($budgetTracking, 201);
    }

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
            'avis' => 'nullable|in:Favorable,Défavorable',
            'moyens_de_paiement' => 'nullable|in:Caisse,Chèque,Virement',
            'signature' => 'nullable|in:Visa Comptable,Visa Chef Comptable,Visa DAF,Visa DE',
        ]);

        $budgetTracking->update($data);

        return response()->json($budgetTracking);
    }
}

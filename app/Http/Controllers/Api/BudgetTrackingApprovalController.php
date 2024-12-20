<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BudgetTracking;
use App\Models\BudgetTrackingApproval;

class BudgetTrackingApprovalController extends Controller
{
    /**
     * Soumettre un nouvel avis et signature pour un suivi budgétaire.
     */
    public function store(Request $request, $budgetTrackingId)
    {
        $budgetTracking = BudgetTracking::findOrFail($budgetTrackingId);

        $data = $request->validate([
            'avis' => 'required|in:Favorable,Défavorable',
            'signature_type' => 'required|in:Visa Comptable,Visa Chef Comptable,Visa DAF,Visa DE',
            'signature_image' => 'required|string', // Base64 image
            'observation' => 'nullable|string',
        ]);

        $approval = BudgetTrackingApproval::create([
            'budget_tracking_id' => $budgetTracking->id,
            'avis' => $data['avis'],
            'signature_type' => $data['signature_type'],
            'signature_image' => $data['signature_image'],
            'observation' => $data['observation'],
            'approved_at' => now(),
        ]);

        return response()->json($approval, 201);
    }

    /**
     * Récupérer les avis et signatures pour un suivi budgétaire.
     */
    public function index($budgetTrackingId)
    {
        $budgetTracking = BudgetTracking::with('approvals')->findOrFail($budgetTrackingId);
        $approvals = $budgetTracking->approvals()->orderBy('approved_at', 'desc')->get();

        return response()->json($approvals);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Engagement;
use App\Models\EngagementOperation;

class EngagementOperationController extends Controller
{
    public function index($engagementId)
    {
        $engagement = Engagement::findOrFail($engagementId);
        $operations = $engagement->engagementOperations;

        return response()->json($operations);
    }

    public function store(Request $request, $engagementId)
    {
        $engagement = Engagement::findOrFail($engagementId);

        // Supprimer les opérations existantes si nécessaire
        $engagement->engagementOperations()->delete();

        // Créer les nouvelles opérations
        foreach ($request->operations as $operationData) {
            $engagement->engagementOperations()->create($operationData);
        }

        return response()->json(['message' => 'Opérations enregistrées avec succès']);
    }

    /**
     * Met à jour une opération existante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id  ID de l'opération
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $operation = EngagementOperation::findOrFail($id);

        $validatedData = $request->validate([
            'designation' => 'required|string',
            'quantite' => 'required|numeric|min:0',
            'nombre' => 'required|numeric|min:0',
            'pu' => 'required|numeric|min:0',
            'montant' => 'required|numeric|min:0',
            'observations' => 'nullable|string',
        ]);

        $operation->update($validatedData);

        return response()->json($operation);
    }
}

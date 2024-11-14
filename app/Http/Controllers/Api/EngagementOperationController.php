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
}

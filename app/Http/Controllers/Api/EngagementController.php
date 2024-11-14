<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Engagement;

class EngagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Engagement::with('project');

        // Filtrer par date
        if ($request->start_date && $request->end_date) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        // Filtrer par projet
        if ($request->project_id) {
            $query->where('project_id', $request->project_id);
        }

        $engagements = $query->get();

        return response()->json($engagements);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'order_number' => 'nullable|string',
            'service_demandeur' => 'required|string',
            'wbs' => 'nullable|string',
            'motif_demande' => 'nullable|string',
            'date' => 'nullable|date',
            'reference' => 'nullable|string',
        ]);

        $engagement = Engagement::create($validatedData);

        return response()->json($engagement, 201);
    }

    public function show($id)
    {
        $engagement = Engagement::with(['project', 'engagementOperations'])->findOrFail($id);

        return response()->json($engagement);
    }

    public function update(Request $request, $id)
    {
        $engagement = Engagement::findOrFail($id);

        $validatedData = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'order_number' => 'nullable|string',
            'service_demandeur' => 'required|string',
            'wbs' => 'nullable|string',
            'motif_demande' => 'nullable|string',
            'date' => 'nullable|date',
            'reference' => 'nullable|string',
        ]);

        $engagement->update($validatedData);

        return response()->json($engagement);
    }

    public function destroy($id)
    {
        $engagement = Engagement::findOrFail($id);
        $engagement->delete();

        return response()->json(null, 204);
    }
}

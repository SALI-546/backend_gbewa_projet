<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentRequestController extends Controller
{
    /**
     * Affiche toutes les demandes de paiement avec possibilité de filtrage.
     */
    public function index(Request $request)
    {
        // Initialiser la requête avec les relations nécessaires
        $query = PaymentRequest::with(['project', 'followedBy', 'recapForms.attachments']);

        // Filtrer par project_id si fourni
        if ($request->has('project_id') && !empty($request->project_id)) {
            $query->where('project_id', $request->project_id);
        }

        // Filtrer par start_date si fourni
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->whereDate('date', '>=', $request->start_date);
        }

        // Filtrer par end_date si fourni
        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->whereDate('date', '<=', $request->end_date);
        }

        // Exécuter la requête
        $paymentRequests = $query->get();

        // Ajouter une URL pour chaque attachment
        foreach ($paymentRequests as $paymentRequest) {
            foreach ($paymentRequest->recapForms as $recapForm) {
                foreach ($recapForm->attachments as $attachment) {
                    $attachment->url = asset('storage/' . $attachment->file_path);
                }
            }
        }

        Log::info("PaymentRequestController@index - Nombre de demandes récupérées: " . $paymentRequests->count());

        return response()->json($paymentRequests);
    }

    /**
     * Crée une nouvelle demande de paiement.
     */
    public function store(Request $request)
    {
        Log::info('Données reçues dans PaymentRequestController@store:', $request->all());

        // Validation des données
        $validatedData = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'followed_by_id' => 'nullable|exists:users,id',
            'quality' => 'nullable|string|max:255',
            'operation' => 'required|string',
            'beneficiary' => 'required|string',
            'invoice_details' => 'required|string',
            'budget_line' => 'required|string',
            // Ajoutez d'autres validations si nécessaire
        ]);

        Log::info('Données validées:', $validatedData);

        // Ajouter la date si nécessaire
        if (!array_key_exists('date', $validatedData) || !$validatedData['date']) {
            $validatedData['date'] = now();
        }

        // Générer automatiquement un `order_number` unique
        $validatedData['order_number'] = 'ORD-' . strtoupper(Str::random(10));

        try {
            // Créer la demande de paiement
            $paymentRequest = PaymentRequest::create($validatedData);

            Log::info('PaymentRequest créé:', $paymentRequest->toArray());

            // Retourner l'ID de la demande créée
            return response()->json([
                'id' => $paymentRequest->id,
                'message' => 'Demande de paiement créée avec succès'
            ], 201);
        } catch (\Exception $e) {
            // Gérer les erreurs
            Log::error('Erreur lors de la création de la demande:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Erreur lors de la création de la demande',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    /**
     * Affiche une demande de paiement spécifique.
     */
    public function show($id)
    {
        // Nettoyer l'ID pour enlever les caractères indésirables comme les sauts de ligne
        $id = (int) trim($id); // Cast en entier pour éviter les caractères non numériques
        Log::info("PaymentRequestController@show - ID reçu: $id");

        // Charger les relations: project, followedBy, recap_forms et leurs attachments
        $paymentRequest = PaymentRequest::with(['project', 'followedBy', 'recapForms.attachments'])->find($id);

        if (!$paymentRequest) {
            Log::warning("PaymentRequestController@show - Demande de paiement non trouvée: ID $id");
            return response()->json(['message' => 'Demande de paiement non trouvée'], 404);
        }

        Log::info("PaymentRequestController@show - PaymentRequest trouvé: ID $id", $paymentRequest->toArray());

        // Ajouter un attribut 'url' pour chaque attachment
        foreach ($paymentRequest->recapForms as $recapForm) {
            foreach ($recapForm->attachments as $attachment) {
                $attachment->url = asset('storage/' . $attachment->file_path);
            }
        }

        return response()->json($paymentRequest);
    }

    /**
     * Met à jour une demande de paiement spécifique.
     */
    public function update(Request $request, $id)
    {
        $id = (int) trim($id);
        $paymentRequest = PaymentRequest::find($id);
        if (!$paymentRequest) {
            return response()->json(['message' => 'Demande de paiement non trouvée'], 404);
        }

        // Validation des données
        $validatedData = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'followed_by_id' => 'nullable|exists:users,id',
            'quality' => 'nullable|string|max:255',
            'operation' => 'required|string',
            'beneficiary' => 'required|string',
            'invoice_details' => 'required|string',
            'budget_line' => 'required|string',
            // Ajoutez d'autres validations si nécessaire
        ]);

        try {
            // Mettre à jour la demande de paiement
            $paymentRequest->update($validatedData);

            return response()->json([
                'message' => 'Demande de paiement mise à jour avec succès'
            ]);
        } catch (\Exception $e) {
            // Gérer les erreurs
            Log::error('Erreur lors de la mise à jour de la demande de paiement:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la demande de paiement',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    /**
     * Supprime une demande de paiement spécifique.
     */
    public function destroy($id)
    {
        $id = (int) trim($id);
        $paymentRequest = PaymentRequest::find($id);
        if (!$paymentRequest) {
            return response()->json(['message' => 'Demande de paiement non trouvée'], 404);
        }

        try {
            $paymentRequest->delete();
            return response()->json(['message' => 'Demande de paiement supprimée avec succès']);
        } catch (\Exception $e) {
            // Gérer les erreurs
            Log::error('Erreur lors de la suppression de la demande de paiement:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Erreur lors de la suppression de la demande de paiement',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }
}

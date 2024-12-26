<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PaymentRequestController extends Controller
{
    /**
     * Affiche une liste des demandes de paiement.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $paymentRequests = PaymentRequest::with(['project', 'followedBy', 'recapForms.attachments'])->get();

        // Transformation des données pour correspondre aux conventions frontend (camelCase)
        $transformed = $paymentRequests->map(function($pr) {
            return [
                'id' => $pr->id,
                'project' => [
                    'id' => $pr->project->id,
                    'name' => $pr->project->name ?? $pr->project->title, // Utilisation de name ou title
                ],
                'orderNumber' => $pr->order_number,
                'date' => $pr->date ? $pr->date->toDateString() : null,
                'operation' => $pr->operation,
                'beneficiary' => $pr->beneficiary,
                'invoiceDetails' => $pr->invoice_details,
                'budgetLine' => $pr->budget_line,
                'followedBy' => $pr->followedBy ? [
                    'id' => $pr->followedBy->id,
                    'name' => $pr->followedBy->name,
                ] : null,
                'quality' => $pr->quality,
                'recapForms' => $pr->recapForms->map(function($rf) {
                    return [
                        'id' => $rf->id,
                        'activite' => $rf->activite,
                        'montantPresenteTotal' => $rf->montant_presente_total,
                        'montantPresenteEligible' => $rf->montant_presente_eligible,
                        'montantSollicite' => $rf->montant_sollicite,
                        'attachments' => $rf->attachments->map(function($att) {
                            return [
                                'id' => $att->id,
                                'filePath' => $att->file_path,
                                'fileName' => $att->file_name,
                                'url' => $att->url, // Assurez-vous que le modèle Attachment a un accessoire 'url' pour obtenir l'URL complète
                            ];
                        }),
                    ];
                }),
                'createdAt' => $pr->created_at,
                'updatedAt' => $pr->updated_at,
            ];
        });

        return response()->json([
            'message' => 'Demandes de paiement récupérées avec succès',
            'data' => $transformed,
        ], 200);
    }

    /**
     * Affiche une demande de paiement spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $paymentRequest = PaymentRequest::with(['project', 'followedBy', 'recapForms.attachments'])->findOrFail($id);

        // Transformation des données pour correspondre aux conventions frontend (camelCase)
        $transformed = [
            'id' => $paymentRequest->id,
            'project' => [
                'id' => $paymentRequest->project->id,
                'name' => $paymentRequest->project->name ?? $paymentRequest->project->title, 
            ],
            'orderNumber' => $paymentRequest->order_number,
            'date' => $paymentRequest->date ? $paymentRequest->date->toDateString() : null,
            'operation' => $paymentRequest->operation,
            'beneficiary' => $paymentRequest->beneficiary,
            'invoiceDetails' => $paymentRequest->invoice_details,
            'budgetLine' => $paymentRequest->budget_line,
            'followedBy' => $paymentRequest->followedBy ? [
                'id' => $paymentRequest->followedBy->id,
                'name' => $paymentRequest->followedBy->name,
            ] : null,
            'quality' => $paymentRequest->quality,
            'recapForms' => $paymentRequest->recapForms->map(function($rf) {
                return [
                    'id' => $rf->id,
                    'activite' => $rf->activite,
                    'montantPresenteTotal' => $rf->montant_presente_total,
                    'montantPresenteEligible' => $rf->montant_presente_eligible,
                    'montantSollicite' => $rf->montant_sollicite,
                    'attachments' => $rf->attachments->map(function($att) {
                        return [
                            'id' => $att->id,
                            'filePath' => $att->file_path,
                            'fileName' => $att->file_name,
                            'url' => $att->url, 
                        ];
                    }),
                ];
            }),
            'createdAt' => $paymentRequest->created_at,
            'updatedAt' => $paymentRequest->updated_at,
        ];

        return response()->json([
            'message' => 'Demande de paiement récupérée avec succès',
            'data' => $transformed,
        ], 200);
    }

    /**
     * Crée une nouvelle demande de paiement.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        Log::info("PaymentRequestController@store - Début de la création d'une nouvelle demande de paiement.");

        try {
            // Validation des données de la requête sans les 'recap_forms'
            $validatedData = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'order_number' => 'required|string|unique:payment_requests,order_number',
                'operation' => 'required|string',
                'beneficiary' => 'required|string',
                'invoice_details' => 'required|string',
                'budget_line' => 'required|string',
                'followed_by_id' => 'nullable|exists:users,id',
                'quality' => 'nullable|string|max:255',
                'date' => 'nullable|date', // Ajoutez ceci si nécessaire
            ]);

            Log::info("PaymentRequestController@store - Données validées:", $validatedData);

            DB::beginTransaction();

            // Créer la demande de paiement avec la date actuelle
            $paymentRequest = PaymentRequest::create([
                'project_id' => $validatedData['project_id'],
                'order_number' => $validatedData['order_number'],
                'operation' => $validatedData['operation'],
                'beneficiary' => $validatedData['beneficiary'],
                'invoice_details' => $validatedData['invoice_details'],
                'budget_line' => $validatedData['budget_line'],
                'followed_by_id' => $validatedData['followed_by_id'] ?? null,
                'quality' => $validatedData['quality'] ?? null,
                'date' => $validatedData['date'] ?? now(), 
            ]);

            Log::info("PaymentRequestController@store - Demande de paiement créée: ID {$paymentRequest->id}");

            DB::commit();

            Log::info("PaymentRequestController@store - Demande de paiement créée avec succès: ID {$paymentRequest->id}");

            // Charger les relations mises à jour
            $paymentRequest->load(['project', 'followedBy']);

            // Transformation des données pour la réponse
            $paymentRequestTransformed = [
                'id' => $paymentRequest->id,
                'project' => [
                    'id' => $paymentRequest->project->id,
                    'name' => $paymentRequest->project->name ?? $paymentRequest->project->title,
                ],
                'orderNumber' => $paymentRequest->order_number,
                'date' => $paymentRequest->date ? $paymentRequest->date->toDateString() : null,
                'operation' => $paymentRequest->operation,
                'beneficiary' => $paymentRequest->beneficiary,
                'invoiceDetails' => $paymentRequest->invoice_details,
                'budgetLine' => $paymentRequest->budget_line,
                'followedBy' => $paymentRequest->followedBy ? [
                    'id' => $paymentRequest->followedBy->id,
                    'name' => $paymentRequest->followedBy->name,
                ] : null,
                'quality' => $paymentRequest->quality,
                'recapForms' => [], // Initialement vide, peut être ajouté si nécessaire
                'createdAt' => $paymentRequest->created_at,
                'updatedAt' => $paymentRequest->updated_at,
            ];

            return response()->json([
                'message' => 'Demande de paiement créée avec succès',
                'data' => $paymentRequestTransformed,
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error("PaymentRequestController@store - Erreur lors de la création de la demande de paiement: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'message' => 'Erreur lors de la création de la demande de paiement',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }


    /**
     * Met à jour une demande de paiement existante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id  ID de la demande de paiement à mettre à jour
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        Log::info("PaymentRequestController@update - Début de la mise à jour pour l'ID: $id");
        Log::info("PaymentRequestController@update - Request input:", $request->all());

        try {
            // Trouver la demande de paiement existante
            $paymentRequest = PaymentRequest::findOrFail($id);

            // Validation des données de la requête sans les 'recap_forms'
            $validatedData = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'order_number' => 'required|string|unique:payment_requests,order_number,' . $paymentRequest->id,
                'operation' => 'required|string',
                'beneficiary' => 'required|string',
                'invoice_details' => 'required|string',
                'budget_line' => 'required|string',
                'followed_by_id' => 'nullable|exists:users,id',
                'quality' => 'nullable|string|max:255',
                'date' => 'nullable|date', // Ajoutez ceci si nécessaire
            ]);

            Log::info("PaymentRequestController@update - Données validées:", $validatedData);

            DB::beginTransaction();

            // Mettre à jour la demande de paiement
            $paymentRequest->update([
                'project_id' => $validatedData['project_id'],
                'order_number' => $validatedData['order_number'],
                'operation' => $validatedData['operation'],
                'beneficiary' => $validatedData['beneficiary'],
                'invoice_details' => $validatedData['invoice_details'],
                'budget_line' => $validatedData['budget_line'],
                'followed_by_id' => $validatedData['followed_by_id'] ?? null,
                'quality' => $validatedData['quality'] ?? null,
                'date' => $validatedData['date'] ?? $paymentRequest->date,
            ]);

            Log::info("PaymentRequestController@update - Demande de paiement mise à jour: ID {$paymentRequest->id}");

            DB::commit();

            Log::info("PaymentRequestController@update - Demande de paiement mise à jour avec succès: ID {$paymentRequest->id}");

            // Charger les relations mises à jour
            $paymentRequest->load(['project', 'followedBy']);

            // Transformation des données pour la réponse
            $paymentRequestTransformed = [
                'id' => $paymentRequest->id,
                'project' => [
                    'id' => $paymentRequest->project->id,
                    'name' => $paymentRequest->project->name ?? $paymentRequest->project->title,
                ],
                'orderNumber' => $paymentRequest->order_number,
                'date' => $paymentRequest->date ? $paymentRequest->date->toDateString() : null,
                'operation' => $paymentRequest->operation,
                'beneficiary' => $paymentRequest->beneficiary,
                'invoiceDetails' => $paymentRequest->invoice_details,
                'budgetLine' => $paymentRequest->budget_line,
                'followedBy' => $paymentRequest->followedBy ? [
                    'id' => $paymentRequest->followedBy->id,
                    'name' => $paymentRequest->followedBy->name,
                ] : null,
                'quality' => $paymentRequest->quality,
                'recapForms' => [], // Peut être mis à jour si nécessaire
                'createdAt' => $paymentRequest->created_at,
                'updatedAt' => $paymentRequest->updated_at,
            ];

            return response()->json([
                'message' => 'Demande de paiement mise à jour avec succès',
                'data' => $paymentRequestTransformed,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollback();
            Log::error("PaymentRequestController@update - Validation échouée:", $e->errors());
            return response()->json([
                'message' => 'Erreur de validation lors de la mise à jour de la demande de paiement',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error("PaymentRequestController@update - Erreur lors de la mise à jour de la demande de paiement: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la demande de paiement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Supprime une demande de paiement.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        Log::info("PaymentRequestController@destroy - Début de la suppression pour l'ID: $id");

        try {
            $paymentRequest = PaymentRequest::with(['recapForms.attachments'])->findOrFail($id);

            // Supprimer les pièces jointes associées
            foreach ($paymentRequest->recapForms as $recapForm) {
                foreach ($recapForm->attachments as $attachment) {
                    Storage::disk('public')->delete($attachment->file_path);
                    $attachment->delete();
                    Log::info("PaymentRequestController@destroy - Pièce jointe supprimée: ID {$attachment->id}");
                }
                $recapForm->delete();
                Log::info("PaymentRequestController@destroy - Formulaire récapitulatif supprimé: ID {$recapForm->id}");
            }

            // Supprimer la demande de paiement
            $paymentRequest->delete();
            Log::info("PaymentRequestController@destroy - Demande de paiement supprimée: ID {$paymentRequest->id}");

            return response()->json([
                'message' => 'Demande de paiement supprimée avec succès',
            ], 200);

        } catch (\Exception $e) {
            Log::error('PaymentRequestController@destroy - Erreur lors de la suppression de la demande de paiement:', [
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

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentRequest;
use App\Models\RecapForm;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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
                                'url' => $att->url,
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
                'name' => $paymentRequest->project->name ?? $paymentRequest->project->title, // Utilisation de name ou title
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
            // Validation des données de la requête
            $validatedData = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'order_number' => 'required|string|unique:payment_requests,order_number',
                'operation' => 'required|string',
                'beneficiary' => 'required|string',
                'invoice_details' => 'required|string',
                'budget_line' => 'required|string',
                'followed_by_id' => 'nullable|exists:users,id',
                'quality' => 'nullable|string|max:255',
                'recap_forms' => 'required|array|min:1',
                'recap_forms.*.activite' => 'required|string',
                'recap_forms.*.montant_presente_total' => 'required|numeric',
                'recap_forms.*.montant_presente_eligible' => 'required|numeric',
                'recap_forms.*.montant_sollicite' => 'required|numeric',
                'recap_forms.*.attachments' => 'nullable|array',
                'recap_forms.*.attachments.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048',
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
                'date' => now(), // Ajout de la date actuelle
            ]);

            Log::info("PaymentRequestController@store - Demande de paiement créée: ID {$paymentRequest->id}");

            // Gestion des formulaires récapitulatifs
            foreach ($validatedData['recap_forms'] as $recapFormData) {
                $recapForm = $paymentRequest->recapForms()->create([
                    'activite' => $recapFormData['activite'],
                    'montant_presente_total' => $recapFormData['montant_presente_total'],
                    'montant_presente_eligible' => $recapFormData['montant_presente_eligible'],
                    'montant_sollicite' => $recapFormData['montant_sollicite'],
                ]);

                Log::info("PaymentRequestController@store - Formulaire récapitulatif créé: ID {$recapForm->id}");

                // Gestion des pièces jointes
                if (isset($recapFormData['attachments']) && is_array($recapFormData['attachments'])) {
                    foreach ($recapFormData['attachments'] as $file) {
                        if ($file instanceof \Illuminate\Http\UploadedFile) {
                            $filePath = $file->store('attachments', 'public');

                            $recapForm->attachments()->create([
                                'file_path' => $filePath,
                                'file_name' => $file->getClientOriginalName(),
                            ]);

                            Log::info("PaymentRequestController@store - Pièce jointe ajoutée: {$file->getClientOriginalName()} pour Formulaire récapitulatif ID {$recapForm->id}");
                        }
                    }
                }
            }

            DB::commit();

            Log::info("PaymentRequestController@store - Demande de paiement et formulaires récapitulatifs créés avec succès: ID {$paymentRequest->id}");

            // Charger les relations mises à jour
            $paymentRequest->load(['project', 'followedBy', 'recapForms.attachments']);

            // Transformation des données pour la réponse
            $paymentRequestTransformed = [
                'id' => $paymentRequest->id,
                'project' => [
                    'id' => $paymentRequest->project->id,
                    'name' => $paymentRequest->project->name ?? $paymentRequest->project->title, // Utilisation de name ou title
                ],
                'orderNumber' => $paymentRequest->order_number,
                'date' => $paymentRequest->date ? $paymentRequest->date->toDateString() : null, // Gestion de la date
                'operation' => $paymentRequest->operation,
                'beneficiary' => $paymentRequest->beneficiary,
                'invoiceDetails' => $paymentRequest->invoice_details,
                'budgetLine' => $paymentRequest->budget_line,
                'followedBy' => $paymentRequest->followedBy ? [
                    'id' => $paymentRequest->followedBy->id,
                    'name' => $paymentRequest->followedBy->name,
                ] : null,
                'quality' => $paymentRequest->quality,
                'recapForms' => $paymentRequest->recapForms->map(function($form) {
                    return [
                        'id' => $form->id,
                        'activite' => $form->activite,
                        'montantPresenteTotal' => $form->montant_presente_total,
                        'montantPresenteEligible' => $form->montant_presente_eligible,
                        'montantSollicite' => $form->montant_sollicite,
                        'attachments' => $form->attachments->map(function($att) {
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

        try {
            // Récupérer la demande de paiement avec ses formulaires récapitulatifs et leurs pièces jointes
            $paymentRequest = PaymentRequest::with(['recapForms.attachments'])->findOrFail($id);

            Log::info("PaymentRequestController@update - Demande de paiement trouvée: ID $id");

            // Log des données reçues pour débogage
            Log::info("PaymentRequestController@update - Requête reçue:", $request->all());

            // Validation des données de la requête
            $validatedData = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'order_number' => 'required|string|unique:payment_requests,order_number,' . $id,
                'operation' => 'required|string',
                'beneficiary' => 'required|string',
                'invoice_details' => 'required|string',
                'budget_line' => 'required|string',
                'followed_by_id' => 'nullable|exists:users,id',
                'quality' => 'nullable|string|max:255',
                'recap_forms' => 'required|array|min:1',
                'recap_forms.*.id' => 'sometimes|exists:recap_forms,id',
                'recap_forms.*.activite' => 'required|string',
                'recap_forms.*.montant_presente_total' => 'required|numeric',
                'recap_forms.*.montant_presente_eligible' => 'required|numeric',
                'recap_forms.*.montant_sollicite' => 'required|numeric',
                'recap_forms.*.attachments' => 'nullable|array',
                'recap_forms.*.attachments.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048',
            ]);

            Log::info("PaymentRequestController@update - Données validées:", $validatedData);

            DB::beginTransaction();

            // Mettre à jour les champs principaux de la demande de paiement
            $paymentRequest->update([
                'project_id' => $validatedData['project_id'],
                'order_number' => $validatedData['order_number'],
                'operation' => $validatedData['operation'],
                'beneficiary' => $validatedData['beneficiary'],
                'invoice_details' => $validatedData['invoice_details'],
                'budget_line' => $validatedData['budget_line'],
                'followed_by_id' => $validatedData['followed_by_id'] ?? null,
                'quality' => $validatedData['quality'] ?? null,
            ]);

            Log::info("PaymentRequestController@update - Demande de paiement mise à jour: ID {$paymentRequest->id}");

            // Gestion des formulaires récapitulatifs
            $existingRecapFormIds = $paymentRequest->recapForms->pluck('id')->toArray();
            $receivedRecapFormIds = [];

            foreach ($validatedData['recap_forms'] as $recapFormData) {
                if (isset($recapFormData['id'])) {
                    // Mise à jour d'un formulaire récapitulatif existant
                    $recapForm = RecapForm::findOrFail($recapFormData['id']);

                    // Vérifier que le formulaire récapitulatif appartient bien à la demande de paiement
                    if ($recapForm->payment_request_id !== $paymentRequest->id) {
                        throw new \Exception("Le formulaire récapitulatif ID {$recapForm->id} n'appartient pas à la demande de paiement ID {$paymentRequest->id}");
                    }

                    // Mettre à jour le formulaire récapitulatif
                    $recapForm->update([
                        'activite' => $recapFormData['activite'],
                        'montant_presente_total' => $recapFormData['montant_presente_total'],
                        'montant_presente_eligible' => $recapFormData['montant_presente_eligible'],
                        'montant_sollicite' => $recapFormData['montant_sollicite'],
                    ]);

                    Log::info("PaymentRequestController@update - Formulaire récapitulatif mis à jour: ID {$recapForm->id}");

                    $receivedRecapFormIds[] = $recapForm->id;

                    // Gestion des nouvelles pièces jointes
                    if (isset($recapFormData['attachments']) && is_array($recapFormData['attachments'])) {
                        foreach ($recapFormData['attachments'] as $file) {
                            // Vérifier si le fichier est une instance de UploadedFile
                            if ($file instanceof \Illuminate\Http\UploadedFile) {
                                $filePath = $file->store('attachments', 'public');

                                $recapForm->attachments()->create([
                                    'file_path' => $filePath,
                                    'file_name' => $file->getClientOriginalName(),
                                ]);

                                Log::info("PaymentRequestController@update - Pièce jointe ajoutée: {$file->getClientOriginalName()} pour Formulaire récapitulatif ID {$recapForm->id}");
                            }
                        }
                    }
                } else {
                    // Création d'un nouveau formulaire récapitulatif
                    $newRecapForm = $paymentRequest->recapForms()->create([
                        'activite' => $recapFormData['activite'],
                        'montant_presente_total' => $recapFormData['montant_presente_total'],
                        'montant_presente_eligible' => $recapFormData['montant_presente_eligible'],
                        'montant_sollicite' => $recapFormData['montant_sollicite'],
                    ]);

                    Log::info("PaymentRequestController@update - Nouveau formulaire récapitulatif créé: ID {$newRecapForm->id}");

                    $receivedRecapFormIds[] = $newRecapForm->id;

                    // Gestion des pièces jointes
                    if (isset($recapFormData['attachments']) && is_array($recapFormData['attachments'])) {
                        foreach ($recapFormData['attachments'] as $file) {
                            if ($file instanceof \Illuminate\Http\UploadedFile) {
                                $filePath = $file->store('attachments', 'public');

                                $newRecapForm->attachments()->create([
                                    'file_path' => $filePath,
                                    'file_name' => $file->getClientOriginalName(),
                                ]);

                                Log::info("PaymentRequestController@update - Pièce jointe ajoutée: {$file->getClientOriginalName()} pour Formulaire récapitulatif ID {$newRecapForm->id}");
                            }
                        }
                    }
                }
            }

            // Suppression des formulaires récapitulatifs qui n'ont pas été reçus
            $recapFormsToDelete = array_diff($existingRecapFormIds, $receivedRecapFormIds);
            foreach ($recapFormsToDelete as $recapFormId) {
                $recapForm = RecapForm::with('attachments')->find($recapFormId);
                if ($recapForm) {
                    // Supprimer les pièces jointes associées
                    foreach ($recapForm->attachments as $attachment) {
                        Storage::disk('public')->delete($attachment->file_path);
                        $attachment->delete();
                        Log::info("PaymentRequestController@update - Pièce jointe supprimée: ID {$attachment->id}");
                    }

                    // Supprimer le formulaire récapitulatif
                    $recapForm->delete();
                    Log::info("PaymentRequestController@update - Formulaire récapitulatif supprimé: ID {$recapForm->id}");
                }
            }

            DB::commit();

            Log::info("PaymentRequestController@update - Mise à jour réussie pour la demande de paiement ID {$paymentRequest->id}");

            // Charger les relations mises à jour
            $paymentRequest->load(['project', 'followedBy', 'recapForms.attachments']);

            // Transformation des données pour la réponse
            $paymentRequestTransformed = [
                'id' => $paymentRequest->id,
                'project' => [
                    'id' => $paymentRequest->project->id,
                    'name' => $paymentRequest->project->name,
                ],
                'orderNumber' => $paymentRequest->order_number,
                'date' => $paymentRequest->date ? $paymentRequest->date->toDateString() : null, // Gestion de la date
                'operation' => $paymentRequest->operation,
                'beneficiary' => $paymentRequest->beneficiary,
                'invoiceDetails' => $paymentRequest->invoice_details,
                'budgetLine' => $paymentRequest->budget_line,
                'followedBy' => $paymentRequest->followedBy ? [
                    'id' => $paymentRequest->followedBy->id,
                    'name' => $paymentRequest->followedBy->name,
                ] : null,
                'quality' => $paymentRequest->quality,
                'recapForms' => $paymentRequest->recapForms->map(function($form) {
                    return [
                        'id' => $form->id,
                        'activite' => $form->activite,
                        'montantPresenteTotal' => $form->montant_presente_total,
                        'montantPresenteEligible' => $form->montant_presente_eligible,
                        'montantSollicite' => $form->montant_sollicite,
                        'attachments' => $form->attachments->map(function($att) {
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
                'message' => 'Demande de paiement mise à jour avec succès',
                'data' => $paymentRequestTransformed,
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error("PaymentRequestController@update - Erreur lors de la mise à jour de la demande de paiement: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la demande de paiement',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
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

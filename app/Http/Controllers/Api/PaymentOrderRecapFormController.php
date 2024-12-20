<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentOrderRecapForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentOrderRecapFormController extends Controller
{
    /**
     * Liste des formulaires récapitulatifs pour un ordre de paiement spécifique.
     */
    public function index(Request $request)
    {
        $paymentOrderId = $request->query('payment_order_id');

        if (!$paymentOrderId) {
            return response()->json(['message' => 'payment_order_id est requis'], 400);
        }

        $recapForms = PaymentOrderRecapForm::with('attachments')
            ->where('payment_order_id', $paymentOrderId)
            ->get()
            ->map(function($form) {
                return [
                    'id' => $form->id,
                    'beneficiaire' => $form->beneficiaire,
                    'montant' => $form->montant,
                    'objetDepense' => $form->objet_depense,
                    'ligneBudgetaire' => $form->ligne_budgetaire,
                    'piecesJointes' => $form->attachments->map(function($attachment) {
                        return [
                            'id' => $attachment->id,
                            'filePath' => $attachment->file_path,
                            'fileName' => $attachment->file_name,
                             'url' => $attachment->url, // Assurez-vous que 'url' est défini via l'accessor
                        ];
                    }),
                ];
            });

        Log::info("PaymentOrderRecapFormController@index - Nombre de recapForms récupérés pour payment_order_id $paymentOrderId: " . $recapForms->count());

        return response()->json($recapForms);
    }

    /**
     * Créer un nouveau formulaire récapitulatif pour un ordre de paiement.
     */
  public function store(Request $request)
    {
        $validated = $request->validate([
            'payment_order_id' => 'required|exists:payment_orders,id',
            'beneficiaire' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'objet_depense' => 'required|string|max:255',
            'ligne_budgetaire' => 'required|string|max:255',
            'pieces_jointes.*' => 'file|max:2048',
        ]);
    try {
        $recapForm = PaymentOrderRecapForm::create([
            'payment_order_id' => $validated['payment_order_id'],
            'beneficiaire' => $validated['beneficiaire'],
            'montant' => $validated['montant'],
            'objet_depense' => $validated['objet_depense'],
            'ligne_budgetaire' => $validated['ligne_budgetaire'],
        ]);

         if ($request->hasFile('pieces_jointes')) {
            foreach ($request->file('pieces_jointes') as $file) {
               $filePath = $file->store('attachments', 'public');
                 $recapForm->attachments()->create([
                     'file_path' => $filePath,
                     'file_name' => $file->getClientOriginalName(),
                 ]);
             }
         }
            Log::info("PaymentOrderRecapForm créé : ID " . $recapForm->id);


            $recapForm->load('attachments');

            $recapFormTransformed = [
                'id' => $recapForm->id,
                'paymentOrderId' => $recapForm->payment_order_id,
                'beneficiaire' => $recapForm->beneficiaire,
                'montant' => $recapForm->montant,
                'objetDepense' => $recapForm->objet_depense,
                'ligneBudgetaire' => $recapForm->ligne_budgetaire,
                'piecesJointes' => $recapForm->attachments->map(function($attachment) {
                    return [
                        'id' => $attachment->id,
                        'filePath' => $attachment->file_path,
                        'fileName' => $attachment->file_name,
                          'url' => $attachment->url,
                    ];
                }),
            ];

            return response()->json([
                'message' => 'Formulaire récapitulatif créé avec succès',
                'data' => $recapFormTransformed,
            ], 201);
    } catch (\Exception $e) {
        Log::error("Erreur lors de la création du formulaire récapitulatif : " . $e->getMessage());

        return response()->json(['message' => 'Erreur lors de la création du formulaire récapitulatif'], 500);
    }
}



    /**
     * Afficher un formulaire récapitulatif spécifique.
     */
    public function show($id)
    {
        $recapForm = PaymentOrderRecapForm::with('attachments')->findOrFail($id);

        // Transformer les données pour utiliser camelCase
        $recapFormTransformed = [
            'id' => $recapForm->id,
            'paymentOrderId' => $recapForm->payment_order_id,
            'beneficiaire' => $recapForm->beneficiaire,
            'montant' => $recapForm->montant,
            'objetDepense' => $recapForm->objet_depense,
            'ligneBudgetaire' => $recapForm->ligne_budgetaire,
            'piecesJointes' => $recapForm->attachments->map(function($attachment) {
                return [
                    'id' => $attachment->id,
                    'filePath' => $attachment->file_path,
                    'fileName' => $attachment->file_name,
                      'url' => $attachment->url,
                ];
            }),
        ];

        return response()->json($recapFormTransformed);
    }

    /**
     * Mettre à jour un formulaire récapitulatif existant.
     */
    public function update(Request $request, $id)
    {
        $recapForm = PaymentOrderRecapForm::findOrFail($id);

       

        try {
            $recapForm->update($request->all());

             if ($request->hasFile('pieces_jointes')) {
                // Optionnel : Supprimer les anciennes pièces jointes si nécessaire
                 //$recapForm->attachments()->delete();

                foreach ($request->file('pieces_jointes') as $file) {
                    $filePath = $file->store('attachments', 'public');
                    $recapForm->attachments()->create([
                        'file_path' => $filePath,
                        'file_name' => $file->getClientOriginalName(),
                    ]);
                }
            }

            Log::info("PaymentOrderRecapForm mis à jour : ID " . $recapForm->id);

            // Charger les relations mises à jour
            $recapForm->load('attachments');

            // Transformer les données pour utiliser camelCase
            $recapFormTransformed = [
                'id' => $recapForm->id,
                'paymentOrderId' => $recapForm->payment_order_id,
                'beneficiaire' => $recapForm->beneficiaire,
                'montant' => $recapForm->montant,
                'objetDepense' => $recapForm->objet_depense,
                'ligneBudgetaire' => $recapForm->ligne_budgetaire,
                'piecesJointes' => $recapForm->attachments->map(function($attachment) {
                    return [
                        'id' => $attachment->id,
                        'filePath' => $attachment->file_path,
                        'fileName' => $attachment->file_name,
                         'url' => $attachment->url,
                    ];
                }),
            ];


            return response()->json([
                'message' => 'Formulaire récapitulatif mis à jour avec succès',
                'data' => $recapFormTransformed,
            ]);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la mise à jour du formulaire récapitulatif : " . $e->getMessage());

            return response()->json(['message' => 'Erreur lors de la mise à jour du formulaire récapitulatif'], 500);
        }
    }

    /**
     * Supprimer un formulaire récapitulatif.
     */
    public function destroy($id)
    {
        $recapForm = PaymentOrderRecapForm::findOrFail($id);

        try {
            // Supprimer les pièces jointes associées
            $recapForm->attachments()->delete();

            $recapForm->delete();

            Log::info("PaymentOrderRecapForm supprimé : ID $id");

            return response()->json(['message' => 'Formulaire récapitulatif supprimé avec succès']);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la suppression du formulaire récapitulatif : ", [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['message' => 'Erreur lors de la suppression du formulaire récapitulatif', 'error' => $e->getMessage()], 500);
        }
    }
}
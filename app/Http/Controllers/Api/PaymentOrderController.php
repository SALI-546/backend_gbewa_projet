<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str; // Import de la classe Str pour générer des chaînes aléatoires

class PaymentOrderController extends Controller
{
    /**
     * Liste des ordres de paiement avec filtres optionnels.
     */
    public function index(Request $request)
    {
        // Requête de base avec relations
        $query = PaymentOrder::with('project', 'recapForms.attachments', 'signatures');
    
        // Filtrage par projet
        if ($request->has('project_id') && $request->project_id) {
            $query->where('project_id', $request->project_id);
        }
    
        // Filtrage par date de début
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
    
        // Filtrage par date de fin
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
    
        // Récupérer les résultats
        $paymentOrders = $query->get();
    
        Log::info("PaymentOrderController@index - Nombre d'ordres de paiement récupérés: " . $paymentOrders->count());
    
        // Transformer les données pour utiliser camelCase
        $paymentOrders = $paymentOrders->map(function($order) {
            return [
                'id' => $order->id,
                'project' => $order->project,
                'orderNumber' => $order->order_number,
                'account' => $order->account,
                'title' => $order->title,
                'invoiceNumber' => $order->invoice_number,
                'billOfLadingNumber' => $order->bill_of_lading_number,
                'recapForms' => $order->recapForms->map(function($form) {
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
                }),
                'signatures' => $order->signatures->map(function($signature) {
                    return [
                        'id' => $signature->id,
                        'role' => $signature->role,
                        'name' => $signature->name,
                        'signatureUrl' => $signature->url,
                        'signedAt' => $signature->signed_at,
                    ];
                }),
                'createdAt' => $order->created_at,
                // Ajoutez d'autres champs si nécessaire
            ];
        });
    
        return response()->json($paymentOrders);
    }
    

    /**
     * Créer un nouvel ordre de paiement.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'account' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'invoice_number' => 'required|string|max:255|unique:payment_orders,invoice_number',
            'bill_of_lading_number' => 'nullable|string|max:255',
        ]);

        try {
            // Générer un order_number unique, par exemple en utilisant un préfixe et une chaîne aléatoire
            $orderNumber = 'PO-' . strtoupper(Str::random(10));

            $paymentOrder = PaymentOrder::create([
                'project_id' => $validated['project_id'],
                'order_number' => $orderNumber, // Ajout du order_number généré
                'account' => $validated['account'],
                'title' => $validated['title'],
                'invoice_number' => $validated['invoice_number'],
                'bill_of_lading_number' => $validated['bill_of_lading_number'],
            ]);

            Log::info("PaymentOrder créé : ID " . $paymentOrder->id . ", Order Number: " . $paymentOrder->order_number);

            // Transformer les données pour utiliser camelCase
            $paymentOrderTransformed = [
                'id' => $paymentOrder->id,
                'project' => $paymentOrder->project,
                'orderNumber' => $paymentOrder->order_number,
                'account' => $paymentOrder->account,
                'title' => $paymentOrder->title,
                'invoiceNumber' => $paymentOrder->invoice_number,
                'billOfLadingNumber' => $paymentOrder->bill_of_lading_number,
                'recapForms' => [], // Vide pour le nouvel ordre, à remplir si nécessaire
                'createdAt' => $paymentOrder->created_at,
             
            ];

            return response()->json([
                'message' => 'Ordre de paiement créé avec succès',
                'data' => $paymentOrderTransformed,
            ], 201);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la création de l'ordre de paiement : " . $e->getMessage());

            return response()->json(['message' => 'Erreur lors de la création de l\'ordre de paiement'], 500);
        }
    }

    /**
     * Afficher un ordre de paiement spécifique.
     */
    public function show($id)
{
    $paymentOrder = PaymentOrder::with('project', 'recapForms.attachments', 'signatures')->findOrFail($id);

    // Transformer les données pour utiliser camelCase
    $paymentOrderTransformed = [
        'id' => $paymentOrder->id,
        'project' => $paymentOrder->project,
        'orderNumber' => $paymentOrder->order_number,
        'account' => $paymentOrder->account,
        'title' => $paymentOrder->title,
        'invoiceNumber' => $paymentOrder->invoice_number,
        'billOfLadingNumber' => $paymentOrder->bill_of_lading_number,
        'recapForms' => $paymentOrder->recapForms->map(function($form) {
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
                        'url' => $attachment->url, 
                    ];
                }),
            ];
        }),
        'signatures' => $paymentOrder->signatures->map(function($signature) {
            return [
                'id' => $signature->id,
                'role' => $signature->role,
                'name' => $signature->name,
                'signatureUrl' => $signature->url,
                'signedAt' => $signature->signed_at,
            ];
        }),
        'createdAt' => $paymentOrder->created_at,
        // Ajoutez d'autres champs si nécessaire
    ];

    return response()->json($paymentOrderTransformed);
}

    /**
     * Mettre à jour un ordre de paiement existant.
     */
    public function update(Request $request, $id)
    {
        $paymentOrder = PaymentOrder::findOrFail($id);

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'account' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'invoice_number' => 'required|string|max:255|unique:payment_orders,invoice_number,' . $id,
            'bill_of_lading_number' => 'nullable|string|max:255',
        ]);

        try {
            $paymentOrder->update([
                'project_id' => $validated['project_id'],
                'account' => $validated['account'],
                'title' => $validated['title'],
                'invoice_number' => $validated['invoice_number'],
                'bill_of_lading_number' => $validated['bill_of_lading_number'],
            ]);
            Log::info("PaymentOrder mis à jour : ID " . $paymentOrder->id);

            // Charger les relations mises à jour
            $paymentOrder->load('project', 'recapForms.attachments');

            // Transformer les données pour utiliser camelCase
            $paymentOrderTransformed = [
                'id' => $paymentOrder->id,
                'project' => $paymentOrder->project,
                'orderNumber' => $paymentOrder->order_number,
                'account' => $paymentOrder->account,
                'title' => $paymentOrder->title,
                'invoiceNumber' => $paymentOrder->invoice_number,
                'billOfLadingNumber' => $paymentOrder->bill_of_lading_number,
                'recapForms' => $paymentOrder->recapForms->map(function($form) {
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
                }),
                'createdAt' => $paymentOrder->created_at,
                
            ];

            return response()->json([
                'message' => 'Ordre de paiement mis à jour avec succès',
                'data' => $paymentOrderTransformed,
            ]);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la mise à jour de l'ordre de paiement : " . $e->getMessage());

            return response()->json(['message' => 'Erreur lors de la mise à jour de l\'ordre de paiement'], 500);
        }
    }

    /**
   
     */
    public function destroy($id)
    {
        $paymentOrder = PaymentOrder::find($id);

        if (!$paymentOrder) {
            return response()->json(['message' => 'Ordre de paiement introuvable'], 404);
        }

        try {
            // Supprimer les recapForms et leurs attachments
            foreach ($paymentOrder->recapForms as $form) {
                $form->attachments()->delete();
                $form->delete();
            }

            $paymentOrder->delete();
            Log::info("PaymentOrder supprimé : ID $id");

            return response()->json(['message' => 'Ordre de paiement supprimé avec succès']);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la suppression de l'ordre de paiement : ", [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['message' => 'Erreur lors de la suppression de l\'ordre de paiement', 'error' => $e->getMessage()], 500);
        }
    }
}

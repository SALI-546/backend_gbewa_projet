<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RecapForm;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class RecapFormController extends Controller
{
    /**
     * Crée un nouveau formulaire récapitulatif.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    // RecapFormController.php

public function store(Request $request)
{
    Log::info("RecapFormController@store - Début de la création d'un formulaire récapitulatif.");

    // Validation des données
    $validatedData = $request->validate([
        'payment_request_id' => 'required|exists:payment_requests,id',
        'activite' => 'required|string',
        'montant_presente_total' => 'required|numeric',
        'montant_presente_eligible' => 'required|numeric',
        'montant_sollicite' => 'required|numeric',
        'attachment_base64' => 'nullable|string',
        'attachment_file_name' => 'nullable|string',
        'attachment_file_type' => 'nullable|string',
    ]);

    try {
        DB::beginTransaction();

        // Créer le formulaire récapitulatif
        $recapForm = RecapForm::create([
            'payment_request_id' => $validatedData['payment_request_id'],
            'activite' => $validatedData['activite'],
            'montant_presente_total' => $validatedData['montant_presente_total'],
            'montant_presente_eligible' => $validatedData['montant_presente_eligible'],
            'montant_sollicite' => $validatedData['montant_sollicite'],
        ]);

        Log::info("RecapFormController@store - Formulaire récapitulatif créé: ID {$recapForm->id}");

        // Gérer la pièce jointe si présente
        if (!empty($validatedData['attachment_base64']) && !empty($validatedData['attachment_file_name']) && !empty($validatedData['attachment_file_type'])) {
            $fileData = base64_decode($validatedData['attachment_base64']);
            $fileName = time() . '_' . $validatedData['attachment_file_name'];
            $filePath = 'attachments/' . $fileName;

            // Stocker le fichier
            Storage::disk('public')->put($filePath, $fileData);

            // Créer une entrée dans la table des attachments
            $attachment = $recapForm->attachments()->create([
                'file_path' => $filePath,
                'file_name' => $validatedData['attachment_file_name'],
            ]);

            Log::info("RecapFormController@store - Pièce jointe créée: ID {$attachment->id}");
        }

        DB::commit();

        return response()->json([
            'message' => 'Formulaire récapitulatif créé avec succès',
            'data' => $recapForm->load('attachments'),
        ], 201);

    } catch (\Exception $e) {
        DB::rollback();
        Log::error("RecapFormController@store - Erreur lors de la création du formulaire récapitulatif: " . $e->getMessage());
        return response()->json([
            'message' => 'Erreur lors de la création du formulaire récapitulatif',
            'error' => $e->getMessage(),
        ], 500);
    }
}

public function update(Request $request, $id)
{
    Log::info("RecapFormController@update - Début de la mise à jour pour l'ID: $id");

    // Trouver le formulaire récapitulatif
    $recapForm = RecapForm::with('attachments')->findOrFail($id);

    // Validation des données
    $validatedData = $request->validate([
        'activite' => 'required|string',
        'montant_presente_total' => 'required|numeric',
        'montant_presente_eligible' => 'required|numeric',
        'montant_sollicite' => 'required|numeric',
        'deleted_attachments' => 'nullable|array',
        'deleted_attachments.*' => 'nullable|integer|exists:attachments,id',
        'attachment_base64' => 'nullable|string',
        'attachment_file_name' => 'nullable|string',
        'attachment_file_type' => 'nullable|string',
    ]);

    try {
        DB::beginTransaction();

        // Mettre à jour le formulaire récapitulatif
        $recapForm->update([
            'activite' => $validatedData['activite'],
            'montant_presente_total' => $validatedData['montant_presente_total'],
            'montant_presente_eligible' => $validatedData['montant_presente_eligible'],
            'montant_sollicite' => $validatedData['montant_sollicite'],
        ]);

        Log::info("RecapFormController@update - Formulaire récapitulatif mis à jour: ID {$recapForm->id}");

        // Supprimer les pièces jointes si spécifié
        if (isset($validatedData['deleted_attachments']) && is_array($validatedData['deleted_attachments'])) {
            foreach ($validatedData['deleted_attachments'] as $attachmentId) {
                $attachment = Attachment::findOrFail($attachmentId);
                Storage::disk('public')->delete($attachment->file_path);
                $attachment->delete();
                Log::info("RecapFormController@update - Pièce jointe supprimée: ID {$attachment->id}");
            }
        }

        // Gérer la nouvelle pièce jointe si présente
        if (!empty($validatedData['attachment_base64']) && !empty($validatedData['attachment_file_name']) && !empty($validatedData['attachment_file_type'])) {
            $fileData = base64_decode($validatedData['attachment_base64']);
            $fileName = time() . '_' . $validatedData['attachment_file_name'];
            $filePath = 'attachments/' . $fileName;

            // Stocker le fichier
            Storage::disk('public')->put($filePath, $fileData);

            // Créer une entrée dans la table des attachments
            $attachment = $recapForm->attachments()->create([
                'file_path' => $filePath,
                'file_name' => $validatedData['attachment_file_name'],
            ]);

            Log::info("RecapFormController@update - Pièce jointe créée: ID {$attachment->id}");
        }

        DB::commit();

        return response()->json([
            'message' => 'Formulaire récapitulatif mis à jour avec succès',
            'data' => $recapForm->load('attachments'),
        ], 200);

    } catch (\Exception $e) {
        DB::rollback();
        Log::error("RecapFormController@update - Erreur lors de la mise à jour du formulaire récapitulatif: " . $e->getMessage());
        return response()->json([
            'message' => 'Erreur lors de la mise à jour du formulaire récapitulatif',
            'error' => $e->getMessage(),
        ], 500);
    }
}


    /**
     * Supprime un formulaire récapitulatif.
     *
     * @param  int  $id  ID du formulaire récapitulatif à supprimer
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        Log::info("RecapFormController@destroy - Début de la suppression pour l'ID: $id");

        try {
            $recapForm = RecapForm::with('attachments')->findOrFail($id);

            // Supprimer les pièces jointes associées
            foreach ($recapForm->attachments as $attachment) {
                Storage::disk('public')->delete($attachment->file_path);
                $attachment->delete();
                Log::info("RecapFormController@destroy - Pièce jointe supprimée: ID {$attachment->id}");
            }

            // Supprimer le formulaire récapitulatif
            $recapForm->delete();
            Log::info("RecapFormController@destroy - Formulaire récapitulatif supprimé: ID {$recapForm->id}");

            return response()->json([
                'message' => 'Formulaire récapitulatif supprimé avec succès',
            ], 200);

        } catch (\Exception $e) {
            Log::error("RecapFormController@destroy - Erreur lors de la suppression du formulaire récapitulatif: " . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la suppression du formulaire récapitulatif',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RecapForm;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RecapFormController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Données reçues dans RecapFormController@store:', $request->all());

        // Validation des données
        $validatedData = $request->validate([
            'payment_request_id' => 'required|exists:payment_requests,id',
            'recap_forms' => 'required|array|min:1',
            'recap_forms.*.activite' => 'required|string',
            'recap_forms.*.montant_presente_total' => 'required|numeric',
            'recap_forms.*.montant_presente_eligible' => 'required|numeric',
            'recap_forms.*.montant_sollicite' => 'required|numeric',
            'recap_forms.*.attachments' => 'array',
            'recap_forms.*.attachments.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048',
        ]);

        Log::info('Données validées dans RecapFormController@store:', $validatedData);

        DB::beginTransaction();

        try {
            // Parcourir les formulaires récapitulatifs
            foreach ($validatedData['recap_forms'] as $index => $recapFormData) {
                Log::info("Traitement du formulaire récapitulatif index $index:", $recapFormData);

                $recapForm = RecapForm::create([
                    'payment_request_id' => $validatedData['payment_request_id'],
                    'activite' => $recapFormData['activite'],
                    'montant_presente_total' => $recapFormData['montant_presente_total'],
                    'montant_presente_eligible' => $recapFormData['montant_presente_eligible'],
                    'montant_sollicite' => $recapFormData['montant_sollicite'],
                ]);

                Log::info("RecapForm créé avec ID " . $recapForm->id);

                // Gérer les pièces jointes
                if (isset($recapFormData['attachments'])) {
                    foreach ($recapFormData['attachments'] as $fileIndex => $file) {
                        Log::info("Traitement de l'attachement $fileIndex pour RecapForm ID " . $recapForm->id);

                        // Stocker le fichier
                        $filePath = $file->store('attachments');

                        Log::info("Fichier stocké à: $filePath");

                        // Créer l'enregistrement d'attachement
                        Attachment::create([
                            'recap_form_id' => $recapForm->id,
                            'file_path' => $filePath,
                            'file_name' => $file->getClientOriginalName(),
                        ]);

                        Log::info("Attachment enregistré pour RecapForm ID " . $recapForm->id);
                    }
                }
            }

            DB::commit();

            return response()->json(['message' => 'Formulaires récapitulatifs enregistrés avec succès'], 201);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Erreur lors de l\'enregistrement des formulaires récapitulatifs:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Erreur lors de l\'enregistrement des formulaires', 'error' => $e->getMessage()], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Signature;
use App\Models\PaymentOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class SignatureController extends Controller
{
    /**
     * Enregistrer une nouvelle signature.
     */
    public function store(Request $request, $paymentOrderId)
    {
        $paymentOrder = PaymentOrder::findOrFail($paymentOrderId);

        $validated = $request->validate([
            'role' => 'required|string|in:emetteur,controle,validation,visa_comptable,visa_chef_comptable,visa_daf,visa_de',
            'name' => 'required|string|max:255',
            'signature' => 'required|string', // Signature en base64
        ]);

        $role = $validated['role'];
        $name = $validated['name'];
        $signatureData = $validated['signature'];

        // Extraire le type de l'image
        if (preg_match('/^data:image\/(\w+);base64,/', $signatureData, $type)) {
            $type = strtolower($type[1]); // jpg, png, etc.
            $data = substr($signatureData, strpos($signatureData, ',') + 1);
            if (!in_array($type, ['jpg', 'jpeg', 'png'])) {
                return response()->json(['message' => 'Type de fichier non supporté.'], 422);
            }

            $data = base64_decode($data);
            if ($data === false) {
                return response()->json(['message' => 'Erreur de décodage de l\'image.'], 422);
            }
        } else {
            return response()->json(['message' => 'Données de signature invalides.'], 422);
        }

        // Générer un nom de fichier unique
        $fileName = 'signatures/' . Str::random(20) . '.' . $type;

        // Stocker l'image
        Storage::disk('public')->put($fileName, $data);

        // Créer l'enregistrement de la signature
        $signature = Signature::create([
            'payment_order_id' => $paymentOrder->id,
            'role' => $role,
            'name' => $name,
            'signature_path' => $fileName,
            'signed_at' => now(),
        ]);

        Log::info("Signature créée : ID " . $signature->id . ", Role: " . $signature->role . ", PaymentOrder ID: " . $paymentOrder->id);

        return response()->json([
            'message' => 'Signature enregistrée avec succès.',
            'data' => [
                'id' => $signature->id,
                'role' => $signature->role,
                'name' => $signature->name,
                'signature_url' => $signature->url,
                'signed_at' => $signature->signed_at,
            ],
        ], 201);
    }
}

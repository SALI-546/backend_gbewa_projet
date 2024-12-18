<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Signature extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_order_id',
        'role',
        'name',
        'signature_path',
        'signed_at',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
    ];

    // Relations
    public function paymentOrder()
    {
        return $this->belongsTo(PaymentOrder::class);
    }

    // Accessor pour l'URL de la signature
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->signature_path);
    }
}

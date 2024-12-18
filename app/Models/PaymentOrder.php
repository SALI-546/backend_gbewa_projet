<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentOrder extends Model
{
    use HasFactory;

    protected $table = 'payment_orders';

    protected $fillable = [
        'project_id',
        'order_number',
        'account',
        'title',
        'invoice_number',
        'bill_of_lading_number',
        'emetteur_signed',
        'emetteur_signed_at',
        'controle_signed',
        'controle_signed_at',
        'validation_signed',
        'validation_signed_at',
    ];

    protected $casts = [
        'emetteur_signed' => 'boolean',
        'emetteur_signed_at' => 'date',
        'controle_signed' => 'boolean',
        'controle_signed_at' => 'date',
        'validation_signed' => 'boolean',
        'validation_signed_at' => 'date',
    ];

    // Relations
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function recapForms()
    {
        return $this->hasMany(PaymentOrderRecapForm::class);
    }

    public function signatures()
    {
        return $this->hasMany(Signature::class);
    }
}

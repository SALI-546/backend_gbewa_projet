<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentOrderRecapForm extends Model
{
    use HasFactory;

    protected $table = 'payment_order_recap_forms';

    protected $fillable = [
        'payment_order_id',
        'beneficiaire',
        'montant',
        'objet_depense',
        'ligne_budgetaire',
    ];

    // Relations
    public function paymentOrder()
    {
        return $this->belongsTo(PaymentOrder::class);
    }

    public function attachments()
    {
        return $this->hasMany(PaymentOrderAttachment::class);
    }
}

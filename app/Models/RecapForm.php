<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecapForm extends Model
{
    use HasFactory;

    protected $table = 'recap_forms';

    protected $fillable = [
        'payment_request_id',
        'activite',
        'montant_presente_total',
        'montant_presente_eligible',
        'montant_sollicite',
    ];

    // Relations
    public function paymentRequest()
    {
        return $this->belongsTo(PaymentRequest::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }
}

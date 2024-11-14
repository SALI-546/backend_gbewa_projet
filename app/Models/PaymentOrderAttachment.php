<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentOrderAttachment extends Model
{
    use HasFactory;

    protected $table = 'payment_order_attachments';

    protected $fillable = [
        'payment_order_recap_form_id',
        'file_path',
        'file_name',
    ];

    // Relations
    public function paymentOrderRecapForm()
    {
        return $this->belongsTo(PaymentOrderRecapForm::class);
    }
}

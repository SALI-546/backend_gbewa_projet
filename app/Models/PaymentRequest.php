<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentRequest extends Model
{
    use HasFactory;

    protected $table = 'payment_requests';

    protected $fillable = [
        'project_id',
        'order_number',
        'date',
        'operation',
        'beneficiary',
        'invoice_details',
        'budget_line',
        'followed_by_id',
        'quality', // Mis à jour de 'quality_id' à 'quality'
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    // Relations
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function followedBy()
    {
        return $this->belongsTo(User::class, 'followed_by_id');
    }

    // Supprimé la relation 'quality' car 'quality' est un champ simple
    // public function quality()
    // {
    //     return $this->belongsTo(User::class, 'quality_id');
    // }

    public function recapForms()
    {
        return $this->hasMany(RecapForm::class);
    }
}
 
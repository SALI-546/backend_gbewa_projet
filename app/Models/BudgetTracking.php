<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetTracking extends Model
{
    use HasFactory;

    protected $fillable = [
        'engagement_id',
        'budget_line',
        'amount_allocated',
        'amount_spent',
        'amount_approved',
        'old_balance',
        'new_balance',
        'fournisseurs_prestataire',
        'avis',
        'moyens_de_paiement',
        'signature',
    ];

    // Relation avec Engagement
    public function engagement()
    {
        return $this->belongsTo(Engagement::class);
    }
}

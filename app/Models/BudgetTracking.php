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
        'moyens_de_paiement',
        
    ];

    protected $casts = [
        'amount_allocated' => 'float',
        'amount_spent' => 'float',
        'amount_approved' => 'float',
        'old_balance' => 'float',
        'new_balance' => 'float',
        'moyens_de_paiement' => 'string',
    ];

    // Relation avec Engagement
    public function engagement()
    {
        return $this->belongsTo(Engagement::class);
    }

    public function approvals()
    {
        return $this->hasMany(BudgetTrackingApproval::class);
    }
}

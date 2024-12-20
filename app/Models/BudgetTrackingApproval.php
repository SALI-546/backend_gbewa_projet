<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetTrackingApproval extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_tracking_id',
        'avis',
        'signature_type',
        'signature_image',
        'observation',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function budgetTracking()
    {
        return $this->belongsTo(BudgetTracking::class);
    }
}

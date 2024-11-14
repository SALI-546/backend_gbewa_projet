<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountingImputation extends Model
{
    use HasFactory;

    protected $fillable = [
        'engagement_id',
        'order_number',
        'description',
    ];

    // Relation avec Engagement
    public function engagement()
    {
        return $this->belongsTo(Engagement::class);
    }

    // Relation avec les entrées
    public function entries()
    {
        return $this->hasMany(AccountingImputationEntry::class);
    }
}

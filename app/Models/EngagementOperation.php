<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EngagementOperation extends Model
{
    use HasFactory;

    protected $table = 'engagement_operations';

    protected $fillable = [
        'engagement_id',
        'designation',
        'quantite',
        'nombre',
        'pu',
        'montant',
        'observations',
        'engagement_id',
    ];

    // Relations
    public function engagement()
    {
        return $this->belongsTo(Engagement::class);
    }
}

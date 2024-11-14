<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StrategicAxe extends Model
{
    use HasFactory;

    protected $table = 'strategic_axes';

    protected $fillable = [
        'name',
        'description',
        // Ajoutez d'autres champs selon votre table
    ];

    // Relations

    public function projects()
    {
        return $this->hasMany(Project::class, 'strategic_axe_id');
    }
}

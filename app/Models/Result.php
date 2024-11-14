<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;

    protected $table = 'results';

    protected $fillable = [
        'name',
        'description',
        // Ajoutez d'autres champs selon votre table
    ];

    // Relations

    public function projects()
    {
        return $this->hasMany(Project::class, 'result_id');
    }
}

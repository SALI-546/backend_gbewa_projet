<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';

    protected $fillable = [
        'title',
        'description',
        'image',
        'attachments',
        'members',
        'beneficiaries',
        'order',
        'status',
        'intervention_zone',
        'start_date',
        'end_date',
        'user_id',
        'project_id',
        'type',
        'strategic_axe_id',
        'department',
        'village',
        'district',
        'result_id',
        'lessons_learned',
    ];

    protected $casts = [
        'attachments' => 'array',
        'members' => 'array',
        'beneficiaries' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Relations

    /**
     * L'utilisateur qui a créé le projet
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Projet parent
     */
    public function parentProject()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    /**
     * Projets enfants
     */
    public function childProjects()
    {
        return $this->hasMany(Project::class, 'project_id');
    }

    /**
     * Axe stratégique
     */
    public function strategicAxe()
    {
        return $this->belongsTo(StrategicAxe::class, 'strategic_axe_id');
    }

    /**
     * Résultat
     */
    public function result()
    {
        return $this->belongsTo(Result::class, 'result_id');
    }

    /**
     * Engagements liés au projet
     */
    public function engagements()
    {
        return $this->hasMany(Engagement::class);
    }

    /**
     * PaymentRequests liés au projet
     */
    public function paymentRequests()
    {
        return $this->hasMany(PaymentRequest::class);
    }

    /**
     * PaymentOrders liés au projet
     */
    public function paymentOrders()
    {
        return $this->hasMany(PaymentOrder::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Engagement extends Model
{
    use HasFactory;

    protected $table = 'engagements';

    protected $fillable = [
        'project_id',
        'order_number',
        'service_demandeur',
        'wbs',
        'motif_demande',
        'date',
        'reference',
    ];
    protected $casts = [
        'date' => 'date',
    ];

    // Relations
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function engagementOperations()
    {
        return $this->hasMany(EngagementOperation::class);
    }

    public function budgetTrackings()
    {
        return $this->hasMany(BudgetTracking::class);
    }

    public function accountingImputations()
    {
        return $this->hasMany(AccountingImputation::class);
    }

    public function engagementAttachments()
    {
        return $this->hasMany(EngagementAttachment::class);
    }
}

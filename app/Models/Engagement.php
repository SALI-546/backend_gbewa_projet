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

        public function budgetTracking()
    {
        return $this->hasOne(BudgetTracking::class, 'engagement_id');
    }

    public function accountingImputation()
    {
        return $this->hasOne(AccountingImputation::class, 'engagement_id');
    }

    public function engagementAttachments()
    {
        return $this->hasMany(EngagementAttachment::class);
    }

        public function entries()
    {
        return $this->hasMany(AccountingImputationEntry::class, 'accounting_imputation_id');
    }

}

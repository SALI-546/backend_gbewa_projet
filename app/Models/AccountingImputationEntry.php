<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountingImputationEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'accounting_imputation_id',
        'account_type',
        'account_number',
        'amount_type',
        'amount_placeholder',
    ];

    // Relation avec AccountingImputation
    public function accountingImputation()
    {
        return $this->belongsTo(AccountingImputation::class);
    }
}

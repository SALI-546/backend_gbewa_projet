<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EngagementAttachment extends Model
{
    use HasFactory;

    protected $table = 'engagement_attachments';

    protected $fillable = [
        'engagement_id',
        'file_path',
        'file_name',
    ];

    // Relations
    public function engagement()
    {
        return $this->belongsTo(Engagement::class);
    }
}

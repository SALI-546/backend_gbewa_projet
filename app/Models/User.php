<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'password_reset_token',
        'attachments',
        'status',
        'image',
        'is_suspended',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'attachments' => 'array',
            'is_suspended' => 'boolean',
        ];
    }

    // Relations

    /**
     * Projets créés par l'utilisateur
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    /**
     * PaymentRequests suivis par l'utilisateur
     */
    public function followedPaymentRequests()
    {
        return $this->hasMany(PaymentRequest::class, 'followed_by_id');
    }

    /**
     * PaymentRequests liés à la qualité par l'utilisateur
     */
    public function qualityPaymentRequests()
    {
        return $this->hasMany(PaymentRequest::class, 'quality_id');
    }
}

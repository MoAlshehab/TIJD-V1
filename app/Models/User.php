<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;


class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, InteractsWithMedia, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'profile_image',
        'owner',
        'company_id',
    ];

    public function registerMediaConversions(?Media $media = null): void
{
    $this
        ->addMediaConversion('profile')
        ->width(200)
        ->height(200)
        ->format('webp')
        ->quality(80)
        ->nonQueued();
}
protected $appends = [
    'profile_image',
];

public function getProfileImageAttribute(): string
{
    return $this->getFirstMediaUrl('profile_photo')
        ?: asset('storage/default_profile.jpg');
}
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
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
        'owner' => 'boolean',
    ];

    // Relatie met afspraken
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'user_id');
    }

    // Relatie met bedrijven (als eigenaar van meerdere bedrijven)
    public function companies()
    {
        return $this->hasMany(Company::class, 'owner_id');
    }

    /**
     * Route notifications for the mail channel.
     */
    public function routeNotificationForMail(): array|string
    {
        return $this->email;
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}

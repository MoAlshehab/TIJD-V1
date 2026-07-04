<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Company extends Model implements HasMedia
{
    use HasFactory,SoftDeletes;
    use InteractsWithMedia;

    protected $casts = [
        //        'favorite' => 'boolean',
    ];

    protected $fillable = ['name', 'kind', 'email', 'phone', 'address', 'city', 'zip', 'images', 'autaccept'];

      public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('card')
            ->width(600)
            ->height(400)
            ->format('webp')
            ->quality(75)
            ->nonQueued();

        $this
            ->addMediaConversion('thumb')
            ->width(300)
            ->height(200)
            ->format('webp')
            ->quality(70)
            ->nonQueued();
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, foreignKey: 'owner_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'company_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function workdays(): HasMany
    {
        return $this->hasMany(Workday::class);
    }

    public function employees()
    {
        return $this->hasMany(User::class, 'company_id');
    }

    // In Company model
    public function services(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Service::class, 'company_id'); // Ensure the foreign key is correct
    }
}

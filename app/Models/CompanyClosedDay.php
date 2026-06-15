<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyClosedDay extends Model
{
    protected $fillable = [
        'company_id',
        'date',
        'reason',
    ];
}

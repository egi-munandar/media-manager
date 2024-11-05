<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaFile extends Model
{
    protected $fillable = [
        'title',
        'file_name',
        'extension',
        'mime',
        'size',
        'tags',
        'thumbnail',
        'share_location',
        'has_proxy',
    ];
}

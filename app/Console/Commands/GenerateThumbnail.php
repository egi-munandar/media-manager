<?php

namespace App\Console\Commands;

use App\Models\MediaFile;
use Illuminate\Console\Command;

class GenerateThumbnail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-thumbnail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $rcds = MediaFile::all();
        foreach ($rcds as $r) {
            if (!file_exists(public_path($r->thumbnail)) || $r->thumbnail == '') {
                $nf = $r->file_name . '.' . $r->extension;
                $thumb = false;
                if (VideoThumbnail::createThumbnail(
                    storage_path('app/media/' . $nf),
                    public_path('thumbs'),
                    $nf . '.jpg',
                    2,
                )) {
                    $thumb = true;
                }
                if ($thumb) {
                    $r->update([

                        'thumbnail' => '/thumbs/' . $nf . '.jpg',
                    ]);
                }
            }
        }
    }
}

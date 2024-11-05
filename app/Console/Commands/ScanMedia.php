<?php

namespace App\Console\Commands;

use App\Models\MediaFile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Pawlox\VideoThumbnail\Facade\VideoThumbnail;

class ScanMedia extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:scan-media';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan for new media and add it to database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $files = Storage::disk('media')->files();
        $rows = MediaFile::selectRaw('concat(file_name,\'.\', extension) as fl')->pluck('fl')->toArray();
        $extensions = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'rrc', 'gif', 'gifv', 'mng', 'mov', 'avi', 'qt', 'wmv', 'yuv', 'rm', 'asf', 'amv', 'mp4', 'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'm4v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b', 'mod'];
        //add new record
        if ($files) {
            $this->line(count($files) . ' File(s) to process');
            $new_files = array_diff($files, $rows);
            $thumb = false;
            foreach ($new_files as $key => $nf) {
                $this->line(($key + 1) . '/' . count($files) . ' | Processing ' . $nf);
                if (VideoThumbnail::createThumbnail(
                    storage_path('app/media/' . $nf),
                    public_path('thumbs'),
                    $nf . '.jpg',
                    2,
                )) {
                    $thumb = true;
                }
                $ex = explode('.', $nf);
                $extension = $ex[count($ex) - 1];
                if (in_array($extension, $extensions)) {
                    $ex1 = $ex;
                    unset($ex1[count($ex1) - 1]);
                    $filename = implode('.', $ex1);
                    MediaFile::create([
                        'title' => $filename,
                        'file_name' => $filename,
                        'extension' => $extension,
                        'mime' => Storage::disk('smb')->mimeType($nf),
                        'size' => Storage::disk('smb')->size($nf),
                        'thumbnail' => $thumb ? '/thumbs/' . $nf . '.jpg' : '',
                        'share_location' => "\\\\" . env('SMB_HOST') . "\\" . env('SMB_PATH') . "\\" . $nf,
                        'exists' => true,
                        'has_proxy' => Storage::disk('media')->exists('proxy/' . $filename . '.mov'),
                    ]);
                }
            }
        }
        $this->line('Finished adding new files');

        $this->line('Checking for orphaned record');
        //orphaned record
        if ($rows) {
            $orphaned_records = array_diff($rows, $files);
            foreach ($orphaned_records as $rcd) {
                $ex = explode('.', $rcd);
                $ex1 = $ex;
                unset($ex1[count($ex1) - 1]);
                $filename = implode('.', $ex1);
                MediaFile::where('file_name', $filename)->where('extension', $ex[count($ex) - 1])->update([
                    'exists' => false,
                ]);
            }
        }

        //check proxy
        $mfs = MediaFile::all();
        foreach ($mfs as $m) {
            $m->update([
                'has_proxy' => Storage::disk('media')->exists('proxy/' . $m->file_name . '.mov')
            ]);
        }
    }
}

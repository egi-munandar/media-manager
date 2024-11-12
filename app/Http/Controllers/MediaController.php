<?php

namespace App\Http\Controllers;

use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Pawlox\VideoThumbnail\Facade\VideoThumbnail;

class MediaController extends Controller
{
    public function index(Request $r)
    {
        $q = $r->q;
        if ($q != "") {
            $ms = MediaFile::where('file_name', 'LIKE', '%' . $q . '%')
                ->orWhere('tags', 'like', '%' . $q . '%')->paginate(9);
            $mds = $ms->appends(['q' => $q]);
        } else {
            $mds = MediaFile::orderBy('file_name')->paginate(9);
        }
        return Inertia::render('Media/MediaPage', [
            'mds' => $mds
        ]);
    }
    public function get_video(MediaFile $media)
    {
        $fileContents = Storage::disk('media')->get('proxy/' . $media->file_name . '.mov');
        $res = Response::make($fileContents, 200);
        $res->header('Content-Type', 'video/mp4');
        return $res;
    }
    public function create()
    {
        return Inertia::render('Media/CreateMedia');
    }
    public function update(Request $r, MediaFile $media)
    {
        $r->validate([
            'title' => 'required',
            'file_name' => 'required',
            'tags' => 'string',
        ]);
        if ($media->file_name != $r->file_name) {
            //file name change
            $fn = $r->file_name . '.' . $media->extension;
            if (Storage::disk('media')->exists($fn)) {
                $error = \Illuminate\Validation\ValidationException::withMessages([
                    'file_name' => ['File name exists! pelase choose other name'],
                ]);
                throw $error;
            } else {
                Storage::disk('media')->move($media->file_name . '.' . $media->extension, $r->file_name . '.' . $media->extension);
                $media->update([
                    'file_name' => $r->file_name,
                    'share_location' => "\\\\" . env('SMB_HOST') . "\\" . env('SMB_PATH') . "\\" . $fn,
                ]);
            }
        }
        $media->update([
            'title' => $r->title,
            'tags' => $r->tags,
        ]);
        return redirect()->back();
    }
    public function store(Request $r)
    {
        $r->validate([
            'title' => 'required',
            'file_name' => 'required',
            'tags' => 'string',
            'video_file' => 'required|mimes:mp4,mov,mkv,gif'
        ]);
        $fn = $r->file_name . '.' . $r->file('video_file')->getClientOriginalExtension();
        if (Storage::disk('media')->exists($fn)) {
            $error = \Illuminate\Validation\ValidationException::withMessages([
                'file_name' => ['File name exists! pelase choose other name'],
            ]);
            throw $error;
        } else {
            if (Storage::disk('media')->putFileAs('', $r->file('video_file'), $fn)) {
                $thumb = false;
                try {
                    if (VideoThumbnail::createThumbnail(
                        storage_path('app/media/' . $fn),
                        public_path('thumbs'),
                        $fn . '.jpg',
                        2,
                    )) {
                        $thumb = true;
                    }
                } catch (\Throwable $th) {
                    //throw $th;
                }
                MediaFile::create([
                    'title' => $r->title,
                    'file_name' => $r->file_name,
                    'tags' => $r->tags,
                    'extension' => $r->file('video_file')->getClientOriginalExtension(),
                    'mime' => $r->file('video_file')->getClientMimeType(),
                    'size' => $r->file('video_file')->getSize(),
                    'share_location' => "\\\\" . env('SMB_HOST') . "\\" . env('SMB_PATH') . "\\" . $fn,
                    'exists' => true,
                    'has_proxy' => Storage::disk('media')->exists('proxy/' . $r->file_name . '.mov'),
                    'thumbnail' => $thumb ? '/thumbs/' . $fn . '.jpg' : '',
                ]);
            }
        }
        return redirect(route('media.index'));
    }
    public function scan_proxy(MediaFile $media)
    {
        if (Storage::disk('media')->exists('proxy/' . $media->file_name . '.' . $media->extension . '.mov')) {
            $media->update(['has_proxy' => 1]);
        }
    }
    public function delete(MediaFile $media)
    {
        if ($media->has_proxy) {
            try {
                Storage::disk('media')->delete('proxy/' . $media->file_name . '.' . $media->extension . '.mov');
            } catch (\Throwable $th) {
                //throw $th;
            }
        }
        $med = $media;
        if ($media->delete()) {
            try {
                unlink(public_path($med->thumbnail));
                Storage::disk('media')->delete($med->file_name . '.' . $med->extension);
            } catch (\Throwable $th) {
                //throw $th;
            }
        }
        return redirect()->back();
    }
}

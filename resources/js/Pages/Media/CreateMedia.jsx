import FileInput from '@/Components/FileInput'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import React from 'react'

export default function CreateMedia() {
    const { data, setData, post, processing, progress } = useForm({
        title: '',
        file_name: '',
        video_file: null,
    })
    const submitAdd = e => {
        e.preventDefault()
        post(route('media.store'), {
            forceFormData: true,
        })
    }
    return (
        <AuthenticatedLayout header={<h3 className="text-xl font-semibold text-gray-800 leading-light">Create Media</h3>}>
            <Head title="Create Media" />
            <div className="p-4 w-full mx-auto lg:max-w-4xl m-4 bg-white rounded-lg">
                <form id="fAdd" onSubmit={submitAdd}>
                    <div className="mb-3">
                        <InputLabel value="Title" />
                        <TextInput className="w-full" onChange={e => setData('title', e.target.value)} placeholder="Title..." />
                    </div>
                    <div className="mb-3">
                        <InputLabel value="File Name" />
                        <TextInput className="w-full" onChange={e => setData('file_name', e.target.value)} placeholder="file_name_example..." />
                    </div>
                    <div className="mb-3">
                        <InputLabel value="Tags" />
                        <TextInput className="w-full" onChange={e => setData('tags', e.target.value)} placeholder="landscape,nature,tech..." />
                        <p className="text-xs text-gray-400 mt-2">
                            Pisahkan dengan (,) koma
                        </p>
                    </div>
                    <div className="mb-3">
                        <label class="text-base text-gray-500 font-semibold mb-2 block">Upload file</label>
                        <FileInput onChange={e => setData('video_file', e.target.files[0])} accept=".mp4,.mov,.mkv,.gif" />
                        <p class="text-xs text-gray-400 mt-2">MP4, MKV, MOV, and GIF are Allowed.</p>
                    </div>
                    <PrimaryButton disabled={!data.title || !data.file_name || !data.video_file} type="submit" form="fAdd">
                        Submit
                    </PrimaryButton>
                    <p className="text-sm text-green-700 pt-2">
                        {progress ? 'Uploading... ' + progress.percentage + '%' : ''}
                    </p>
                </form>
            </div>
        </AuthenticatedLayout>
    )
}

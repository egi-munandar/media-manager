import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router, useForm } from '@inertiajs/react'
import React from 'react'
import MediaCard from './MediaCard'
import TextInput from '@/Components/TextInput'
import { useState } from 'react'
import PrimaryButton from '@/Components/PrimaryButton'
import Modal from '@/Components/Modal'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import Swal from 'sweetalert2'

export default function MediaPage({ mds }) {
    const [queryString, setQueryString] = useState('')
    const [vidData, setVidData] = useState()
    const [mdVid, setMdVid] = useState(false)
    const [mdEdit, setMdEdit] = useState(false)
    const closeMdEdit = () => {
        setMdEdit(false)
        setTimeout(() => fEdit.reset(), 300)
    }
    const openMdEdit = media => {
        fEdit.setData(media)
        setTimeout(() => setMdEdit(true), 10)
    }
    const closeMdVid = () => {
        setMdVid(false)
        setTimeout(() => {
            setVidData()
        }, 300);
    }
    const openMdVid = media => {
        setVidData(media)
        setTimeout(() => setMdVid(true), 10)
    }
    const fEdit = useForm({})
    const fDelet = useForm()
    const submitUpd = e => {
        e.preventDefault()
        fEdit.put(route('media.update', fEdit.data.id), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success',
                    text: 'Data updated!',
                    toast: true,
                    timer: 1500,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    icon: 'success'
                })
                router.visit('media', {
                    only: ['mds'],
                    preserveState: true,
                })
                closeMdEdit()
            }
        })
    }
    const deleteMedia = media => {
        Swal.fire({
            title: 'Delete this media?',
            text: media.title,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            showLoaderOnConfirm: true,
            preConfirm: () => fDelet.delete(route('media.delete', media.id), {
                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        timer: 1500,
                        position: 'top-right',
                        icon: 'success',
                        title: 'Success!',
                        text: 'Media deleted!',
                        showConfirmButton: false,
                    })
                    router.visit('media', {
                        only: ['mds'],
                        preserveState: true,
                        preserveScroll: true
                    })
                }
            })
        })
    }
    const form = useForm()
    const scanProxy = (media) => {
        form.put(route('media.scan-proxy', media.id), {
            onSuccess: () => {
                router.visit(route('media.index'), {
                    only: ['mds'],
                    preserveState: true,
                    preserveScroll: true,
                })
            },
        })
    }
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">
            Media Files
        </h2>}>
            <Head title="Media Files" />
            <div className="p-4 w-full min-h-svh bg-gray-50">
                <div className="py-4 mx-auto w-full lg:max-w-7xl">
                    <Link className="justify-end" href={route('media.create')}>
                        <PrimaryButton>Upload Media</PrimaryButton>
                    </Link>
                </div>
                <div className="mx-auto py-4 w-full lg:max-w-7xl">
                    <TextInput onKeyUp={e => {
                        if (e.key === 'Enter') {
                            router.visit('/media', {
                                preserveState: true, data: {
                                    q: queryString
                                }
                            })
                        }
                    }}
                        onChange={e => setQueryString(e.target.value)}
                        placeholder="Search Media..." className="w-full lg:w-1/3" />
                </div>
                <div className="mx-auto  grid gap-4 grid-cols-1 lg:p-0 lg:grid-cols-3 lg:max-w-7xl">
                    {
                        mds.data.map((media, i) => <MediaCard deletClick={() => deleteMedia(media)} fProc={form.processing} scanProxy={() => scanProxy(media)} editClick={() => openMdEdit(media)} clickRes={() => media.has_proxy ? openMdVid(media) : Swal.fire('Error!', 'Media has no proxy, playback disabled!', 'error')} media={media} key={i} className="cursor-pointer" />)
                    }
                </div>
            </div>
            <div className="w-full py-3 flex">
                <div className="flex items-center gap-4 pt-4 mx-auto">
                    {
                        mds.links.map((link, i) => i === 0 ?
                            <Link href={mds.prev_page_url} key={i}>
                                <PrimaryButton disabled={!mds.prev_page_url}>Prev</PrimaryButton>
                            </Link> : i + 1 === mds.links.length ? <Link key={i} href={mds.next_page_url}>
                                <PrimaryButton disabled={!mds.next_page_url}>Next</PrimaryButton>
                            </Link>
                                : <Link className={`px-4 py-2 transition-colors duration-300 hover:bg-gray-700 hover:text-white rounded-md ${link.active ? 'bg-gray-800 text-white' : 'bg-transparent text-gray-900'}`} key={i} href={link.active ? null : link.url}>
                                    {link.label}
                                </Link>
                        )
                    }
                </div>
            </div>
            <Modal show={mdVid} onClose={closeMdVid}>
                {
                    vidData ?
                        <div className="p-4 w-full max-h-svh">
                            <video className="w-full max-h-svh" controls>
                                <source src={route('media.get-video', vidData.id)} type="video/mp4" ></source>
                                Your browser doesn't support video tag
                            </video>
                        </div> : ''
                }
            </Modal>
            {
                fEdit.data ? <Modal show={mdEdit} onClose={closeMdEdit}>
                    <div className="p-8 w-full">
                        <div className="pb-4 font-bold text-gray-700 text-3xl">
                            EDIT MEDIA
                        </div>
                        <form id="fedit" onSubmit={submitUpd}>
                            <div className="mb-3">
                                <InputLabel value="Title" />
                                <TextInput className="w-full" defaultValue={fEdit.data.title} onChange={e => fEdit.setData('title', e.target.value)} placeholder="Title..." />
                                <InputError message={fEdit.errors.title} className="mt-2" />
                            </div>
                            <div className="mb-3">
                                <InputLabel value="File Name" />
                                <TextInput className="w-full" defaultValue={fEdit.data.file_name} onChange={e => fEdit.setData('file_name', e.target.value)} placeholder="Title..." />
                                <InputError message={fEdit.errors.file_name} className="mt-2" />
                            </div>
                            <div className="mb-3">
                                <InputLabel value="Tags" />
                                <TextInput defaultValue={fEdit.data.tags} className="w-full" onChange={e => fEdit.setData('tags', e.target.value)} placeholder="landscape,nature,tech..." />
                                <p className="text-xs text-gray-400 mt-2">
                                    Pisahkan dengan (,) koma
                                </p>
                            </div>
                        </form>
                        <div className="flex gap-2">
                            <PrimaryButton disabled={!fEdit.data.title || !fEdit.data.file_name} type="submit" form="fedit">
                                Submit
                            </PrimaryButton>
                            <button onClick={closeMdEdit} className="transition-all bg-gray-500 text-white px-2 py-1 rounded-md uppercase text-xs font-semibold hover:bg-gray-200 hover:text-gray-700">
                                Close
                            </button>
                        </div>
                    </div>
                </Modal> : ''
            }
        </AuthenticatedLayout>
    )
}

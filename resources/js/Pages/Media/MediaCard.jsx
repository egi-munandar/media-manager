import React from 'react'
import Swal from 'sweetalert2'
import { PencilIcon, TagIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useForm } from '@inertiajs/react';

export default function MediaCard({ clickRes, deletClick, fProc, media, editClick, scanProxy, ...props }) {
    const byteValueNumberFormatter = Intl.NumberFormat("en", {
        notation: "compact",
        style: "unit",
        unit: "byte",
        unitDisplay: "narrow",
    });
    return (
        <div {...props} className="bg-white relative rounded-lg shadow-sm border-gray-50">
            <img onClick={clickRes} src={media.thumbnail} alt={media.file_name} className="w-full rounded-t-lg cursor-pointer" />
            <div className="p-4 text-pretty">
                <div className="break-all">
                    <p className="text-gray-700 text-3xl font-bold transition-colors duration-200 hover:text-blue-500 cursor-pointer">{media.title}</p>
                    <dl>
                        <dt className="font-semibold">File Name</dt>
                        <dd>{media.file_name}.{media.extension}</dd>
                    </dl>
                    <dl>
                        <dt className="font-semibold">Share Location</dt>
                        <dd className="text-blue-900 hover:text-blue-600 transition-colors duration-300 cursor-pointer text-sm" onClick={() => {
                            try {
                                navigator.clipboard.writeText(media.share_location)
                                Swal.fire({
                                    title: 'Share location copied!',
                                    text: media.share_location,
                                    timer: 1500,
                                    showConfirmButton: false,
                                    toast: true,
                                    position: 'top-right',
                                    icon: 'success',
                                    timerProgressBar: true,
                                })

                            } catch (error) {
                                Swal.fire({
                                    title: 'Copy Failed!',
                                    timer: 1500,
                                    showConfirmButton: false,
                                    toast: true,
                                    position: 'top-right',
                                    icon: 'error',
                                    timerProgressBar: true,
                                })
                            }
                        }}>{media.share_location}</dd>
                        <dl>
                            <dt className="font-semibold">Size</dt>
                            <dd>{byteValueNumberFormatter.format(media.size)}</dd>
                        </dl>
                        <dl>
                            <dt className="font-semibold">Proxy</dt>
                            <dd>{media.has_proxy ? 'Proxy Available' : fProc ? 'Loading...' : <span onClick={scanProxy} className="cursor-pointer transition-colors duration-300 text-gray-800 hover:text-blue-800">Click to rescan proxy...</span>}</dd>
                        </dl>
                    </dl>
                </div>
            </div>
            {
                media.tags ?
                    <div className="p-4 flex gap-2 flex-wrap">
                        {media.tags.split(",").map((v, i) => <div key={i} className="flex gap-2">
                            <div className="rounded-md flex items-center bg-slate-800 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                                <TagIcon className="w-4 h-4 mr-1.5" />{v}
                            </div>
                        </div>
                        )}
                    </div>
                    : ''
            }
            <div className="absolute flex gap-1 rounded-md top-2 right-2">
                <button onClick={editClick} className="bg-opacity-0 opacity-40 transition-colors duration-300 px-2 py-2 border border-gray-400 text-gray-400 rounded-md hover:border-amber-50 hover:text-amber-50 hover:bg-amber-500 hover:bg-opacity-75 hover:opacity-100">
                    <PencilIcon className="size-4" />
                </button>
                <button onClick={deletClick} className="bg-opacity-0 opacity-40 transition-colors duration-300 px-2 py-2 border border-gray-400 text-gray-400 rounded-md hover:border-red-50 hover:text-red-50 hover:bg-red-500 hover:bg-opacity-75 hover:opacity-100">
                    <TrashIcon className="size-4" />
                </button>
            </div>
        </div>
    )
}

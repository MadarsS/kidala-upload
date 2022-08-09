import axios from 'axios';
import React, { useState } from 'react';
import {DocumentIcon} from "@heroicons/react/solid"

function isFileImage(file: File) {
    return file && file['type'].split('/')[0] === 'image';
}

function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState('');

    const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) {
            return;
        }

        if (isFileImage(e.target.files[0])) {
            const preview = URL.createObjectURL(e.target.files[0]);

            setFilePreview(preview);
        }

        setFile(e.target.files[0]);
    };

    const uploadFile = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        if (!file) {
            return;
        }

        let formData = new FormData();
        formData.append('file', file);

        const headers = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        await axios
            .post('https://46.109.36.103:8000/upload', formData, headers)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                if(!err.response){
                    return console.log(err);
                }

                if(!err.response.data){
                    return console.log(err);
                }
                
                console.log(err.response.data);
            });
    };

    return (
        <form className="w-80">
            <div className="flex w-full items-center justify-center">
                <input
                    type="file"
                    onChange={(e) => selectFile(e)}
                    className="hidden"
                    name="selectFile"
                    id="selectFile"
                />

                <label
                    htmlFor="selectFile"
                    className="cursor-pointer w-28 h-10 flex items-center justify-center text-center bg-white text-gray-900"
                >
                    {file ? "Change" : "Select"} file
                </label>

                <button
                    type="submit"
                    onClick={(e) => uploadFile(e)}
                    className="bg-gray-900 text-white px-10 h-10 ml-2 flex-1"
                >
                    Upload
                </button>
            </div>

            {filePreview && file ? (
                <img
                    src={filePreview}
                    alt="file preview"
                    className="w-full mt-2"
                />
            ) : file ? (
                <div className="flex mt-2">
                    <DocumentIcon className='text-white mr-1 h-6' />

                    <p className='text-white'>File is ready for upload</p>
                </div>
            ) : null}
        </form>
    );
}

export default UploadForm;

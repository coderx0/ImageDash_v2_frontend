import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import Lottie from "lottie-react";
import loadingSpinner from "../public/loading.json";
import { BsFillCloudUploadFill } from 'react-icons/bs';

const ImageUploader = ({setImageAsset,profilePage}) => {
    const [loading, setLoading] = useState(false);
    const [wrongImageType, setWrongImageType] = useState(false);
  const [image, setImage] = useState(null);
  
    const uploadImage = async (e) => {
        const selectedFile = e.target.files[0];
        const formData = new FormData();
        formData.append(e.target.name,selectedFile);
    
        // uploading asset to sanity
        if (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff' || selectedFile.type === 'image/webp') {
          setWrongImageType(false);
          setLoading(true);
          const config = {
            headers: { 'content-type': 'multipart/form-data' }
          };
          const response = await axios.post('/api/utils/upload/uploadImage', formData, config);
         
          setImageAsset(response.data);
          setImage(response.data);
          setLoading(false);
        } else {
          setLoading(false);
          setWrongImageType(true);
        }
    };
    
  return (
          <div className={profilePage ? `bg-stone-900 flex h-64`:"bg-stone-900 p-2 flex w-full"}>
          <div className={`relative flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full ${profilePage?'m-2':'m-6 h-96'}`}>
            {loading && (
                <Lottie
                        className="h-[70vh]"
                        animationData={loadingSpinner}
                        loop />
            )}
            {
              wrongImageType && (
                <p className='absolute top-0 text-red-400 font-semibold text-lg'>wrong file type !</p>
              )
            }
            {(!image && !loading) && (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className={`animate-pulse flex flex-col mt-12 justify-center items-center`}>
                    <p className="font-bold text-2xl">
                  <BsFillCloudUploadFill className={profilePage?'h-8 w-8':'h-16 w-16'}/>
                    </p>
                    <p className={profilePage?'text-lg':'text-2xl'}>Click to upload</p>
                  </div>

                  <p className={`text-gray-300 text-md ${profilePage?'my-4 p-4 text-[12px]':'mt-16 p-4'}`}>
                    Use high-quality JPG, JPEG,WEBP, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="uploadedFile"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
                </label>
        )}
        {(image) && (
              <div className="relative h-full w-[90%]">
                <img
                  src={image?.url}
                  alt="uploaded-pic"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full btn btn-error text-2xl cursor-pointer"
              onClick={() => {
                setImage(null);
                setImageAsset(null)
              }}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
  )
}

export default ImageUploader
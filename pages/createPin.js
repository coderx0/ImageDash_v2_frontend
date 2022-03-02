import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
// import { categories } from '../lib/Data';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import { cdnClient } from '../lib/sanityClient';
import { availableCategories } from '../lib/Data';

const CreatePin = ({ user,categories }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

  const { data: session, loding } = useSession();

  const router = useRouter();

  const uploadImage = async (e) => {
    const selectedFile = e.target.files[0];
    const formData = new FormData();
    formData.append(e.target.name,selectedFile);

    // uploading asset to sanity
    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
      setWrongImageType(false);
      setLoading(true);
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      };
      const response = await axios.post('/api/utils/upload/uploadImage', formData, config);
     
      setImageAsset(response.data);
      setLoading(false);
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  const savePin = async() => {
    if (title && about && destination && imageAsset?._id && category) {
      const response = await axios.post('/api/utils/upload/saveImage', {
        title,
        about,
        destination,
        imageAsset,
        category,
        userId: session.user.id
      }
      );
      router.push('/');
    } else {
      setFields(true);

      setTimeout(
        () => {
          setFields(false);
        },
        2000,
      );
    }
  };
  return (
    <Layout>
      <div
      className="lg:h-[89vh] flex flex-col justify-center items-center">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">Please add all fields.</p>
      )}
      <div className=" flex lg:flex-row flex-col justify-center items-center bg-[black] rounded-3xl lg:p-5 p-3 lg:w-4/5  w-full">
        <div className="bg-stone-900 p-3 flex flex-0.7 w-full">
          <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 m-6 w-full h-96">
            {loading && (
              <h1 className='animate-spin text-8xl font-bold'>.</h1>
            )}
            {
              wrongImageType && (
                <p>wrong file type.</p>
              )
            }
            {(!imageAsset && !loading) && (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-pulse flex flex-col mt-12 justify-center items-center">
                    <p className="font-bold text-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                        <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                      </svg>
                    </p>
                    <p className="text-2xl">Click to upload</p>
                  </div>

                  <p className="mt-16 p-4 text-gray-300 text-md">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="uploadedFile"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
                </label>
            ) }{(imageAsset) && (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full btn btn-error text-2xl cursor-pointer"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 bg-[black] lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className="outline-none text-2xl text-dark-700 sm:text-3xl font-bold p-2 m-2 bg-[black] border-b-2"
          />
          {session?.user && (
            <div className="flex gap-2 mt-2 mb-2 text-lg  bg-[black] p-2 items-center rounded-lg ">
              <img
                src={session?.user?.image}
                className="w-10 h-10 rounded-full object-cover"
                alt="user-profile"
              />
              <p className="font-bold">{session?.user?.name}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell everyone what your Pin is about"
            className="outline-none text-xl text-dark-700 sm:text-2xl font-bold p-2 m-2 bg-[black] border-b-2"
          />
          <input
            type="url"
            vlaue={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-xl text-dark-700 sm:text-2xl font-bold p-2 m-2 bg-[black] border-b-2"
          />

          <div className="flex flex-col p-4">
            <div className='flex'>
              <p className="mb-2 mr-4 font-semibold text:lg sm:text-xl">Choose Pin Category</p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="outline-none p-2 bg-stone-700 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-stone-700">Select Category</option>
                {categories.map((category) => (
                  <option
                    className=" border-0 text-white outline-none capitalize bg-stone-900"
                    key={category._id}
                    value={`${category._id},${category.title}`}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default CreatePin;

export async function getStaticProps() {
  const categories = await cdnClient.fetch(availableCategories);

  return {
    props: {
      categories
    }
  }
}
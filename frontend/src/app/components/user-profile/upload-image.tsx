'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import useToast from '@/app/context/toasts/toast-context';
import { userAtom } from '@/app/store/atoms';
import { useAtom } from 'jotai';

type FormData = {
  image: FileList;
};

export default function ImageUploadForm() {
  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>();
  const { addToast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useAtom(userAtom);
  const [preview, setPreview] = useState<string | null>(null);

  const image = watch('image');

  const removeImage = () => {
    setPreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    setValue('image', null as unknown as FileList);
  };

  const onSubmit = async (data: FormData) => {
    const imageFile = data.image?.[0];
    if (!imageFile) {
      addToast({ type: 'error', content: 'No image selected' });
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const res = await fetch('http://localhost/api/upload/image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        addToast({ type: 'error', content: errorData.detail });
        return;
      }

      addToast({ type: 'success', content: 'Image uploaded successfully' });
      reset();
    } catch (error) {
      console.error('Image upload error:', error);
      addToast({ type: 'error', content: 'An error occurred while uploading the image' });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('image', event.target.files as FileList);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-8">
      <div className="col-span-full flex items-center gap-x-8">
        {preview ? (
          <Image
            src={preview}
            alt="Preview Image"
            className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            width={96}
            height={96}
          />
        ) : (
          <Image
            src={user?.profilePhotoUrl || 'https://i.imgur.com/tdi3NGa.png'}
            alt="Profile Image"
            className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            width={96}
            height={96}
          />
        )}
        <div>
          {preview ? (
            <button
              type="button"
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
              onClick={removeImage}
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
              onClick={() => imageInputRef.current?.click()}
            >
              Change Picture
            </button>
          )}
          <button
            type="submit"
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ml-2"
          >
            Upload Image
          </button>

          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            hidden
            {...register('image', {
              onChange: handleFileChange,
            })}
            ref={imageInputRef}
          />
          <p className="mt-2 text-xs leading-5 text-gray-400">JPG, JPEG, PNG. 10MB max.</p>
        </div>
      </div>
    </form>
  );
}

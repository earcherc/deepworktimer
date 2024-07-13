'use client';

import {
  ApiError,
  Body_upload_profile_photo_upload_upload_profile_photo_post,
  UploadsService,
  User,
  UsersService,
} from '@api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useToast from '@app/context/toasts/toast-context';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

type FormData = {
  image: FileList;
};

export default function ImageUploadForm() {
  const { register, handleSubmit, setValue, reset } = useForm<FormData>();
  const { addToast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: () => UsersService.readCurrentUserUsersMeGet(),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData: Body_upload_profile_photo_upload_upload_profile_photo_post = {
        file: file,
      };
      return UploadsService.uploadProfilePhotoUploadUploadProfilePhotoPost(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      addToast({ type: 'success', content: 'Image uploaded successfully' });
      reset();
      setPreview(null);
      setSelectedFile(null);
    },
    onError: (error: unknown) => {
      let errorMessage = 'An error occurred while uploading the image';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const onSubmit = async () => {
    if (!selectedFile) {
      addToast({ type: 'error', content: 'No image selected' });
      return;
    }
    uploadMutation.mutate(selectedFile);
  };

  const removeMutation = useMutation({
    mutationFn: () => {
      return UploadsService.removeProfilePhotoUploadRemoveProfilePhotoDelete();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      addToast({ type: 'success', content: 'Profile photo removed successfully' });
      setPreview(null);
      setSelectedFile(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'An error occurred while removing the profile photo';
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const removeProfilePhoto = () => {
    removeMutation.mutate();
  };

  const removeImage = () => {
    setPreview(null);
    setSelectedFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    setValue('image', null as unknown as FileList);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
        {user && user.profile_photo_urls ? (
          <Image
            src={user.profile_photo_urls.original || ''}
            alt="Profile Image"
            className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            width={96}
            height={96}
          />
        ) : preview ? (
          <Image
            src={preview}
            alt="Preview Image"
            className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            width={96}
            height={96}
          />
        ) : (
          <div className="h-24 w-24 flex-none rounded-lg bg-gray-800" />
        )}
        <div>
          {user && user.profile_photo_urls ? (
            <button
              type="button"
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
              onClick={removeProfilePhoto}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? 'Removing...' : 'Remove Photo'}
            </button>
          ) : (
            <button
              type="button"
              className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
              onClick={() => imageInputRef.current?.click()}
            >
              Select Image
            </button>
          )}
          {selectedFile && (
            <>
              <button
                type="button"
                className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 ml-2"
                onClick={removeImage}
              >
                Remove
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ml-2"
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
              </button>
            </>
          )}
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

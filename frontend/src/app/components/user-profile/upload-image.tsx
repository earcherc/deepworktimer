'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import useToast from '@app/context/toasts/toast-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadsService } from '@api';

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

  const { data: profilePhotoUrl } = useQuery({
    queryKey: ['profilePhotoUrl'],
    queryFn: () => UploadsService.getProfilePhotoUrlUploadGetProfilePhotoUrlGet(),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        const { presigned_url, file_url } = await UploadsService.getUploadUrlUploadGetPresignedUrlPost(file.name);
        console.log('Presigned URL:', presigned_url);
        console.log('File URL:', file_url);
        
        const uploadResponse = await fetch(presigned_url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
        }

        await UploadsService.confirmUploadUploadConfirmUploadPost(file_url);

        return file_url;
      } catch (error) {
        console.error('Detailed upload error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profilePhotoUrl'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      addToast({ type: 'success', content: 'Image uploaded successfully' });
      reset();
      setPreview(null);
      setSelectedFile(null);
    },
    onError: (error: any) => {
      console.error('Image upload error:', error);
      addToast({ type: 'error', content: 'An error occurred while uploading the image' });
    },
  });

  const removeImage = () => {
    setPreview(null);
    setSelectedFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    setValue('image', null as unknown as FileList);
  };

  const onSubmit = async () => {
    if (!selectedFile) {
      addToast({ type: 'error', content: 'No image selected' });
      return;
    }
    uploadMutation.mutate(selectedFile);
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
        {preview ? (
          <Image
            src={preview}
            alt="Preview Image"
            className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            width={96}
            height={96}
          />
        ) : profilePhotoUrl?.profile_photo_presigned_url ? (
          <Image
            src={profilePhotoUrl.profile_photo_presigned_url}
            alt="Profile Image"
            className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            width={96}
            height={96}
          />
        ) : (
          <div className="h-24 w-24 flex-none rounded-lg bg-gray-800" />
        )}
        <div>
          <button
            type="button"
            className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
            onClick={() => imageInputRef.current?.click()}
          >
            {preview ? 'Change Image' : 'Select Image'}
          </button>
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
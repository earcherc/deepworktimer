/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_profile_photo_upload_upload_profile_photo_post } from '../models/Body_upload_profile_photo_upload_upload_profile_photo_post';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadsService {
    /**
     * Upload Profile Photo
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadProfilePhotoUploadUploadProfilePhotoPost(
        formData: Body_upload_profile_photo_upload_upload_profile_photo_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/upload-profile-photo',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Profile Photo
     * @returns any Successful Response
     * @throws ApiError
     */
    public static removeProfilePhotoUploadRemoveProfilePhotoDelete(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/upload/remove-profile-photo',
        });
    }
    /**
     * Get Profile Photo View Url
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProfilePhotoViewUrlUploadGetProfilePhotoViewUrlGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/upload/get-profile-photo-view-url',
        });
    }
    /**
     * Get Profile Photo Upload Url
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProfilePhotoUploadUrlUploadGetProfilePhotoUploadUrlGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/upload/get-profile-photo-upload-url',
        });
    }
}

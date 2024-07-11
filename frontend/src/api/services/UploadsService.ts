/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadsService {
    /**
     * Get Upload Url
     * @param filename
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getUploadUrlUploadGetPresignedUrlPost(
        filename: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/get-presigned-url',
            query: {
                'filename': filename,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirm Upload
     * @param fileUrl
     * @returns any Successful Response
     * @throws ApiError
     */
    public static confirmUploadUploadConfirmUploadPost(
        fileUrl: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/confirm-upload',
            query: {
                'file_url': fileUrl,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Profile Photo Url
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProfilePhotoUrlUploadGetProfilePhotoUrlGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/upload/get-profile-photo-url',
        });
    }
}

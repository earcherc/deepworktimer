/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StudyCategory } from '../models/StudyCategory';
import type { StudyCategoryCreate } from '../models/StudyCategoryCreate';
import type { StudyCategoryUpdate } from '../models/StudyCategoryUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudyCategoriesService {
    /**
     * Read Study Categories
     * @param skip
     * @param limit
     * @returns StudyCategory Successful Response
     * @throws ApiError
     */
    public static readStudyCategoriesStudyCategoriesGet(
        skip?: number,
        limit: number = 10,
    ): CancelablePromise<Array<StudyCategory>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/study-categories/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Study Category
     * @param requestBody
     * @returns StudyCategory Successful Response
     * @throws ApiError
     */
    public static createStudyCategoryStudyCategoriesPost(
        requestBody: StudyCategoryCreate,
    ): CancelablePromise<StudyCategory> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/study-categories/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Study Category
     * @param studyCategoryId
     * @returns StudyCategory Successful Response
     * @throws ApiError
     */
    public static readStudyCategoryStudyCategoriesStudyCategoryIdGet(
        studyCategoryId: number,
    ): CancelablePromise<StudyCategory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/study-categories/{study_category_id}',
            path: {
                'study_category_id': studyCategoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Study Category
     * @param studyCategoryId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static deleteStudyCategoryStudyCategoriesStudyCategoryIdDelete(
        studyCategoryId: number,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/study-categories/{study_category_id}',
            path: {
                'study_category_id': studyCategoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Study Category
     * @param studyCategoryId
     * @param requestBody
     * @returns StudyCategory Successful Response
     * @throws ApiError
     */
    public static updateStudyCategoryStudyCategoriesStudyCategoryIdPatch(
        studyCategoryId: number,
        requestBody: StudyCategoryUpdate,
    ): CancelablePromise<StudyCategory> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/study-categories/{study_category_id}',
            path: {
                'study_category_id': studyCategoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StudyBlock } from '../models/StudyBlock';
import type { StudyBlockCreate } from '../models/StudyBlockCreate';
import type { StudyBlockQuery } from '../models/StudyBlockQuery';
import type { StudyBlockUpdate } from '../models/StudyBlockUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudyBlocksService {
    /**
     * Create Study Block
     * @param requestBody
     * @returns StudyBlock Successful Response
     * @throws ApiError
     */
    public static createStudyBlockStudyBlocksPost(
        requestBody: StudyBlockCreate,
    ): CancelablePromise<StudyBlock> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/study-blocks/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Study Block
     * @param studyBlockId
     * @returns StudyBlock Successful Response
     * @throws ApiError
     */
    public static readStudyBlockStudyBlocksStudyBlockIdGet(
        studyBlockId: number,
    ): CancelablePromise<StudyBlock> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/study-blocks/{study_block_id}',
            path: {
                'study_block_id': studyBlockId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Study Block
     * @param studyBlockId
     * @param requestBody
     * @returns StudyBlock Successful Response
     * @throws ApiError
     */
    public static updateStudyBlockStudyBlocksStudyBlockIdPatch(
        studyBlockId: number,
        requestBody: StudyBlockUpdate,
    ): CancelablePromise<StudyBlock> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/study-blocks/{study_block_id}',
            path: {
                'study_block_id': studyBlockId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Study Block
     * @param studyBlockId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static deleteStudyBlockStudyBlocksStudyBlockIdDelete(
        studyBlockId: number,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/study-blocks/{study_block_id}',
            path: {
                'study_block_id': studyBlockId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Query Study Blocks
     * @param requestBody
     * @returns StudyBlock Successful Response
     * @throws ApiError
     */
    public static queryStudyBlocksStudyBlocksQueryPost(
        requestBody: StudyBlockQuery,
    ): CancelablePromise<Array<StudyBlock>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/study-blocks/query',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}

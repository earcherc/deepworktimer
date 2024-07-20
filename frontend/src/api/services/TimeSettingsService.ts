/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TimeSettings } from '../models/TimeSettings';
import type { TimeSettingsCreate } from '../models/TimeSettingsCreate';
import type { TimeSettingsUpdate } from '../models/TimeSettingsUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TimeSettingsService {
    /**
     * Read Time Settings List
     * @param skip
     * @param limit
     * @returns TimeSettings Successful Response
     * @throws ApiError
     */
    public static readTimeSettingsListTimeSetttingsGet(
        skip?: number,
        limit: number = 10,
    ): CancelablePromise<Array<TimeSettings>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/time-setttings/',
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
     * Create Time Settings
     * @param requestBody
     * @returns TimeSettings Successful Response
     * @throws ApiError
     */
    public static createTimeSettingsTimeSetttingsPost(
        requestBody: TimeSettingsCreate,
    ): CancelablePromise<TimeSettings> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/time-setttings/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Time Settings
     * @param timeSettingsId
     * @returns TimeSettings Successful Response
     * @throws ApiError
     */
    public static readTimeSettingsTimeSetttingsTimeSettingsIdGet(
        timeSettingsId: number,
    ): CancelablePromise<TimeSettings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/time-setttings/{time_settings_id}',
            path: {
                'time_settings_id': timeSettingsId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Time Settings
     * @param timeSettingsId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static deleteTimeSettingsTimeSetttingsTimeSettingsIdDelete(
        timeSettingsId: number,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/time-setttings/{time_settings_id}',
            path: {
                'time_settings_id': timeSettingsId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Time Settings
     * @param timeSettingsId
     * @param requestBody
     * @returns TimeSettings Successful Response
     * @throws ApiError
     */
    public static updateTimeSettingsTimeSetttingsTimeSettingsIdPatch(
        timeSettingsId: number,
        requestBody: TimeSettingsUpdate,
    ): CancelablePromise<TimeSettings> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/time-setttings/{time_settings_id}',
            path: {
                'time_settings_id': timeSettingsId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}

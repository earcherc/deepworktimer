/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionCounter } from '../models/SessionCounter';
import type { SessionCounterCreate } from '../models/SessionCounterCreate';
import type { SessionCounterUpdate } from '../models/SessionCounterUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SessionCountersService {
    /**
     * Read Session Counters
     * @param skip
     * @param limit
     * @returns SessionCounter Successful Response
     * @throws ApiError
     */
    public static readSessionCountersSessionCountersGet(
        skip?: number,
        limit: number = 10,
    ): CancelablePromise<Array<SessionCounter>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/session-counters/',
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
     * Create Session Counter
     * @param requestBody
     * @returns SessionCounter Successful Response
     * @throws ApiError
     */
    public static createSessionCounterSessionCountersPost(
        requestBody: SessionCounterCreate,
    ): CancelablePromise<SessionCounter> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/session-counters/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Session Counter
     * @param sessionCounterId
     * @returns SessionCounter Successful Response
     * @throws ApiError
     */
    public static readSessionCounterSessionCountersSessionCounterIdGet(
        sessionCounterId: number,
    ): CancelablePromise<SessionCounter> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/session-counters/{session_counter_id}',
            path: {
                'session_counter_id': sessionCounterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Session Counter
     * @param sessionCounterId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static deleteSessionCounterSessionCountersSessionCounterIdDelete(
        sessionCounterId: number,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/session-counters/{session_counter_id}',
            path: {
                'session_counter_id': sessionCounterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Session Counter
     * @param sessionCounterId
     * @param requestBody
     * @returns SessionCounter Successful Response
     * @throws ApiError
     */
    public static updateSessionCounterSessionCountersSessionCounterIdPatch(
        sessionCounterId: number,
        requestBody: SessionCounterUpdate,
    ): CancelablePromise<SessionCounter> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/session-counters/{session_counter_id}',
            path: {
                'session_counter_id': sessionCounterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}

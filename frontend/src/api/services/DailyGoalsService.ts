/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailyGoal } from '../models/DailyGoal';
import type { DailyGoalCreate } from '../models/DailyGoalCreate';
import type { DailyGoalUpdate } from '../models/DailyGoalUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DailyGoalsService {
    /**
     * Create Daily Goal
     * @param requestBody
     * @returns DailyGoal Successful Response
     * @throws ApiError
     */
    public static createDailyGoalDailyGoalsPost(
        requestBody: DailyGoalCreate,
    ): CancelablePromise<DailyGoal> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/daily-goals/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Daily Goals
     * @param skip
     * @param limit
     * @returns DailyGoal Successful Response
     * @throws ApiError
     */
    public static readDailyGoalsDailyGoalsGet(
        skip?: number,
        limit: number = 10,
    ): CancelablePromise<Array<DailyGoal>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/daily-goals/',
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
     * Read Daily Goal
     * @param dailyGoalId
     * @returns DailyGoal Successful Response
     * @throws ApiError
     */
    public static readDailyGoalDailyGoalsDailyGoalIdGet(
        dailyGoalId: number,
    ): CancelablePromise<DailyGoal> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/daily-goals/{daily_goal_id}',
            path: {
                'daily_goal_id': dailyGoalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Daily Goal
     * @param dailyGoalId
     * @param requestBody
     * @returns DailyGoal Successful Response
     * @throws ApiError
     */
    public static updateDailyGoalDailyGoalsDailyGoalIdPatch(
        dailyGoalId: number,
        requestBody: DailyGoalUpdate,
    ): CancelablePromise<DailyGoal> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/daily-goals/{daily_goal_id}',
            path: {
                'daily_goal_id': dailyGoalId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Daily Goal
     * @param dailyGoalId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static deleteDailyGoalDailyGoalsDailyGoalIdDelete(
        dailyGoalId: number,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/daily-goals/{daily_goal_id}',
            path: {
                'daily_goal_id': dailyGoalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}

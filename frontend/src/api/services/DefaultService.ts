/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_image_upload_image_post } from '../models/Body_upload_image_upload_image_post';
import type { DailyGoal } from '../models/DailyGoal';
import type { DailyGoalCreate } from '../models/DailyGoalCreate';
import type { DailyGoalUpdate } from '../models/DailyGoalUpdate';
import type { LoginRequest } from '../models/LoginRequest';
import type { PasswordChangeRequest } from '../models/PasswordChangeRequest';
import type { RegistrationRequest } from '../models/RegistrationRequest';
import type { StudyBlock } from '../models/StudyBlock';
import type { StudyBlockCreate } from '../models/StudyBlockCreate';
import type { StudyBlockUpdate } from '../models/StudyBlockUpdate';
import type { StudyCategory } from '../models/StudyCategory';
import type { StudyCategoryCreate } from '../models/StudyCategoryCreate';
import type { StudyCategoryUpdate } from '../models/StudyCategoryUpdate';
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Login
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static loginAuthLoginPost(
        requestBody: LoginRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Logout
     * @returns any Successful Response
     * @throws ApiError
     */
    public static logoutAuthLogoutPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
        });
    }
    /**
     * Register
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static registerAuthRegisterPost(
        requestBody: RegistrationRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Validate Session
     * @returns any Successful Response
     * @throws ApiError
     */
    public static validateSessionAuthValidateSessionPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/validate-session',
        });
    }
    /**
     * Change Password
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static changePasswordAuthChangePasswordPost(
        requestBody: PasswordChangeRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/change-password',
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
    public static updateDailyGoalDailyGoalsDailyGoalIdPut(
        dailyGoalId: number,
        requestBody: DailyGoalUpdate,
    ): CancelablePromise<DailyGoal> {
        return __request(OpenAPI, {
            method: 'PUT',
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
    /**
     * Read Users
     * @param skip
     * @param limit
     * @returns User Successful Response
     * @throws ApiError
     */
    public static readUsersUsersGet(
        skip?: number,
        limit: number = 10,
    ): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/',
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
     * Update Current User
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static updateCurrentUserUsersPut(
        requestBody: UserUpdate,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create User
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static createUserUsersPost(
        requestBody: UserCreate,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Current User
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static deleteCurrentUserUsersDelete(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/',
        });
    }
    /**
     * Read User
     * @param userId
     * @returns User Successful Response
     * @throws ApiError
     */
    public static readUserUsersUserIdGet(
        userId: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Study Blocks
     * @param skip
     * @param limit
     * @returns StudyBlock Successful Response
     * @throws ApiError
     */
    public static readStudyBlocksStudyBlocksGet(
        skip?: number,
        limit: number = 10,
    ): CancelablePromise<Array<StudyBlock>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/study-blocks/',
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
    public static updateStudyBlockStudyBlocksStudyBlockIdPut(
        studyBlockId: number,
        requestBody: StudyBlockUpdate,
    ): CancelablePromise<StudyBlock> {
        return __request(OpenAPI, {
            method: 'PUT',
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
     * Update Study Category
     * @param studyCategoryId
     * @param requestBody
     * @returns StudyCategory Successful Response
     * @throws ApiError
     */
    public static updateStudyCategoryStudyCategoriesStudyCategoryIdPut(
        studyCategoryId: number,
        requestBody: StudyCategoryUpdate,
    ): CancelablePromise<StudyCategory> {
        return __request(OpenAPI, {
            method: 'PUT',
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
     * Upload Image
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadImageUploadImagePost(
        formData: Body_upload_image_upload_image_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/image',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}

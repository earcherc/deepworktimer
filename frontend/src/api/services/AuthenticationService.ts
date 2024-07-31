/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { LoginRequest } from '../models/LoginRequest';
import type { PasswordChangeRequest } from '../models/PasswordChangeRequest';
import type { RegistrationRequest } from '../models/RegistrationRequest';
export class AuthenticationService {
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
}

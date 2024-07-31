/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailVerificationRequest } from '../models/EmailVerificationRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { PasswordChangeRequest } from '../models/PasswordChangeRequest';
import type { RegistrationRequest } from '../models/RegistrationRequest';
import type { ResendVerificationEmailRequest } from '../models/ResendVerificationEmailRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
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
     * Github Login
     * @param code
     * @returns any Successful Response
     * @throws ApiError
     */
    public static githubLoginAuthGithubLoginPost(
        code: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/github-login',
            query: {
                'code': code,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Google Login
     * @param idToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static googleLoginAuthGoogleLoginPost(
        idToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/google-login',
            query: {
                'id_token': idToken,
            },
            errors: {
                422: `Validation Error`,
            },
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
     * Verify Email
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static verifyEmailAuthVerifyEmailPost(
        requestBody: EmailVerificationRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/verify-email',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Resend Verification Email
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static resendVerificationEmailAuthResendVerificationEmailPost(
        requestBody: ResendVerificationEmailRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/resend-verification-email',
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
     * Test Email
     * @param email
     * @returns any Successful Response
     * @throws ApiError
     */
    public static testEmailAuthTestEmailPost(
        email: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/test-email',
            query: {
                'email': email,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}

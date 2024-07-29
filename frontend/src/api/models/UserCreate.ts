/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Gender } from './Gender';
import type { SocialProvider } from './SocialProvider';
export type UserCreate = {
    username: string;
    email: string;
    bio?: string;
    date_of_birth?: string;
    first_name?: string;
    last_name?: string;
    gender?: Gender;
    profile_photo_key?: string;
    profile_photo_urls?: Record<string, string>;
    password?: string;
    social_provider?: SocialProvider;
    social_id?: string;
};


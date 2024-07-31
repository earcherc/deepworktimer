/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Gender } from './Gender';
import type { SocialProvider } from './SocialProvider';
export type UserCreate = {
    username: string;
    email: string;
    bio?: (string | null);
    date_of_birth?: (string | null);
    first_name?: (string | null);
    last_name?: (string | null);
    gender?: (Gender | null);
    profile_photo_key?: (string | null);
    profile_photo_urls?: (Record<string, (string | null)> | null);
    password?: (string | null);
    social_provider?: (SocialProvider | null);
    social_id?: (string | null);
};


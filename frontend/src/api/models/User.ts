/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Gender } from './Gender';
import type { SocialProvider } from './SocialProvider';
export type User = {
    username: string;
    email: string;
    bio?: (string | null);
    date_of_birth?: (string | null);
    first_name?: (string | null);
    last_name?: (string | null);
    gender?: (Gender | null);
    profile_photo_key?: (string | null);
    profile_photo_urls?: (Record<string, (string | null)> | null);
    id: number;
    created_at: string;
    is_active: boolean;
    is_email_verified: boolean;
    social_provider?: (SocialProvider | null);
};


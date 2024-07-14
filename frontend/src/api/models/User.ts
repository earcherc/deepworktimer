/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Gender } from './Gender';
export type User = {
    username: string;
    email: string;
    bio?: string;
    date_of_birth?: string;
    first_name?: string;
    last_name?: string;
    gender?: Gender;
    profile_photo_key?: string;
    profile_photo_urls?: Record<string, string>;
    id: number;
    created_at: string;
    is_selected: boolean;
};


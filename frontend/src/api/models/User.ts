/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Gender } from './Gender';
export type User = {
    username: string;
    email: string;
    bio?: string;
    job_title?: string;
    personal_title?: string;
    date_of_birth?: string;
    latitude?: number;
    longitude?: number;
    first_name?: string;
    last_name?: string;
    gender?: Gender;
    profile_photo_url?: string;
    timezone?: string;
    language?: string;
    status?: string;
    id: number;
    created_at: string;
};


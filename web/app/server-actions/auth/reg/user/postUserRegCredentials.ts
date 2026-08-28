"use server";

import { UserRegCredentials } from "@/app/(app)/auth/reg/user/_lib/UserRegMain";
import { fetchPOSTGuest } from "@/app/server-actions/functions/fetchPOSTGuest";
import "server-only";

export type userRegCredentialsResponsePayload = { token: string } | undefined;

export default async function postUserRegCredentials(
    credentials: UserRegCredentials,
) {
    return await fetchPOSTGuest<userRegCredentialsResponsePayload>({
        url: "/auth/reg/user/credentials/",
        body: credentials,
    });
}

"use server";

import { fetchPOSTGuest } from "@/app/server-actions/functions/fetchPOSTGuest";
import "server-only";

export type loginCredentialsResponsePayload = { token: string } | undefined;

export default async function postLoginCredentials(credentials: {
    username: string;
    password: string;
}) {
    return await fetchPOSTGuest<loginCredentialsResponsePayload>({
        url: "/auth/login/credentials/",
        body: credentials,
        options: {
            debug: false,
        },
    });
}

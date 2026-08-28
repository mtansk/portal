"use server";

import { CompRegCredentials } from "@/app/(app)/auth/reg/company/_lib/CompRegMain";
import { fetchPOSTGuest } from "@/app/server-actions/functions/fetchPOSTGuest";
import "server-only";

export type compRegCredentialsResponsePayload = { token: string } | undefined;

export default async function postCompRegCredentials(
    credentials: CompRegCredentials,
) {
    return await fetchPOSTGuest<compRegCredentialsResponsePayload>({
        url: "/auth/reg/company/credentials/",
        body: credentials,
    });
}

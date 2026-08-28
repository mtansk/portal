"use server";

import { fetchPOSTGuest } from "@/app/server-actions/functions/fetchPOSTGuest";
import "server-only";
import { AuthorizationPayload } from "@/app/types/access/Access";

export default async function postUserRegCode(payload: {
    token: string;
    code: string;
}) {
    return await fetchPOSTGuest<AuthorizationPayload>({
        url: "/auth/reg/user/code/",
        body: payload,
    });
}

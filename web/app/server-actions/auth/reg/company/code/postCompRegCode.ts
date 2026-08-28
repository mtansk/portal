"use server";

import "server-only";
import { fetchPOSTGuest } from "@/app/server-actions/functions/fetchPOSTGuest";
import { AuthorizationPayload } from "@/app/types/access/Access";

export default async function postCompanyRegCode(payload: {
    token: string;
    code: string;
}) {
    return await fetchPOSTGuest<AuthorizationPayload>({
        url: "/auth/reg/company/code/",
        body: payload,
    });
}

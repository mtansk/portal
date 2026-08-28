"use server";

import "server-only";
import { fetchPOSTNew } from "@/app/server-actions/functions/fetchPOSTNew";
import { ApiResponse } from "@/app/server-actions/functions/types";
import { AuthorizationPayload } from "@/app/types/access/Access";
import { FormJoinCompany } from "@/app/(app)/my/profile/_lib/modals/join-company/JoinCompanyModal";

export default async function postJoinCompany(
    payload: FormJoinCompany,
): Promise<ApiResponse<AuthorizationPayload>> {
    return await fetchPOSTNew({
        url: "/my/company/join/",
        body: payload,
    });
}

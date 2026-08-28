"use server";

import "server-only";
import { ApiResponse } from "@/app/server-actions/functions/types";
import { AuthorizationPayload } from "@/app/types/access/Access";
import { fetchPUTNew } from "@/app/server-actions/functions/fetchPUTNew";

export default async function putCompanySelection(object: {
    id: string;
    token: string;
}): Promise<ApiResponse<AuthorizationPayload>> {
    return await fetchPUTNew({
        url: "/my/company/selection/",
        body: object,
        id: object.id,
    });
}

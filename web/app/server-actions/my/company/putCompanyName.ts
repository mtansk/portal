"use server";

import "server-only";
import { ApiResponse } from "@/app/server-actions/functions/types";
import { fetchPUTNew } from "@/app/server-actions/functions/fetchPUTNew";
import { ApiMyUser } from "@/app/types/user/Users";

export default async function putCompanyName(
    object: ApiMyUser,
): Promise<ApiResponse<unknown>> {
    return await fetchPUTNew({
        url: "/my/company/name/",
        body: object,
        id: "",
    });
}

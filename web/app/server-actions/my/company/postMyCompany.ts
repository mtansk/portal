"use server";

import "server-only";
import { FormCompany } from "@/app/(app)/my/profile/_lib/modals/create-company/CreateCompanyModal";
import { fetchPOSTNew } from "@/app/server-actions/functions/fetchPOSTNew";
import { ApiResponse } from "@/app/server-actions/functions/types";
import { AuthorizationPayload } from "@/app/types/access/Access";

export default async function postMyCompany(
    company: FormCompany,
): Promise<ApiResponse<AuthorizationPayload>> {
    return await fetchPOSTNew({
        url: "/my/company/",
        body: company,
    });
}

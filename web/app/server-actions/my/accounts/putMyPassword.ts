"use server";

import "server-only";
import { fetchPUTNew } from "../../functions/fetchPUTNew";
import { PasswordChangeFormObject } from "@/app/(app)/my/profile/_lib/modals/change-password/PasswordModal";
import { AuthorizationPayload } from "@/app/types/access/Access";

export default async function putMyPassword(object: PasswordChangeFormObject) {
    return await fetchPUTNew<AuthorizationPayload>({
        url: "/my/account/password/",
        body: object,
        id: "",
    });
}

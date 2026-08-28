"use server";

import { fetchPOSTGuest } from "@/app/server-actions/functions/fetchPOSTGuest";
import "server-only";

export type CompanySelectionCompany = {
    user_id: string;
    account_id: string;
    user_title: string;
    deleted_at: string | null;
    company_id: string;
    company_name: string;
};

export type loginCodeResponsePayload =
    | { token: string; companies: CompanySelectionCompany[] }
    | undefined;

export default async function postLoginCode(payload: {
    token: string;
    code: string;
}) {
    return await fetchPOSTGuest<loginCodeResponsePayload>({
        url: "/auth/login/code/",
        body: payload,
    });
}

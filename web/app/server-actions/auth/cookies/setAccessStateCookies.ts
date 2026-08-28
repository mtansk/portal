"use server";

import "server-only";
import { AuthorizationPayload } from "@/app/types/access/Access";
import { cookies } from "next/headers";
import { authCookieOptions } from "./authCookiesOptions";

export default async function setAccessStateCookies(
    newCookies: AuthorizationPayload,
) {
    const cookiesStore = await cookies();
    const options = authCookieOptions;
    const expires = {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    };

    cookiesStore.set("JWT", newCookies.JWT, options);
    cookiesStore.set("refreshToken", newCookies.refreshToken, options);

    cookiesStore.set("access_state", newCookies.access_state, expires);
    cookiesStore.set("access_level", newCookies.access_level, expires);
    cookiesStore.set("company_id", newCookies.company_id, expires);
    cookiesStore.set("user_id", newCookies.user_id, expires);
    cookiesStore.set("account_id", newCookies.account_id, expires);
}

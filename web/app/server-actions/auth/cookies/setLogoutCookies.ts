"use server";

import "server-only";
import { cookies } from "next/headers";

export default async function setLogoutCookies() {
    const cookiesStore = await cookies();

    cookiesStore.delete("JWT");
    cookiesStore.delete("refreshToken");

    cookiesStore.set("access_level", "guest");
    cookiesStore.set("access_state", "none");
    cookiesStore.set("company_id", "");
    cookiesStore.set("user_id", "");
    cookiesStore.set("account_id", "");
}

"use server";

import "server-only";
import fetchGETNew from "../../functions/fetchGETNew";
import { ApiMyAccount } from "@/app/types/access/Accounts";

export default async function getMyAccount(): Promise<ApiMyAccount> {
    const data: ApiMyAccount[] = await fetchGETNew({
        url: "/my/account/",
    });
    return data[0];
}

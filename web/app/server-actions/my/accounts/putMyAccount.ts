"use server";

import { ApiMyAccount } from "@/app/types/access/Accounts";
import "server-only";
import { fetchPUTNew } from "../../functions/fetchPUTNew";

export default async function putMyAccount(account: ApiMyAccount) {
    return await fetchPUTNew({
        url: "/my/account/",
        body: account,
        id: "",
    });
}

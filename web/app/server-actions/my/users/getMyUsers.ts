"use server";

import "server-only";
import fetchGETNew from "../../functions/fetchGETNew";
import { ApiMyUser } from "@/app/types/user/Users";

export default async function getMyUsers(): Promise<ApiMyUser[]> {
    const data: ApiMyUser[] = await fetchGETNew({
        url: "/my/users/",
    });
    return data;
}

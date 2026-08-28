"use server";

import "server-only";
import fetchGETNew from "../../functions/fetchGETNew";
import { ApiMyColleague } from "@/app/types/user/Users";

export default async function getMyColleagues(): Promise<ApiMyColleague[]> {
    return await fetchGETNew({
        url: "/my/colleagues/",
    });
}

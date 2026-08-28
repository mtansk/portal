"use server";

import "server-only";
import { fetchPUTNew } from "../functions/fetchPUTNew";
import { AccessLevels } from "@/app/types/access/Access";

export async function putAccessLevel(data: {
    access_level: AccessLevels;
    user_id: string;
}) {
    return await fetchPUTNew({
        url: "/users/access-level/",
        id: data.user_id,
        body: data,
    });
}

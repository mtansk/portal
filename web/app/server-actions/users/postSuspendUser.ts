"use server";

import "server-only";
import { fetchPOSTNew } from "../functions/fetchPOSTNew";

export async function postSuspendUser(data: { user_id: string }) {
    return await fetchPOSTNew({
        url: "/users/suspend/",
        body: data,
    });
}

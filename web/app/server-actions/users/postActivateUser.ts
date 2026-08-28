"use server";

import "server-only";
import { fetchPOSTNew } from "../functions/fetchPOSTNew";

export async function postActivateUser(data: { user_id: string }) {
    return await fetchPOSTNew({
        url: "/users/activate/",
        body: data,
    });
}

"use server";

import "server-only";
import { fetchPOSTNew } from "../functions/fetchPOSTNew";

export async function postRecoverUser(data: { user_id: string }) {
    return await fetchPOSTNew({
        url: "/users/recover/",
        body: data,
    });
}

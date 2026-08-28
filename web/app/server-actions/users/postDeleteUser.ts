"use server";

import "server-only";
import { fetchPOSTNew } from "../functions/fetchPOSTNew";

export async function postDeleteUser(data: { user_id: string }) {
    return await fetchPOSTNew({
        url: "/users/delete/",
        body: data,
    });
}

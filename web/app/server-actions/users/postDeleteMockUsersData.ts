"use server";

import "server-only";
import { fetchPOSTNew } from "../functions/fetchPOSTNew";

export async function postDeleteMockUsersData() {
    return await fetchPOSTNew({
        url: "/users/mock/delete/",
        body: {},
    });
}

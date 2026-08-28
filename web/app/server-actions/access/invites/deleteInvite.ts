"use server";

import "server-only";
import { fetchDELETENew } from "../../functions/fetchDELETENew";

export default async function deleteInvite(id: string) {
    return await fetchDELETENew({
        url: "/access/invites/",
        id: id,
        options: {},
    });
}

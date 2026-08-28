"use server";

import "server-only";
import { fetchPOSTNew } from "../../functions/fetchPOSTNew";

export default async function postInvite(obj: { user_id: string }) {
    return await fetchPOSTNew({
        url: "/access/invites/",
        body: obj,
    });
}

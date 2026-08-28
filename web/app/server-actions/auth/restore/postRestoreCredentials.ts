"use server";

import "server-only";
import { fetchPOSTGuest } from "@/app/server-actions/functions/fetchPOSTGuest";
import { RestoreCredentials } from "@/app/(app)/auth/restore/_lib/RestoreMain";

export default async function postRestoreCredentials(data: RestoreCredentials) {
    return await fetchPOSTGuest({
        url: "/auth/restore/",
        body: data,
    });
}

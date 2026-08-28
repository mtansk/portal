"use server";

import "server-only";
import { FormUser } from "@/app/(app)/users/(form)/[id]/_lib/UserForm";
import { fetchPUTNew } from "../functions/fetchPUTNew";

export async function putUser(user: FormUser) {
    return await fetchPUTNew({
        url: "/users/",
        id: user.user_id,
        body: user,
    });
}

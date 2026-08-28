"use server";

import "server-only";
import { FormUser } from "@/app/(app)/users/(form)/[id]/_lib/UserForm";
import { fetchPOSTNew } from "../functions/fetchPOSTNew";

export async function postUser(user: FormUser) {
    return await fetchPOSTNew({
        url: "/users/",
        body: user,
    });
}

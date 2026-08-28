"use server";

import "server-only";

import { ApiUser } from "@/app/types/user/Users";
import { GETParams } from "../functions/fetchGETNew";
import fetchGETNew from "../functions/fetchGETNew";

export default async function getUsers({
    params,
}: {
    params?: GETParams;
}): Promise<ApiUser[]>;
export default async function getUsers({
    params,
    id,
}: {
    params?: GETParams;
    id: string;
}): Promise<ApiUser | undefined>;

export default async function getUsers({
    id,
    params = {
        show_deleted: "true",
    },
}: {
    id?: string;
    params?: GETParams;
}) {
    return await fetchGETNew({
        url: "/users/",
        id,
        params,
        options: {
            debug: false,
            revalidate: 0,
        },
    });
}

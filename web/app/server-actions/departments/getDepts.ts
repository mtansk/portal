"use server";

import "server-only";

import { GETParams } from "../functions/fetchGETNew";
import { ApiDept } from "@/app/types/depts/Depts";
import fetchGETNew from "../functions/fetchGETNew";

export default async function getDepts({
    params,
    id,
}: {
    params?: GETParams;
    id: string;
}): Promise<ApiDept | undefined>;

export default async function getDepts({
    params,
}: {
    params?: GETParams;
}): Promise<ApiDept[]>;

export default async function getDepts({
    params,
    id,
}: {
    params?: GETParams;
    id?: string;
}) {
    return await fetchGETNew({
        url: "/company/departments/",
        params,
        id,
        options: {
            debug: false,
        },
    });
}

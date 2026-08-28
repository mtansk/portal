"use server";

import { GETParams } from "../functions/fetchGETNew";
import { ApiSheet } from "@/app/types/sheet/Sheets";
import fetchGETNew from "../functions/fetchGETNew";

export default async function getSheets({
    params,
}: {
    params?: GETParams;
}): Promise<ApiSheet[]>;

export default async function getSheets({
    params,
    id,
}: {
    params?: GETParams;
    id: string;
}): Promise<ApiSheet | undefined>;

export default async function getSheets({
    params,
    id,
}: {
    params?: GETParams;
    id?: string;
}) {
    return await fetchGETNew({
        url: "/sheets/",
        id,
        params,
    });
}

"use server";

import "server-only";
import fetchGETNew, { GETParams } from "../../functions/fetchGETNew";
import { ApiMySheet } from "@/app/types/sheet/Sheets";

export default async function getMySheets({
    params,
}: {
    params?: GETParams;
}): Promise<ApiMySheet[]> {
    return await fetchGETNew({
        url: "/my/sheets/my/",
        params,
    });
}

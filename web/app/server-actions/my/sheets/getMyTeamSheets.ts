"use server";

import "server-only";
import fetchGETNew, { GETParams } from "../../functions/fetchGETNew";
import { ApiMyTeamSheet } from "@/app/types/sheet/Sheets";

export default async function getMyTeamSheets({
    params,
}: {
    params?: GETParams;
}): Promise<ApiMyTeamSheet[]> {
    return await fetchGETNew({
        url: "/my/sheets/team/",
        params,
    });
}

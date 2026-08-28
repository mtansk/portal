"use server";

import "server-only";
import { ApiDefaultSheet } from "@/app/types/default-sheet/DefaultSheets";
import fetchGETNew from "../functions/fetchGETNew";

export default async function getDefaultSheets(): Promise<ApiDefaultSheet[]>;

export default async function getDefaultSheets() {
    return await fetchGETNew({
        url: "/company/default-sheets/",
    });
}

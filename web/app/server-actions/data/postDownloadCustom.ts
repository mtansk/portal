"use server";

import "server-only";
import { fetchPOSTDownload } from "../functions/fetchPOSTDownload";

export default async function postDownloadCustom() {
    return await fetchPOSTDownload({
        url: "/data/download/custom/",
        body: {},
    });
}

"use server";

import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { ApiResponse } from "./types";
import { authHeaderString, parseApiResponse } from "./other";
import { unstable_rethrow } from "next/navigation";

export async function fetchPOSTDownload<T = {}>({
    url,
    addApiFolderToUrl = true,
    body,
    options,
}: {
    url: string;
    addApiFolderToUrl?: boolean;
    body: any;
    options?: { debug?: boolean; tags?: string[] };
}): Promise<Blob> {
    try {
        const baseUrl = `${process.env.API_HOST_NAME}${addApiFolderToUrl ? "/api/private" : ""}${url}`;
        const data = await fetch(baseUrl, {
            method: "POST",
            headers: {
                authorization: await authHeaderString(),
                contentType: "application/json",
            },
            body: JSON.stringify(body),
        });

        const file = await data.blob();

        return await file;
    } catch (e) {
        unstable_rethrow(e);
        throw new Error("Ошибка, пойманная catch в fetchPOSTNew. Текст: " + e);
    }
}

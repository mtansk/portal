"use server";

import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { ApiResponse } from "./types";
import { parseApiResponse } from "./other";
import { unstable_rethrow } from "next/navigation";

export async function fetchPOSTGuest<T = {}>({
    url,
    addApiFolderToUrl = true,
    body,
    options,
}: {
    url: string;
    addApiFolderToUrl?: boolean;
    body: any;
    options?: { debug?: boolean; tags?: string[] };
}): Promise<ApiResponse<T>> {
    try {
        const baseUrl = `${process.env.API_HOST_NAME}${addApiFolderToUrl ? "/api/private" : ""}${url}`;
        const data = await fetch(baseUrl, {
            method: "POST",
            headers: {
                contentType: "application/json",
            },
            body: JSON.stringify(body),
        });

        if (data.ok) {
            revalidatePath("/");
            revalidateTag("get");
            options?.tags?.forEach((tag) => revalidateTag(tag));
        }

        const res: ApiResponse<any> = await parseApiResponse(data);

        return await res;
    } catch (e) {
        unstable_rethrow(e);
        throw new Error("Ошибка, пойманная catch в fetchPOSTNew. Текст: " + e);
    }
}

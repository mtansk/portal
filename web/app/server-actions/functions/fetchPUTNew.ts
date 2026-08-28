"use server";

import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { authHeaderString, parseApiResponse } from "./other";
import { ApiResponse } from "./types";
import { unstable_rethrow } from "next/navigation";
import { cookies } from "next/headers";

export async function fetchPUTNew<T = {}>({
    url,
    body,
    addApiFolderToUrl = true,
    id,
    options,
}: {
    url: string;
    body: any;
    id: string | number;
    addApiFolderToUrl?: boolean;
    options?: {
        debug?: boolean;
        tags?: string[];
    };
}) {
    try {
        const baseUrl = `${process.env.API_HOST_NAME}${addApiFolderToUrl ? "/api/private" : ""}${url}${id ?? ""}`;
        const data = await fetch(baseUrl, {
            method: "PUT",
            headers: {
                authorization: await authHeaderString(),
                contentType: "application/json",
            },
            body: JSON.stringify(body),
        });
        if (data.ok) {
            revalidatePath("/");
            revalidateTag("get");
            options?.tags?.forEach((tag) => revalidateTag(tag));
        }

        const res: ApiResponse<T> = await parseApiResponse(data);

        return await res;
    } catch (e) {
        unstable_rethrow(e);
        throw new Error("Ошибка загрузки данных в fetchPUT через catch. " + e);
    }
}

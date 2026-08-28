"use server";

import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { authHeaderString, parseApiResponse } from "./other";
import { ApiResponse } from "./types";
import { unstable_rethrow } from "next/navigation";

export async function fetchDELETENew<T = {}>({
    url,
    id,
    addApiFolderToUrl = true,
    options,
}: {
    url: string;
    id: number | string;
    addApiFolderToUrl?: boolean;
    options?: { debug?: boolean; tags?: string[] };
}) {
    try {
        const baseUrl = `${process.env.API_HOST_NAME}${addApiFolderToUrl ? "/api/private" : ""}${url}${id ?? ""}`;
        const data = await fetch(baseUrl, {
            method: "DELETE",
            headers: {
                authorization: await authHeaderString(),
            },
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
        throw new Error(
            "Ошибка загрузки данных в fetchDELETE через catch. " + e,
        );
    }
}

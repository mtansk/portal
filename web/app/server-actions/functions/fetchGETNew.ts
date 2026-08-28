"use server";

import "server-only";

import { redirect, unstable_rethrow } from "next/navigation";
import { ApiResponse } from "./types";
import { authHeaderString, parseApiResponse } from "./other";

export type GETParams = {
    user_id?: string;
    start?: string;
    end?: string;
    payslip_id?: string;
    extended_payslip_id?: string;
    show_deleted?: string;
    show_only_active?: string;
    paramsString?: string;
};

export default async function fetchGETNew({
    url,
    id,
    addApiFolderToUrl = true,
    params,
    options = {
        cache: "no-cache",
    },
}: {
    url: string;
    id?: string;
    addApiFolderToUrl?: boolean;
    params?: GETParams;
    options?: {
        cache?: "force-cache" | "no-cache" | "default" | "reload" | "no-store";
        tags?: string[];
        revalidate?: number | false;
        debug?: boolean;
    };
}) {
    const { cache, tags, revalidate } = options;

    function constructURL() {
        const baseUrl = `${process.env.API_HOST_NAME}${addApiFolderToUrl ? "/api/private" : ""}${url}${id ?? ""}`;

        const paramsObj: Record<string, string> = {};

        Object.entries(params ?? {}).forEach(([key, value]) => {
            if (value && key !== "paramsString") {
                paramsObj[key] = value;
            }
        });

        const queryString = new URLSearchParams(paramsObj)
            .toString()
            .concat(params?.paramsString ? `&${params.paramsString}` : "");

        return `${baseUrl}${queryString ? `?${queryString}` : ""}`;
    }

    try {
        const data = await fetch(constructURL(), {
            method: "GET",
            headers: {
                authorization: await authHeaderString(),
            },
            cache: cache,
            next: {
                tags: tags,
                revalidate: revalidate,
            },
        });

        const res: ApiResponse<any> = await parseApiResponse(data);

        if (res.code === 401) {
            redirect("/auth/logout");
        }

        if (!data.ok) {
            throw new Error(
                `Ошибка запроса, Дата не ОК, код: ${data.status}. ${res.message}`,
            );
        }

        if (id) {
            return await res.data[0];
        }

        return await res.data;
    } catch (e) {
        unstable_rethrow(e);
        throw new Error("Ошибка загрузки данных в fetchGET через catch. " + e);
    }
}

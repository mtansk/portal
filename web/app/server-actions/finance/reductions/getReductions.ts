"use server";

import "server-only";

import { ApiReduction } from "@/app/types/finance/reductions/Reductions";
import { GETParams } from "../../functions/fetchGETNew";
import fetchGETNew from "../../functions/fetchGETNew";

export default async function getReductions({
    params,
    id,
}: {
    params?: GETParams;
    id: string;
}): Promise<ApiReduction | undefined>;

export default async function getReductions({
    params,
}: {
    params?: GETParams;
}): Promise<ApiReduction[]>;

export default async function getReductions({
    id,
    params,
}: {
    id?: string;
    params?: GETParams;
}) {
    return await fetchGETNew({
        url: `/finance/reductions/`,
        id,
        params,
    });
}

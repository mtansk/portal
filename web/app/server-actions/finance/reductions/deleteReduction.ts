"use server";

import "server-only";

import { fetchDELETENew } from "../../functions/fetchDELETENew";

export default async function deleteReduction(reduction_id: string) {
    return await fetchDELETENew({
        url: "/finance/reductions/",
        id: reduction_id,
    });
}

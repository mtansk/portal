"use server";

import "server-only";
import { ApiResponse } from "../functions/types";
import { fetchPOSTNoTags } from "../functions/fetchPOSTNoTags";

export type PostInitializeDataRes = {
    ct: string;
    transaction_id: string;
};

export default async function postInitialize(data: {
    qty: number | string;
}): Promise<ApiResponse<PostInitializeDataRes>> {
    return await fetchPOSTNoTags({
        url: "/transactions/initialize/",
        body: data,
    });
}

"use server";

import "server-only";

import { ApiResponse } from "../functions/types";
import { fetchPOSTNoTags } from "../functions/fetchPOSTNoTags";

export type PostCheckDataRes = {
    status: string;
    details?: string;
};

export default async function postCheck(data: {
    transaction_id: string;
}): Promise<ApiResponse<PostCheckDataRes>> {
    return await fetchPOSTNoTags({
        url: "/transactions/check/",
        body: data,
    });
}

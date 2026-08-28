"use server";

import { GETParams } from "../functions/fetchGETNew";
import fetchGETNew from "../functions/fetchGETNew";

export type ReservedDates = {
    user_id: string;
    reserved_dates: string[];
};

export default async function getReservedDates({
    params,
}: {
    params?: GETParams;
}): Promise<ReservedDates[]>;

export default async function getReservedDates({
    params,
}: {
    params?: GETParams;
}) {
    const res: ReservedDates[] = await fetchGETNew({
        url: "/sheets/reserved-dates/",
        params,
    });

    return res;
}

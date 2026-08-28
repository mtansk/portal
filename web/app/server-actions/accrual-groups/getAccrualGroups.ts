"use server";

import { ApiAccrualGroup } from "@/app/types/accrual-group/AccrualGroups";
import fetchGETNew from "../functions/fetchGETNew";

export default async function getAccrualGroups(): Promise<ApiAccrualGroup[]>;

export default async function getAccrualGroups() {
    return await fetchGETNew({
        url: "/company/accrual-groups/",
    });
}

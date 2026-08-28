"use server";

import "server-only";
import { FormAccrualGroup } from "@/app/(app)/company/rates/general-rates/_lib/form/AccrualGroupForm";
import { fetchPUTNew } from "../functions/fetchPUTNew";

export async function putAccrualGroup(group: FormAccrualGroup) {
    return await fetchPUTNew({
        url: "/company/accrual-groups/",
        body: group,
        id: group.accrual_group_id,
    });
}

"use server";

import "server-only";
import { FormAccrualGroup } from "@/app/(app)/company/rates/general-rates/_lib/form/AccrualGroupForm";
import { fetchPOSTNew } from "../functions/fetchPOSTNew";

export async function postAccrualGroup(group: FormAccrualGroup) {
    return await fetchPOSTNew({
        url: "/company/accrual-groups/",
        body: group,
    });
}

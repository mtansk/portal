"use server";

import "server-only";
import fetchGETNew from "@/app/server-actions/functions/fetchGETNew";
import { ApiMyDepartment } from "@/app/types/depts/Depts";

export default async function getMyDepartments(): Promise<ApiMyDepartment[]> {
    return await fetchGETNew({
        url: "/my/departments/",
    });
}

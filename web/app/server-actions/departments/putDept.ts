"use server";

import "server-only";
import { fetchPUTNew } from "../functions/fetchPUTNew";
import { FormDept } from "@/app/(app)/company/departments/_lib/form/DepartmentForm";

export default async function putDept(dept: FormDept) {
    return await fetchPUTNew({
        url: "/company/departments/",
        id: dept.department_id,
        body: dept,
    });
}

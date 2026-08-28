"use server";

import "server-only";
import { fetchPOSTNew } from "../functions/fetchPOSTNew";
import { FormDept } from "@/app/(app)/company/departments/_lib/form/DepartmentForm";

export default async function postDept(dept: FormDept) {
    return await fetchPOSTNew({
        url: "/company/departments/",
        body: dept,
    });
}

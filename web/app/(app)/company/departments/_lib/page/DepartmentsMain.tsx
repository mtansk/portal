"use client";

import { ApiDept, defaultDeptObject } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import DepartmentsHeader from "./DepartmentsHeader";
import { useFormMainHandler } from "@/app/components/hooks/useFormMainHandler";
import DepartmentsBody from "./DepartmentsBody";
import DepartmentForm from "../form/DepartmentForm";
import { ModalPortal } from "@/app/components/form/ModalPortal";

export default function DepartmentsMain({
    users,
    depts,
}: {
    users: ApiUser[];
    depts: ApiDept[];
}) {
    const {
        dialogIsOpen,
        setDialogIsOpen,
        initialObject: dept,
        handleObjectClick: handleDeptClick,
        type,
    } = useFormMainHandler(depts, "department_id", defaultDeptObject);

    return (
        <>
            {dialogIsOpen && dept && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    <DepartmentForm
                        initialDept={dept}
                        users={users}
                        type={type}
                        view="modal"
                        setDialogIsOpen={setDialogIsOpen}
                    />
                </ModalPortal>
            )}
            <DepartmentsHeader
                onAddClick={() => handleDeptClick("-1", "add")}
            />
            <DepartmentsBody
                depts={depts}
                users={users}
                onDeptClick={handleDeptClick}
            />
        </>
    );
}

"use client";

import { useCallback, useMemo } from "react";

import { ModalPortal } from "@/app/components/form/ModalPortal";
import ReductionForm from "../form/ReductionsForm";

import { ApiDept } from "@/app/types/depts/Depts";
import { useFormMainHandler } from "@/app/components/hooks/useFormMainHandler";
import { ApiUser } from "@/app/types/user/Users";
import {
    ApiReduction,
    defaultReductionObject,
} from "@/app/types/finance/reductions/Reductions";
import { financeArrayHandler } from "../../../_lib/functions";
import {
    AllEFOObjects,
    FinanceSearchParams,
} from "@/app/types/finance/other/FinanceTypes";
import { FinanceStandardBody } from "../../../_lib/efo-body/actual-body/FinanceStandardBody";
import { ApiDebt } from "@/app/types/finance/debts/Debts";

export default function ReductionsMain({
    reductions,
    users,
    depts,
    debts,

    searchParams,
    typeOfPage,
}: {
    reductions: ApiReduction[];
    users: ApiUser[];
    depts: ApiDept[];
    debts: ApiDebt[];

    searchParams: FinanceSearchParams;
    typeOfPage: "list" | "grouped";
}) {
    const {
        initialObject: initialReduction,
        dialogIsOpen,
        setDialogIsOpen,
        handleObjectClick,
        type,
    } = useFormMainHandler(reductions, "reduction_id", defaultReductionObject);

    const sortedFilteredTI = useMemo(() => {
        return financeArrayHandler(reductions, searchParams);
    }, [reductions, searchParams]);

    const handleReductionClick = useCallback(
        (object: AllEFOObjects) => {
            if (object.id === "0") {
                handleObjectClick("0", "add", {
                    user_id: object.user_id,
                });
            } else {
                handleObjectClick(object.id);
            }
        },
        [handleObjectClick],
    );

    return (
        <>
            {dialogIsOpen && initialReduction && (
                <ModalPortal
                    setDialogIsOpen={setDialogIsOpen}
                    dialogIsOpen={dialogIsOpen}
                >
                    <ReductionForm
                        initialReduction={initialReduction}
                        users={users}
                        debts={debts}
                        type={"edit"}
                        view="modal"
                        setDialogIsOpen={setDialogIsOpen}
                        options={{
                            date: "single",
                            payslip: false,
                            user: "fixed",
                        }}
                    />
                </ModalPortal>
            )}
            <FinanceStandardBody
                arrayOfObjects={sortedFilteredTI}
                depts={depts}
                users={users}
                typeOfPage={typeOfPage}
                onObjectClick={handleReductionClick}
                addPath="/finance/reductions"
            />
        </>
    );
}

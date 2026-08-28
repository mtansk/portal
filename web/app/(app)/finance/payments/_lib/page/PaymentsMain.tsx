"use client";

import { useCallback, useMemo } from "react";

import { ModalPortal } from "@/app/components/form/ModalPortal";

import { ApiDept } from "@/app/types/depts/Depts";
import { useFormMainHandler } from "@/app/components/hooks/useFormMainHandler";
import { ApiUser } from "@/app/types/user/Users";
import {
    ApiPayment,
    defaultPaymentObject,
} from "@/app/types/finance/payments/Payments";
import { financeArrayHandler } from "../../../_lib/functions";
import {
    AllEFOObjects,
    FinanceSearchParams,
} from "@/app/types/finance/other/FinanceTypes";
import PaymentsForm from "../form/PaymentsForm";
import { FinanceStandardBody } from "../../../_lib/efo-body/actual-body/FinanceStandardBody";

export default function PaymentsMain({
    payments,
    users,
    depts,

    searchParams,
    typeOfPage,
}: {
    payments: ApiPayment[];
    users: ApiUser[];
    depts: ApiDept[];

    searchParams: FinanceSearchParams;
    typeOfPage: "list" | "grouped";
}) {
    const {
        initialObject: initialPayment,
        dialogIsOpen,
        setDialogIsOpen,
        handleObjectClick,
        type,
    } = useFormMainHandler(payments, "payment_id", defaultPaymentObject);

    const sortedFilteredTI = useMemo(() => {
        return financeArrayHandler(payments, searchParams);
    }, [payments, searchParams]);

    const handlePaymentClick = useCallback(
        function (obj: AllEFOObjects) {
            if (obj.id === "0") {
                handleObjectClick("0", "add", {
                    user_id: obj.user_id,
                });
            } else {
                handleObjectClick(obj.id);
            }
        },
        [handleObjectClick],
    );

    return (
        <>
            {dialogIsOpen && initialPayment && (
                <ModalPortal
                    setDialogIsOpen={setDialogIsOpen}
                    dialogIsOpen={dialogIsOpen}
                >
                    <PaymentsForm
                        initialPayment={initialPayment}
                        users={users}
                        type={"edit"}
                        view="modal"
                        setDialogIsOpen={setDialogIsOpen}
                        options={{
                            date: "single",
                            user: "fixed",
                            payslip: false,
                        }}
                    />
                </ModalPortal>
            )}
            <FinanceStandardBody
                arrayOfObjects={sortedFilteredTI}
                onObjectClick={handlePaymentClick}
                depts={depts}
                users={users}
                typeOfPage={typeOfPage}
                addPath="/finance/payments"
            />
        </>
    );
}

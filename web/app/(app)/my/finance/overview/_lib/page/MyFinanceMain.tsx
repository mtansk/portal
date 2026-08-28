"use client";

import { ApiMyAccrual } from "@/app/types/finance/accrual/Accruals";
import { MyFinanceSearchParams } from "../../page";
import { ApiMySheet } from "@/app/types/sheet/Sheets";
import { ApiMyReduction } from "@/app/types/finance/reductions/Reductions";
import { ApiMyPayment } from "@/app/types/finance/payments/Payments";
import MyFinanceBody from "./MyFinanceBody";
import MyFinanceHeader from "./MyFinanceHeader";
import { EFONames } from "@/app/types/finance/other/FinanceTypes";
import { useState, useMemo, useCallback } from "react";
import MySheetForm from "@/app/(app)/my/schedule/my/_lib/form/MySheetFrom";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import MyAccrualForm from "../form/MyAccrualForm";
import MyReductionForm from "../form/MyReductionForm";
import MyPaymentForm from "../form/MyPaymentForm";
import {
    isMyApiAccrual,
    isMyApiSheet,
    isMyApiReduction,
    isMyApiPayment,
} from "@/app/types/guards/guards";

export default function MyFinanceMain({
    searchParams,

    accruals,
    sheets,
    reductions,
    payments,
}: {
    searchParams: MyFinanceSearchParams;

    accruals: ApiMyAccrual[];
    sheets: ApiMySheet[];
    reductions: ApiMyReduction[];
    payments: ApiMyPayment[];
}) {
    const [id, setId] = useState<string | null>(null);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogType, setDialogType] = useState<EFONames | null>(null);

    const dialogObject = useMemo(() => {
        const object = [
            ...accruals,
            ...sheets,
            ...reductions,
            ...payments,
        ].find((item) => item.id === id);

        if (id) {
            if (isMyApiAccrual(object)) {
                setDialogType("accrual");
                return object;
            }

            if (isMyApiSheet(object)) {
                setDialogType("sheet");
                return object;
            }

            if (isMyApiReduction(object)) {
                setDialogType("reduction");
                return object;
            }

            if (isMyApiPayment(object)) {
                setDialogType("payment");
                return object;
            }
        }
        return null;
    }, [id, accruals, sheets, reductions, payments]);

    const handleObjectClick = useCallback(
        (id: string) => {
            setId(id);
            setDialogIsOpen(true);
        },
        [setId, setDialogIsOpen],
    );

    return (
        <>
            {dialogIsOpen &&
                isMyApiAccrual(dialogObject) &&
                dialogType === "accrual" && (
                    <ModalPortal
                        dialogIsOpen={dialogIsOpen}
                        setDialogIsOpen={setDialogIsOpen}
                    >
                        <MyAccrualForm
                            initialAccrual={dialogObject}
                            view="modal"
                            setDialogIsOpen={setDialogIsOpen}
                        />
                    </ModalPortal>
                )}
            {dialogIsOpen &&
                isMyApiSheet(dialogObject) &&
                dialogType === "sheet" && (
                    <ModalPortal
                        dialogIsOpen={dialogIsOpen}
                        setDialogIsOpen={setDialogIsOpen}
                    >
                        <MySheetForm
                            initialSheet={dialogObject}
                            view="modal"
                            setDialogIsOpen={setDialogIsOpen}
                        />
                    </ModalPortal>
                )}
            {dialogIsOpen &&
                isMyApiReduction(dialogObject) &&
                dialogType === "reduction" && (
                    <ModalPortal
                        dialogIsOpen={dialogIsOpen}
                        setDialogIsOpen={setDialogIsOpen}
                    >
                        <MyReductionForm
                            initialReduction={dialogObject}
                            view="modal"
                            setDialogIsOpen={setDialogIsOpen}
                        />
                    </ModalPortal>
                )}
            {dialogIsOpen &&
                isMyApiPayment(dialogObject) &&
                dialogType === "payment" && (
                    <ModalPortal
                        dialogIsOpen={dialogIsOpen}
                        setDialogIsOpen={setDialogIsOpen}
                    >
                        <MyPaymentForm
                            initialPayment={dialogObject}
                            view="modal"
                            setDialogIsOpen={setDialogIsOpen}
                        />
                    </ModalPortal>
                )}
            <MyFinanceHeader searchParams={searchParams} />
            <MyFinanceBody
                searchParams={searchParams}
                accruals={accruals}
                sheets={sheets}
                reductions={reductions}
                payments={payments}
                handleObjectClick={handleObjectClick}
            />
        </>
    );
}

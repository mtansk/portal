"use client";

import MyFormHandler from "@/app/components/form/MyFormHandler";
import { ApiMyAccrual } from "@/app/types/finance/accrual/Accruals";
import { ApiMyPayment } from "@/app/types/finance/payments/Payments";
import { ApiMyPayslip } from "@/app/types/finance/payslip/Payslips";
import { ApiMyReduction } from "@/app/types/finance/reductions/Reductions";
import { ApiMySocialFee } from "@/app/types/finance/social-fees/SocialFees";
import { ApiMyTaxDeduction } from "@/app/types/finance/tax-deductions/TaxDeduction";
import { ApiMyTax } from "@/app/types/finance/taxes/Taxes";
import { ApiMySheet } from "@/app/types/sheet/Sheets";
import styles from "./css/form.module.scss";
import { MyPayslipFormHeader } from "./MyPayslipFormHeader";
import { calculateFOArrayTotal } from "@/app/(app)/finance/_lib/functions";
import MyPayslipTotals from "./MyPayslipTotals";
import { EFONames } from "@/app/types/finance/other/FinanceTypes";
import { useState, useMemo, useCallback } from "react";
import {
    isMyApiAccrual,
    isMyApiSheet,
    isMyApiReduction,
    isMyApiPayment,
} from "@/app/types/guards/guards";
import MySheetForm from "@/app/(app)/my/schedule/my/_lib/form/MySheetFrom";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import MyAccrualForm from "../../../../overview/_lib/form/MyAccrualForm";
import MyPaymentForm from "../../../../overview/_lib/form/MyPaymentForm";
import MyReductionForm from "../../../../overview/_lib/form/MyReductionForm";
import MyPayslipMemoBody from "./MyPayslipMemoBody";
import dynamic from "next/dynamic";
import FormLoading from "@/app/components/form/FormLoading";

const LazyAccrual = dynamic(
    () => import("../../../../overview/_lib/form/MyAccrualForm"),
    { loading: () => <FormLoading /> },
);

const LazySheet = dynamic(
    () => import("@/app/(app)/my/schedule/my/_lib/form/MySheetFrom"),
    { loading: () => <FormLoading /> },
);

const LazyReduction = dynamic(
    () => import("../../../../overview/_lib/form/MyReductionForm"),
    { loading: () => <FormLoading /> },
);

const LazyPayment = dynamic(
    () => import("../../../../overview/_lib/form/MyPaymentForm"),
    { loading: () => <FormLoading /> },
);

export default function MyPayslipForm({
    payslip,

    accruals,
    reductions,
    payments,
    taxes,
    taxDeductions,
    socialFees,
}: {
    payslip: ApiMyPayslip;

    accruals: (ApiMyAccrual | ApiMySheet)[];
    reductions: ApiMyReduction[];
    payments: ApiMyPayment[];
    taxes: ApiMyTax[];
    taxDeductions: ApiMyTaxDeduction[];
    socialFees: ApiMySocialFee[];
}) {
    const [id, setId] = useState<string | null>(null);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogType, setDialogType] = useState<EFONames | null>(null);

    const dialogObject = useMemo(() => {
        const object = [...accruals, ...reductions, ...payments].find(
            (item) => item.id === id,
        );

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
    }, [id, accruals, reductions, payments]);

    const handleObjectClick = useCallback(
        (id: string) => {
            setId(id);
            setDialogIsOpen(true);
        },
        [setId, setDialogIsOpen],
    );

    const accrualsTotal = useMemo(
        () => calculateFOArrayTotal(accruals),
        [accruals],
    );
    const taxesTotal = useMemo(() => calculateFOArrayTotal(taxes), [taxes]);
    const reductionsTotal = useMemo(
        () => calculateFOArrayTotal(reductions),
        [reductions],
    );
    const paymentsTotal = useMemo(
        () => calculateFOArrayTotal(payments),
        [payments],
    );

    return (
        <MyFormHandler view="page">
            {dialogIsOpen &&
                isMyApiAccrual(dialogObject) &&
                dialogType === "accrual" && (
                    <ModalPortal
                        dialogIsOpen={dialogIsOpen}
                        setDialogIsOpen={setDialogIsOpen}
                    >
                        <LazyAccrual
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
                        <LazySheet
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
                        <LazyReduction
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
                        <LazyPayment
                            initialPayment={dialogObject}
                            view="modal"
                            setDialogIsOpen={setDialogIsOpen}
                        />
                    </ModalPortal>
                )}
            <div className={styles.main_div}>
                <div className={styles.header_div}>
                    <MyPayslipFormHeader payslip={payslip} />
                </div>
                <div className={styles.body_div}>
                    <MyPayslipMemoBody
                        accruals={accruals}
                        reductions={reductions}
                        payments={payments}
                        taxes={taxes}
                        taxDeductions={taxDeductions}
                        socialFees={socialFees}
                        handleObjectClick={handleObjectClick}
                    />
                    <div className={styles.totals}>
                        <MyPayslipTotals
                            accrualsTotal={accrualsTotal}
                            taxesTotal={taxesTotal}
                            reductionsTotal={reductionsTotal}
                            paymentsTotal={paymentsTotal}
                        />
                    </div>
                </div>
            </div>
        </MyFormHandler>
    );
}

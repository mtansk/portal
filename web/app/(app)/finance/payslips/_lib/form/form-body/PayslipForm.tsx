"use client";

import { ApiAccrual } from "@/app/types/finance/accrual/Accruals";
import {
    ApiPayment,
    defaultPaymentObject,
} from "@/app/types/finance/payments/Payments";
import { ApiReduction } from "@/app/types/finance/reductions/Reductions";
import { ApiSheet } from "@/app/types/sheet/Sheets";
import { ApiUser } from "@/app/types/user/Users";
import styles from "./css/form.module.scss";
import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";
import { FormPayslip } from "@/app/types/finance/payslip/Payslips";
import { useCallback, useMemo, useReducer, useState } from "react";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";

import {
    ApiTax,
    defaultPayslipFoObject,
} from "@/app/types/finance/taxes/Taxes";
import { ApiTaxDeduction } from "@/app/types/finance/tax-deductions/TaxDeduction";
import { ApiSocialFee } from "@/app/types/finance/social-fees/SocialFees";

import { PayslipMemoBody } from "./PayslipMemoBody";
import dynamic from "next/dynamic";
import FormLoading from "@/app/components/form/FormLoading";
import {
    AllEFOObjects,
    EFONames,
    FONames,
} from "@/app/types/finance/other/FinanceTypes";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import PayslipTotals from "./PayslipTotals";
import { UTCDateMini } from "@date-fns/utc";
import { isAfter, isBefore, isSameDay } from "date-fns";
import { getFinanceObjectType } from "@/app/(app)/finance/_lib/functions";
import {
    payslipInitialState,
    payslipObjectsReducer,
} from "../functions/payslipObjectsReducer";
import { Payslip } from "../functions/utilityObject";
import getPayslipObjects from "../functions/usePayslipObjects";
import postPayslip from "@/app/server-actions/finance/payslips/postPayslip";
import putPayslip from "@/app/server-actions/finance/payslips/putPayslip";
import deletePayslip from "@/app/server-actions/finance/payslips/deletePayslip";
import { PayslipFormHeader } from "./PayslipFormHeader";
import FormHandler from "@/app/components/form/FormHandler";
import { SearchParams } from "next/dist/server/request/search-params";
import { PayslipsAddParams } from "../../../(form)/add/page";
import { PayslipFOConstructorObject } from "@/app/classes/finance/PayslipFO";

const FOFormLazy = dynamic(() => import("../FOForm/FOForm"), {
    loading: () => <FormLoading />,
});

const PaymentsFormLazy = dynamic(
    () => import("@/app/(app)/finance/payments/_lib/form/PaymentsForm"),
    {
        loading: () => <FormLoading />,
    },
);

const SelectionModalLazy = dynamic(
    () => import("../selection-form/PayslipSelectionModal"),
    {
        loading: () => <FormLoading />,
    },
);

export default function PayslipForm({
    initialPayslip,
    payslip_id,

    accruals,
    reductions,
    payments,
    taxes,
    taxDeductions,
    socialFees,

    user,

    type,
    periodOptions,
    searchParams,
}: {
    initialPayslip: FormPayslip;
    payslip_id?: string;

    accruals: (ApiAccrual | ApiSheet)[];
    reductions: ApiReduction[];
    payments: ApiPayment[];
    taxes: ApiTax[];
    taxDeductions: ApiTaxDeduction[];
    socialFees: ApiSocialFee[];

    user: ApiUser;

    type: FormTypes;
    periodOptions?: PeriodOptions;
    searchParams: SearchParams | PayslipsAddParams;
}) {
    const {
        actionType,
        isDisabled,
        object: payslip,
        setObject: setPayslip,
        setActionType,
    } = useFormHandler(initialPayslip, type);

    function createSQLObject() {
        const obj = {
            ...payslip,
            ...payslipObjects,
        };
        return obj;
    }

    function selectedObjectsCollector() {
        if (type === "add" && periodOptions && searchParams.auto === "true") {
            const startDate = new UTCDateMini(periodOptions.start);
            const endDate = new UTCDateMini(periodOptions.end);

            function mapIds(array: AllEFOObjects[]) {
                return array
                    .filter((o) => {
                        const date = new UTCDateMini(o.date);
                        if (
                            (isBefore(date, endDate) ||
                                isSameDay(date, endDate)) &&
                            (isAfter(date, startDate) ||
                                isSameDay(date, startDate))
                        ) {
                            return true;
                        }
                    })
                    .map((o) => {
                        return o.id;
                    });
            }

            const accrualsIdArray = mapIds(accruals);
            const reductionsIdArray = mapIds(reductions);
            const paymentsIdArray = mapIds(payments);

            return {
                ...payslipInitialState,
                selectedObjects: {
                    ...payslipInitialState.selectedObjects,
                    accrual: accrualsIdArray,
                    reduction: reductionsIdArray,
                    payment: paymentsIdArray,
                },
            };
        } else if (type === "edit") {
            return { ...payslipInitialState, payslip_id: payslip_id || null };
        }

        return payslipInitialState;
    }

    const [payslipObjects, payslipObjectsDispatch] = useReducer(
        payslipObjectsReducer,
        payslipInitialState,
        selectedObjectsCollector,
    );

    const {
        accrualsObjects,
        reductionsObjects,
        paymentsObjects,
        taxesObjects,
        taxDeductionsObjects,
        socialFeesObjects,
    } = useMemo(
        () =>
            getPayslipObjects({
                accruals,
                reductions,
                payments,
                taxes,
                taxDeductions,
                socialFees,
                payslipObjects,
                payslip_id,
            }),
        [
            accruals,
            reductions,
            payments,
            taxes,
            taxDeductions,
            socialFees,
            payslipObjects,
            payslip_id,
        ],
    );

    /* 
    
        FO
    
    */

    const [FOFormObjectType, setFOFormObjectType] = useState<FONames>("tax");

    const foFormInitialObject = useMemo((): PayslipFOConstructorObject => {
        const baseObject = defaultPayslipFoObject;

        const calculateQty = () => {
            if (FOFormObjectType === "tax") {
                return (
                    accrualsObjects.total - taxDeductionsObjects.total
                ).toFixed(2);
            }
            if (FOFormObjectType === "socialFee") {
                return accrualsObjects.total.toFixed(2);
            }
            if (FOFormObjectType === "taxDeduction") {
                return "1";
            }
            return "";
        };

        switch (FOFormObjectType) {
            case "tax":
                return {
                    ...baseObject,
                    name: taxesObjects.array.length === 0 ? "НДФЛ" : "",
                    qty: calculateQty(),
                    rate: taxesObjects.array.length === 0 ? "0.13" : "",
                    is_round: 1,
                };
            case "socialFee":
                return {
                    ...baseObject,
                    qty: calculateQty(),
                };
            case "taxDeduction":
                return {
                    ...baseObject,
                    qty: calculateQty(),
                };
            default:
                return baseObject;
        }
    }, [
        FOFormObjectType,
        accrualsObjects.total,
        taxDeductionsObjects.total,
        taxesObjects.array.length,
    ]);

    const [foDialogIsOpen, setFoDialogIsOpen] = useState(false);

    const handleAddFOClick = useCallback((type: FONames) => {
        setFOFormObjectType(type);
        setFoDialogIsOpen(true);
    }, []);

    /* 
    
        PAYMENT

    */
    const [paymentDialogIsOpen, setPaymentDialogIsOpen] = useState(false);

    const paymentInitialObject = useMemo(() => {
        const toBePaid =
            accrualsObjects.total -
            reductionsObjects.total -
            taxesObjects.total -
            paymentsObjects.total;

        return {
            ...defaultPaymentObject,
            date: payslip.payslip_date,
            rate:
                toBePaid >= 0 ?
                    (
                        accrualsObjects.total -
                        reductionsObjects.total -
                        taxesObjects.total -
                        paymentsObjects.total
                    ).toFixed(2)
                :   "0.00",
            user_id: user.user_id,
        };
    }, [
        user.user_id,
        accrualsObjects.total,
        reductionsObjects.total,
        taxesObjects.total,
        paymentsObjects.total,
        payslip.payslip_date,
    ]);

    const handleAddPayment = useCallback(() => {
        setPaymentDialogIsOpen(true);
    }, []);

    /* 
    

    SELECT


    */

    const [selectionDialogIsOpen, setSelectionDialogIsOpen] = useState(false);
    const [selectionDialogType, setSelectionDialogType] =
        useState<EFONames>("accrual");

    const handleSelectClick = useCallback((type: EFONames) => {
        setSelectionDialogType(type);
        setSelectionDialogIsOpen(true);
    }, []);

    const selectObjects = useMemo(() => {
        function filterArrayForSelection<
            T extends (ApiAccrual | ApiSheet) | ApiReduction | ApiPayment,
        >(array: T[]) {
            const _type = getFinanceObjectType(array[0], true);

            return array.filter((obj) => {
                return Payslip.isInSelectionList(
                    payslipObjects,
                    obj,
                    _type || "accrual",
                );
            });
        }

        switch (selectionDialogType) {
            case "accrual":
                return filterArrayForSelection(accruals);
            case "reduction":
                return filterArrayForSelection(reductions);
            case "payment":
                return filterArrayForSelection(payments);
            default:
                return [];
        }
    }, [selectionDialogType, accruals, reductions, payments, payslipObjects]);

    const Totals = (
        <PayslipTotals
            accrualsTotal={accrualsObjects.total}
            taxesTotal={taxesObjects.total}
            reductionsTotal={reductionsObjects.total}
            paymentsTotal={paymentsObjects.total}
        />
    );

    return (
        <>
            {foDialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={foDialogIsOpen}
                    setDialogIsOpen={setFoDialogIsOpen}
                >
                    <FOFormLazy
                        initialObject={foFormInitialObject}
                        dispatch={payslipObjectsDispatch}
                        typeOfFoObject={FOFormObjectType}
                        setDialogIsOpen={setFoDialogIsOpen}
                    />
                </ModalPortal>
            )}
            {paymentDialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={paymentDialogIsOpen}
                    setDialogIsOpen={setPaymentDialogIsOpen}
                >
                    <PaymentsFormLazy
                        initialPayment={paymentInitialObject}
                        users={[user]}
                        type="add"
                        view="modal"
                        setDialogIsOpen={setPaymentDialogIsOpen}
                        options={{
                            user: "fixed",
                            date: "single",
                            payslip: false,
                        }}
                        payslipDispatch={payslipObjectsDispatch}
                    />
                </ModalPortal>
            )}
            {selectionDialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={selectionDialogIsOpen}
                    setDialogIsOpen={setSelectionDialogIsOpen}
                >
                    <SelectionModalLazy
                        setDialogIsOpen={setSelectionDialogIsOpen}
                        objects={selectObjects}
                        typeOfObject={selectionDialogType}
                        dispatch={payslipObjectsDispatch}
                    />
                </ModalPortal>
            )}

            <FormHandler
                actionType={actionType}
                object={payslip}
                setActionType={setActionType}
                view="page"
                actions={{
                    async deleteAction() {
                        return await deletePayslip(payslip.payslip_id);
                    },
                    async postAction() {
                        return await postPayslip(createSQLObject());
                    },
                    async putAction() {
                        return await putPayslip(createSQLObject());
                    },
                }}
                deleteDialogOptions={{
                    deleteDialogText: (
                        <>
                            {`Вы уверены, что хотите удалить этот расчетный лист?
                            Вычеты, налоги и взносы будут полностью удалены. 
                            Начисления, удержания и
                            выплаты станут снова активными и доступными для
                            добавления в другие расчетные листы.`}
                        </>
                    ),
                }}
                pathOptions={{
                    redirectOnAdd: true,
                }}
            >
                <div className={styles.main_div}>
                    <div className={styles.header_div}>
                        <PayslipFormHeader
                            isDisabled={isDisabled}
                            payslip={payslip}
                            setPayslip={setPayslip}
                            user={user}
                        />
                    </div>
                    <div className={styles.body_div}>
                        <PayslipMemoBody
                            accrualsClass={accrualsObjects}
                            reductionsClass={reductionsObjects}
                            paymentsClass={paymentsObjects}
                            taxes={taxesObjects}
                            taxDeductions={taxDeductionsObjects}
                            socialFees={socialFeesObjects}
                            isDisabled={isDisabled}
                            dispatch={payslipObjectsDispatch}
                            onAddFOClick={handleAddFOClick}
                            onAddPaymentClick={handleAddPayment}
                            onSelectClick={handleSelectClick}
                        />
                        <div className={styles.totals}>{Totals}</div>
                        <div className={styles.totals2}>{Totals}</div>
                    </div>
                </div>
            </FormHandler>
        </>
    );
}

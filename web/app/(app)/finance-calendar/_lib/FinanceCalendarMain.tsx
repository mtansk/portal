"use client";

import { ApiDept } from "@/app/types/depts/Depts";
import { EfoTotals } from "@/app/types/finance/other/Totals";
import { ApiUser } from "@/app/types/user/Users";
import { FinanceCalendarBody } from "./FinanceCalendarBody";
import { FinanceCalendarSearchParams } from "../page";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { FinanceCalendarHeader } from "./FinanceCalendarHeader";
import { useFormMainHandler } from "@/app/components/hooks/useFormMainHandler";
import { defaultAccrualObject } from "@/app/types/finance/accrual/Accruals";
import { defaultPaymentObject } from "@/app/types/finance/payments/Payments";
import { defaultReductionObject } from "@/app/types/finance/reductions/Reductions";
import useCalendarMain from "@/app/components/hooks/useCalendarMain";
import postAccrual from "@/app/server-actions/finance/accruals/postAccrual";
import postPayment from "@/app/server-actions/finance/payments/postPayment";
import postReduction from "@/app/server-actions/finance/reductions/postReduction";

import Payment, {
    PaymentConstructorObject,
} from "@/app/classes/finance/Payment";
import Reduction, {
    ReductionConstructorObject,
    SQLObject,
} from "@/app/classes/finance/Reduction";
import dynamic from "next/dynamic";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import { startTransition, useCallback, useMemo } from "react";
import { formatUTCDate } from "@/app/functions/dates";
import { IDBGeneralRate } from "@/app/types/general-rate/GeneralRates";
import { IDBAccrualGroup } from "@/app/types/accrual-group/AccrualGroups";
import FormLoading from "@/app/components/form/FormLoading";
import Accrual, {
    AccrualConstructorObject,
} from "@/app/classes/finance/Accrual";

import styles from "./css/container.module.scss";
import { ApiResponse } from "@/app/server-actions/functions/types";

function getIdAndDefObj(object: "accruals" | "payments" | "reductions"): {
    id: string;
    defObj:
        | AccrualConstructorObject
        | PaymentConstructorObject
        | ReductionConstructorObject;
    post:
        | ((object: SQLObject<Payment>) => Promise<ApiResponse<unknown>>)
        | ((object: SQLObject<Accrual>) => Promise<ApiResponse<unknown>>)
        | ((object: SQLObject<Reduction>) => Promise<ApiResponse<unknown>>);
} {
    if (object === "accruals") {
        return {
            id: "accrual_id",
            defObj: defaultAccrualObject,
            post: postAccrual,
        };
    } else if (object === "payments") {
        return {
            id: "payment_id",
            defObj: defaultPaymentObject,
            post: postPayment,
        };
    }
    return {
        id: "reduction_id",
        defObj: defaultReductionObject,
        post: postReduction,
    };
}

const AccrualFormLazy = dynamic(
    () => import("../../finance/accruals/_lib/form/AccrualsForm"),
    {
        loading: () => <FormLoading />,
    },
);

const ReductionsFormLazy = dynamic(
    () => import("../../finance/reductions/_lib/form/ReductionsForm"),
    {
        loading: () => <FormLoading />,
    },
);

const PaymentFormLazy = dynamic(
    () => import("../../finance/payments/_lib/form/PaymentsForm"),
    {
        loading: () => <FormLoading />,
    },
);

export default function FinanceCalendarMain({
    arrayOfTotals,

    depts,
    users,
    generalRates,
    accrualGroups,

    periodOptions,
    searchParams,
}: {
    arrayOfTotals: EfoTotals[];

    depts: ApiDept[];
    users: ApiUser[];
    generalRates: IDBGeneralRate[];
    accrualGroups: IDBAccrualGroup[];

    periodOptions: PeriodOptions;
    searchParams: FinanceCalendarSearchParams;
}) {
    const temp = useMemo(
        () => getIdAndDefObj(searchParams.object),
        [searchParams.object],
    );

    const {
        initialObject: initialObject,
        dialogIsOpen,
        handleObjectClick,
        setDialogIsOpen,
        type,
    } = useFormMainHandler([], temp.id, temp.defObj);

    const {
        after,
        disabledSaveButton,
        isAdding,
        isLoading,
        handleSaveClick,
        templateObject,
        setTemplateObject,
        setIsAdding,
    } = useCalendarMain<
        EfoTotals,
        Accrual | Payment | Reduction,
        SQLObject<Accrual | Payment | Reduction>
    >({
        arrayOfObjects: arrayOfTotals,
        postDBO: temp.post as (
            object: SQLObject<Accrual | Payment | Reduction>,
        ) => Promise<ApiResponse<unknown>>,
    });

    const filteredDepts = useMemo(() => {
        return searchParams.dept === "0" ?
                depts
            :   depts.filter(
                    (dept) => dept.department_id === searchParams.dept,
                );
    }, [depts, searchParams.dept]);

    const switchDateFn = useCallback(
        (day: Date, user: ApiUser) => {
            startTransition(() => {
                setTemplateObject((prev) => {
                    if (prev) {
                        const copy = prev.copy();
                        copy.idDateMap.switchDateInMap(
                            formatUTCDate(day),
                            user.user_id,
                        );
                        return copy;
                    }
                    return null;
                });
            });
        },
        [setTemplateObject],
    );

    return (
        <>
            {dialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    {searchParams.object === "accruals" && (
                        <AccrualFormLazy
                            initialAccrual={initialObject as Accrual}
                            setDialogIsOpen={setDialogIsOpen}
                            type={type}
                            after={after}
                            setTemplateAccrual={
                                setTemplateObject as (
                                    accrual: Accrual | null,
                                ) => void
                            }
                            templateAccrual={templateObject as Accrual | null}
                            view="modal"
                            users={users}
                            rates={generalRates}
                            accrualGroups={accrualGroups}
                            options={{
                                template: true,
                            }}
                        />
                    )}
                    {searchParams.object === "reductions" && (
                        <ReductionsFormLazy
                            initialReduction={initialObject as Reduction}
                            setDialogIsOpen={setDialogIsOpen}
                            type={type}
                            after={after}
                            setTemplateReduction={
                                setTemplateObject as (
                                    reduction: Reduction | null,
                                ) => void
                            }
                            templateReduction={
                                templateObject as Reduction | null
                            }
                            view="modal"
                            users={users}
                            options={{
                                template: true,
                            }}
                        />
                    )}
                    {searchParams.object === "payments" && (
                        <PaymentFormLazy
                            initialPayment={initialObject as Payment}
                            setDialogIsOpen={setDialogIsOpen}
                            type={type}
                            after={after}
                            setTemplatePayment={
                                setTemplateObject as (
                                    payment: Payment | null,
                                ) => void
                            }
                            templatePayment={templateObject as Payment | null}
                            view="modal"
                            users={users}
                            options={{
                                template: true,
                            }}
                        />
                    )}
                </ModalPortal>
            )}

            <div className={styles.calendar_container}>
                <FinanceCalendarHeader
                    periodOptions={periodOptions}
                    searchParams={searchParams}
                    depts={depts}
                    disabledSaveButton={disabledSaveButton}
                    isAdding={isAdding}
                    onSaveClick={handleSaveClick}
                    isLoading={isLoading}
                    setIsAdding={setIsAdding}
                    handleConfigureClick={handleObjectClick}
                    clickFn={after}
                />

                <FinanceCalendarBody
                    arrayOfTotals={arrayOfTotals}
                    depts={filteredDepts}
                    users={users}
                    periodOptions={periodOptions}
                    searchParams={searchParams}
                    isAdding={isAdding}
                    templateObject={templateObject}
                    isLoading={isLoading}
                    switchDateFn={switchDateFn}
                    navigationFn={after}
                />
            </div>
        </>
    );
}

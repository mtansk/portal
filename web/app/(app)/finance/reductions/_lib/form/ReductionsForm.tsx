"use client";

import Reduction, {
    ReductionConstructorObject,
} from "@/app/classes/finance/Reduction";
import FormHandler from "@/app/components/form/FormHandler";
import FormHeader from "@/app/components/form/header/FormHeader";
import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";
import { MultipleDateInputMemo } from "@/app/components/inputs/defaults/date-calendar-multiple-memo/MultipleDateInputMemo";
import { SingleDateInputMemo } from "@/app/components/inputs/defaults/date-calendar-single-memo/SingleDateInputMemo";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { QtyInput } from "@/app/components/inputs/defaults/qty/QtyInput";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import DummyInput from "@/app/components/inputs/DummyInput";
import deleteReduction from "@/app/server-actions/finance/reductions/deleteReduction";
import postReduction from "@/app/server-actions/finance/reductions/postReduction";
import putReduction from "@/app/server-actions/finance/reductions/putReduction";
import { ApiReduction } from "@/app/types/finance/reductions/Reductions";
import { ApiUser } from "@/app/types/user/Users";
import { useMemo, useCallback } from "react";
import { FinanceCurrencyStringNew } from "../../../_lib/other/FinanceCurrencyString";

import styles from "./css/reductions-form.module.scss";
import { ApiDebt } from "@/app/types/finance/debts/Debts";
import { ApiDept } from "@/app/types/depts/Depts";
import { ApiPayslip } from "@/app/types/finance/payslip/Payslips";
import { FormOptions } from "../../../accruals/_lib/form/AccrualsForm";
import { useIdDateMap } from "@/app/components/hooks/useIdDateMap";
import { FormPrettyUserBlock } from "@/app/components/inputs/defaults/pretty-user/FormPrettyUserBlock";
import { MultipleUserInputNew } from "@/app/components/inputs/defaults/user-multiple-new/MultipleUserInputNew";
import { PayslipInput } from "@/app/components/inputs/defaults/payslip-input/PayslipInput";
import { DebtInput } from "@/app/components/inputs/defaults/debt-input/DebtInput";
import FormBadges from "./FormBadges";
import { FormButtonsNotation } from "@/app/components/form/buttons/FormButtons";

export default function ReductionForm({
    initialReduction,

    users,
    depts,
    payslips,
    debts,

    type,
    view,

    setDialogIsOpen,

    templateReduction,
    setTemplateReduction,

    options,

    after,
}: {
    initialReduction: ApiReduction | ReductionConstructorObject;

    users: ApiUser[];
    depts?: ApiDept[];
    payslips?: ApiPayslip[];
    debts?: ApiDebt[];

    type: FormTypes;
    view: "page" | "modal";

    setDialogIsOpen?: (value: boolean) => void;

    templateReduction?: Reduction | null;
    setTemplateReduction?: (reduction: Reduction | null) => void;

    options?: FormOptions;

    after?: () => void;
}) {
    const {
        object: reduction,
        setObject: setReduction,
        actionType,
        setActionType,
        isDisabled,
    } = useFormHandler(
        initialReduction,
        type,
        useMemo(() => {
            return new Reduction(
                templateReduction ?? initialReduction,
                undefined,
            );
        }, [initialReduction, templateReduction]),
    );

    const newMap = useIdDateMap(reduction.user_id, reduction.date);

    function handleOnChange(
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) {
        const { name, value } = e.target;
        const copy = reduction.copy();
        copy.setterFn(name as keyof Reduction, value);
        setReduction(copy);
    }

    const handleSingleDateSelection = useCallback(
        (date: string[]) => {
            if (date.length === 0) return;
            newMap.setSingleDate(date[0]);
            setReduction((prev) => {
                const copy = prev.copy();
                copy.setterFn("date", date[0]);
                return copy;
            });
        },
        [setReduction, newMap],
    );

    const handleMultipleDateSelection = useCallback(
        (date: string[]) => {
            newMap.switchUserDate(date[0]);
        },
        [newMap],
    );

    const handlePayslipSelection = useCallback(
        (payslip_id: string | null) => {
            setReduction((prev) => {
                const copy = prev.copy();
                copy.payslip_id = payslip_id;
                return copy;
            });
        },
        [setReduction],
    );

    const handleDebtSelection = useCallback(
        (debt_id: string | null) => {
            setReduction((prev) => {
                const copy = prev.copy();
                copy.debt_id = debt_id;
                return copy;
            });
        },
        [setReduction],
    );

    const user = users.find((user) => user.user_id === reduction.user_id);

    const buttonsNotation: FormButtonsNotation | undefined =
        setTemplateReduction ?
            {
                right: [
                    {
                        style: "ne",
                        text: "Выйти",
                        onClick: () => {
                            setDialogIsOpen?.(false);
                        },
                    },
                    {
                        style: "g",
                        text: "Сохранить",
                        onClick: () => {
                            setTemplateReduction(reduction);
                            setDialogIsOpen?.(false);
                        },
                        disabledByForm: true,
                    },
                ],
            }
        :   undefined;

    return (
        <FormHandler
            object={{ ...reduction }}
            actionType={actionType}
            setActionType={setActionType}
            view={view}
            title="Удержание"
            actions={{
                async deleteAction() {
                    return await deleteReduction(reduction.reduction_id);
                },
                async postAction() {
                    return await postReduction({
                        ...reduction.createSQLObject(),
                        ids: newMap.toSQL(),
                    });
                },
                async putAction() {
                    return await putReduction(reduction.createSQLObject());
                },
            }}
            pathOptions={{
                detailsOnEdit: true,
                basePath: "/finance/reductions",
                id: reduction.reduction_id,
                redirectOnAdd: true,
            }}
            setDialogIsOpen={setDialogIsOpen}
            after={after}
            buttonsNotation={buttonsNotation}
        >
            <div className={styles.main_div}>
                {!options?.template && (
                    <div className={styles.left}>
                        <div className={styles.user}>
                            {options?.user === "fixed" ?
                                <FormPrettyUserBlock user={user} />
                            :   <MultipleUserInputNew
                                    users={users}
                                    depts={depts || []}
                                    selectedUsers={newMap.users}
                                    onSaveClick={newMap.setUsers}
                                    isDisabled={isDisabled}
                                />
                            }
                        </div>
                        <div className={styles.date}>
                            {options?.date === "multiple" ?
                                <MultipleDateInputMemo
                                    isDisabled={isDisabled}
                                    selectedDates={newMap.map.default}
                                    onChange={handleMultipleDateSelection}
                                />
                            :   <SingleDateInputMemo
                                    isDisabled={isDisabled}
                                    selectedDate={reduction.date}
                                    onChange={handleSingleDateSelection}
                                />
                            }
                        </div>
                    </div>
                )}
                <div className={styles.right}>
                    <div className={styles.main}>
                        <FormHeader
                            title="Основные"
                            className={styles.header}
                        />
                        <div className={styles.name_and_desc}>
                            <NameInput
                                isDisabled={isDisabled}
                                value={reduction.name}
                                onChange={handleOnChange}
                            />
                            {view === "page" && (
                                <DescInput
                                    isDisabled={isDisabled}
                                    value={reduction.desc}
                                    onChange={handleOnChange}
                                />
                            )}
                        </div>
                        <div className={styles.fin}>
                            <RateInput
                                isDisabled={isDisabled}
                                value={reduction.rate}
                                onChange={handleOnChange}
                            />
                            <QtyInput
                                isDisabled={isDisabled}
                                value={reduction.qty}
                                onChange={handleOnChange}
                            />
                            <div className={styles.total}>
                                <DummyInput
                                    value={
                                        (
                                            (reduction.total &&
                                                reduction.total <= 1000000) ||
                                            reduction.total === 0
                                        ) ?
                                            1
                                        :   ""
                                    }
                                />
                                <div className={styles.total_number}>
                                    <FinanceCurrencyStringNew
                                        total={reduction.total}
                                        type="reduction"
                                        archive={reduction.payslip_id !== null}
                                        colored={true}
                                    />
                                </div>
                            </div>
                            <div className={styles.note}>
                                Итог не должен превышать 1 миллион.
                            </div>
                        </div>
                    </div>
                    {options?.payslip && (
                        <>
                            <div className={styles.payslip}>
                                <FormHeader title="Расчетный лист" />
                                <PayslipInput
                                    payslips={payslips}
                                    selectedPayslip={reduction.payslip_id}
                                    onPayslipSelection={handlePayslipSelection}
                                    isDisabled={isDisabled}
                                />
                            </div>
                            <div className={styles.debt}>
                                <FormHeader title="Задолженность" />
                                <DebtInput
                                    debts={debts}
                                    selectedDebt={reduction.debt_id}
                                    onDebtSelecteion={handleDebtSelection}
                                    isDisabled={isDisabled}
                                />
                            </div>
                        </>
                    )}
                    {!options?.payslip && (
                        <div className={styles.badges}>
                            <FormBadges obj={reduction} />
                        </div>
                    )}
                </div>
            </div>
        </FormHandler>
    );
}

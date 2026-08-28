"use client";

import Payment, {
    PaymentConstructorObject,
} from "@/app/classes/finance/Payment";
import FormHandler from "@/app/components/form/FormHandler";
import FormHeader from "@/app/components/form/header/FormHeader";
import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import DummyInput from "@/app/components/inputs/DummyInput";
import deletePayment from "@/app/server-actions/finance/payments/deletePayment";
import postPayment from "@/app/server-actions/finance/payments/postPayment";
import putPayment from "@/app/server-actions/finance/payments/putPayment";
import { ApiUser } from "@/app/types/user/Users";
import { useMemo, useCallback } from "react";
import { FinanceCurrencyStringNew } from "../../../_lib/other/FinanceCurrencyString";
import { SingleDateInputMemo } from "../../../../../components/inputs/defaults/date-calendar-single-memo/SingleDateInputMemo";
import { MultipleDateInputMemo } from "../../../../../components/inputs/defaults/date-calendar-multiple-memo/MultipleDateInputMemo";

import styles from "./css/payments-form.module.scss";
import { FormButtonsNotation } from "@/app/components/form/buttons/FormButtons";
import { PayslipObjectsDispatch } from "../../../payslips/_lib/form/functions/payslipObjectsReducer";
import { FormOptions } from "../../../accruals/_lib/form/AccrualsForm";
import { useIdDateMap } from "@/app/components/hooks/useIdDateMap";
import { ApiDept } from "@/app/types/depts/Depts";
import { FormPrettyUserBlock } from "@/app/components/inputs/defaults/pretty-user/FormPrettyUserBlock";
import { MultipleUserInputNew } from "@/app/components/inputs/defaults/user-multiple-new/MultipleUserInputNew";
import { ApiPayment } from "@/app/types/finance/payments/Payments";
import { ApiPayslip } from "@/app/types/finance/payslip/Payslips";
import { PayslipInput } from "@/app/components/inputs/defaults/payslip-input/PayslipInput";
import FormBadges from "../../../reductions/_lib/form/FormBadges";

export default function PaymentForm({
    initialPayment,

    users,
    depts,
    payslips,

    type,
    view,

    setDialogIsOpen,

    templatePayment,
    setTemplatePayment,

    options,
    buttonsNotation,
    payslipDispatch,

    after,
}: {
    initialPayment: PaymentConstructorObject | ApiPayment;

    users: ApiUser[];
    depts?: ApiDept[];
    payslips?: ApiPayslip[];

    type: FormTypes;
    view: "page" | "modal";

    setDialogIsOpen?: (value: boolean) => void;

    templatePayment?: Payment | null;
    setTemplatePayment?: (payment: Payment | null) => void;
    payslipDispatch?: (o: PayslipObjectsDispatch) => void;

    options?: FormOptions;
    buttonsNotation?: FormButtonsNotation;

    after?: () => void;
}) {
    const {
        object: payment,
        setObject: setPayment,
        actionType,
        setActionType,
        isDisabled,
    } = useFormHandler(
        initialPayment,
        type,
        useMemo(() => {
            return new Payment(templatePayment ?? initialPayment, undefined);
        }, [initialPayment, templatePayment]),
    );

    const newMap = useIdDateMap(payment.user_id, payment.date);

    function handleOnChange(
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) {
        const { name, value } = e.target;
        const copy = payment.copy();
        copy.setterFn(name as keyof Payment, value);
        setPayment(copy);
    }

    const handleSingleDateSelection = useCallback(
        (date: string[]) => {
            if (date.length === 0) return;
            newMap.setSingleDate(date[0]);
            setPayment((prev) => {
                const copy = prev.copy();
                copy.setterFn("date", date[0]);
                return copy;
            });
        },
        [setPayment, newMap],
    );

    const handleMultipleDateSelection = useCallback(
        (date: string[]) => {
            newMap.switchUserDate(date[0]);
        },
        [newMap],
    );

    const handlePayslipSelection = useCallback(
        (payslip_id: string | null) => {
            setPayment((prev) => {
                const copy = prev.copy();
                copy.payslip_id = payslip_id;
                return copy;
            });
        },
        [setPayment],
    );

    const user = users.find((user) => user.user_id === payment.user_id);

    function getButtonsNotation(): FormButtonsNotation | undefined {
        if (payslipDispatch) {
            return {
                right: [
                    {
                        text: "Выйти",
                        style: "ne",
                        onClick() {
                            setDialogIsOpen?.(false);
                        },
                    },
                    {
                        text: "Сохранить",
                        style: "g",
                        disabledByForm: true,
                        onClick() {
                            const obj = {
                                ...payment.createSQLObject(),
                                ids: newMap.toSQL(),
                            };
                            payslipDispatch?.({
                                type: "ADD_OBJECT",
                                payload: {
                                    objectType: "payment",
                                    object: obj,
                                },
                            });
                            setDialogIsOpen?.(false);
                        },
                    },
                ],
            };
        }

        if (setTemplatePayment) {
            return {
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
                            setTemplatePayment(payment);
                            setDialogIsOpen?.(false);
                        },
                        disabledByForm: true,
                    },
                ],
            };
        }

        if (buttonsNotation) {
            return buttonsNotation;
        }

        return undefined;
    }

    return (
        <FormHandler
            object={{ ...payment }}
            actionType={actionType}
            setActionType={setActionType}
            view={view}
            title="Выплата"
            actions={{
                async deleteAction() {
                    return await deletePayment(payment.payment_id);
                },
                async postAction() {
                    return await postPayment({
                        ...payment.createSQLObject(),
                        ids: newMap.toSQL(),
                    });
                },
                async putAction() {
                    return await putPayment(payment.createSQLObject());
                },
            }}
            buttonsNotation={getButtonsNotation()}
            pathOptions={{
                detailsOnEdit: true,
                basePath: "/finance/payments",
                id: payment.payment_id,
                redirectOnAdd: true,
            }}
            setDialogIsOpen={setDialogIsOpen}
            after={after}
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
                                    selectedDate={payment.date}
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
                                value={payment.name}
                                onChange={handleOnChange}
                            />
                            {view === "page" && (
                                <DescInput
                                    isDisabled={isDisabled}
                                    value={payment.desc}
                                    onChange={handleOnChange}
                                />
                            )}
                        </div>
                        <div className={styles.fin}>
                            <RateInput
                                isDisabled={isDisabled}
                                value={payment.rate}
                                onChange={handleOnChange}
                                label="Сумма, руб."
                                step={0.01}
                            />
                            <div className={styles.total}>
                                <DummyInput
                                    value={
                                        (
                                            (payment.total &&
                                                payment.total <= 1000000) ||
                                            payment.total === 0
                                        ) ?
                                            1
                                        :   ""
                                    }
                                />
                                <div className={styles.total_number}>
                                    <FinanceCurrencyStringNew
                                        total={payment.total}
                                        type="payment"
                                        archive={payment.payslip_id !== null}
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
                        <div className={styles.payslip}>
                            <FormHeader title="Расчетный лист" />
                            <PayslipInput
                                payslips={payslips}
                                selectedPayslip={payment.payslip_id}
                                onPayslipSelection={handlePayslipSelection}
                                isDisabled={isDisabled}
                            />
                        </div>
                    )}
                    {!options?.payslip && (
                        <div className={styles.badges}>
                            <FormBadges obj={payment} />
                        </div>
                    )}
                </div>
            </div>
        </FormHandler>
    );
}

"use client";

import { IDBDebt } from "@/app/types/finance/debts/Debts";
import { ApiUser } from "@/app/types/user/Users";

import styles from "./css/debt-form.module.scss";
import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";
import FormHandler from "@/app/components/form/FormHandler";
import CustomDateInput from "@/app/components/inputs/date/CustomDateInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import React, { memo, useMemo } from "react";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import { parseFloatAny } from "@/app/functions/other";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import { ApiReduction } from "@/app/types/finance/reductions/Reductions";
import { PayslipObjectsContainer } from "../../../payslips/_lib/form/form-body/PayslipObjectsContainer";
import { calculateFOArrayTotal } from "../../../_lib/functions";
import { Formatter } from "@/app/classes/Formatter";
import { ArrayWithTotal } from "@/app/types/finance/other/FinanceTypes";
import putDebt from "@/app/server-actions/finance/debts/putDebt";
import postDebt from "@/app/server-actions/finance/debts/postDebt";
import { SingleUserInputNew } from "@/app/components/inputs/defaults/user-single-new/SingleUserInputNew";
import { ApiDept } from "@/app/types/depts/Depts";
import deleteDebt from "@/app/server-actions/finance/debts/deleteDebt";

type FormDebt = IDBDebt;

export default function DebtForm({
    initialDebt,
    users,
    depts,
    reductions,

    type,
}: {
    initialDebt: FormDebt;
    users: ApiUser[];
    depts: ApiDept[];
    reductions: ApiReduction[];

    type: FormTypes;
}) {
    const {
        object: debt,
        setObject: setDebt,
        actionType,
        setActionType,
        isDisabled,
    } = useFormHandler(initialDebt, type);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        const { name, value } = e.target;
        setDebt({
            ...debt,
            [name]: value,
        });
    }

    const reductionsObject = useMemo(
        () => ({
            array: reductions,
            total: calculateFOArrayTotal(reductions),
        }),
        [reductions],
    );

    const left =
        debt.is_settled === 1 ?
            0
        :   parseFloatAny(debt.debt_total) - reductionsObject.total;

    return (
        <FormHandler
            actionType={actionType}
            object={debt}
            setActionType={setActionType}
            view="page"
            actions={{
                putAction: () => putDebt(debt),
                postAction: () => postDebt(debt),
                deleteAction: () => deleteDebt(debt),
            }}
            pathOptions={{
                redirectOnAdd: true,
            }}
        >
            <div className={styles.main_div}>
                <div className={styles.left_div}>
                    <SingleUserInputNew
                        depts={depts}
                        users={users}
                        isDisabled={isDisabled}
                        selectedUsers={[debt.user_id]}
                        onSaveClick={(users: string[]) => {
                            setDebt({
                                ...debt,
                                user_id: users[0],
                            });
                        }}
                    />
                    <InputWrapper
                        isDisabled={isDisabled}
                        label="Дата"
                        required={true}
                        headerLike={true}
                    >
                        <CustomDateInput
                            initialDate={debt.debt_date}
                            isDisabled={isDisabled}
                            onDateChange={(date: string) => {
                                setDebt({
                                    ...debt,
                                    debt_date: date,
                                });
                            }}
                        />
                    </InputWrapper>
                    <NameInput
                        isDisabled={isDisabled}
                        value={debt.debt_name}
                        onChange={handleChange}
                        name="debt_name"
                    />
                    <DescInput
                        isDisabled={isDisabled}
                        value={debt.debt_desc}
                        onChange={handleChange}
                        name="debt_desc"
                    />
                </div>
                <div className={styles.middle_div}>
                    <RateInput
                        isDisabled={isDisabled}
                        value={debt.debt_total}
                        onChange={handleChange}
                        label="Сумма долга, руб."
                        name="debt_total"
                        max={10_000_000}
                        step={0.01}
                    />
                    <CustomCheckbox
                        isDisabled={isDisabled}
                        value={debt.is_settled === 1}
                        onChange={(value) => {
                            setDebt({
                                ...debt,
                                is_settled: value ? 1 : 0,
                            });
                        }}
                        text="Задолженность погашена"
                        className={styles.checkbox}
                    />
                    <InputWrapper
                        isDisabled={true}
                        label="К погашению, руб."
                    >
                        <div className={styles.to_be_paid}>
                            {Formatter.currencyString({
                                value: left < 0 ? 0 : left,
                                signDisplay: "never",
                            })}
                        </div>
                    </InputWrapper>
                </div>
                <div className={styles.reductions_div}>
                    <ReductionsMemo reductionsObject={reductionsObject} />
                    <div className={styles.note}>
                        {type === "edit" ?
                            'Отредактировать удержания вы можете в разделе "Удержания".'
                        :   "Вы сможете добавить удержания после создания задолженности. Каждое удержание добавляется отдельно."
                        }
                    </div>
                </div>
            </div>
        </FormHandler>
    );
}

const ReductionsMemo = memo(function _({
    reductionsObject,
}: {
    reductionsObject: ArrayWithTotal<ApiReduction>;
}) {
    const fn = () => {};
    return (
        <PayslipObjectsContainer
            isDisabled={true}
            objects={reductionsObject}
            onSelectClick={fn}
            type="reduction"
            dispatch={fn}
        />
    );
});

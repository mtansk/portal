"use client";

import { ApiMyDebt } from "@/app/types/finance/debts/Debts";

import styles from "./css/debt-form.module.scss";
import CustomDateInput from "@/app/components/inputs/date/CustomDateInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import React, { memo, useCallback, useState } from "react";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import { parseFloatAny } from "@/app/functions/other";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import {
    ApiMyReduction,
    ApiReduction,
} from "@/app/types/finance/reductions/Reductions";
import { Formatter } from "@/app/classes/Formatter";
import MyFormHandler from "@/app/components/form/MyFormHandler";
import { FormPrettyUserBlock } from "@/app/components/inputs/defaults/pretty-user/FormPrettyUserBlock";
import { MyPayslipObjectGroup } from "../../../payslips/_lib/form/form-body/MyPayslipObjectGroup";
import FormLoading from "@/app/components/form/FormLoading";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import { isMyApiReduction } from "@/app/types/guards/guards";
import dynamic from "next/dynamic";
import { type } from "os";
import { calculateFOArrayTotal } from "@/app/(app)/finance/_lib/functions";

const LazyReduction = dynamic(
    () => import("./../../../overview/_lib/form/MyReductionForm"),
    { loading: () => <FormLoading /> },
);

export default function DebtForm({
    debt,
    reductions,
}: {
    debt: ApiMyDebt;
    reductions: ApiReduction[];
}) {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [id, setId] = useState<string | null>(null);

    const dialogReduction = reductions.find((r) => r.id === id);
    const reductionsTotal = calculateFOArrayTotal(reductions);
    const left =
        debt.is_settled === 1 ?
            0
        :   parseFloatAny(debt.debt_total) - reductionsTotal;

    const handleReductionClick = useCallback((id: string) => {
        setId(id);
        setDialogIsOpen(true);
    }, []);

    return (
        <>
            {dialogIsOpen && dialogReduction && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    <LazyReduction
                        initialReduction={dialogReduction}
                        view="modal"
                        setDialogIsOpen={setDialogIsOpen}
                    />
                </ModalPortal>
            )}
            <MyFormHandler view="page">
                <div className={styles.main_div}>
                    <div className={styles.left_div}>
                        <FormPrettyUserBlock user={undefined} />
                        <InputWrapper
                            isDisabled={true}
                            label="Дата"
                            required={true}
                            headerLike={true}
                        >
                            <CustomDateInput
                                initialDate={debt.debt_date}
                                isDisabled={true}
                                onDateChange={() => {}}
                            />
                        </InputWrapper>
                        <NameInput
                            isDisabled={true}
                            value={debt.debt_name}
                            onChange={() => {}}
                            name="debt_name"
                        />
                        <DescInput
                            isDisabled={true}
                            value={debt.debt_desc}
                            onChange={() => {}}
                            name="debt_desc"
                        />
                    </div>
                    <div className={styles.middle_div}>
                        <RateInput
                            isDisabled={true}
                            value={debt.debt_total}
                            onChange={() => {}}
                            label="Сумма долга, руб."
                            name="debt_total"
                            max={10_000_000}
                            step={0.01}
                        />
                        <CustomCheckbox
                            isDisabled={true}
                            value={debt.is_settled === 1}
                            onChange={() => {}}
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
                        <ReductionsMemo
                            reductions={reductions}
                            handleReductionClick={handleReductionClick}
                        />
                    </div>
                </div>
            </MyFormHandler>
        </>
    );
}

const ReductionsMemo = memo(function _({
    reductions,
    handleReductionClick,
}: {
    reductions: ApiMyReduction[];
    handleReductionClick: (id: string) => void;
}) {
    const fn = () => {};
    return (
        <MyPayslipObjectGroup
            arrayOfObjects={reductions}
            typeOfObject="reduction"
            handleObjectClick={handleReductionClick}
        />
    );
});

"use client";

import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import Accrual from "@/app/classes/finance/Accrual";
import FormHeader from "@/app/components/form/header/FormHeader";
import MyFormHandler from "@/app/components/form/MyFormHandler";
import { useFormHandler } from "@/app/components/hooks/useFormHandler";
import { SingleDateInputMemo } from "@/app/components/inputs/defaults/date-calendar-single-memo/SingleDateInputMemo";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { FormPrettyUserBlock } from "@/app/components/inputs/defaults/pretty-user/FormPrettyUserBlock";
import { QtyInput } from "@/app/components/inputs/defaults/qty/QtyInput";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import FormTimeInput from "@/app/components/inputs/time/FormTimeInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { timeFromSeconds } from "@/app/functions/dates";
import { parseFloatAny } from "@/app/functions/other";
import { ApiMyAccrual } from "@/app/types/finance/accrual/Accruals";
import { useMemo } from "react";
import styles from "./css/accruals-form.module.scss";
import MyFormBadges from "@/app/(app)/finance/reductions/_lib/form/MyFormBadges";
import MyDesc from "./MyDesc";

export default function MyAccrualForm({
    initialAccrual,
    view,
    setDialogIsOpen,
}: {
    initialAccrual: ApiMyAccrual;
    view: "page" | "modal";
    setDialogIsOpen?: (value: boolean) => void;
}) {
    if (initialAccrual.accrual_group_id === null) {
        initialAccrual.accrual_group_id = "0";
    }

    const { object: accrual, isDisabled } = useFormHandler(
        initialAccrual,
        "edit",
        useMemo(() => {
            return new Accrual(
                {
                    ...initialAccrual,
                    accrual_group_id: initialAccrual.accrual_group_id || "0",
                },
                undefined,
            );
        }, [initialAccrual]),
    );

    return (
        <MyFormHandler
            view={view}
            title="Начисление"
            setDialogIsOpen={setDialogIsOpen}
        >
            <div className={styles.main_div}>
                <div className={styles.left}>
                    <div className={styles.user}>
                        <FormPrettyUserBlock user={undefined} />
                    </div>
                    <div className={styles.date}>
                        <SingleDateInputMemo
                            isDisabled={isDisabled}
                            selectedDate={accrual.date}
                            onChange={() => {}}
                        />
                    </div>
                </div>

                <div className={styles.right}>
                    <div className={styles.group}>
                        <InputWrapper
                            isDisabled={isDisabled}
                            label="Группа начислений"
                            headerLike={true}
                        >
                            {initialAccrual.accrual_group_name}
                        </InputWrapper>
                    </div>
                    <div className={styles.time}>
                        <InputWrapper
                            label="Время"
                            headerLike={true}
                            isDisabled={isDisabled}
                            required={false}
                        >
                            <FormTimeInput
                                disabled={isDisabled}
                                name={"accrual_time"}
                                value={
                                    accrual.accrual_time !== null ?
                                        timeFromSeconds(accrual.accrual_time)
                                    :   ""
                                }
                                handleTimeInputChange={() => {}}
                            />
                        </InputWrapper>
                    </div>
                    <div className={styles.main}>
                        <FormHeader
                            title="Основные"
                            className={styles.header}
                        />
                        <div className={styles.name_and_desc}>
                            <NameInput
                                isDisabled={isDisabled}
                                value={accrual.name}
                                onChange={() => {}}
                            />

                            {accrual.desc && <MyDesc value={accrual.desc} />}
                        </div>
                        <div className={styles.fin}>
                            <RateInput
                                isDisabled={isDisabled}
                                value={accrual.rate}
                                onChange={() => {}}
                            />
                            <QtyInput
                                isDisabled={isDisabled}
                                value={accrual.qty}
                                onChange={() => {}}
                            />
                            <div className={styles.total}>
                                <div className={styles.total_number}>
                                    <FinanceCurrencyStringNew
                                        total={parseFloatAny(accrual.total, 2)}
                                        archive={accrual.payslip_id !== null}
                                        colored={true}
                                        type="accrual"
                                    />
                                </div>
                            </div>
                            <div className={styles.note}>
                                Итог не должен превышать 1 миллион.
                            </div>
                        </div>
                    </div>
                    <div className={styles.badges}>
                        <MyFormBadges obj={accrual} />
                    </div>
                </div>
            </div>
        </MyFormHandler>
    );
}

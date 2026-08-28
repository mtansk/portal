"use client";

import Reduction from "@/app/classes/finance/Reduction";
import FormHeader from "@/app/components/form/header/FormHeader";
import { useFormHandler } from "@/app/components/hooks/useFormHandler";
import { SingleDateInputMemo } from "@/app/components/inputs/defaults/date-calendar-single-memo/SingleDateInputMemo";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { QtyInput } from "@/app/components/inputs/defaults/qty/QtyInput";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import { ApiMyReduction } from "@/app/types/finance/reductions/Reductions";
import { useMemo } from "react";

import styles from "./css/reductions-form.module.scss";
import { FormPrettyUserBlock } from "@/app/components/inputs/defaults/pretty-user/FormPrettyUserBlock";
import MyFormBadges from "@/app/(app)/finance/reductions/_lib/form/MyFormBadges";
import MyFormHandler from "@/app/components/form/MyFormHandler";
import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import MyDesc from "./MyDesc";

export default function MyReductionForm({
    initialReduction,
    view,
    setDialogIsOpen,
}: {
    initialReduction: ApiMyReduction;
    view: "page" | "modal";
    setDialogIsOpen?: (value: boolean) => void;
}) {
    const { object: reduction, isDisabled } = useFormHandler(
        initialReduction,

        "edit",
        useMemo(() => {
            return new Reduction(initialReduction, undefined);
        }, [initialReduction]),
    );

    return (
        <MyFormHandler
            view={view}
            title="Удержание"
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
                            selectedDate={reduction.date}
                            onChange={() => {}}
                        />
                    </div>
                </div>

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
                                onChange={() => {}}
                            />
                            {reduction.desc && (
                                <MyDesc value={reduction.desc} />
                            )}
                        </div>
                        <div className={styles.fin}>
                            <RateInput
                                isDisabled={isDisabled}
                                value={reduction.rate}
                                onChange={() => {}}
                            />
                            <QtyInput
                                isDisabled={isDisabled}
                                value={reduction.qty}
                                onChange={() => {}}
                            />
                            <div className={styles.total}>
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
                    <div className={styles.badges}>
                        <MyFormBadges obj={reduction} />
                    </div>
                </div>
            </div>
        </MyFormHandler>
    );
}

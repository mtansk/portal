"use client";

import { ApiMyPayment } from "@/app/types/finance/payments/Payments";
import styles from "./css/payments-form.module.scss";
import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import MyFormBadges from "@/app/(app)/finance/reductions/_lib/form/MyFormBadges";
import Payment from "@/app/classes/finance/Payment";
import FormHeader from "@/app/components/form/header/FormHeader";
import MyFormHandler from "@/app/components/form/MyFormHandler";
import { useFormHandler } from "@/app/components/hooks/useFormHandler";
import { SingleDateInputMemo } from "@/app/components/inputs/defaults/date-calendar-single-memo/SingleDateInputMemo";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { FormPrettyUserBlock } from "@/app/components/inputs/defaults/pretty-user/FormPrettyUserBlock";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import { useMemo } from "react";
import MyDesc from "./MyDesc";

export default function MyPaymentForm({
    initialPayment,
    view,

    setDialogIsOpen,
}: {
    initialPayment: ApiMyPayment;
    view: "page" | "modal";
    setDialogIsOpen?: (value: boolean) => void;
}) {
    const { object: payment, isDisabled } = useFormHandler(
        initialPayment,
        "edit",
        useMemo(() => {
            return new Payment(initialPayment, undefined);
        }, [initialPayment]),
    );

    return (
        <MyFormHandler
            view={view}
            title="Выплата"
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
                            selectedDate={payment.date}
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
                                value={payment.name}
                                onChange={() => {}}
                            />
                            {payment.desc && <MyDesc value={payment.desc} />}
                        </div>
                        <div className={styles.fin}>
                            <RateInput
                                isDisabled={isDisabled}
                                value={payment.rate}
                                onChange={() => {}}
                                label="Сумма, руб."
                                step={0.01}
                            />
                            <div className={styles.total}>
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
                    <div className={styles.badges}>
                        <MyFormBadges obj={payment} />
                    </div>
                </div>
            </div>
        </MyFormHandler>
    );
}

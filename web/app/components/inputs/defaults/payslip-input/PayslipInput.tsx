"use client";

import { Formatter } from "@/app/classes/Formatter";
import useBackURL from "@/app/components/hooks/useBackURL";
import { ApiPayslip } from "@/app/types/finance/payslip/Payslips";
import { UTCDateMini } from "@date-fns/utc";
import { useState } from "react";
import FormPayslipSelectModal from "./FormPayslipSelectModal";
import styles from "./payslip-input.module.scss";
import AwayLink from "@/app/components/link/AwayLink";

export function PayslipInput({
    payslips,
    selectedPayslip,

    onPayslipSelection,

    isDisabled,
}: {
    payslips?: ApiPayslip[];

    selectedPayslip: string | null;
    onPayslipSelection: (value: string | null) => void;

    isDisabled: boolean;
}) {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const payslip = payslips?.find((p) => p.payslip_id === selectedPayslip);

    return (
        <>
            {dialogIsOpen && (
                <FormPayslipSelectModal
                    payslips={payslips || []}
                    selectedPayslip={selectedPayslip}
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                    onPayslipSelection={onPayslipSelection}
                />
            )}
            <div className={styles.payslip_input}>
                <div className={styles.payslip_main}>
                    {payslip ?
                        <div className={styles.payslip_div}>
                            <div className={styles.name}>
                                {payslip.payslip_name}
                            </div>
                            <div className={styles.period}>
                                {`${Formatter.date(
                                    new UTCDateMini(payslip.payslip_st_date),
                                    "shortRu",
                                )} - ${Formatter.date(
                                    new UTCDateMini(payslip.payslip_en_date),
                                    "shortRu",
                                )}`}
                            </div>
                            <div className={styles.date}>
                                {Formatter.date(
                                    new UTCDateMini(payslip.payslip_date),
                                    "shortRu",
                                )}
                            </div>
                        </div>
                    :   "Не включено в расчетный лист."}
                </div>

                <div className={styles.payslip_bottom}>
                    {!isDisabled && (
                        <button
                            className={styles.payslip_button}
                            onClick={() => setDialogIsOpen(true)}
                            type="button"
                            disabled={isDisabled}
                        >
                            Изменить
                        </button>
                    )}
                    {payslip?.payslip_id && (
                        <PayslipLink id={payslip?.payslip_id || ""} />
                    )}
                </div>
            </div>
        </>
    );
}

function PayslipLink({ id }: { id: string }) {
    const backurl = useBackURL();
    const href = `/finance/payslips/${id}?backurl=${backurl}`;

    return (
        <AwayLink
            href={href}
            title="Перейти к РЛ"
        />
    );
}

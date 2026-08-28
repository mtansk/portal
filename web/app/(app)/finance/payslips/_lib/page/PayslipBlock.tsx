import { ApiPayslip } from "@/app/types/finance/payslip/Payslips";

import styles from "./css/block.module.scss";
import { UTCDateMini } from "@date-fns/utc";
import { FinanceCurrencyStringNew } from "../../../_lib/other/FinanceCurrencyString";
import { Formatter } from "@/app/classes/Formatter";
import { Link } from "react-transition-progress/next";
import { Suspense } from "react";
import useBackURL from "@/app/components/hooks/useBackURL";

export default function PayslipBlock({ payslip }: { payslip: ApiPayslip }) {
    const backurl = useBackURL();

    function dateFormat(date: string) {
        const _d = new UTCDateMini(date);
        return Intl.DateTimeFormat("ru-RU", {
            day: "numeric",
            month: "short",
            timeZone: "UTC",
        }).format(_d);
    }

    return (
        <>
            <Link
                href={`/finance/payslips/${payslip.payslip_id}?backurl=${backurl}`}
            >
                <div className={styles.payslip_block}>
                    <div className={styles.group}>
                        {`${dateFormat(
                            payslip.payslip_st_date,
                        )} - ${dateFormat(payslip.payslip_en_date)}
                        `}
                    </div>
                    <div className={styles.name}>{payslip.payslip_name}</div>
                    <div className={styles.date}>
                        {dateFormat(payslip.payslip_date)}
                    </div>
                    <div className={styles.details}>
                        <FinanceCurrencyStringNew
                            total={payslip.payments_total}
                            type="payment"
                        />
                        {" из"}
                    </div>
                    <div className={styles.total}>
                        {Formatter.currencyString({
                            value: payslip.total,
                            signDisplay: "never",
                            prettyMinus: true,
                        })}
                    </div>
                </div>
            </Link>
            <div className={styles.stripe}></div>
        </>
    );
}

export function PayslipBlockWrapper({ payslip }: { payslip: ApiPayslip }) {
    return (
        <Suspense>
            <PayslipBlock payslip={payslip} />
        </Suspense>
    );
}

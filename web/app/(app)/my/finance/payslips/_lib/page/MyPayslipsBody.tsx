import styles from "./css/body.module.scss";
import { memo } from "react";
import { ApiMyPayslip } from "@/app/types/finance/payslip/Payslips";
import { dateStringToUTCDate } from "@/app/functions/dates";
import { UTCDateMini } from "@date-fns/utc";
import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import { Formatter } from "@/app/classes/Formatter";
import { Link } from "react-transition-progress/next";

const MyPayslipsBody = memo(function MyPayslipsBody({
    payslips,
}: {
    payslips: ApiMyPayslip[];
}) {
    const dates = new Set(payslips.map((payslip) => payslip.payslip_date));

    return (
        <div className={styles.body}>
            <div className={styles.main_div}>
                {Array.from(dates).map((date) => {
                    const payslipsByDate = payslips.filter(
                        (payslip) => payslip.payslip_date === date,
                    );

                    return (
                        <div
                            className={styles.date_div}
                            key={date}
                        >
                            <div className={styles.date}>
                                {Intl.DateTimeFormat("ru-RU", {
                                    day: "2-digit",
                                    month: "short",
                                    weekday: "short",
                                    timeZone: "UTC",
                                }).format(dateStringToUTCDate(date))}
                            </div>
                            <div className={styles.payslips}>
                                {payslipsByDate.map((payslip) => {
                                    return (
                                        <Link
                                            href={`/my/finance/payslips/${
                                                payslip.payslip_id
                                            }?backurl=${encodeURIComponent("/my/finance/payslips")}`}
                                            key={payslip.payslip_id}
                                        >
                                            <div className={styles.payslip_div}>
                                                <div
                                                    className={styles.period}
                                                >{`${dateFormat(
                                                    payslip.payslip_st_date,
                                                )} - ${dateFormat(payslip.payslip_en_date)}
                                            `}</div>
                                                <div className={styles.name}>
                                                    {payslip.payslip_name}
                                                </div>
                                                <div className={styles.details}>
                                                    <FinanceCurrencyStringNew
                                                        total={
                                                            payslip.payments_total
                                                        }
                                                        type="payment"
                                                        colored={true}
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
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                {payslips.length === 0 && (
                    <div className={styles.no_payslips}>Ничего не найдено.</div>
                )}
            </div>
        </div>
    );
});

export default MyPayslipsBody;

function dateFormat(date: string) {
    const _d = new UTCDateMini(date);
    return Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
    }).format(_d);
}

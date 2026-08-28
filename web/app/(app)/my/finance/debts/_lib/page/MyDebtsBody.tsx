import styles from "./css/body.module.scss";
import { memo } from "react";
import { dateStringToUTCDate } from "@/app/functions/dates";
import { UTCDateMini } from "@date-fns/utc";
import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import { Formatter } from "@/app/classes/Formatter";
import { Link } from "react-transition-progress/next";
import { ApiMyDebt } from "@/app/types/finance/debts/Debts";

const MyDebtsBody = memo(function MyDebtsBody({
    debts,
}: {
    debts: ApiMyDebt[];
}) {
    const dates = new Set(debts.map((debt) => debt.debt_date));

    return (
        <div className={styles.body}>
            <div className={styles.main_div}>
                {Array.from(dates).map((date) => {
                    const debtsByDate = debts.filter(
                        (debt) => debt.debt_date === date,
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
                            <div className={styles.debts}>
                                {debtsByDate.map((debt) => {
                                    return (
                                        <Link
                                            href={`/my/finance/debts/${
                                                debt.debt_id
                                            }?backurl=${encodeURIComponent("/my/finance/debts")}`}
                                            key={debt.debt_id}
                                        >
                                            <div className={styles.debt_div}>
                                                <div className={styles.period}>
                                                    {debt.is_settled ?
                                                        "Погашенная задолженность"
                                                    :   "Задолженность"}
                                                </div>
                                                <div className={styles.name}>
                                                    {debt.debt_name}
                                                </div>
                                                <div className={styles.details}>
                                                    <FinanceCurrencyStringNew
                                                        total={
                                                            debt.reductions_total
                                                        }
                                                        type="reduction"
                                                        colored={true}
                                                    />
                                                    {" из"}
                                                </div>
                                                <div className={styles.total}>
                                                    {Formatter.currencyString({
                                                        value: debt.debt_total,
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
                {debts.length === 0 && (
                    <div className={styles.no_payslips}>Ничего не найдено.</div>
                )}
            </div>
        </div>
    );
});

export default MyDebtsBody;

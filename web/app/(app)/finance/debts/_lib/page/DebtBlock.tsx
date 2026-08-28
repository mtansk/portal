import styles from "./css/block.module.scss";
import { Formatter } from "@/app/classes/Formatter";
import { Link } from "react-transition-progress/next";
import { Suspense } from "react";
import useBackURL from "@/app/components/hooks/useBackURL";
import { parseFloatAny } from "@/app/functions/other";
import { ApiDebt } from "@/app/types/finance/debts/Debts";
import { dateStringToUTCDate } from "@/app/functions/dates";

export default function DebtBlock({ debt }: { debt: ApiDebt }) {
    const backurl = useBackURL();

    return (
        <>
            <Link href={`/finance/debts/${debt.debt_id}?backurl=${backurl}`}>
                <div className={styles.debt_block}>
                    <div className={styles.group}>
                        {debt.is_settled ?
                            "Погашенная задолженность"
                        :   "Задолженность"}
                    </div>
                    <div className={styles.name}>{debt.debt_name}</div>
                    <div className={styles.date}>
                        {Intl.DateTimeFormat("ru-RU", {
                            day: "numeric",
                            month: "short",
                            timeZone: "UTC",
                        }).format(dateStringToUTCDate(debt.debt_date))}
                    </div>
                    <div className={styles.details}>
                        <div className={styles.colored}>
                            {Formatter.currencyString({
                                value:
                                    parseFloatAny(debt.reductions_total) * -1,
                                signDisplay: "always",
                            })}
                        </div>

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
            <div className={styles.stripe}></div>
        </>
    );
}

export function DebtBlockWrapper({ debt }: { debt: ApiDebt }) {
    return (
        <Suspense>
            <DebtBlock debt={debt} />
        </Suspense>
    );
}

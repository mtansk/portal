import { Formatter } from "@/app/classes/Formatter";

import styles from "./css/currency-string.module.scss";
import { AllFoNames } from "@/app/types/finance/other/FinanceTypes";

export function FinanceCurrencyStringNew({
    total,
    type,
    archive = false,
    colored = false,
}: {
    total: number | string;
    type?: AllFoNames | undefined;
    archive?: boolean;
    colored?: boolean;
}) {
    function getString() {
        if (type === "sheet" || type === "accrual" || type === undefined) {
            return Formatter.currencyString({
                value: total,
                signDisplay: "exceptZero",
            });
        }

        if (type === "reduction" || type === "tax") {
            return Formatter.currencyString({
                value:
                    typeof total === "string" ?
                        parseFloat(total) * -1
                    :   total * -1,
                signDisplay: "exceptZero",
            });
        }

        if (type === "payment") {
            return (
                <div className={styles.payment_currency_string}>
                    <div className="icon">keyboard_double_arrow_up</div>
                    {Formatter.currencyString({
                        value: total,
                        signDisplay: "never",
                    })}
                </div>
            );
        }

        if (type === "taxDeduction" || type === "socialFee") {
            return Formatter.currencyString({
                value: total,
                signDisplay: "never",
            });
        }
    }

    const string = getString();

    return (
        <div
            className={styles.string_div}
            title="Архивировано. Уже находится в расчетном листе."
        >
            {archive && <div className={styles.icon + " icon"}>checkbook</div>}
            <div
                className={
                    styles.string_text +
                    " " +
                    (colored ? styles.colored : "") +
                    " " +
                    styles[type || ""]
                }
            >
                {string}
            </div>
        </div>
    );
}

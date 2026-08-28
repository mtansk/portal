import { Formatter } from "@/app/classes/Formatter";
import {
    isAccrual,
    isReduction,
    isSheet,
    isSocialFee,
    isTax,
} from "@/app/types/guards/guards";

export function FODetails({ object }: { object: any }) {
    if (isSheet(object)) {
        return (
            <>
                {Formatter.currencyString({
                    value:
                        object.sheet_use_f === 1 ?
                            object.sheet_payment_f || 0
                        :   object.sheet_payment_p || 0,
                })}
                {parseInt(object.sheet_overtime_total || "0") > 0 && (
                    <>
                        {" + "}
                        {Formatter.currencyString({
                            value: object.sheet_overtime_total || 0,
                        })}
                    </>
                )}
            </>
        );
    }

    if (isAccrual(object) || isReduction(object)) {
        return (
            <>
                {Formatter.currencyString({ value: object.rate })}
                {" x "}
                {Intl.NumberFormat("ru-RU", {
                    style: "decimal",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                    /*   minimumFractionDigits: 2,
                    maximumFractionDigits: 2, */
                }).format(parseFloat(object.qty))}
            </>
        );
    }

    if (isTax(object) || isSocialFee(object)) {
        return (
            <>
                {Formatter.currencyString({ value: object.qty })}
                {" x "}
                {Intl.NumberFormat("ru-RU", {
                    style: "percent",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                }).format(parseFloat(object.rate))}
            </>
        );
    }
}

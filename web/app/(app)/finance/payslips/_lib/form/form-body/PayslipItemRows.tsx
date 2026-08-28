import { parseFloatAny } from "@/app/functions/other";

import { FOApiFields } from "@/app/types/finance/other/FinanceTypes";

import rowStyles from "./css/row.module.scss";
import containerStyles from "./css/container.module.scss";
import { getFinanceObjectType } from "@/app/(app)/finance/_lib/functions";
import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import { FODetails } from "@/app/(app)/finance/_lib/other/FODetails";
import foGroupString from "@/app/(app)/finance/_lib/other/FoGroupString";
import { Link } from "react-transition-progress/next";
import useBackURL from "@/app/components/hooks/useBackURL";

export function PayslipListItemRow<
    T extends Record<string, any> & FOApiFields,
>({
    obj,
    isDisabled,

    onCrossClick,
}: {
    obj: T;
    isDisabled: boolean;

    onCrossClick: (id: string) => void;
}) {
    const objectType = getFinanceObjectType(obj);

    return (
        <div className={rowStyles.list_item_row}>
            <div className={rowStyles.group}>{foGroupString(obj)}</div>
            <div className={rowStyles.name}>
                <NameDiv
                    obj={obj}
                    isDisabled={isDisabled}
                />
            </div>
            <div className={rowStyles.details}>
                <FODetails object={obj} />
            </div>
            <div
                className={
                    rowStyles.total +
                    " " +
                    rowStyles[getFinanceObjectType(obj) || ""]
                }
            >
                {
                    <FinanceCurrencyStringNew
                        total={parseFloatAny(obj.total || 0)}
                        type={getFinanceObjectType(obj)}
                    />
                }
            </div>
            {!isDisabled && (
                <div className={rowStyles.rem}>
                    <div
                        className="icon"
                        onClick={() => onCrossClick(obj.id)}
                    >
                        close_small
                    </div>
                </div>
            )}
        </div>
    );
}

function NameDiv<T extends Record<string, any> & FOApiFields>({
    obj,
    isDisabled,
}: {
    obj: T;
    isDisabled: boolean;
}) {
    const backurl = useBackURL();

    if (!isDisabled) return obj.name;

    const objectType = getFinanceObjectType(obj);

    if (
        isDisabled &&
        ["accrual", "reduction", "sheet", "payment"].includes(objectType || "")
    ) {
        return (
            <Link
                href={`${objectType === "sheet" ? "/sheet" : `/finance/${objectType}`}s/${obj.id}?backurl=${backurl}`}
            >
                {obj.name}
            </Link>
        );
    }

    return obj.name;
}

export function PayslipContainer({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className={containerStyles.container}>
            <div className={containerStyles.header}>{title}</div>
            <div className={containerStyles.body_div}>{children}</div>
        </div>
    );
}

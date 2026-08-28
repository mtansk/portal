import { calculateFOArrayTotal } from "@/app/(app)/finance/_lib/functions";
import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import { FODetails } from "@/app/(app)/finance/_lib/other/FODetails";
import foGroupString from "@/app/(app)/finance/_lib/other/FoGroupString";
import { dateStringToUTCDate } from "@/app/functions/dates";
import {
    AllFoNames,
    EFOApiFields,
    EFONames,
    FOApiFields,
    FONames,
} from "@/app/types/finance/other/FinanceTypes";
import { useState } from "react";

import styles from "./css/group.module.scss";
import { foNameString } from "@/app/(app)/finance/payslips/_lib/form/form-body/PayslipObjectsContainer";
import { ApiMyTax } from "@/app/types/finance/taxes/Taxes";
import { ApiMySocialFee } from "@/app/types/finance/social-fees/SocialFees";
import { ApiMyTaxDeduction } from "@/app/types/finance/tax-deductions/TaxDeduction";

export function MyPayslipObjectGroup({
    arrayOfObjects,
    typeOfObject,

    handleObjectClick,
}: {
    arrayOfObjects: EFOApiFields[];
    typeOfObject: EFONames;

    handleObjectClick?: (id: string) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const total = calculateFOArrayTotal(arrayOfObjects);
    const dates = new Set(
        arrayOfObjects
            .map((item) => item.date)
            .sort((a, b) => {
                return (
                    dateStringToUTCDate(a).getTime() -
                    dateStringToUTCDate(b).getTime()
                );
            }),
    );

    return (
        <div className={styles.group_div}>
            <div
                className={styles.main_div}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className={"icon " + styles.arrow}>
                    {isExpanded ?
                        "keyboard_arrow_down"
                    :   "keyboard_arrow_right"}
                </div>
                <div className={styles.object_name}>
                    {foNameString(typeOfObject)}
                </div>
                <div className={`${styles.total}`}>
                    <FinanceCurrencyStringNew
                        total={total}
                        colored={false}
                        type={typeOfObject}
                    />
                </div>
            </div>
            {isExpanded && (
                <div className={styles.objects}>
                    {Array.from(dates).map((date) => {
                        const objects = arrayOfObjects.filter(
                            (item) => item.date === date,
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
                                <div className={styles.blocks_div}>
                                    {objects.map((object) => (
                                        <Block
                                            key={object.id}
                                            object={object}
                                            typeOfObject={typeOfObject}
                                            handleObjectClick={
                                                handleObjectClick
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {!dates.size && (
                        <div className={styles.date_div}>
                            <div className={styles.date}>Нет данных</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function MyPayslipTaxesGroup({
    taxes,
    taxDeductions,
    socialFees,
}: {
    taxes: ApiMyTax[];
    taxDeductions: ApiMyTaxDeduction[];
    socialFees: ApiMySocialFee[];
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const taxesTotal = calculateFOArrayTotal(taxes);

    return (
        <div className={styles.group_div}>
            <div
                className={styles.main_div}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className={"icon " + styles.arrow}>
                    {isExpanded ?
                        "keyboard_arrow_down"
                    :   "keyboard_arrow_right"}
                </div>
                <div className={styles.object_name}>Налоги и сборы</div>
                <div className={`${styles.total}`}>
                    <FinanceCurrencyStringNew
                        total={taxesTotal}
                        colored={false}
                        type={"tax"}
                    />
                </div>
            </div>
            {isExpanded && (
                <div className={styles.objects}>
                    <div className={styles.date_div}>
                        <div className={styles.date}>Налоговые вычеты</div>
                        <div className={styles.blocks_div}>
                            {taxDeductions.map((object) => (
                                <Block
                                    key={object.id}
                                    object={object}
                                    typeOfObject={"taxDeduction"}
                                />
                            ))}
                        </div>
                    </div>
                    <div className={styles.date_div}>
                        <div className={styles.date}>Взносы</div>
                        <div className={styles.blocks_div}>
                            {socialFees.map((object) => (
                                <Block
                                    key={object.id}
                                    object={object}
                                    typeOfObject={"socialFee"}
                                />
                            ))}
                        </div>
                    </div>
                    <div className={styles.date_div}>
                        <div className={styles.date}>Налоги</div>
                        <div className={styles.blocks_div}>
                            {taxes.map((object) => (
                                <Block
                                    key={object.id}
                                    object={object}
                                    typeOfObject={"tax"}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Block({
    object,
    typeOfObject,

    handleObjectClick,
}: {
    object: FOApiFields;
    typeOfObject: AllFoNames;

    handleObjectClick?: (id: string) => void;
}) {
    return (
        <div
            className={styles.block_div}
            onClick={() => handleObjectClick && handleObjectClick(object.id)}
        >
            <div className={styles.block_group}>{foGroupString(object)}</div>
            <div className={styles.block_name}>{object.name}</div>
            <div className={styles.block_details}>
                <FODetails object={object} />
            </div>
            <div className={styles.block_total}>
                <FinanceCurrencyStringNew
                    total={object.total}
                    colored={true}
                    type={typeOfObject}
                    archive={false}
                />
            </div>
        </div>
    );
}

"use client";

import { memo } from "react";

import styles from "./css/body.module.scss";
import { ApiSheetRate } from "@/app/types/sheet-rate/SheetRates";
import { Formatter } from "@/app/classes/Formatter";
import { MeasureTypes } from "@/app/global/MEASURE_TYPES";

type GroupType = {
    measure_type: MeasureTypes;
    name: string;
};

const groups: GroupType[] = [
    {
        measure_type: "hour",
        name: "Почасовая оплата",
    },
    {
        measure_type: "sheet",
        name: "Фиксированная оплата",
    },
];

const SheetRatesBody = memo(function SheetRatesBody({
    rates,

    onRateClick,
}: {
    rates: ApiSheetRate[];

    onRateClick: (id: string) => void;
}) {
    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                <div className={styles.rates_div}>
                    {groups.map((group) => {
                        const groupRates = rates.filter(
                            (rate) => rate.measure_type === group.measure_type,
                        );
                        return (
                            <div
                                className={styles.group_div}
                                key={group.measure_type}
                            >
                                <div className={styles.group_upper_div}>
                                    <div className={styles.group_name}>
                                        {group.name}
                                    </div>
                                </div>
                                <div className={styles.group_rates}>
                                    {groupRates.map((rate) => {
                                        return (
                                            <div
                                                className={styles.rate_div}
                                                key={rate.sheet_rate_id}
                                                onClick={() =>
                                                    onRateClick(
                                                        rate.sheet_rate_id,
                                                    )
                                                }
                                            >
                                                <div
                                                    className={styles.rate_name}
                                                >
                                                    {rate.sheet_rate_name}
                                                    {!rate.sheet_rate_is_public && (
                                                        <div
                                                            className={
                                                                "icon " +
                                                                styles.visibility_icon
                                                            }
                                                        >
                                                            visibility_off
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className={styles.rate_rate}
                                                >
                                                    {Formatter.currencyString({
                                                        value: rate.sheet_rate_rate,
                                                        signDisplay: "never",
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {groupRates.length === 0 && (
                                        <div
                                            className={styles.empty}
                                        >{`Ставок нет. Ставки нужны для быстрого заполнения при создании смен.`}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default SheetRatesBody;

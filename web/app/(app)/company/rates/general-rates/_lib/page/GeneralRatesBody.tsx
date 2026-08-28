"use client";

import { memo, useMemo } from "react";

import styles from "./css/body.module.scss";
import { ApiAccrualGroup } from "@/app/types/accrual-group/AccrualGroups";
import {
    ApiGeneralRate,
    IDBGeneralRate,
} from "@/app/types/general-rate/GeneralRates";
import { Formatter } from "@/app/classes/Formatter";

const GeneralRatesBody = memo(function GeneralRatesBody({
    rates,
    groups,

    onRateClick,
    onGroupClick,
}: {
    rates: ApiGeneralRate[];
    groups: ApiAccrualGroup[];

    onRateClick: (id: string) => void;
    onGroupClick: (id: string) => void;
}) {
    const ratesWithNoGroup = useMemo(
        () => rates.filter((rate) => rate.accrual_group_id === null),
        [rates],
    );

    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                <div className={styles.rates_div}>
                    {groups.map((group) => {
                        const groupRates = rates.filter(
                            (rate) =>
                                rate.accrual_group_id ===
                                group.accrual_group_id,
                        );
                        return (
                            <div
                                className={styles.group_div}
                                key={group.accrual_group_id}
                            >
                                <div className={styles.group_upper_div}>
                                    <div className={styles.group_name}>
                                        {group.accrual_group_name}
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.edit_button}
                                        onClick={() =>
                                            onGroupClick(group.accrual_group_id)
                                        }
                                    >
                                        <div className={"icon " + styles.icon}>
                                            edit
                                        </div>
                                    </button>
                                </div>
                                <div className={styles.group_rates}>
                                    {groupRates.map((rate) => {
                                        return (
                                            <div
                                                className={styles.rate_div}
                                                key={rate.general_rate_id}
                                                onClick={() =>
                                                    onRateClick(
                                                        rate.general_rate_id,
                                                    )
                                                }
                                            >
                                                <div
                                                    className={styles.rate_name}
                                                >
                                                    {rate.general_rate_name}
                                                    {!rate.general_rate_is_public && (
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
                                                        value: rate.general_rate_rate,
                                                        signDisplay: "never",
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {groupRates.length === 0 && (
                                        <div className={styles.empty}>
                                            Ставок нет.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div className={styles.group_div}>
                        <div className={styles.group_upper_div}>
                            <div className={styles.group_name}>Без группы</div>
                        </div>
                        <div className={styles.group_rates}>
                            {ratesWithNoGroup.map((rate) => {
                                return (
                                    <div
                                        className={styles.rate_div}
                                        key={rate.general_rate_id}
                                        onClick={() =>
                                            onRateClick(rate.general_rate_id)
                                        }
                                    >
                                        <div className={styles.rate_name}>
                                            {rate.general_rate_name}
                                            {!rate.general_rate_is_public && (
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
                                        <div className={styles.rate_rate}>
                                            {Formatter.currencyString({
                                                value: rate.general_rate_rate,
                                                signDisplay: "never",
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                            {ratesWithNoGroup.length === 0 && (
                                <div
                                    className={styles.empty}
                                >{`Ставок и групп нет. Ставки нужны для быстрого заполнения при создании начислений,
                                    а группы — для их удобной группировки.`}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default GeneralRatesBody;

"use client";

import {
    getWeeksByMonth,
    WeekWithDates,
    formatISODate,
} from "@/app/functions/dates";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { isThisWeek } from "date-fns";
import React, { useState } from "react";
import { MonthBlocks } from "../blocks/MonthBlocks";
import { YearBlocks } from "../blocks/YearBlocks";

import styles from "./../css/modal.module.scss";
import { Button } from "@/app/components/buttons/Buttons";

export function WeekPicker({
    periodOptions,
    initialPeriodOptions,

    handleGlobalPeriodChange,
    handleLocalPeriodChange,
}: {
    periodOptions: PeriodOptions;
    initialPeriodOptions: PeriodOptions;

    handleGlobalPeriodChange?: (
        start: string | Date,
        end: string | Date,
    ) => void;
    handleLocalPeriodChange?: (
        start: string | Date,
        end: string | Date,
    ) => void;
}) {
    const [month, setMonth] = useState<number | undefined>(undefined);

    const selectedYear = new Date(periodOptions.start).getFullYear();
    const weeksByMonth = getWeeksByMonth(selectedYear);

    const WeekBlocks = () => {
        function handleGlobalWeekChange(week: WeekWithDates) {
            handleGlobalPeriodChange?.(week.monday, week.sunday);
        }

        const blocks: React.ReactNode[] = [];
        const weeks = weeksByMonth[month!].weeks;

        for (let i = 0; i < weeks.length; i++) {
            blocks.push(
                <div
                    className={`${styles.block} ${styles.week_block}
								${
                                    (
                                        initialPeriodOptions.start ===
                                            formatISODate(weeks[i].monday) &&
                                        initialPeriodOptions.end ===
                                            formatISODate(weeks[i].sunday)
                                    ) ?
                                        styles.selected
                                    :   ""
                                }
							${isThisWeek(weeks[i].monday) ? styles.current : ""}`}
                    key={i}
                    onClick={() => handleGlobalWeekChange(weeks[i])}
                >
                    <div className={styles.week_number}>
                        {weeks[i].weekNumber}
                    </div>
                    <div className={styles.dates}>
                        {Intl.DateTimeFormat("ru-RU", {
                            day: "numeric",
                            month: "short",
                        }).format(weeks[i].monday)}
                        {" - "}
                        {Intl.DateTimeFormat("ru-RU", {
                            day: "numeric",
                            month: "short",
                        }).format(weeks[i].sunday)}
                    </div>
                </div>,
            );
        }
        return blocks;
    };

    function handleLocalYearChange(year: number) {
        if (selectedYear === year) return;

        const startDate = new Date(year, 0);
        const endDate = new Date(year, 11, 31);

        handleLocalPeriodChange?.(startDate, endDate);
    }

    if (month === undefined) {
        return (
            <>
                <div className={styles.month + " " + styles.body}>
                    <MonthBlocks
                        dateChangeFn={setMonth}
                        initialPeriodOptions={initialPeriodOptions}
                        periodOptions={periodOptions}
                        type="week"
                    />
                </div>
                <div className={styles.year}>
                    <YearBlocks
                        periodOptions={periodOptions}
                        yearChangeFn={handleLocalYearChange}
                    />
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className={styles.week + " " + styles.body}>
                    <WeekBlocks />
                </div>
                <div className={styles.week_button_div}>
                    <Button
                        type="filled"
                        colors="nav-blue"
                        onClick={() => setMonth(undefined)}
                        innerContent="Изменить месяц"
                        className={styles.month_button}
                    />
                </div>
            </>
        );
    }
}

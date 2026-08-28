"use client";

import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import React from "react";
import { MonthBlocks } from "../blocks/MonthBlocks";
import { YearBlocks } from "../blocks/YearBlocks";
import styles from "./../css/modal.module.scss";

export function MonthPicker({
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
    const selectedYear = new Date(periodOptions.start).getFullYear();

    function handleGlobalMonthChange(month: number) {
        const startDate = new Date(selectedYear, month);
        const endDate = new Date(selectedYear, month + 1, 0);

        handleGlobalPeriodChange?.(startDate, endDate);
    }

    function handleLocalYearChange(year: number) {
        if (selectedYear === year) return;

        const startDate = new Date(year, 0);
        const endDate = new Date(year, 11, 31);

        handleLocalPeriodChange?.(startDate, endDate);
    }

    return (
        <>
            <div className={styles.month + " " + styles.body}>
                <MonthBlocks
                    dateChangeFn={handleGlobalMonthChange}
                    initialPeriodOptions={initialPeriodOptions}
                    periodOptions={periodOptions}
                    type="month"
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
}

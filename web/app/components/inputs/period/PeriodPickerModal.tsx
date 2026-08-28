"use client";

import { PeriodOptions, PeriodTypes } from "@/app/functions/urlPeriodOptions";
import { useState } from "react";

import { MonthPicker } from "./pickers/MonthPicker";
import { WeekPicker } from "./pickers/WeekPicker";
import { YearPicker } from "./pickers/YearPicker";
import { CustomPicker } from "./pickers/CustomPicker";
import { formatISODate } from "@/app/functions/dates";

import styles from "./css/modal.module.scss";

export default function PeriodPickerModal({
    allowedPeriods,
    initialPeriodOptions,

    setDialogIsOpen,

    dateChangeFn,
}: {
    allowedPeriods: Set<PeriodTypes>;
    initialPeriodOptions: PeriodOptions;

    setDialogIsOpen: (isOpen: boolean) => void;

    dateChangeFn?: (start: string, end: string) => void;
}) {
    const [periodOptions, setPeriodOptions] = useState(initialPeriodOptions);

    function handlePeriodSelection(period: PeriodTypes) {
        setPeriodOptions({
            ...periodOptions,
            period: period,
        });
    }

    function handleLocalPeriodChange(start: string | Date, end: string | Date) {
        const startString =
            typeof start === "string" ? start : formatISODate(start);

        const endString = typeof end === "string" ? end : formatISODate(end);

        setPeriodOptions({
            ...periodOptions,
            start: startString,
            end: endString,
        });
    }

    function handleGlobalPeriodChange(
        start: string | Date,
        end: string | Date,
    ) {
        const startString =
            typeof start === "string" ? start : formatISODate(start);

        const endString = typeof end === "string" ? end : formatISODate(end);
        handleLocalPeriodChange(start, end);
        dateChangeFn?.(startString, endString);
        setDialogIsOpen(false);
    }

    function InnerContent() {
        if (periodOptions.period === "month") {
            return (
                <MonthPicker
                    periodOptions={periodOptions}
                    initialPeriodOptions={initialPeriodOptions}
                    handleGlobalPeriodChange={handleGlobalPeriodChange}
                    handleLocalPeriodChange={handleLocalPeriodChange}
                />
            );
        }
        if (periodOptions.period === "week") {
            return (
                <WeekPicker
                    periodOptions={periodOptions}
                    initialPeriodOptions={initialPeriodOptions}
                    handleGlobalPeriodChange={handleGlobalPeriodChange}
                    handleLocalPeriodChange={handleLocalPeriodChange}
                />
            );
        }
        if (periodOptions.period === "custom") {
            return (
                <CustomPicker
                    periodOptions={periodOptions}
                    setPeriodOptions={setPeriodOptions}
                    dateChangeFn={dateChangeFn}
                    setDialogIsOpen={setDialogIsOpen}
                />
            );
        }
        if (periodOptions.period === "year") {
            return (
                <YearPicker
                    periodOptions={periodOptions}
                    initialPeriodOptions={initialPeriodOptions}
                    handleGlobalPeriodChange={handleGlobalPeriodChange}
                />
            );
        }
    }

    function periodLabel(period: PeriodTypes) {
        switch (period) {
            case "month":
                return "Месяц";
            case "week":
                return "Неделя";
            case "custom":
                return "Период";
            case "year":
                return "Год";
            default:
                return "";
        }
    }

    return (
        <div
            className={
                styles.period_picker_modal +
                " " +
                (periodOptions.period === "custom" ? styles.custom : "")
            }
        >
            <div className={styles.nav_div}>
                {Array.from(allowedPeriods)
                    .sort((a, b) => {
                        const order: PeriodTypes[] = [
                            "week",
                            "month",
                            "year",
                            "custom",
                        ];
                        return (
                            order.indexOf(a as PeriodTypes) -
                            order.indexOf(b as PeriodTypes)
                        );
                    })
                    .map((period) => {
                        return (
                            <div
                                className={`${styles.period_div} ${periodOptions.period === period ? styles.selected : ""} ${styles.block}`}
                                key={period}
                                onClick={() => handlePeriodSelection(period)}
                            >
                                {periodLabel(period)}
                            </div>
                        );
                    })}
            </div>
            <InnerContent />
        </div>
    );
}

"use client";

import { formatISODate, getWeekInfo } from "@/app/functions/dates";
import {
    PeriodTypes,
    urlPeriodOptions,
} from "@/app/functions/urlPeriodOptions";
import { usePathname, useRouter } from "next/navigation";

import { ModalPortal } from "../../form/ModalPortal";
import { memo, startTransition, useCallback, useEffect, useState } from "react";
import PeriodPickerModal from "./PeriodPickerModal";
import {
    addMonths,
    addWeeks,
    addYears,
    endOfMonth,
    endOfYear,
    startOfMonth,
    startOfYear,
    subMonths,
    subWeeks,
    subYears,
} from "date-fns";
import { ALLOWED_YEARS } from "@/app/global/ALLOWED_YEARS";

import styles from "./css/period-picker.module.scss";
import { ArrowLink } from "./ArrowLink";
import { useProgress } from "react-transition-progress";

export const PeriodPicker = memo(function PeriodPicker({
    allowedPeriods,
    defaultPeriod = "month",

    initialParams,

    shouldUseURL = false,
    dateChangeFn,
    clickFn,

    shouldUseModal = true,
    isDisabled = false,
    alwaysShowCustom = false,

    className,
}: {
    allowedPeriods: Set<PeriodTypes>;
    defaultPeriod?: "month" | "week";

    initialParams: {
        start: string;
        end: string;
        [other: string]: string;
    };

    shouldUseURL?: boolean;
    dateChangeFn?: (start: string, end: string) => void;
    clickFn?: () => void;

    shouldUseModal?: boolean;
    isDisabled?: boolean;
    alwaysShowCustom?: boolean;

    className?: string;
}) {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [localDisabled, setLocalDisabled] = useState(isDisabled);
    const startProgress = useProgress();

    useEffect(() => {
        setLocalDisabled(isDisabled);
    }, [isDisabled]);

    const path = usePathname();
    const router = useRouter();

    const periodOptions = urlPeriodOptions(
        initialParams.start,
        initialParams.end,
        allowedPeriods,
        defaultPeriod,
    );

    const getNewURLString = useCallback(
        (start: string, end: string) => {
            const params = new URLSearchParams(initialParams);
            params.set("start", start);
            params.set("end", end);
            return `${path}?${params.toString()}`;
        },
        [initialParams, path],
    );

    const [innerPeriod, setInnerPeriod] = useState(periodOptions);

    useEffect(() => {
        if (
            shouldUseURL &&
            (innerPeriod.start !== periodOptions.start ||
                innerPeriod.end !== periodOptions.end)
        ) {
            startTransition(() => {
                startProgress();
                router.replace(
                    getNewURLString(innerPeriod.start, innerPeriod.end),
                    {
                        scroll: false,
                    },
                );
            });
        }

        if (
            innerPeriod.start == periodOptions.start &&
            innerPeriod.end == periodOptions.end
        ) {
            setLocalDisabled(false);
        }
    }, [
        innerPeriod,
        periodOptions,
        router,
        shouldUseURL,
        getNewURLString,
        startProgress,
    ]);

    function doRedirect(start: string, end: string) {
        startTransition(() => {
            startProgress();
            router.replace(getNewURLString(start, end), {
                scroll: false,
            });
        });
    }

    /* 
	
	
	*/

    function PeriodNav({ periodType }: { periodType: PeriodTypes }) {
        const date = new Date(innerPeriod.start);

        const formattedMonthDate = () => {
            const formattedMonth = Intl.DateTimeFormat("ru-RU", {
                month: "long",
                timeZone: "UTC",
            }).format(date);
            return `${formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1)}, ${Intl.DateTimeFormat(
                "ru-RU",
                {
                    year: "numeric",
                    timeZone: "UTC",
                },
            ).format(date)}`;
        };
        const formattedWeekDate = () => {
            const weekInfo = getWeekInfo(date);

            return `${weekInfo.weekNumber} н., ${Intl.DateTimeFormat("ru-RU", {
                day: "numeric",
                month: "numeric",
                timeZone: "UTC",
            }).format(weekInfo.monday)} - ${Intl.DateTimeFormat("ru-RU", {
                day: "numeric",
                month: "numeric",
                timeZone: "UTC",
            }).format(weekInfo.sunday)}`;
        };
        const formattedCustomDate = () => {
            return (
                <>
                    {Intl.DateTimeFormat("ru-RU", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                    }).format(new Date(innerPeriod.start))}
                    {" — "}
                    {Intl.DateTimeFormat("ru-RU", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                    }).format(new Date(innerPeriod.end))}
                </>
            );
        };
        const formattedYearDate = () => {
            return Intl.DateTimeFormat("ru-RU", {
                year: "numeric",
                timeZone: "UTC",
            }).format(date);
        };

        const getMonthPeriod = () => {
            const startPrevMonth = startOfMonth(subMonths(date, 1));
            const endPrevMonth = endOfMonth(subMonths(date, 1));
            const startNextMonth = startOfMonth(addMonths(date, 1));
            const endNextMonth = endOfMonth(addMonths(date, 1));

            return {
                prev: {
                    start: formatISODate(startPrevMonth),
                    end: formatISODate(endPrevMonth),
                    year: startPrevMonth.getFullYear(),
                },
                next: {
                    start: formatISODate(startNextMonth),
                    end: formatISODate(endNextMonth),
                    year: startNextMonth.getFullYear(),
                },
            };
        };

        const getWeekPeriod = () => {
            const prevWeekInfo = getWeekInfo(subWeeks(date, 1));
            const nextWeekInfo = getWeekInfo(addWeeks(date, 1));

            return {
                prev: {
                    start: formatISODate(prevWeekInfo.monday),
                    end: formatISODate(prevWeekInfo.sunday),
                    year: prevWeekInfo.monday.getFullYear(),
                },
                next: {
                    start: formatISODate(nextWeekInfo.monday),
                    end: formatISODate(nextWeekInfo.sunday),
                    year: nextWeekInfo.monday.getFullYear(),
                },
            };
        };

        const getYearPeriod = () => {
            const prevYear = subYears(date, 1);
            const nextYear = addYears(date, 1);

            return {
                prev: {
                    start: formatISODate(startOfYear(prevYear)),
                    end: formatISODate(endOfYear(prevYear)),
                    year: prevYear.getFullYear(),
                },
                next: {
                    start: formatISODate(startOfYear(nextYear)),
                    end: formatISODate(endOfYear(nextYear)),
                    year: nextYear.getFullYear(),
                },
            };
        };

        const getPeriod = () => {
            if (periodType === "month") {
                return getMonthPeriod();
            }
            if (periodType === "week") {
                return getWeekPeriod();
            }
            if (periodType === "year") {
                return getYearPeriod();
            }

            return getMonthPeriod();
        };

        const { prev: prevPeriod, next: nextPeriod } = getPeriod();

        const isPrevDisabled = !ALLOWED_YEARS.includes(prevPeriod.year);
        const isNextDisabled = !ALLOWED_YEARS.includes(nextPeriod.year);

        const Inner = () => {
            if (periodType === "month" && !alwaysShowCustom) {
                return formattedMonthDate();
            }

            if (periodType === "week") {
                return formattedWeekDate();
            }

            if (periodType === "custom" || alwaysShowCustom) {
                return formattedCustomDate();
            }

            if (periodType === "year") {
                return formattedYearDate();
            }
        };

        return (
            <div className={styles[`${periodType}_period_nav`]}>
                {periodType !== "custom" && !alwaysShowCustom && (
                    <ArrowLink
                        direction="back"
                        isDisabled={
                            isPrevDisabled || isDisabled || localDisabled
                        }
                        fn={() => {
                            setInnerPeriod(
                                urlPeriodOptions(
                                    prevPeriod.start,
                                    prevPeriod.end,
                                    allowedPeriods,
                                    defaultPeriod,
                                ),
                            );
                            if (dateChangeFn) {
                                dateChangeFn(prevPeriod.start, prevPeriod.end);
                            }
                            clickFn?.();
                        }}
                    />
                )}
                <div
                    className={shouldUseModal ? styles.use_modal : ""}
                    onClick={() => {
                        if (shouldUseModal && !isDisabled && !localDisabled) {
                            setDialogIsOpen(true);
                        }
                    }}
                >
                    <Inner />
                    {shouldUseModal && !isDisabled && !localDisabled && (
                        <div className="icon">edit_calendar</div>
                    )}
                </div>
                {periodType !== "custom" && !alwaysShowCustom && (
                    <ArrowLink
                        direction="forward"
                        isDisabled={
                            isNextDisabled || isDisabled || localDisabled
                        }
                        fn={() => {
                            setInnerPeriod(
                                urlPeriodOptions(
                                    nextPeriod.start,
                                    nextPeriod.end,
                                    allowedPeriods,
                                    defaultPeriod,
                                ),
                            );
                            if (dateChangeFn) {
                                dateChangeFn(nextPeriod.start, nextPeriod.end);
                            }
                            clickFn?.();
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <div
            className={`${styles.period_picker_div} ${
                shouldUseURL ? styles.shadow : ""
            } ${isDisabled || localDisabled ? styles.disabled : ""} ${className} ${dialogIsOpen ? styles.active : ""}`}
        >
            {shouldUseModal && dialogIsOpen && !localDisabled && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    <PeriodPickerModal
                        allowedPeriods={allowedPeriods}
                        initialPeriodOptions={innerPeriod}
                        setDialogIsOpen={setDialogIsOpen}
                        dateChangeFn={(start: string, end: string) => {
                            setInnerPeriod(
                                urlPeriodOptions(
                                    start,
                                    end,
                                    allowedPeriods,
                                    defaultPeriod,
                                ),
                            );
                            clickFn?.();

                            if (shouldUseURL) {
                                doRedirect(start, end);
                                setLocalDisabled(true);
                            }
                            dateChangeFn?.(start, end);
                        }}
                    />
                </ModalPortal>
            )}
            <PeriodNav periodType={innerPeriod.period} />
        </div>
    );
});

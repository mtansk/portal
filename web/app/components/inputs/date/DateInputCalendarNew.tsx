import { useState } from "react";
import {
    addDays,
    eachDayOfInterval,
    eachWeekOfInterval,
    endOfMonth,
    endOfWeek,
    isAfter,
    isBefore,
    isSameDay,
    isSameMonth,
    isThisMonth,
    isToday,
    isWeekend,
    startOfMonth,
    subDays,
} from "date-fns";
import { PeriodPicker } from "../period/PeriodPicker";
import { dateStringToUTCDate, formatUTCDate } from "@/app/functions/dates";
import { UTCDateMini } from "@date-fns/utc";
import styles from "./css/new-calendar.module.scss";
import { Button } from "../../buttons/Buttons";

export default function DateInputCalendarNew({
    type,
    selectedDates,
    onChange,

    onResetClick,

    isDisabled,
    reservedDates,

    shouldUseModal,
    maxSelectedDates = 20,
    maxPeriodDays = 15,
}: {
    type: "date" | "dates" | "period";
    selectedDates: string[];
    onChange: (date: string[]) => void;

    onResetClick?: () => void;

    isDisabled?: boolean;
    reservedDates?: string[];

    shouldUseModal?: boolean;
    maxSelectedDates?: number;
    maxPeriodDays?: number;
}) {
    const [calendarDate, setCalendarDate] = useState(getInitialDate);

    function getInitialDate() {
        if (selectedDates.length > 0) {
            const date = dateStringToUTCDate(selectedDates[0]);

            return date;
        }
        const date = new UTCDateMini();
        return date;
    }

    const startDate = startOfMonth(calendarDate);
    const endDate = endOfMonth(calendarDate);

    const weeks = eachWeekOfInterval(
        { start: startDate, end: endDate },
        { weekStartsOn: 1 },
    );

    const isCurrentMonth = isThisMonth(startDate);

    function getDayClasses(date: Date) {
        const classes = [styles.day, styles.block];

        const formattedDate = formatUTCDate(date);

        const dayOfCurrentMonth = isSameMonth(date, startDate);
        const isSelected = selectedDates.includes(formattedDate);
        const isDisabledDate = reservedDates?.includes(formattedDate);

        if (isWeekend(date)) classes.push(styles.weekend);
        if (isCurrentMonth && isToday(date.toString()))
            classes.push(styles.today);
        if (!dayOfCurrentMonth) classes.push(styles.empty);
        if (isSelected) classes.push(styles.selected);
        if (isDisabled) classes.push(styles.disabled);
        if (isDisabledDate && !isDisabled) classes.push(styles.disabled_date);
        if (type === "period" && selectedDates.length === 1) {
            if (
                isBefore(date, subDays(selectedDates[0], maxPeriodDays)) ||
                isAfter(date, addDays(selectedDates[0], maxPeriodDays))
            ) {
                classes.push(styles.disabled_date);
            }
        }

        if (type === "period") {
        }

        return classes.join(" ");
    }

    function getHolderClasses(date: Date) {
        const classes = [styles.holder];

        if (type === "period") {
            if (selectedDates.length === 2) {
                if (
                    isBefore(date, selectedDates[1]) &&
                    isAfter(date, selectedDates[0])
                ) {
                    classes.push(styles.period);
                }

                if (isSameDay(date, selectedDates[0])) {
                    classes.push(styles.period_selected_start);
                }

                if (isSameDay(date, selectedDates[1])) {
                    classes.push(styles.period_selected_end);
                }
            }
        }

        return classes.join(" ");
    }

    function handleDayClick(date: Date) {
        const formattedDate = formatUTCDate(date);

        const dayOfCurrentMonth = isSameMonth(date, startDate);
        const isSelected = selectedDates.includes(formattedDate);
        const isDisabledDate = reservedDates?.includes(formattedDate);

        if (isDisabledDate && !isSelected) return;

        if (type === "period") {
            if (selectedDates.length === 0) {
                const array = [formattedDate];
                onChange(array);
                return;
            } else if (selectedDates.length === 1) {
                if (isBefore(date, selectedDates[0])) {
                    onChange([formattedDate, selectedDates[0]]);
                    return;
                } else {
                    onChange([selectedDates[0], formattedDate]);
                    return;
                }
            } else {
                onChange([formattedDate]);
                return;
            }
        }

        if (type === "date" && isSelected) {
            return;
        }

        if (dayOfCurrentMonth && !isDisabled) {
            onChange([formattedDate]);
        }
    }

    return (
        <div
            className={`${styles.date_selector_div} ${isDisabled ? styles.disabled : ""}`}
        >
            {/* <input

				type="number"
				required={true}
				hidden={true}
				onChange={() => {}}
				name="dates_count"
			/> */}
            <div
                className={
                    styles.main_div +
                    " " +
                    (onResetClick ? styles.with_reset : "")
                }
            >
                <div className={styles.period_picker_div}>
                    <PeriodPicker
                        allowedPeriods={new Set(["month"])}
                        defaultPeriod="month"
                        initialParams={{
                            start: formatUTCDate(startDate),
                            end: formatUTCDate(endDate),
                        }}
                        dateChangeFn={(start) => {
                            const date = new UTCDateMini(start);
                            setCalendarDate(date);
                        }}
                        shouldUseModal={shouldUseModal}
                        isDisabled={isDisabled}
                        className={styles.period_picker}
                    />
                </div>
                <div className={styles.calendar_div}>
                    <div className={styles.weekdays + " " + styles.row}>
                        {Array.from({ length: 7 }, (_, i) => i).map((index) => {
                            const day = new UTCDateMini(0, 0, index + 1);
                            return (
                                <div
                                    className={
                                        styles.holder + " " + styles.weekday
                                    }
                                    key={index}
                                >
                                    <div className={styles.block}>
                                        {day.toLocaleString("ru", {
                                            weekday: "short",
                                            timeZone: "UTC",
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.dates}>
                        {weeks.map((weekStart, weekIndex) => (
                            <div
                                className={styles.week + " " + styles.row}
                                key={weekIndex}
                            >
                                {eachDayOfInterval({
                                    start: weekStart,
                                    end: endOfWeek(weekStart, {
                                        weekStartsOn: 1,
                                    }),
                                }).map((date, dayIndex) => {
                                    const dayOfCurrentMonth = isSameMonth(
                                        date,
                                        startDate,
                                    );

                                    if (!dayOfCurrentMonth) {
                                        return (
                                            <div key={`empty${dayIndex}`}></div>
                                        );
                                    }

                                    return (
                                        <div
                                            className={getHolderClasses(date)}
                                            key={`day${dayIndex}`}
                                        >
                                            <button
                                                className={getDayClasses(date)}
                                                type="button"
                                                onClick={() =>
                                                    handleDayClick(date)
                                                }
                                            >
                                                {dayOfCurrentMonth ?
                                                    date.getDate()
                                                :   ""}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                {onResetClick && (
                    <div className={styles.reset}>
                        <Button
                            type="bold"
                            colors="bold-blue"
                            onClick={onResetClick}
                            innerContent="Сбросить"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

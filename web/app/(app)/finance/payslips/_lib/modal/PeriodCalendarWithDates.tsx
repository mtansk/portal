import DateInputCalendarNew from "@/app/components/inputs/date/DateInputCalendarNew";
import DummyInput from "@/app/components/inputs/DummyInput";
import styles from "./css/calendar.module.scss";

export default function PeriodCalendarWithDates({
    dates,
    onChange,
    onResetClick,

    maxPeriodDays,
}: {
    dates: string[];
    onChange: (dates: string[]) => void;
    onResetClick?: () => void;

    maxPeriodDays?: number;
}) {
    return (
        <div className={styles.period_calendar}>
            <div className={styles.dates}>
                <div
                    className={
                        styles.date +
                        " " +
                        (dates.length === 0 ? styles.active : "")
                    }
                >
                    {dates[0] ?
                        Intl.DateTimeFormat("ru", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            timeZone: "UTC",
                        }).format(new Date(dates[0]))
                    :   "Начало"}
                </div>
                {" — "}
                <div
                    className={
                        styles.date +
                        " " +
                        (dates.length === 1 ? styles.active : "")
                    }
                >
                    {dates[1] ?
                        Intl.DateTimeFormat("ru", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            timeZone: "UTC",
                        }).format(new Date(dates[1]))
                    :   "Конец"}
                </div>
            </div>
            <div className={styles.calendar}>
                <DummyInput value={dates.length === 2 ? "1" : 0} />
                <DateInputCalendarNew
                    selectedDates={dates}
                    type="period"
                    onChange={onChange}
                    isDisabled={false}
                    onResetClick={onResetClick}
                    maxPeriodDays={maxPeriodDays || 45}
                    shouldUseModal={false}
                />
            </div>
        </div>
    );
}

import { ApiMySheet } from "@/app/types/sheet/Sheets";
import styles from "./css/body.module.scss";
import { MyScheduleSearchParams } from "../../page";
import { PeriodPicker } from "@/app/components/inputs/period/PeriodPicker";
import {
    dateStringToUTCDate,
    formatUTCDate,
    timeFromSeconds,
} from "@/app/functions/dates";
import {
    eachDayOfInterval,
    eachWeekOfInterval,
    endOfWeek,
    isToday,
} from "date-fns";
import { UTCDateMini } from "@date-fns/utc";
import { statusLabels } from "@/app/(app)/(sheets)/schedule/_lib/ScheduleBody";
import { capitalize } from "@/app/functions/other";
import { memo } from "react";
import useParamsChanger from "@/app/components/hooks/useParamsChanger";

const MyScheduleBody = memo(function MyScheduleBody({
    sheets,
    searchParams,

    handleSheetClick,
}: {
    sheets: ApiMySheet[];
    searchParams: MyScheduleSearchParams;

    handleSheetClick: (id: string) => void;
}) {
    const changeParams = useParamsChanger();

    return (
        <div className={styles.main_div}>
            <div className={styles.calendar_div}>
                <div className={styles.factual}>
                    <select
                        value={searchParams.factual}
                        onChange={(e) =>
                            changeParams("factual", e.target.value)
                        }
                    >
                        <option value="false">Плановое время</option>
                        <option value="true">Фактическое время</option>
                    </select>
                </div>
                <div className={styles.period}>
                    <PeriodPicker
                        allowedPeriods={new Set(["month"])}
                        initialParams={searchParams}
                        shouldUseURL={true}
                        shouldUseModal={true}
                    />
                </div>
                <div className={styles.month_name}>
                    {`${capitalize(
                        Intl.DateTimeFormat("ru", {
                            month: "long",
                            timeZone: "UTC",
                        }).format(dateStringToUTCDate(searchParams.start)),
                    )}, ${searchParams.start.slice(0, 4)}`}
                </div>
                <div className={styles.calendar_body}>
                    <Calendar
                        sheets={sheets}
                        searchParams={searchParams}
                        handleSheetClick={handleSheetClick}
                    />
                </div>
            </div>
        </div>
    );
});
export default MyScheduleBody;

function Calendar({
    sheets,
    searchParams,

    handleSheetClick,
}: {
    sheets: ApiMySheet[];
    searchParams: MyScheduleSearchParams;

    handleSheetClick: (id: string) => void;
}) {
    const startDate = dateStringToUTCDate(searchParams.start);
    const endDate = dateStringToUTCDate(searchParams.end);

    const weeks = eachWeekOfInterval(
        {
            start: startDate,
            end: endDate,
        },
        {
            weekStartsOn: 1,
        },
    );

    return (
        <div className={styles.calendar}>
            <div className={styles.header}>
                <div className={styles.weekdays}>
                    {arrayOf7.map((i) => {
                        const date = new UTCDateMini(1970, 0, 5 + i);
                        return (
                            <div
                                key={`weekday${i}`}
                                className={
                                    styles.weekday + " " + styles[`weekday${i}`]
                                }
                            >
                                {capitalize(
                                    Intl.DateTimeFormat("ru", {
                                        weekday: "short",
                                        timeZone: "UTC",
                                    }).format(date),
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.body}>
                {weeks.map((startOfWeek) => {
                    const weekDates = eachDayOfInterval({
                        start: startOfWeek,
                        end: endOfWeek(startOfWeek, { weekStartsOn: 1 }),
                    });
                    return (
                        <div
                            className={styles.week}
                            key={startOfWeek.toISOString()}
                        >
                            {weekDates.map((date) => {
                                if (date < startDate || date > endDate) {
                                    return (
                                        <div
                                            className={styles.date_parent}
                                            key={date.toISOString()}
                                        ></div>
                                    );
                                }

                                const dateStr = date.toISOString().slice(0, 10);

                                return (
                                    <div
                                        className={styles.date_parent}
                                        key={dateStr}
                                    >
                                        <div
                                            className={`${styles.date_header}`}
                                        >
                                            <div
                                                className={`${styles.header_date}  ${isToday(date.toString()) ? styles.today : ""}`}
                                            >
                                                {date.getUTCDate()}
                                            </div>
                                        </div>
                                        <div className={styles.date_body}>
                                            <MyScheduleCalendarCell
                                                day={date}
                                                sheets={sheets}
                                                showFactual={
                                                    searchParams.factual ===
                                                    "true"
                                                }
                                                handleSheetClick={(id) => {
                                                    handleSheetClick(id);
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const arrayOf7 = Array.from({ length: 7 }, (_, i) => i);

function MyScheduleCalendarCell({
    day,
    sheets,

    showFactual,

    handleSheetClick,
}: {
    day: Date;
    sheets: ApiMySheet[];

    showFactual: boolean;

    handleSheetClick: (id: string) => void;
}) {
    const currentSheet = sheets.find(
        (sheet) => sheet.sheet_date === formatUTCDate(day),
    );

    if (currentSheet) {
        return (
            <div
                className={`${styles.sheet_cell} ${styles[currentSheet.sheet_status]}`}
                onClick={() => handleSheetClick(currentSheet.sheet_id)}
                style={
                    currentSheet.sheet_status === "workday" ?
                        {
                            backgroundColor: currentSheet.department_color,
                        }
                    :   {}
                }
            >
                <InnerContent
                    sheet={currentSheet}
                    showFactual={showFactual}
                />
            </div>
        );
    }

    return <div className={`${styles.sheet_cell} ${styles.empty}`}></div>;
}

function InnerContent({
    sheet,
    showFactual,
}: {
    sheet: ApiMySheet;
    showFactual: boolean;
}) {
    if (!sheet) return null;

    if (sheet.sheet_status === "workday") {
        const isFactual = showFactual;
        const duration = isFactual ? sheet.sheet_total_dur : sheet.sheet_dur_p;

        return (
            <>
                <div className={styles.start}>
                    {isFactual ?
                        sheet.sheet_f_st ?
                            timeFromSeconds(sheet.sheet_f_st)
                        :   "--:--"
                    :   timeFromSeconds(sheet.sheet_p_st || 0)}
                </div>
                <div className={styles.end}>
                    {isFactual ?
                        sheet.sheet_f_en ?
                            timeFromSeconds(sheet.sheet_f_en)
                        :   "--:--"
                    :   timeFromSeconds(sheet.sheet_p_en || 0)}
                </div>
                <div className={styles.hours}>
                    {timeFromSeconds(duration || 0)}
                </div>
            </>
        );
    }

    return statusLabels[sheet.sheet_status] || null;
}

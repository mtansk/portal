import { ApiMyTeamSheet } from "@/app/types/sheet/Sheets";
import styles from "./css/body.module.scss";
import { TeamScheduleSearchParams } from "../../page";
import { PeriodPicker } from "@/app/components/inputs/period/PeriodPicker";
import {
    dateStringToUTCDate,
    formatUTCDate,
    timeFromSeconds,
} from "@/app/functions/dates";
import { eachDayOfInterval, isToday } from "date-fns";
import { UTCDateMini } from "@date-fns/utc";
import { statusLabels } from "@/app/(app)/(sheets)/schedule/_lib/ScheduleBody";
import { capitalize, getUserFullnameString } from "@/app/functions/other";
import { memo, useMemo } from "react";
import { ApiMyDepartment } from "@/app/types/depts/Depts";
import { ApiMyColleague } from "@/app/types/user/Users";

const MyTeamScheduleBody = memo(function MyScheduleBody({
    sheets,
    users,
    depts,
    searchParams,
}: {
    sheets: ApiMyTeamSheet[];
    users: ApiMyColleague[];
    depts: ApiMyDepartment[];
    searchParams: TeamScheduleSearchParams;
}) {
    return (
        <div className={styles.main_div}>
            <div className={styles.calendar_div}>
                <div className={styles.period}>
                    <PeriodPicker
                        allowedPeriods={new Set(["week"])}
                        initialParams={searchParams}
                        shouldUseURL={true}
                        shouldUseModal={true}
                    />
                </div>
                <div className={styles.month_name}>
                    {`${Intl.DateTimeFormat("ru", {
                        day: "2-digit",
                        month: "2-digit",
                    }).format(
                        dateStringToUTCDate(searchParams.start),
                    )} — ${Intl.DateTimeFormat("ru", {
                        day: "2-digit",
                        month: "2-digit",
                    }).format(
                        dateStringToUTCDate(searchParams.end),
                    )}, ${searchParams.start.slice(0, 4)}`}
                </div>
                <div className={styles.calendar_body}>
                    <Calendar
                        sheets={sheets}
                        users={users}
                        depts={depts}
                        searchParams={searchParams}
                    />
                </div>
            </div>
        </div>
    );
});
export default MyTeamScheduleBody;

function Calendar({
    sheets,
    users,
    depts,
    searchParams,
}: {
    sheets: ApiMyTeamSheet[];
    users: ApiMyColleague[];
    depts: ApiMyDepartment[];
    searchParams: TeamScheduleSearchParams;
}) {
    const startDate = dateStringToUTCDate(searchParams.start);
    const endDate = dateStringToUTCDate(searchParams.end);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const sheetsObject = useMemo(() => {
        let groupedSheets: Record<
            string,
            Record<string, ApiMyTeamSheet>
        > = [] as any;

        for (let i = 0; i < sheets.length; i++) {
            const date = sheets[i].sheet_date;
            const user = sheets[i].user_id;

            if (!groupedSheets[user]) groupedSheets[user] = {};

            groupedSheets[user][date] = sheets[i];
        }
        return groupedSheets;
    }, [sheets]);

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
                <div className={styles.dates}>
                    {days.map((day) => {
                        return (
                            <div
                                className={
                                    styles.date +
                                    " " +
                                    (isToday(day) ? styles.today : "")
                                }
                                key={day.toString()}
                            >
                                {day.getUTCDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.body}>
                {depts.map((dept) => {
                    const deptUsers = users.filter(
                        (user) => user.department_id === dept.department_id,
                    );
                    if (deptUsers.length === 0) return null;

                    return (
                        <div
                            className={styles.dept_div}
                            key={dept.department_id}
                        >
                            <div className={styles.dept_name}>
                                {dept.department_name}
                            </div>
                            <div className={styles.dept_body}>
                                {deptUsers.map((user) => {
                                    return (
                                        <div
                                            className={styles.user_div}
                                            key={user.user_id}
                                        >
                                            <div className={styles.user_name}>
                                                {getUserFullnameString(
                                                    user,
                                                    false,
                                                )}
                                            </div>
                                            <div className={styles.user_sheets}>
                                                {days.map((day) => {
                                                    const currentSheet =
                                                        sheetsObject[
                                                            user.user_id
                                                        ]?.[formatUTCDate(day)];

                                                    return (
                                                        <MyScheduleCalendarCell
                                                            key={day.toString()}
                                                            currentSheet={
                                                                currentSheet
                                                            }
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const arrayOf7 = Array.from({ length: 7 }, (_, i) => i);

function MyScheduleCalendarCell({
    currentSheet,
}: {
    currentSheet: ApiMyTeamSheet | undefined;
}) {
    if (currentSheet) {
        return (
            <div
                className={`${styles.sheet_cell} ${styles[currentSheet.sheet_status]}`}
                style={
                    currentSheet.sheet_status === "workday" ?
                        {
                            backgroundColor: currentSheet.department_color,
                        }
                    :   {}
                }
            >
                <InnerContent sheet={currentSheet} />
            </div>
        );
    }

    return <div className={`${styles.sheet_cell} ${styles.empty}`}></div>;
}

function InnerContent({ sheet }: { sheet: ApiMyTeamSheet }) {
    if (!sheet) return null;

    if (sheet.sheet_status === "workday") {
        const duration = sheet.sheet_dur_p;

        return (
            <>
                <div className={styles.start}>
                    {timeFromSeconds(sheet.sheet_p_st || 0)}
                </div>
                <div className={styles.end}>
                    {timeFromSeconds(sheet.sheet_p_en || 0)}
                </div>
                <div className={styles.hours}>
                    {timeFromSeconds(duration || 0)}
                </div>
            </>
        );
    }

    return statusLabels[sheet.sheet_status] || null;
}

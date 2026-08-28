import { getWeekNumber } from "@/app/functions/dates";
import { capitalize } from "@/app/functions/other";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { usePathname } from "next/navigation";

import containerStyles from "./css/calendar-container.module.scss";
import { SearchParams } from "next/dist/server/request/search-params";

import { UTCDateMini } from "@date-fns/utc";
import { DateLink } from "./DateLink";
import { Button } from "../buttons/Buttons";

export default function CalendarUpperDiv({
    periodOptions,
    fullscreenRef,
    intervalDates,

    searchParams,
    useHeaderNavigation,
    navigationFn,
}: {
    periodOptions: PeriodOptions;
    fullscreenRef: React.RefObject<HTMLDivElement | null>;

    intervalDates: Date[];

    searchParams?: SearchParams;
    useHeaderNavigation?: boolean;
    navigationFn?: () => void;
}) {
    const path = usePathname();

    function goFullScreen() {
        type FullscreenElement = HTMLElement & {
            webkitRequestFullscreen?: () => Promise<void>;
            msRequestFullscreen?: () => Promise<void>;
        };
        if (fullscreenRef?.current) {
            const element = fullscreenRef.current as FullscreenElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    }

    function closeFullScreen() {
        type FullscreenDocument = Document & {
            webkitExitFullscreen?: () => Promise<void>;
            msExitFullscreen?: () => Promise<void>;
        };
        const doc = document as FullscreenDocument;
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        }
    }

    const weeksMap = new Map<number, Date[]>();
    const monthMap = new Map<number, Date[]>();

    intervalDates.forEach((date) => {
        const weekNumber = getWeekNumber(date);
        weeksMap.set(weekNumber, [...(weeksMap.get(weekNumber) || []), date]);

        const monthNumber = date.getMonth();
        monthMap.set(monthNumber, [...(monthMap.get(monthNumber) || []), date]);
    });

    const WeekPostfix = () => {
        if (periodOptions.period === "week") {
            const months = Array.from(monthMap.values()).map((array, i) => {
                const content = capitalize(
                    Intl.DateTimeFormat("ru", { month: "long" }).format(
                        array[0],
                    ),
                );
                if (
                    useHeaderNavigation &&
                    periodOptions.allowedPeriods.has("month")
                ) {
                    return (
                        <DateLink
                            date={array[0]}
                            period="month"
                            path={path}
                            clickFn={navigationFn}
                            searchParams={searchParams}
                            key={`keyOfDateLink${i}`}
                        >
                            {content}
                        </DateLink>
                    );
                }

                return content;
            });

            if (months.length === 1) {
                return <>{months[0]}</>;
            } else {
                return (
                    <>
                        {months[0]}
                        &nbsp;{`и`}&nbsp;
                        {months[1]}
                    </>
                );
            }
        }
    };

    const MainContent = () => {
        if (periodOptions.period === "month") {
            const date = new UTCDateMini(
                2022,
                intervalDates[2].getUTCMonth(),
                2,
            );

            const month = capitalize(
                Intl.DateTimeFormat("ru", {
                    month: "long",
                    timeZone: "UTC",
                }).format(date),
            );
            const year = intervalDates[2].getUTCFullYear();

            if (
                useHeaderNavigation &&
                periodOptions.allowedPeriods.has("year")
            ) {
                return (
                    <>
                        {`${month},`}&nbsp;
                        <DateLink
                            date={intervalDates[2]}
                            period="year"
                            path={path}
                            clickFn={navigationFn}
                            searchParams={searchParams}
                        >
                            {year}
                        </DateLink>
                    </>
                );
            } else {
                return (
                    <>
                        {month + ", "}&nbsp;{year}
                    </>
                );
            }
        }

        if (periodOptions.period === "year") {
            return intervalDates[1].getUTCFullYear();
        }

        if (periodOptions.period === "week") {
            return (
                <>
                    {`${Array.from(weeksMap.keys())[0]},`}&nbsp;
                    <WeekPostfix />
                </>
            );
        }
    };

    return (
        <div className={containerStyles.upper_div}>
            <div className={containerStyles.month_div}>
                <MainContent />
            </div>

            <div className={containerStyles.button_div}>
                <Button
                    type="filled"
                    colors="filled-gray"
                    innerContent={"На весь экран"}
                    onClick={goFullScreen}
                    className={`${containerStyles.fullscreen} ${containerStyles.open}`}
                />
                <Button
                    type="filled"
                    colors="filled-gray"
                    innerContent={"Закрыть"}
                    onClick={closeFullScreen}
                    className={`${containerStyles.fullscreen} ${containerStyles.close}`}
                />
            </div>
        </div>
    );
}

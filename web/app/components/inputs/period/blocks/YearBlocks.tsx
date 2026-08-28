import { formatISODate } from "@/app/functions/dates";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { ALLOWED_YEARS } from "@/app/global/ALLOWED_YEARS";
import { startOfYear, endOfYear } from "date-fns";

import styles from "./../css/modal.module.scss";

export function YearBlocks({
    periodOptions,
    yearChangeFn,
}: {
    periodOptions: PeriodOptions;

    yearChangeFn: (year: number) => void;
}) {
    const selectedMonth = new Date(periodOptions.start).getMonth();
    const selectedYear = new Date(periodOptions.start).getFullYear();

    const selected = (year: number) => {
        if (periodOptions.period === "year") {
            const date = new Date(year, selectedMonth);
            return (
                    periodOptions.start === formatISODate(startOfYear(date)) &&
                        periodOptions.end === formatISODate(endOfYear(date))
                ) ?
                    styles.selected
                :   "";
        } else {
            return selectedYear === year ? styles.selected : "";
        }
    };

    const blocks: React.ReactNode[] = [];
    for (
        let i = ALLOWED_YEARS[0];
        i <= ALLOWED_YEARS[ALLOWED_YEARS.length - 1];
        i++
    ) {
        blocks.push(
            <div
                className={`${styles.block} ${selected(i)}`}
                key={i}
                onClick={() => yearChangeFn(i)}
            >
                {i}
            </div>,
        );
    }
    return blocks;
}

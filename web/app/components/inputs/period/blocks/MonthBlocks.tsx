"use client";
import { getWeeksByMonth, formatISODate } from "@/app/functions/dates";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { isSameMonth, isThisMonth } from "date-fns";

import styles from "./../css/modal.module.scss";

export function MonthBlocks({
	type,
	dateChangeFn,
	periodOptions,
	initialPeriodOptions,
}: {
	type: "week" | "month";
	dateChangeFn: (month: number) => void;

	periodOptions: PeriodOptions;
	initialPeriodOptions: PeriodOptions;
}) {
	const selectedYear = new Date(periodOptions.start).getFullYear();
	const weeksByMonth = getWeeksByMonth(selectedYear);

	const selected = (i: number) => {
		if (type === "month") {
			return (
				initialPeriodOptions.start ===
					formatISODate(new Date(selectedYear, i)) &&
				initialPeriodOptions.end ===
					formatISODate(new Date(selectedYear, i + 1, 0))
			);
		}
		return (
			isSameMonth(initialPeriodOptions.start, new Date(selectedYear, i)) &&
			initialPeriodOptions.period === "week"
		);
	};

	const blocks: React.ReactNode[] = [];
	for (let i = 0; i < 12; i++) {
		blocks.push(
			<div
				className={`month_block ${
					selected(i) ? styles.selected : ""
				} ${styles.block} ${
					isThisMonth(new Date(selectedYear, i)) ? styles.current : ""
				}`}
				key={i}
				onClick={() => dateChangeFn(i)}
			>
				<div className={styles.month_name}>
					{Intl.DateTimeFormat("ru-RU", {
						month: "short",
					}).format(new Date(2024, i))}
				</div>
				{type === "month" ? (
					<div className={styles.month_number}>{i + 1}</div>
				) : (
					<div className={styles.week_numbers}>
						{weeksByMonth[i].weeks[0].weekNumber +
							"-" +
							weeksByMonth[i].weeks[weeksByMonth[i].weeks.length - 1]
								.weekNumber}
					</div>
				)}
			</div>,
		);
	}
	return blocks;
}

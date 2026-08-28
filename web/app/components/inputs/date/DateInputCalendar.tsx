import { useState } from "react";
import {
	eachDayOfInterval,
	eachWeekOfInterval,
	endOfMonth,
	endOfWeek,
	isThisMonth,
	isToday,
	isWeekend,
	startOfMonth,
} from "date-fns";
import { PeriodPicker } from "../period/PeriodPicker";
import { formatUTCDate } from "@/app/functions/dates";
import { UTCDateMini } from "@date-fns/utc";
import styles from "./css/date-input-calendar.module.scss";

export default function DateInputCalendar({
	/* type, */

	isDisabled,
	setOfSelectedDates,
	reservedDates,
	fn,

	shouldUseModal,
	maxSelectedDates = 20,
}: {
	type: "date" | "dates" | "period";

	isDisabled?: boolean;
	setOfSelectedDates: Set<string>;
	reservedDates?: string[];
	fn: (date: Date) => void;

	shouldUseModal?: boolean;
	maxSelectedDates?: number;
}) {
	const [yearAndMonth, setYearAndMonth] = useState(() => {
		if (setOfSelectedDates.size > 0) {
			const date = new UTCDateMini([...setOfSelectedDates][0]);
			return {
				year: date.getUTCFullYear(),
				month: date.getUTCMonth(),
			};
		}
		const date = new UTCDateMini();
		return {
			year: date.getUTCFullYear(),
			month: date.getUTCMonth(),
		};
	});

	const startDate = startOfMonth(
		new UTCDateMini(yearAndMonth.year, yearAndMonth.month, 2),
	);
	const endDate = endOfMonth(startDate);

	const weeks = eachWeekOfInterval(
		{ start: startDate, end: endDate },
		{ weekStartsOn: 1 },
	);

	const isCurrentMonth = isThisMonth(startDate);

	return (
		<div
			className={`${styles.date_selector_div} ${isDisabled ? styles.disabled : ""}`}
		>
			<input
				value={setOfSelectedDates.size > 0 ? setOfSelectedDates.size : ""}
				type="number"
				required={true}
				hidden={true}
				onChange={() => {}}
				name="dates_count"
			/>
			<div className={styles.main_div}>
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
							setYearAndMonth({
								year: date.getUTCFullYear(),
								month: date.getUTCMonth(),
							});
						}}
						shouldUseModal={shouldUseModal}
						isDisabled={isDisabled}
						className={styles.period_picker}
					/>
				</div>
				<div className={styles.calendar_div}>
					<div className={styles.weekdays}>
						{Array.from({ length: 7 }, (_, i) => i).map((index) => {
							const day = new UTCDateMini(0, 0, index + 1);
							return (
								<div className={styles.weekday} key={index}>
									{day.toLocaleString("ru", {
										weekday: "short",
										timeZone: "UTC",
									})}
								</div>
							);
						})}
					</div>
					<div className={styles.dates}>
						{weeks.map((weekStart, weekIndex) => (
							<div className={styles.week} key={weekIndex}>
								{eachDayOfInterval({
									start: weekStart,
									end: endOfWeek(weekStart, {
										weekStartsOn: 1,
									}),
								}).map((date, dayIndex) => {
									const dayOfCurrentMonth =
										date.getMonth() === yearAndMonth.month;

									const isSelected = setOfSelectedDates.has(
										formatUTCDate(date),
									);

									const isDisabledDate = reservedDates?.includes(
										formatUTCDate(date),
									);
									return (
										/* 		<button> */
										<button
											className={`${styles.day} ${isWeekend(date) ? styles.weekend : ""} ${
												isCurrentMonth && isToday(date) ? styles.today : ""
											} ${!dayOfCurrentMonth ? styles.empty : ""} ${
												isSelected ? styles.selected : ""
											} ${isDisabled ? styles.disabled : ""} ${
												isDisabledDate && !isDisabled
													? styles.disabled_date
													: ""
											}`}
											key={dayIndex}
											type="button"
											onClick={() => {
												if (isDisabledDate && !isSelected) return;
												if (
													dayOfCurrentMonth &&
													setOfSelectedDates.size < maxSelectedDates &&
													!isDisabled
												) {
													fn(date);
												}
											}}
										>
											{dayOfCurrentMonth ? date.getDate() : ""}
										</button> /* </button> */
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

"use client";

import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { startOfYear, endOfYear } from "date-fns";
import React from "react";
import { YearBlocks } from "../blocks/YearBlocks";

import styles from "./../css/modal.module.scss";

export function YearPicker({
	periodOptions,
	initialPeriodOptions,

	handleGlobalPeriodChange,
}: {
	periodOptions: PeriodOptions;
	initialPeriodOptions: PeriodOptions;

	handleGlobalPeriodChange?: (start: string | Date, end: string | Date) => void;
}) {
	function handleGlobalYearChange(year: number) {
		const startDate = startOfYear(new Date(year, 1));
		const endDate = endOfYear(new Date(year, 6));

		handleGlobalPeriodChange?.(startDate, endDate);
	}

	return (
		<>
			<div className={styles.year_body + " " + styles.body}>
				Пожалуйста, выберите год.
			</div>
			<div className={styles.year}>
				<YearBlocks
					periodOptions={periodOptions}
					yearChangeFn={handleGlobalYearChange}
				/>
			</div>
		</>
	);
}

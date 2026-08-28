"use client";

import PeriodCalendarWithDates from "@/app/(app)/finance/payslips/_lib/modal/PeriodCalendarWithDates";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { useState } from "react";

export function CustomPicker({
    periodOptions,
    setPeriodOptions,
    dateChangeFn,
    setDialogIsOpen,
}: {
    periodOptions: PeriodOptions;
    setPeriodOptions: (periodOptions: PeriodOptions) => void;
    dateChangeFn?: (start: string, end: string) => void;
    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const [localDates, setLocalDates] = useState<string[]>([]);

    return (
        <div className="custom_div">
            <PeriodCalendarWithDates
                onChange={(dates: string[]) => {
                    setLocalDates(dates);
                    if (dates.length === 2) {
                        dateChangeFn?.(dates[0], dates[1]);
                        setDialogIsOpen(false);
                    }
                }}
                onResetClick={() => setLocalDates([])}
                dates={localDates}
                maxPeriodDays={90}
            />
        </div>
    );
}

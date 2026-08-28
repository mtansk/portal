"use client";

import useParamsChanger from "@/app/components/hooks/useParamsChanger";
import styles from "./css/header.module.scss";
import { PeriodPicker } from "@/app/components/inputs/period/PeriodPicker";
import { MyPayslipsSearchParams } from "../../page";

export default function MyPayslipsHeader({
    searchParams,
}: {
    searchParams: MyPayslipsSearchParams;
}) {
    return (
        <div className={styles.finance_header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Мои расчетные листы</div>
                <div className={styles.period}>
                    <PeriodPicker
                        allowedPeriods={new Set(["month", "week", "custom"])}
                        defaultPeriod="month"
                        initialParams={searchParams}
                        shouldUseURL={true}
                        key={searchParams.start + searchParams.end}
                    />
                </div>
            </div>
        </div>
    );
}

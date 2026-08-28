"use client";

import useParamsChanger from "@/app/components/hooks/useParamsChanger";
import styles from "./css/header.module.scss";
import { PeriodPicker } from "@/app/components/inputs/period/PeriodPicker";
import { MyFinanceSearchParams } from "../../page";

export default function MyFinanceHeader({
    searchParams,
}: {
    searchParams: MyFinanceSearchParams;
}) {
    const changeParams = useParamsChanger();

    return (
        <div className={styles.finance_header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Моя зарплата</div>

                <div className={styles.options}>
                    <select
                        value={searchParams.a}
                        onChange={(e) => changeParams("a", e.target.value)}
                    >
                        <option value="all">Все объекты</option>
                        <option value="active">Активные</option>
                        <option value="archive">Архивные</option>
                    </select>
                </div>
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

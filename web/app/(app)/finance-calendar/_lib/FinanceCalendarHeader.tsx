import { PeriodPicker } from "@/app/components/inputs/period/PeriodPicker";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import styles from "./css/header.module.scss";
import { FinanceCalendarSearchParams } from "../page";
import { ApiDept } from "@/app/types/depts/Depts";
import { usePathname, useRouter } from "next/navigation";
import { FormTypes } from "@/app/components/hooks/useFormHandler";
import { memo } from "react";
import { Button } from "@/app/components/buttons/Buttons";

export const FinanceCalendarHeader = memo(function FinanceCalendarHeader({
    searchParams,
    periodOptions,

    depts,

    handleConfigureClick,

    isAdding,
    setIsAdding,

    disabledSaveButton,
    onSaveClick,
    isLoading,

    clickFn,
}: {
    searchParams: FinanceCalendarSearchParams;
    periodOptions: PeriodOptions;

    depts: ApiDept[];

    handleConfigureClick: (id: "-1", type: FormTypes) => void;

    isAdding: boolean;
    setIsAdding: (value: boolean) => void;

    disabledSaveButton: boolean;
    onSaveClick: () => void;
    isLoading?: boolean;

    clickFn?: () => void;
}) {
    const path = usePathname();
    const router = useRouter();

    function handleParamsChange(name: string, value: string) {
        const URLparams = new URLSearchParams(searchParams);
        URLparams.set(name, value);
        router.replace(`${path}?${URLparams.toString()}`);
    }

    const modifiedDepts = [...depts];
    modifiedDepts.unshift({
        department_id: "0",
        department_name: "Все отделы",
        department_color: "#000000",
    });

    return (
        <div className={styles.finance_calendar_header}>
            <div className={styles.main_div}>
                <div className={styles.title}>
                    Календарь{" "}
                    {searchParams.object === "accruals" && "начислений"}
                    {searchParams.object === "payments" && "выплат"}
                    {searchParams.object === "reductions" && "удержаний"}
                </div>
                <div className={styles.period}>
                    <PeriodPicker
                        allowedPeriods={new Set(["month", "year", "week"])}
                        initialParams={searchParams}
                        shouldUseURL={true}
                        clickFn={clickFn}
                        isDisabled={isAdding}
                        key={
                            periodOptions.start +
                            periodOptions.end +
                            periodOptions.period
                        }
                    />
                </div>

                {!isAdding ?
                    <>
                        <div className={styles.add}>
                            {periodOptions.period === "week" ?
                                <Button
                                    innerContent="Режим добавления"
                                    type="nav"
                                    colors="nav-blue"
                                    isDisabled={
                                        isLoading ||
                                        periodOptions.period !== "week"
                                    }
                                    onClick={() => {
                                        setIsAdding(true);
                                    }}
                                />
                            :   <div className={styles.add_title}>
                                    Добавление доступно при виде за неделю.
                                </div>
                            }
                        </div>
                        <div className={styles.options_div}>
                            <div className={styles.object}>
                                <select
                                    value={searchParams.object}
                                    onChange={(e) => {
                                        handleParamsChange(
                                            "object",
                                            e.target.value,
                                        );
                                    }}
                                >
                                    <option value="accruals">Начисления</option>
                                    <option value="reductions">
                                        Удержания
                                    </option>
                                    <option value="payments">Выплаты</option>
                                </select>
                            </div>
                            <div className={styles.sum}>
                                <select
                                    value={searchParams.sum}
                                    onChange={(e) => {
                                        handleParamsChange(
                                            "sum",
                                            e.target.value,
                                        );
                                    }}
                                >
                                    <option value="all">Все</option>
                                    <option value="arc">Архивные</option>
                                    <option value="act">Активные</option>
                                </select>
                            </div>
                            <div className={styles.dept}>
                                <select
                                    value={searchParams.dept}
                                    onChange={(e) => {
                                        handleParamsChange(
                                            "dept",
                                            e.target.value,
                                        );
                                    }}
                                >
                                    {modifiedDepts.map((dept) => (
                                        <option
                                            key={dept.department_id}
                                            value={dept.department_id}
                                        >
                                            {dept.department_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </>
                :   <>
                        <div className={styles.cancel}>
                            <Button
                                type="filled"
                                colors="filled-gray"
                                isDisabled={isLoading}
                                innerContent="Отмена"
                                onClick={() => {
                                    setIsAdding(false);
                                }}
                            />
                        </div>
                        <div className={styles.button_div}>
                            <Button
                                type="nav"
                                colors="nav-purple"
                                isDisabled={isLoading}
                                innerContent={
                                    searchParams.object === "accruals" ?
                                        "Настроить начисление"
                                    : searchParams.object === "payments" ?
                                        "Настроить выплату"
                                    :   "Настроить удержание"
                                }
                                onClick={() => {
                                    handleConfigureClick("-1", "template");
                                }}
                            />

                            <div className={styles.save_div}>
                                <Button
                                    innerContent="Сохранить"
                                    type="nav"
                                    colors="nav-blue"
                                    isPending={isLoading}
                                    isDisabled={disabledSaveButton}
                                    onClick={onSaveClick}
                                />
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    );
});

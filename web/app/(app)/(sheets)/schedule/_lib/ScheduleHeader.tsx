"use client";

import { ApiDept } from "@/app/types/depts/Depts";
import { memo } from "react";
import { ScheduleSearchParams } from "../page";
import { PeriodPicker } from "@/app/components/inputs/period/PeriodPicker";
import { FormTypes } from "@/app/components/hooks/useFormHandler";

import styles from "./css/header.module.scss";
import { Button } from "@/app/components/buttons/Buttons";
import useParamsChanger from "@/app/components/hooks/useParamsChanger";

const ScheduleHeader = memo(function ScheduleHeader({
    searchParams,

    depts,
    handleConfigureClick,

    isAdding,
    setIsAdding,

    multiplier,
    setMultiplier,

    disabledSaveButton,
    onSaveClick,
    isLoading,

    clickFn,
}: {
    searchParams: ScheduleSearchParams;

    depts: ApiDept[];
    handleConfigureClick: (id: "-1", type: FormTypes) => void;

    isAdding: boolean;
    setIsAdding: (value: boolean) => void;

    multiplier: number;
    setMultiplier: (value: number) => void;

    disabledSaveButton: boolean;
    onSaveClick: () => void;
    isLoading?: boolean;

    clickFn?: () => void;
}) {
    const changeParams = useParamsChanger();

    const modifiedDepts = [...depts];
    modifiedDepts.unshift({
        department_id: "0",
        department_name: "Все отделы",
        department_color: "#000000",
    });

    const LeftDivContent = () => {
        if (isAdding) {
            return (
                <>
                    <div className={styles.title}>Режим добавления</div>
                    <div className={styles.left_button}>
                        <Button
                            innerContent="Отмена"
                            type="filled"
                            colors="filled-gray"
                            isDisabled={isLoading}
                            onClick={() => {
                                setIsAdding(false);
                            }}
                        />
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className={styles.title}>График работы</div>
                    <div className={styles.left_button}>
                        <Button
                            innerContent="Режим добавления"
                            type="nav"
                            colors="nav-blue"
                            isDisabled={isLoading}
                            onClick={() => {
                                setIsAdding(true);
                            }}
                        />
                    </div>
                </>
            );
        }
    };

    const RightDivContent = () => {
        if (isAdding) {
            return (
                <>
                    <div className={styles.options}>
                        <div className={styles.multiplier}>
                            <div className="text">Добавлять по</div>
                            <select
                                value={multiplier}
                                onChange={(e) =>
                                    setMultiplier(parseInt(e.target.value))
                                }
                                disabled={isLoading}
                            >
                                {[1, 2, 3, 4, 5].map((value) => {
                                    return (
                                        <option
                                            key={value}
                                            value={value}
                                        >
                                            {value}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className={styles.right_buttons}>
                        <Button
                            type="nav"
                            colors="nav-purple"
                            innerContent="Настроить смену"
                            isDisabled={isLoading}
                            onClick={() =>
                                handleConfigureClick("-1", "template")
                            }
                        />
                        <div className={styles.save_div}>
                            <Button
                                isPending={isLoading}
                                isDisabled={disabledSaveButton}
                                type="nav"
                                colors="nav-blue"
                                onClick={onSaveClick}
                                innerContent="Сохранить"
                            />
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <div className={styles.options}>
                    <div className={styles.factual}>
                        <select
                            value={searchParams.factual}
                            onChange={(e) =>
                                changeParams("factual", e.target.value)
                            }
                            disabled={isLoading}
                        >
                            <option value="false">Плановое время</option>
                            <option value="true">Фактическое время</option>
                        </select>
                    </div>
                    <div className={styles.dept_filter}>
                        <select
                            value={searchParams.filter}
                            onChange={(e) =>
                                changeParams("filter", e.target.value)
                            }
                            disabled={isLoading}
                        >
                            {modifiedDepts.map((dept) => {
                                return (
                                    <option
                                        key={dept.department_id}
                                        value={dept.department_id}
                                    >
                                        {dept.department_name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className={styles.schedule_header}>
            <div
                className={
                    styles.main_schedule_header +
                    " " +
                    styles[isAdding ? "adding" : ""]
                }
            >
                <LeftDivContent />

                <RightDivContent />
                <div className={styles.period}>
                    <PeriodPicker
                        allowedPeriods={new Set(["month", "week"])}
                        defaultPeriod="month"
                        initialParams={searchParams}
                        shouldUseModal={true}
                        shouldUseURL={true}
                        isDisabled={isAdding}
                        clickFn={clickFn}
                        key={searchParams.start + searchParams.end + isAdding}
                    />
                </div>
            </div>
        </div>
    );
});

export default ScheduleHeader;

"use client";

import { useMemo } from "react";

import Sheet, { SheetConstructorObject } from "@/app/classes/Sheet";
import { useFormHandler } from "@/app/components/hooks/useFormHandler";
import FormTimeInput from "@/app/components/inputs/time/FormTimeInput";
import { timeFromSeconds } from "@/app/functions/dates";
import { SHEET_STATUSES } from "@/app/global/SHEET_STATUSES";

import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import CustomRadio from "@/app/components/inputs/radio/CustomRadio";
import { SingleDateInputMemo } from "@/app/components/inputs/defaults/date-calendar-single-memo/SingleDateInputMemo";
import { FormPrettyUserBlock } from "@/app/components/inputs/defaults/pretty-user/FormPrettyUserBlock";
import DummyInput from "@/app/components/inputs/DummyInput";
import { MEASURE_TYPES } from "@/app/global/MEASURE_TYPES";

import FormHeader from "@/app/components/form/header/FormHeader";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import styles from "./my-sheet-form.module.scss";
import MyFormHandler from "@/app/components/form/MyFormHandler";
import MyFormBadges from "@/app/(app)/finance/reductions/_lib/form/MyFormBadges";
import MyDesc from "@/app/(app)/my/finance/overview/_lib/form/MyDesc";

export default function MySheetForm({
    initialSheet,
    view,
    setDialogIsOpen,
}: {
    initialSheet: SheetConstructorObject;
    view: "page" | "modal";
    setDialogIsOpen?: (dialogIsOpen: boolean) => void;
}) {
    const { object: sheet, isDisabled } = useFormHandler(
        initialSheet,
        "edit",
        useMemo(() => {
            return new Sheet(initialSheet, undefined);
        }, [initialSheet]),
    );

    function handleOnChange<K extends keyof Sheet>(name: K, value: Sheet[K]) {}

    const sheetStatuses = SHEET_STATUSES;

    const isRequired = sheet.sheet_status === "workday";

    const Start = (
        <div className={styles.start}>
            <div className={styles.title3}>Начало</div>
            <InputWrapper
                isDisabled={isDisabled}
                required={true}
            >
                <FormTimeInput
                    disabled={isDisabled}
                    required={isRequired}
                    value={
                        sheet.sheet_p_st !== null ?
                            timeFromSeconds(sheet.sheet_p_st)
                        :   ""
                    }
                    handleTimeInputChange={handleOnChange}
                    name={"sheet_p_st"}
                    tabIndex={1}
                />
            </InputWrapper>
            <InputWrapper
                isDisabled={isDisabled}
                required={false}
            >
                <FormTimeInput
                    disabled={isDisabled}
                    required={false}
                    value={
                        sheet.sheet_f_st !== null ?
                            timeFromSeconds(sheet.sheet_f_st)
                        :   ""
                    }
                    handleTimeInputChange={handleOnChange}
                    name={"sheet_f_st"}
                    tabIndex={4}
                />
            </InputWrapper>
        </div>
    );

    const End = (
        <div className={styles.end}>
            <div className={styles.title3}>Окончание</div>
            <InputWrapper
                isDisabled={isDisabled}
                required={true}
            >
                <FormTimeInput
                    disabled={isDisabled}
                    required={isRequired}
                    value={
                        sheet.sheet_p_en !== null ?
                            timeFromSeconds(sheet.sheet_p_en)
                        :   ""
                    }
                    handleTimeInputChange={handleOnChange}
                    name={"sheet_p_en"}
                    tabIndex={2}
                />
            </InputWrapper>
            <InputWrapper
                isDisabled={isDisabled}
                required={false}
            >
                <FormTimeInput
                    disabled={isDisabled}
                    required={false}
                    value={
                        sheet.sheet_f_en !== null ?
                            timeFromSeconds(sheet.sheet_f_en)
                        :   ""
                    }
                    handleTimeInputChange={handleOnChange}
                    name={"sheet_f_en"}
                    tabIndex={5}
                />
            </InputWrapper>
        </div>
    );

    const PlusDay = (
        <div className={styles.plus_day}>
            <div className={styles.title3}>Окончание после 00:00</div>
            <CustomCheckbox
                isDisabled={isDisabled}
                value={sheet.sheet_plus_day_p === 1}
                text="Да"
                onChange={(b) => handleOnChange("sheet_plus_day_p", b ? 1 : 0)}
            />
            <CustomCheckbox
                isDisabled={isDisabled}
                value={sheet.sheet_plus_day_f === 1}
                text="Да"
                onChange={(b) => handleOnChange("sheet_plus_day_f", b ? 1 : 0)}
            />
        </div>
    );

    const Break = (
        <div className={styles.break}>
            <div className={styles.title3}>Перерывы</div>
            <InputWrapper
                isDisabled={isDisabled}
                required={true}
            >
                <FormTimeInput
                    disabled={isDisabled}
                    required={true}
                    value={
                        sheet.break_dur_p !== null ?
                            timeFromSeconds(sheet.break_dur_p)
                        :   ""
                    }
                    handleTimeInputChange={handleOnChange}
                    name={"break_dur_p"}
                    tabIndex={3}
                />
            </InputWrapper>
            <InputWrapper
                isDisabled={isDisabled}
                required={false}
            >
                <FormTimeInput
                    disabled={isDisabled}
                    required={false}
                    value={
                        sheet.break_dur_f !== null ?
                            timeFromSeconds(sheet.break_dur_f)
                        :   ""
                    }
                    handleTimeInputChange={handleOnChange}
                    name={"break_dur_f"}
                    tabIndex={6}
                />
            </InputWrapper>
        </div>
    );

    const TotalDur = (
        <>
            <div className={styles.total_dur}>
                <div className={styles.title3}>Рабочее время</div>
                <div
                    className={
                        styles.dur_time +
                        " " +
                        (sheet.sheet_dur_p && sheet.sheet_dur_p < 0 ?
                            styles.error
                        :   "")
                    }
                >
                    {timeFromSeconds(sheet.sheet_dur_p || 0)}
                </div>
                <div
                    className={
                        styles.dur_time +
                        " " +
                        (sheet.sheet_dur_f && sheet.sheet_dur_f < 0 ?
                            styles.error
                        :   "")
                    }
                >
                    {timeFromSeconds(sheet.sheet_dur_f || 0)}
                </div>
            </div>

            <DummyInput
                value={
                    sheet.sheet_dur_p !== null && sheet.sheet_dur_p >= 0 ?
                        "1"
                    :   ""
                }
            />
            <DummyInput
                value={
                    sheet.sheet_dur_f !== null && sheet.sheet_dur_f >= 0 ?
                        "1"
                    :   ""
                }
            />
        </>
    );

    return (
        <MyFormHandler
            view={view}
            setDialogIsOpen={setDialogIsOpen}
            title="Смена"
        >
            <div
                className={
                    styles.main_div +
                    " " +
                    (sheet.sheet_status === "workday" ? styles.workday : "") +
                    " " +
                    " " +
                    (view === "page" ? styles.page : "")
                }
            >
                <div className={styles.left_div}>
                    <div className={styles.status}>
                        <InputWrapper
                            isDisabled={isDisabled}
                            required={true}
                            label="Статус смены"
                            headerLike={true}
                        >
                            <select
                                disabled={isDisabled}
                                className={styles.status_select}
                                onChange={() => {}}
                                value={sheet.sheet_status}
                            >
                                {sheetStatuses.map((status) => (
                                    <option
                                        key={status.status}
                                        value={status.status}
                                    >
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </InputWrapper>
                    </div>

                    <div className={styles.user}>
                        <FormPrettyUserBlock user={undefined} />
                    </div>
                    <div className={styles.date}>
                        <SingleDateInputMemo
                            isDisabled={isDisabled}
                            selectedDate={sheet.sheet_date}
                            onChange={() => {}}
                            reservedDates={[]}
                        />
                    </div>
                </div>
                {sheet.sheet_status === "workday" && (
                    <>
                        <div className={styles.middle_div}>
                            <div className={styles.time_div}>
                                <FormHeader
                                    title="Время"
                                    className={styles.time_header}
                                />
                                <div className={styles.title1}>План.</div>
                                <div className={styles.title1}>Факт.</div>

                                {Start}
                                {End}
                                {PlusDay}
                                {Break}
                                {TotalDur}
                            </div>
                        </div>
                        <div className={styles.right_div}>
                            <div className={styles.payment}>
                                <FormHeader
                                    title="Оплата"
                                    className={styles.header}
                                />
                                <div className={styles.measure}>
                                    <InputWrapper
                                        required={true}
                                        isDisabled={isDisabled}
                                    >
                                        <CustomRadio
                                            array={MEASURE_TYPES}
                                            currentSelection={MEASURE_TYPES.find(
                                                (type) =>
                                                    type.measure_type ===
                                                    sheet.measure_type,
                                            )}
                                            getOptionText={(option) =>
                                                option?.measure_name || ""
                                            }
                                            handleSelection={(selection) => {
                                                handleOnChange(
                                                    "measure_type",
                                                    selection?.measure_type ||
                                                        "hour",
                                                );
                                            }}
                                            title="База оплаты"
                                            isDisabled={isDisabled}
                                        />
                                    </InputWrapper>
                                </div>
                                <div className={styles.rate}>
                                    <RateInput
                                        isDisabled={isDisabled}
                                        value={sheet.sheet_rate}
                                        onChange={(e) =>
                                            handleOnChange(
                                                "sheet_rate",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className={styles.payment_total}>
                                    <FinanceCurrencyStringNew
                                        total={
                                            sheet.use_f_payment ?
                                                (
                                                    sheet.sheet_payment_f || 0
                                                ).toString()
                                            :   (
                                                    sheet.sheet_payment_p || 0
                                                ).toString()
                                        }
                                        type="accrual"
                                        colored={true}
                                    />
                                </div>
                            </div>
                            <div className={styles.overtime}>
                                <FormHeader
                                    title="Сверхурочные"
                                    className={styles.header}
                                />
                                <div className={styles.overtime_rate}>
                                    <RateInput
                                        isDisabled={isDisabled}
                                        value={sheet.sheet_overtime_rate}
                                        onChange={(e) =>
                                            handleOnChange(
                                                "sheet_overtime_rate",
                                                e.target.value,
                                            )
                                        }
                                        required={false}
                                    />
                                </div>
                                <div className={styles.overtime_time}>
                                    <InputWrapper
                                        isDisabled={isDisabled}
                                        required={false}
                                        label="Время"
                                        id="overtime_time"
                                    >
                                        <FormTimeInput
                                            disabled={isDisabled}
                                            required={false}
                                            value={
                                                (
                                                    sheet.sheet_overtime_time !==
                                                    null
                                                ) ?
                                                    timeFromSeconds(
                                                        sheet.sheet_overtime_time,
                                                    )
                                                :   ""
                                            }
                                            handleTimeInputChange={
                                                handleOnChange
                                            }
                                            name={"sheet_overtime_time"}
                                            id="overtime_time"
                                        />
                                    </InputWrapper>
                                </div>
                                <div className={styles.overtime_total}>
                                    <FinanceCurrencyStringNew
                                        total={(
                                            sheet.sheet_overtime_total || 0
                                        ).toString()}
                                        type="accrual"
                                        colored={true}
                                    />
                                </div>
                            </div>
                            <div className={styles.options}>
                                <FormHeader
                                    title="Параметры"
                                    className={styles.header}
                                />
                                <div className={styles.use_f_payment}>
                                    <CustomCheckbox
                                        value={sheet.use_f_payment === 1}
                                        onChange={(checked) =>
                                            handleOnChange(
                                                "use_f_payment",
                                                checked ? 1 : 0,
                                            )
                                        }
                                        isDisabled={isDisabled}
                                        text="Оплата по факт. времени"
                                    />
                                </div>
                                <div className={styles.use_f_dur}>
                                    <CustomCheckbox
                                        value={sheet.use_f_dur === 1}
                                        onChange={(checked) =>
                                            handleOnChange(
                                                "use_f_dur",
                                                checked ? 1 : 0,
                                            )
                                        }
                                        isDisabled={isDisabled}
                                        text="Длительность по факт. времени"
                                    />
                                </div>
                                <div className={styles.use_overtime_dur}>
                                    <CustomCheckbox
                                        value={sheet.use_overtime_dur === 1}
                                        onChange={(checked) =>
                                            handleOnChange(
                                                "use_overtime_dur",
                                                checked ? 1 : 0,
                                            )
                                        }
                                        isDisabled={isDisabled}
                                        text="Длительность со сверхурочными"
                                    />
                                </div>
                            </div>
                            <div className={styles.totals}>
                                <div className={styles.header}>Итого</div>
                                <div
                                    className={
                                        styles.sheet_time_total +
                                        " " +
                                        ((
                                            sheet.sheet_total_dur &&
                                            sheet.sheet_total_dur < 0
                                        ) ?
                                            styles.error
                                        :   "")
                                    }
                                >
                                    {timeFromSeconds(sheet.sheet_total_dur)}
                                </div>
                                <div className={styles.sheet_payment_total}>
                                    <FinanceCurrencyStringNew
                                        total={(
                                            sheet.sheet_total || 0
                                        ).toString()}
                                        type="accrual"
                                        colored={false}
                                        archive={sheet.payslip_id !== null}
                                    />
                                </div>
                            </div>
                            <div className={styles.badges}>
                                <MyFormBadges obj={sheet} />
                            </div>
                        </div>
                    </>
                )}

                {sheet.sheet_desc && (
                    <div className={styles.desc}>
                        <FormHeader title="Дополнительно" />
                        <MyDesc value={sheet.sheet_desc} />
                    </div>
                )}
            </div>
        </MyFormHandler>
    );
}

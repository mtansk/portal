"use client";

import { useCallback, useMemo } from "react";

import Sheet, { SheetConstructorObject } from "@/app/classes/Sheet";
import FormHandler from "@/app/components/form/FormHandler";
import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";
import FormTimeInput from "@/app/components/inputs/time/FormTimeInput";
import { timeFromSeconds } from "@/app/functions/dates";
import { SHEET_STATUSES } from "@/app/global/SHEET_STATUSES";
import { deleteSheet } from "@/app/server-actions/sheets/deleteSheet";
import { postSheet } from "@/app/server-actions/sheets/postSheet";
import { putSheet } from "@/app/server-actions/sheets/putSheet";
import { ApiUser } from "@/app/types/user/Users";

import { FinanceCurrencyStringNew } from "@/app/(app)/finance/_lib/other/FinanceCurrencyString";
import { FormOptions } from "@/app/(app)/finance/accruals/_lib/form/AccrualsForm";
import { Formatter } from "@/app/classes/Formatter";
import { FormButtonsNotation } from "@/app/components/form/buttons/FormButtons";
import { useIdDateMap } from "@/app/components/hooks/useIdDateMap";
import CustomCheckbox from "@/app/components/inputs/checkbox/CustomCheckbox";
import CustomRadio from "@/app/components/inputs/radio/CustomRadio";
import { MultipleDateInputMemo } from "@/app/components/inputs/defaults/date-calendar-multiple-memo/MultipleDateInputMemo";
import { SingleDateInputMemo } from "@/app/components/inputs/defaults/date-calendar-single-memo/SingleDateInputMemo";
import { FormPrettyUserBlock } from "@/app/components/inputs/defaults/pretty-user/FormPrettyUserBlock";
import { MultipleUserInputNew } from "@/app/components/inputs/defaults/user-multiple-new/MultipleUserInputNew";
import DummyInput from "@/app/components/inputs/DummyInput";
import { MEASURE_TYPES } from "@/app/global/MEASURE_TYPES";
import { ReservedDates } from "@/app/server-actions/sheets/getReservedDates";
import { ApiDefaultSheet } from "@/app/types/default-sheet/DefaultSheets";
import { ApiSheetRate } from "@/app/types/sheet-rate/SheetRates";

import FormHeader from "@/app/components/form/header/FormHeader";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { ApiDept } from "@/app/types/depts/Depts";
import styles from "./css/sheet-form.module.scss";
import { ApiPayslip } from "@/app/types/finance/payslip/Payslips";
import FormBadges from "@/app/(app)/finance/reductions/_lib/form/FormBadges";
import { PayslipInput } from "@/app/components/inputs/defaults/payslip-input/PayslipInput";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import { SheetStatuses } from "@/app/types/sheet/Sheets";

export default function SheetForm({
    initialSheet,

    users,
    depts,
    payslips,
    sheetRates,
    defaultSheets,

    reservedDates,

    type,
    view,

    setDialogIsOpen,

    templateSheet,
    setTemplateSheet,
    options,

    after,
}: {
    initialSheet: SheetConstructorObject;

    users: ApiUser[];
    depts?: ApiDept[];
    payslips?: ApiPayslip[];
    sheetRates: ApiSheetRate[];
    defaultSheets: ApiDefaultSheet[];

    reservedDates: ReservedDates[];

    type: FormTypes;
    view: "page" | "modal";

    setDialogIsOpen?: (dialogIsOpen: boolean) => void;

    templateSheet?: Sheet | null;
    setTemplateSheet?: (sheet: Sheet | null) => void;
    options?: FormOptions;

    after?: () => void;
}) {
    const {
        object: sheet,
        setObject: setSheet,
        actionType,
        setActionType,
        isDisabled,
    } = useFormHandler(
        initialSheet,
        type,
        useMemo(() => {
            if (templateSheet) {
                return templateSheet;
            }
            return new Sheet(initialSheet, undefined);
        }, [initialSheet, templateSheet]),
    );

    const newMap = useIdDateMap(sheet.user_id, sheet.sheet_date);

    function handleOnChange<K extends keyof Sheet>(name: K, value: Sheet[K]) {
        setSheet((prev) => {
            const copy = prev.copy();
            copy.setterFn(name, value);
            return copy;
        });
    }

    function handleDefSheetSelection(defaultSheet: ApiDefaultSheet) {
        const copy = sheet.copy();
        copy.setterFn("sheet_p_st", defaultSheet.def_sheet_st);
        copy.setterFn("sheet_p_en", defaultSheet.def_sheet_en);
        copy.setterFn("break_dur_p", defaultSheet.def_sheet_break);
        copy.setterFn("sheet_plus_day_p", defaultSheet.def_sheet_plus_day);
        setSheet(copy);
    }

    function handleRateSelect(rate: formattedSheetRate) {
        const copy = sheet.copy();
        copy.setterFn("sheet_rate", rate.sheet_rate_rate);
        copy.setterFn("measure_type", rate.measure_type);
        setSheet(copy);
    }

    const sheetStatuses = SHEET_STATUSES;

    const isRequired = sheet.sheet_status === "workday";

    type formattedSheetRate = ApiSheetRate & {
        sheet_rate_formattedRate: string;
    };

    const formattedSheetRates = sheetRates.map((rate) => {
        const copy = { ...rate } as formattedSheetRate;
        copy.sheet_rate_formattedRate = Formatter.currencyString({
            value: rate.sheet_rate_rate,
        });
        return copy;
    }) as formattedSheetRate[];

    const userReservedDates = useMemo(() => {
        const userDates = reservedDates?.find(
            (reserved) => reserved.user_id === sheet.user_id,
        )?.reserved_dates;

        if (type === "add") {
            return userDates;
        } else {
            return userDates?.filter(
                (date) => date !== initialSheet.sheet_date,
            );
        }
    }, [reservedDates, sheet.user_id, type, initialSheet.sheet_date]);

    const handleSingleDateSelection = useCallback(
        (date: string[]) => {
            if (date.length === 0) return;
            newMap.setSingleDate(date[0]);
            setSheet((prev) => {
                const copy = prev.copy();
                copy.setterFn("sheet_date", date[0]);
                return copy;
            });
        },
        [setSheet, newMap],
    );

    const handleMultipleDateSelection = useCallback(
        (date: string[]) => {
            newMap.switchUserDate(date[0]);
        },
        [newMap],
    );

    const handlePayslipSelection = useCallback(
        (payslip_id: string | null) => {
            setSheet((prev) => {
                const copy = prev.copy();
                copy.payslip_id = payslip_id;
                return copy;
            });
        },
        [setSheet],
    );

    const user = useMemo(
        () => users.find((user) => user.user_id === sheet.user_id),
        [users, sheet.user_id],
    );

    const buttonsNotation: FormButtonsNotation | undefined =
        setTemplateSheet ?
            {
                right: [
                    {
                        style: "ne",
                        text: "Выйти",
                        onClick: () => {
                            setDialogIsOpen?.(false);
                        },
                    },
                    {
                        style: "g",
                        text: "Сохранить",
                        onClick: () => {
                            setTemplateSheet(sheet);
                            setDialogIsOpen?.(false);
                        },
                        disabledByForm: true,
                    },
                ],
            }
        :   undefined;

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
        <FormHandler
            actionType={actionType}
            object={{ ...sheet }}
            view={view}
            setActionType={setActionType}
            setDialogIsOpen={setDialogIsOpen}
            actions={{
                async deleteAction() {
                    return await deleteSheet(sheet.createSQLObject());
                },
                async postAction() {
                    return await postSheet({
                        ...sheet.createSQLObject(),
                        ids: newMap.toSQL(),
                    });
                },
                async putAction() {
                    return await putSheet(sheet.createSQLObject());
                },
            }}
            pathOptions={{
                basePath: "/sheets",
                detailsOnEdit: true,
                id: sheet.sheet_id,
                detailsOnAdd: true,
                params: `uid=${sheet.user_id}`,
                redirectOnAdd: true,
            }}
            title="Смена"
            after={after}
            buttonsNotation={buttonsNotation}
        >
            <div
                className={
                    styles.main_div +
                    " " +
                    (sheet.sheet_status === "workday" ? styles.workday : "") +
                    " " +
                    (type === "template" ? styles.template : "") +
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
                                onChange={(e) => {
                                    handleOnChange(
                                        "sheet_status",
                                        e.target.value as SheetStatuses,
                                    );
                                }}
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
                    {!options?.template && (
                        <>
                            <div className={styles.user}>
                                {options?.user === "fixed" ?
                                    <FormPrettyUserBlock user={user} />
                                :   <MultipleUserInputNew
                                        users={users}
                                        depts={depts || []}
                                        selectedUsers={newMap.users}
                                        onSaveClick={newMap.setUsers}
                                        isDisabled={isDisabled}
                                    />
                                }
                            </div>
                            <div className={styles.date}>
                                {options?.date === "multiple" ?
                                    <MultipleDateInputMemo
                                        isDisabled={isDisabled}
                                        selectedDates={newMap.map.default}
                                        onChange={handleMultipleDateSelection}
                                        reservedDates={userReservedDates}
                                    />
                                :   <SingleDateInputMemo
                                        isDisabled={isDisabled}
                                        selectedDate={sheet.sheet_date}
                                        onChange={handleSingleDateSelection}
                                        reservedDates={userReservedDates}
                                    />
                                }
                            </div>
                        </>
                    )}
                </div>
                {sheet.sheet_status === "workday" && (
                    <>
                        <div className={styles.middle_div}>
                            {!isDisabled && (
                                <div className={styles.def_sheet}>
                                    <select
                                        value={"1"}
                                        className={styles.def_select}
                                        disabled={isDisabled}
                                        onChange={(e) => {
                                            const defaultSheet =
                                                defaultSheets.find(
                                                    (sheet) =>
                                                        sheet.def_sheet_id ===
                                                        e.target.value,
                                                );
                                            if (defaultSheet) {
                                                handleDefSheetSelection(
                                                    defaultSheet,
                                                );
                                            }
                                        }}
                                    >
                                        <option value="1">
                                            Подобрать время
                                        </option>
                                        {defaultSheets.map((option) => (
                                            <option
                                                key={option.def_sheet_id}
                                                value={option.def_sheet_id}
                                            >
                                                {`${option.def_sheet_name}, ${timeFromSeconds(
                                                    option.def_sheet_st || 0,
                                                )} - ${timeFromSeconds(
                                                    option.def_sheet_en || 0,
                                                )}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {!isDisabled && (
                                <div className={styles.def_rate}>
                                    {/*  <InputWithSearchbar
                                        initialArray={formattedSheetRates}
                                        currentSelection={undefined}
                                        getOptionText={(option) =>
                                            `${option.sheet_rate_name}. ${
                                                option.sheet_rate_formattedRate
                                            }/${
                                                option.measure_type === "hour" ?
                                                    "час"
                                                :   "смена"
                                            }`
                                        }
                                        defText="Подобрать ставку"
                                        isDisabled={isDisabled}
                                        handleSelection={handleRateSelect}
                                        clearOnSelection={true}
                                        className={styles.def}
                                    /> */}
                                    <select
                                        value={"1"}
                                        onChange={(e) => {
                                            const rate =
                                                formattedSheetRates.find(
                                                    (rate) =>
                                                        rate.sheet_rate_id ===
                                                        e.target.value,
                                                );
                                            rate && handleRateSelect(rate);
                                        }}
                                        className={styles.rate_select}
                                    >
                                        <option value={"1"}>
                                            Подобрать ставку
                                        </option>
                                        {formattedSheetRates.map((rate) => (
                                            <option
                                                key={rate.sheet_rate_id}
                                                value={rate.sheet_rate_id}
                                            >
                                                {rate.sheet_rate_name} (
                                                {rate.sheet_rate_formattedRate})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
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
                            {!options?.payslip && (
                                <div className={styles.badges}>
                                    <FormBadges obj={sheet} />
                                </div>
                            )}
                        </div>
                    </>
                )}
                {view === "page" && (
                    <div className={styles.desc}>
                        <FormHeader title="Дополнительно" />
                        <DescInput
                            isDisabled={isDisabled}
                            value={sheet.sheet_desc}
                            onChange={(e) =>
                                handleOnChange("sheet_desc", e.target.value)
                            }
                        />
                    </div>
                )}
                {options?.payslip && (
                    <div className={styles.payslip}>
                        <FormHeader title="Расчетный лист" />
                        <PayslipInput
                            payslips={payslips}
                            selectedPayslip={sheet.payslip_id}
                            onPayslipSelection={handlePayslipSelection}
                            isDisabled={isDisabled}
                        />
                    </div>
                )}
            </div>
        </FormHandler>
    );
}

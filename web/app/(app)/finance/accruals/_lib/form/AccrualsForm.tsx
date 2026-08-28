"use client";

import { useCallback, useMemo } from "react";
import { IDBGeneralRate } from "@/app/types/general-rate/GeneralRates";
import {
    ApiAccrualGroup,
    IDBAccrualGroup,
    NullableAccrualGroup,
} from "@/app/types/accrual-group/AccrualGroups";
import {
    FormTypes,
    useFormHandler,
} from "@/app/components/hooks/useFormHandler";
import { modifyRates } from "./AccrualsFormParent";
import { ApiUser } from "@/app/types/user/Users";
import deleteAccrual from "@/app/server-actions/finance/accruals/deleteAccrual";
import postAccrual from "@/app/server-actions/finance/accruals/postAccrual";
import putAccrual from "@/app/server-actions/finance/accruals/putAccrual";
import { ApiAccrual } from "@/app/types/finance/accrual/Accruals";
import Accrual, {
    AccrualConstructorObject,
} from "@/app/classes/finance/Accrual";
import FormHandler from "@/app/components/form/FormHandler";
import styles from "./css/accruals-form.module.scss";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { DescInput } from "@/app/components/inputs/defaults/desc/DescInput";
import { RateInput } from "@/app/components/inputs/defaults/rate/RateInput";
import { QtyInput } from "@/app/components/inputs/defaults/qty/QtyInput";
import FormHeader from "@/app/components/form/header/FormHeader";
import { FinanceCurrencyStringNew } from "../../../_lib/other/FinanceCurrencyString";
import DummyInput from "@/app/components/inputs/DummyInput";
import { MultipleDateInputMemo } from "../../../../../components/inputs/defaults/date-calendar-multiple-memo/MultipleDateInputMemo";
import { SingleDateInputMemo } from "../../../../../components/inputs/defaults/date-calendar-single-memo/SingleDateInputMemo";
import { ApiPayslip } from "@/app/types/finance/payslip/Payslips";
import { PayslipInput } from "../../../../../components/inputs/defaults/payslip-input/PayslipInput";
import { FormPrettyUserBlock } from "../../../../../components/inputs/defaults/pretty-user/FormPrettyUserBlock";
import { useIdDateMap } from "../../../../../components/hooks/useIdDateMap";
import { ApiDept } from "@/app/types/depts/Depts";
import { MultipleUserInputNew } from "@/app/components/inputs/defaults/user-multiple-new/MultipleUserInputNew";
import FormBadges from "../../../reductions/_lib/form/FormBadges";
import { FormButtonsNotation } from "@/app/components/form/buttons/FormButtons";
import { parseFloatAny } from "@/app/functions/other";
import FormTimeInput from "@/app/components/inputs/time/FormTimeInput";
import { timeFromSeconds } from "@/app/functions/dates";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import AccrualGroupSelectorNew from "@/app/components/inputs/defaults/accrual-group/AccrualGroupSelectorNew";

export type FormOptions = {
    user?: "single" | "multiple" | "fixed" | "none";
    date?: "single" | "multiple";
    payslip?: boolean;
    template?: boolean;
};

export default function AccrualForm({
    initialAccrual,

    accrualGroups,
    users,
    depts,
    rates,
    payslips,

    type,
    view,

    setDialogIsOpen,

    templateAccrual,
    setTemplateAccrual,

    options,
    /*     buttonsNotation, */

    after,
}: {
    initialAccrual: AccrualConstructorObject | ApiAccrual;

    accrualGroups: IDBAccrualGroup[] | undefined;
    users: ApiUser[];
    depts?: ApiDept[];
    rates: IDBGeneralRate[];
    payslips?: ApiPayslip[];

    type: FormTypes;
    view: "page" | "modal";

    setDialogIsOpen?: (value: boolean) => void;

    templateAccrual?: Accrual | null;
    setTemplateAccrual?: (accrual: Accrual | null) => void;

    options?: FormOptions;
    /*     buttonsNotation?: FormButtonsNotation; */

    after?: () => void;
}) {
    const {
        object: accrual,
        setObject: setAccrual,
        actionType,
        setActionType,
        isDisabled,
    } = useFormHandler(
        initialAccrual,
        type,
        useMemo(() => {
            return new Accrual(
                templateAccrual ?? {
                    ...initialAccrual,
                    accrual_group_id: initialAccrual.accrual_group_id,
                },
                undefined,
            );
        }, [initialAccrual, templateAccrual]),
    );

    const newMap = useIdDateMap(accrual.user_id, accrual.date);

    const modifiedAccrualGroupsArray: NullableAccrualGroup[] = (
        [
            {
                accrual_group_id: null,
                accrual_group_name: "Без группы",
            },
        ] as NullableAccrualGroup[]
    ).concat(accrualGroups || []);

    const modifiedRates = modifyRates(rates);

    function handleOnChange(
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) {
        const { name, value } = e.target;
        const copy = accrual.copy();
        copy.setterFn(name as keyof Accrual, value);
        setAccrual(copy);
    }

    function handleRateSelection(rate: IDBGeneralRate) {
        const copy = accrual.copy();
        copy.setterFn("rate", rate.general_rate_rate);
        copy.setterFn("name", rate.general_rate_name);
        copy.setterFn("accrual_group_id", rate.accrual_group_id);
        setAccrual(copy);
    }
    function handleGroupChange(group: ApiAccrualGroup | NullableAccrualGroup) {
        const copy = accrual.copy();
        copy.setterFn("accrual_group_id", group.accrual_group_id);
        setAccrual(copy);
    }

    const handleSingleDateSelection = useCallback(
        (date: string[]) => {
            if (date.length === 0) return;
            newMap.setSingleDate(date[0]);
            setAccrual((prev) => {
                const copy = prev.copy();
                copy.setterFn("date", date[0]);
                return copy;
            });
        },
        [setAccrual, newMap],
    );

    const handleMultipleDateSelection = useCallback(
        (date: string[]) => {
            newMap.switchUserDate(date[0]);
        },
        [newMap],
    );

    const handlePayslipSelection = useCallback(
        (payslip_id: string | null) => {
            setAccrual((prev) => {
                const copy = prev.copy();
                copy.payslip_id = payslip_id;
                return copy;
            });
        },
        [setAccrual],
    );

    const user = users.find((user) => user.user_id === accrual.user_id);

    const buttonsNotation: FormButtonsNotation | undefined =
        setTemplateAccrual ?
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
                            setTemplateAccrual(accrual);
                            setDialogIsOpen?.(false);
                        },
                        disabledByForm: true,
                    },
                ],
            }
        :   undefined;

    return (
        <FormHandler
            object={{ ...accrual }}
            actionType={actionType}
            setActionType={setActionType}
            view={view}
            title="Начисление"
            actions={{
                async deleteAction() {
                    return await deleteAccrual(accrual.createSQLObject());
                },
                async postAction() {
                    return await postAccrual({
                        ...accrual.createSQLObject(),
                        ids: newMap.toSQL(),
                    });
                },
                async putAction() {
                    return await putAccrual(accrual.createSQLObject());
                },
            }}
            pathOptions={{
                detailsOnEdit: true,
                basePath: "/finance/accruals",
                id: accrual.accrual_id,
                redirectOnAdd: true,
            }}
            setDialogIsOpen={setDialogIsOpen}
            after={after}
            key={"now" in initialAccrual ? initialAccrual.now : "1"}
            buttonsNotation={buttonsNotation}
        >
            <div className={styles.main_div}>
                {!options?.template && (
                    <div className={styles.left}>
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
                                />
                            :   <SingleDateInputMemo
                                    isDisabled={isDisabled}
                                    selectedDate={accrual.date}
                                    onChange={handleSingleDateSelection}
                                />
                            }
                        </div>
                    </div>
                )}
                <div className={styles.right}>
                    {!isDisabled && (
                        <div className={styles.def}>
                            <select
                                value={"1"}
                                onChange={(e) => {
                                    const rate = modifiedRates.find(
                                        (rate) =>
                                            rate.general_rate_id ===
                                            e.target.value,
                                    );
                                    rate && handleRateSelection(rate);
                                }}
                                className={styles.def_select}
                            >
                                <option value={"1"}>Подобрать ставку</option>
                                {modifiedRates.map((rate) => (
                                    <option
                                        key={rate.general_rate_id}
                                        value={rate.general_rate_id}
                                    >
                                        {rate.general_rate_name} (
                                        {rate.formattedRateString})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className={styles.group}>
                        {/*  <AccrualGroupSelector
                            isDisabled={isDisabled}
                            groups={modifiedAccrualGroupsArray}
                            selectedId={accrual.accrual_group_id}
                            onChange={handleGroupChange}
                        /> */}
                        <AccrualGroupSelectorNew
                            isDisabled={isDisabled}
                            groups={modifiedAccrualGroupsArray}
                            selectedId={accrual.accrual_group_id}
                            onChange={handleGroupChange}
                        />
                    </div>
                    <div className={styles.time}>
                        <InputWrapper
                            label="Время"
                            headerLike={true}
                            isDisabled={isDisabled}
                            required={false}
                        >
                            <FormTimeInput
                                disabled={isDisabled}
                                name={"accrual_time"}
                                value={
                                    accrual.accrual_time !== null ?
                                        timeFromSeconds(accrual.accrual_time)
                                    :   ""
                                }
                                handleTimeInputChange={(name, value) => {
                                    const copy = accrual.copy();
                                    copy.setterFn(name, value);
                                    setAccrual(copy);
                                }}
                            />
                        </InputWrapper>
                    </div>
                    <div className={styles.main}>
                        <FormHeader
                            title="Основные"
                            className={styles.header}
                        />
                        <div className={styles.name_and_desc}>
                            <NameInput
                                isDisabled={isDisabled}
                                value={accrual.name}
                                onChange={handleOnChange}
                            />
                            {view === "page" && (
                                <DescInput
                                    isDisabled={isDisabled}
                                    value={accrual.desc}
                                    onChange={handleOnChange}
                                />
                            )}
                        </div>
                        <div className={styles.fin}>
                            <RateInput
                                isDisabled={isDisabled}
                                value={accrual.rate}
                                onChange={handleOnChange}
                            />
                            <QtyInput
                                isDisabled={isDisabled}
                                value={accrual.qty}
                                onChange={handleOnChange}
                            />
                            <div className={styles.total}>
                                <DummyInput
                                    value={
                                        (
                                            (accrual.total &&
                                                accrual.total <= 1000000) ||
                                            accrual.total === 0
                                        ) ?
                                            1
                                        :   ""
                                    }
                                />
                                <div className={styles.total_number}>
                                    <FinanceCurrencyStringNew
                                        total={parseFloatAny(accrual.total, 2)}
                                        archive={accrual.payslip_id !== null}
                                        colored={true}
                                        type="accrual"
                                    />
                                </div>
                            </div>
                            <div className={styles.note}>
                                Итог не должен превышать 1 миллион.
                            </div>
                        </div>
                    </div>
                    {options?.payslip && (
                        <div className={styles.payslip}>
                            <FormHeader title="Расчетный лист" />
                            <PayslipInput
                                payslips={payslips}
                                selectedPayslip={accrual.payslip_id}
                                onPayslipSelection={handlePayslipSelection}
                                isDisabled={isDisabled}
                            />
                        </div>
                    )}
                    {!options?.payslip && (
                        <div className={styles.badges}>
                            <FormBadges obj={accrual} />
                        </div>
                    )}
                </div>
            </div>
        </FormHandler>
    );
}

"use client";

import ScheduleBody from "./ScheduleBody";
import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { ApiUser } from "@/app/types/user/Users";
import { useFormMainHandler } from "@/app/components/hooks/useFormMainHandler";
import { ApiSheet, defaultSheetObject } from "@/app/types/sheet/Sheets";
import ScheduleHeader from "./ScheduleHeader";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import { ApiDefaultSheet } from "@/app/types/default-sheet/DefaultSheets";
import { ApiSheetRate } from "@/app/types/sheet-rate/SheetRates";
import { ApiDept } from "@/app/types/depts/Depts";
import { ScheduleSearchParams } from "../page";
import { startTransition, useCallback, useMemo, useState } from "react";
import Sheet from "@/app/classes/Sheet";
import { formatISODate } from "@/app/functions/dates";
import { addDays, isSameMonth } from "date-fns";
import { postSheet } from "@/app/server-actions/sheets/postSheet";
import useCalendarMain from "@/app/components/hooks/useCalendarMain";
import { SQLObject } from "@/app/classes/finance/Reduction";

import styles from "./css/schedule.module.scss";
import { ReservedDates } from "@/app/server-actions/sheets/getReservedDates";
import dynamic from "next/dynamic";
import FormLoading from "@/app/components/form/FormLoading";
import { FormOptions } from "@/app/(app)/finance/accruals/_lib/form/AccrualsForm";

const SheetFormLazy = dynamic(() => import("../../_lib/form/SheetForm"), {
    loading: () => <FormLoading />,
});

export default function ScheduleMain({
    users,
    sheets,
    depts,
    periodOptions,
    sheetRates,
    defaultSheets,
    reservedDates,

    searchParams,
}: {
    users: ApiUser[];
    sheets: ApiSheet[];
    depts: ApiDept[];
    periodOptions: PeriodOptions;
    sheetRates: ApiSheetRate[];
    defaultSheets: ApiDefaultSheet[];
    reservedDates: ReservedDates[];

    searchParams: ScheduleSearchParams;
}) {
    const {
        initialObject: initialSheet,
        dialogIsOpen,
        handleObjectClick,
        setDialogIsOpen,
        type,
    } = useFormMainHandler(sheets, "sheet_id", defaultSheetObject);

    const filteredDepts = useMemo(
        () =>
            searchParams.filter === "0" ?
                depts
            :   depts.filter(
                    (dept) => dept.department_id === searchParams.filter,
                ),
        [searchParams.filter, depts],
    );

    const filteredSheets = useMemo(
        () =>
            searchParams.filter === "0" ?
                sheets
            :   sheets.filter(
                    (sheet) => sheet.department_id === searchParams.filter,
                ),
        [searchParams.filter, sheets],
    );

    /* 
	
	for adding mode 
	
	*/

    const {
        after,
        templateObject: templateSheet,
        setTemplateObject: setTemplateSheet,
        disabledSaveButton,
        isAdding,
        setIsAdding,
        isLoading,
        handleSaveClick,
    } = useCalendarMain<ApiSheet, Sheet, SQLObject<Sheet>>({
        arrayOfObjects: sheets,
        postDBO: postSheet,
    });

    const [multiplier, setMultiplier] = useState(1);

    const switchDate = useCallback(
        (action: "add" | "delete", day: Date, user: ApiUser) => {
            startTransition(() => {
                if (!templateSheet) return;

                const dayISO = formatISODate(day);
                const copy = templateSheet.copy();

                if (action === "delete") {
                    copy.idDateMap.switchDateInMap(dayISO, user.user_id);
                } else if (action === "add") {
                    for (let i = 0; i < multiplier; i++) {
                        const newDate = addDays(day, i);
                        if (!isSameMonth(newDate, day)) break;

                        const newDateISO = formatISODate(newDate);
                        const existingSheet = sheets.find(
                            (sheet) =>
                                sheet.sheet_date === newDateISO &&
                                sheet.user_id === user.user_id,
                        );
                        const existingTemplateSheet =
                            templateSheet.idDateMap.map
                                .get(user.user_id)
                                ?.has(newDateISO);

                        if (!existingSheet && !existingTemplateSheet) {
                            copy.idDateMap.switchDateInMap(
                                newDateISO,
                                user.user_id,
                            );
                        }
                    }
                }

                setTemplateSheet(copy);
            });
        },
        [templateSheet, sheets, multiplier, setTemplateSheet],
    );

    const options = (): FormOptions => {
        if (type === "add") {
            return {
                date: "multiple",
                user: "fixed",
                payslip: false,
                template: false,
            };
        }
        if (type === "edit") {
            return {
                date: "single",
                user: "fixed",
                payslip: false,
                template: false,
            };
        }
        if (type === "template") {
            return {
                date: "single",
                user: "fixed",
                payslip: false,
                template: true,
            };
        }
        return {};
    };

    return (
        <div className={styles.schedule_container}>
            {dialogIsOpen && initialSheet && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    <SheetFormLazy
                        initialSheet={initialSheet}
                        defaultSheets={defaultSheets}
                        sheetRates={sheetRates}
                        type={type}
                        users={users}
                        depts={depts}
                        view="modal"
                        setDialogIsOpen={setDialogIsOpen}
                        templateSheet={isAdding ? templateSheet : null}
                        setTemplateSheet={
                            isAdding ? setTemplateSheet : undefined
                        }
                        after={after}
                        key={isAdding ? "adding" : initialSheet.sheet_id}
                        reservedDates={reservedDates}
                        options={options()}
                    />
                </ModalPortal>
            )}
            <ScheduleHeader
                depts={depts}
                searchParams={searchParams}
                handleConfigureClick={handleObjectClick}
                setIsAdding={setIsAdding}
                isAdding={isAdding}
                multiplier={multiplier}
                setMultiplier={setMultiplier}
                disabledSaveButton={disabledSaveButton}
                onSaveClick={handleSaveClick}
                isLoading={isLoading}
                clickFn={after}
            />
            <ScheduleBody
                depts={filteredDepts}
                periodOptions={periodOptions}
                sheets={filteredSheets}
                users={users}
                searchParams={searchParams}
                handleSheetClick={handleObjectClick}
                templateSheet={templateSheet}
                switchDateFn={switchDate}
                isAdding={isAdding}
                isLoading={isLoading}
                after={after}
            />
        </div>
    );
}

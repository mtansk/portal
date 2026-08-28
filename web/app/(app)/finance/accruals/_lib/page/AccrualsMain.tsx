"use client";

import { useCallback, useMemo } from "react";
import {
    ApiAccrual,
    defaultAccrualObject,
} from "@/app/types/finance/accrual/Accruals";

import { ModalPortal } from "@/app/components/form/ModalPortal";

import { IDBAccrualGroup } from "@/app/types/accrual-group/AccrualGroups";
import { IDBGeneralRate } from "@/app/types/general-rate/GeneralRates";
import { ApiSheet, defaultSheetObject } from "@/app/types/sheet/Sheets";
import { ApiDept } from "@/app/types/depts/Depts";
import { useFormMainHandler } from "@/app/components/hooks/useFormMainHandler";
import { ApiUser } from "@/app/types/user/Users";
import {
    AllEFOObjects,
    FinanceSearchParams,
} from "@/app/types/finance/other/FinanceTypes";
import { ApiDefaultSheet } from "@/app/types/default-sheet/DefaultSheets";
import { ApiSheetRate } from "@/app/types/sheet-rate/SheetRates";
import { financeArrayHandler } from "../../../_lib/functions";
import { isAccrual, isSheet } from "@/app/types/guards/guards";
import { FinanceStandardBody } from "../../../_lib/efo-body/actual-body/FinanceStandardBody";
import { ReservedDates } from "@/app/server-actions/sheets/getReservedDates";
import dynamic from "next/dynamic";
import FormLoading from "@/app/components/form/FormLoading";

export type ModifiedRate = IDBGeneralRate & {
    formattedRateNumber: number;
    formattedRateString: string;
};

const LazyAccrual = dynamic(() => import("./../form/AccrualsForm"), {
    loading: () => <FormLoading />,
});

const LazySheet = dynamic(
    () => import("@/app/(app)/(sheets)/_lib/form/SheetForm"),
    {
        loading: () => <FormLoading />,
    },
);

export default function AccrualsMain({
    accruals,
    users,
    depts,
    accrualGroups,
    sheets,
    rates,
    defaultSheets,
    sheetRates,
    reservedDates,

    searchParams,
    typeOfPage,
}: {
    accruals: ApiAccrual[];
    users: ApiUser[];
    depts: ApiDept[];
    accrualGroups: IDBAccrualGroup[] | undefined;
    sheets: ApiSheet[];
    rates: IDBGeneralRate[];
    defaultSheets: ApiDefaultSheet[];
    sheetRates: ApiSheetRate[];
    reservedDates: ReservedDates[];

    searchParams: FinanceSearchParams;
    typeOfPage: "list" | "grouped";
}) {
    const {
        initialObject: initialAccrual,
        dialogIsOpen,
        setDialogIsOpen,
        handleObjectClick: handleAccrualClick,
        type,
    } = useFormMainHandler(accruals, "accrual_id", defaultAccrualObject);

    const {
        initialObject: initialSheet,
        dialogIsOpen: sheetDialogIsOpen,
        setDialogIsOpen: setSheetDialogIsOpen,
        handleObjectClick: handleSheetClick,
    } = useFormMainHandler(sheets, "sheet_id", defaultSheetObject);

    const sortedFilteredTI = useMemo(() => {
        return financeArrayHandler([...accruals, ...sheets], searchParams);
    }, [accruals, sheets, searchParams]);

    const handleObjectClick = useCallback(
        (object: AllEFOObjects) => {
            if (isSheet(object)) {
                handleSheetClick(object.sheet_id);
            } else if (isAccrual(object)) {
                handleAccrualClick(object.accrual_id);
            }

            return;
        },
        [handleAccrualClick, handleSheetClick],
    );

    return (
        <>
            {dialogIsOpen && initialAccrual && (
                <ModalPortal
                    setDialogIsOpen={setDialogIsOpen}
                    dialogIsOpen={dialogIsOpen}
                >
                    <LazyAccrual
                        initialAccrual={initialAccrual}
                        accrualGroups={accrualGroups}
                        users={users}
                        rates={rates}
                        type={"edit"}
                        view="modal"
                        setDialogIsOpen={setDialogIsOpen}
                        options={{
                            date: "single",
                            user: "fixed",
                            payslip: false,
                        }}
                    />
                </ModalPortal>
            )}
            {sheetDialogIsOpen && initialSheet && (
                <ModalPortal
                    dialogIsOpen={sheetDialogIsOpen}
                    setDialogIsOpen={setSheetDialogIsOpen}
                >
                    <LazySheet
                        initialSheet={initialSheet}
                        defaultSheets={defaultSheets}
                        sheetRates={sheetRates}
                        reservedDates={reservedDates}
                        type={"edit"}
                        users={users}
                        view="modal"
                        setDialogIsOpen={setSheetDialogIsOpen}
                        key={initialSheet.sheet_id}
                        options={{
                            date: "single",
                            payslip: false,
                            template: false,
                            user: "fixed",
                        }}
                    />
                </ModalPortal>
            )}

            <FinanceStandardBody
                arrayOfObjects={sortedFilteredTI}
                onObjectClick={handleObjectClick}
                depts={depts}
                users={users}
                typeOfPage={typeOfPage}
                addPath="/finance/accruals"
            />
        </>
    );
}

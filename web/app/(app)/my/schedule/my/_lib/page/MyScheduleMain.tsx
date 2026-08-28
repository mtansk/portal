"use client";

import { ApiMySheet, defaultSheetObject } from "@/app/types/sheet/Sheets";
import MyScheduleBody from "./MyScheduleBody";
import styles from "./css/container.module.scss";
import { MyScheduleSearchParams } from "../../page";
import { useFormMainHandler } from "@/app/components/hooks/useFormMainHandler";
import FormLoading from "@/app/components/form/FormLoading";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import dynamic from "next/dynamic";

const SheetFormLazy = dynamic(() => import("./../form/MySheetFrom"), {
    loading: () => <FormLoading />,
});

export default function MyScheduleMain({
    sheets,
    searchParams,
}: {
    sheets: ApiMySheet[];
    searchParams: MyScheduleSearchParams;
}) {
    const {
        initialObject: initialSheet,
        dialogIsOpen,
        handleObjectClick,
        setDialogIsOpen,
    } = useFormMainHandler(sheets, "sheet_id", defaultSheetObject);

    return (
        <>
            {dialogIsOpen && initialSheet && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    <SheetFormLazy
                        initialSheet={initialSheet}
                        view="modal"
                        setDialogIsOpen={setDialogIsOpen}
                        key={initialSheet.sheet_id}
                    />
                </ModalPortal>
            )}

            <div className={styles.container}>
                <MyScheduleBody
                    searchParams={searchParams}
                    sheets={sheets}
                    handleSheetClick={handleObjectClick}
                />
            </div>
        </>
    );
}

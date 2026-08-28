"use client";

import FormLoading from "@/app/components/form/FormLoading";
import { useFormMainHandler } from "@/app/components/hooks/useFormMainHandler";
import {
    ApiDefaultSheet,
    defaultDefaultSheetObject,
} from "@/app/types/default-sheet/DefaultSheets";
import dynamic from "next/dynamic";
import DefaultSheetsBody from "./DefaultSheetsBody";
import DefaultSheetsHeader from "./DefaultSheetsHeader";
import { ModalPortal } from "@/app/components/form/ModalPortal";

const SheetFormLazy = dynamic(() => import("../form/DefaultSheetForm"), {
    loading: () => <FormLoading />,
});

export default function DefaultSheetsMain({
    sheets,
}: {
    sheets: ApiDefaultSheet[];
}) {
    const {
        dialogIsOpen,
        setDialogIsOpen,
        initialObject: sheet,
        handleObjectClick: handleSheetClick,
        type,
    } = useFormMainHandler(sheets, "def_sheet_id", defaultDefaultSheetObject);

    return (
        <>
            {dialogIsOpen && sheet && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    <SheetFormLazy
                        initialSheet={sheet}
                        type={type}
                        view="modal"
                        setDialogIsOpen={setDialogIsOpen}
                    />
                </ModalPortal>
            )}
            <DefaultSheetsHeader
                onAddSheetClick={() => handleSheetClick("-1", "add")}
            />
            <DefaultSheetsBody
                sheets={sheets}
                onSheetClick={handleSheetClick}
            />
        </>
    );
}

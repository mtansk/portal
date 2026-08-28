"use client";

import SheetRatesHeader from "./SheetRatesHeader";
import { useFormMainHandler } from "@/app/components/hooks/useFormMainHandler";
import SheetRatesBody from "./SheetRatesBody";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import {
    ApiSheetRate,
    defaultSheetRateObject,
} from "@/app/types/sheet-rate/SheetRates";
import dynamic from "next/dynamic";
import FormLoading from "@/app/components/form/FormLoading";

const RateFormLazy = dynamic(() => import("../form/SheetRateForm"), {
    loading: () => <FormLoading />,
});

export default function SheetRatesMain({ rates }: { rates: ApiSheetRate[] }) {
    const {
        dialogIsOpen: rateDialogIsOpen,
        setDialogIsOpen: setRateDialogIsOpen,
        initialObject: rate,
        handleObjectClick: handleRateClick,
        type: rateDialogType,
    } = useFormMainHandler(rates, "sheet_rate_id", defaultSheetRateObject);

    return (
        <>
            {rateDialogIsOpen && rate && (
                <ModalPortal
                    dialogIsOpen={rateDialogIsOpen}
                    setDialogIsOpen={setRateDialogIsOpen}
                >
                    <RateFormLazy
                        initialRate={rate}
                        type={rateDialogType}
                        view="modal"
                        setDialogIsOpen={setRateDialogIsOpen}
                    />
                </ModalPortal>
            )}

            <SheetRatesHeader
                onAddRateClick={() => handleRateClick("-1", "add")}
            />
            <SheetRatesBody
                rates={rates}
                onRateClick={handleRateClick}
            />
        </>
    );
}

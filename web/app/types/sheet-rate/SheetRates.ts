import { FormSheetRate } from "@/app/(app)/company/rates/sheet-rates/_lib/form/SheetRateForm";
import { MeasureTypes } from "@/app/global/MEASURE_TYPES";

export const defaultSheetRateObject: FormSheetRate = {
    sheet_rate_id: "dummy_id",
    sheet_rate_name: "",
    sheet_rate_rate: "",
    sheet_rate_desc: "",
    sheet_rate_is_public: 0,
    measure_type: "hour",
};

export type ApiSheetRate = IDBSheetRate;

export interface IDBSheetRate {
    sheet_rate_id: string;
    sheet_rate_name: string;
    sheet_rate_rate: string;
    sheet_rate_desc: string | null;
    sheet_rate_is_public: 0 | 1;
    measure_type: MeasureTypes;
}

import { FormDefaultSheet } from "@/app/(app)/company/default-sheets/_lib/form/DefaultSheetForm";

export const defaultDefaultSheetObject: FormDefaultSheet = {
    def_sheet_id: "dummy_id",
    def_sheet_name: "",
    def_sheet_st: null,
    def_sheet_en: null,
    def_sheet_break: 0,
    def_sheet_plus_day: 0,
    def_sheet_desc: "",
};

export type ApiDefaultSheet = IDBDefaultSheet & {
    def_sheet_dur: number;
};

export interface IDBDefaultSheet {
    def_sheet_id: string;
    def_sheet_name: string;
    def_sheet_st: number | null;
    def_sheet_en: number | null;
    def_sheet_break: number | null;
    def_sheet_plus_day: 0 | 1;
    def_sheet_desc: string | null;
}

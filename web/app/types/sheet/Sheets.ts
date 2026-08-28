import { IDBAccrualGroup } from "../accrual-group/AccrualGroups";
import { MeasureTypes } from "@/app/global/MEASURE_TYPES";
import { SheetConstructorObject } from "@/app/classes/Sheet";
import { EFOApiFields, Now, UsersJoin } from "../finance/other/FinanceTypes";

export const defaultSheetObject: SheetConstructorObject = {
    sheet_id: "dummy_id",

    sheet_date: "",

    sheet_plus_day_p: 0,
    sheet_plus_day_f: 0,

    sheet_p_st: null,
    sheet_p_en: null,
    break_dur_p: 0,

    sheet_f_st: null,
    sheet_f_en: null,
    break_dur_f: 0,

    sheet_rate: null,
    measure_type: "hour",
    sheet_use_f: 0,

    use_f_payment: 0,
    use_f_dur: 0,
    use_overtime_dur: 0,

    sheet_overtime_rate: null,
    sheet_overtime_time: null,

    sheet_desc: "",

    sheet_status: "workday",

    payslip_id: null,
    user_id: "0",
};

export type SheetStatuses =
    | "workday"
    | "dayoff"
    | "vacation"
    | "excused"
    | "absence";

export type ApiSheet = IDBSheet &
    EFOApiFields &
    UsersJoin &
    Partial<Omit<IDBAccrualGroup, "accrual_group_id">> &
    Now & {
        sheet_dur_p: number;
    };

export interface IDBSheet {
    sheet_id: string;

    sheet_date: string;

    sheet_p_st: number | null;
    sheet_p_en: number | null;
    break_dur_p: number | null;
    sheet_plus_day_p: 0 | 1;

    sheet_f_st: number | null;
    sheet_f_en: number | null;
    break_dur_f: number | null;
    sheet_plus_day_f: 0 | 1;

    sheet_rate: string | null;
    sheet_payment_p: string | null;
    sheet_payment_f: string | null;
    measure_type: MeasureTypes;
    sheet_use_f: 0 | 1;

    use_f_payment: 0 | 1;
    use_f_dur: 0 | 1;
    use_overtime_dur: 0 | 1;

    sheet_overtime_rate: string | null;
    sheet_overtime_time: number | null;
    sheet_overtime_total: string | null;

    sheet_total: string | null;
    sheet_total_dur: number;

    sheet_desc: string | null;

    sheet_status: SheetStatuses;

    payslip_id: string | null;
    user_id: string;
}

export type ApiMySheet = ApiSheet;

export type ApiMyTeamSheet = {
    sheet_id: string;

    sheet_date: string;

    sheet_p_st: number | null;
    sheet_p_en: number | null;
    break_dur_p: number | null;
    sheet_plus_day_p: 0 | 1;

    sheet_status: SheetStatuses;
    user_id: string;
} & {
    sheet_dur_p: number;
} & UsersJoin;

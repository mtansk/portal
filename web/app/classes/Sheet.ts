import { formatISODate } from "../functions/dates";
import { parseFloatAny } from "../functions/other";
import { SheetStatuses } from "../types/sheet/Sheets";
import { IDBEntityClass } from "./IDBEntityClass";
import { IdDateMapper } from "./IdDateMapper";
import { MeasureTypes } from "../global/MEASURE_TYPES";

export type SheetConstructorObject = {
    sheet_id: string;

    sheet_date: string;

    sheet_plus_day_p: 0 | 1;
    sheet_plus_day_f: 0 | 1;

    sheet_p_st: number | null;
    sheet_p_en: number | null;
    break_dur_p: number | null;

    sheet_f_st: number | null;
    sheet_f_en: number | null;
    break_dur_f: number | null;

    sheet_rate: string | string | null;
    measure_type: MeasureTypes;
    sheet_use_f: 0 | 1;
    use_f_payment: 0 | 1;
    use_f_dur: 0 | 1;
    use_overtime_dur: 0 | 1;

    sheet_overtime_rate: string | string | null;
    sheet_overtime_time: number | string | null;

    sheet_desc: string | null;

    sheet_status: SheetStatuses;

    payslip_id: string | null;
    user_id: string;
};

export default class Sheet implements IDBEntityClass<Sheet> {
    sheet_id: string;

    sheet_date: string;

    sheet_plus_day_p: 0 | 1; // DEPENDENCY
    sheet_plus_day_f: 0 | 1; // DEPENDENCY

    sheet_p_st: number | null; // DEPENDENCY
    sheet_p_en: number | null; // DEPENDENCY
    break_dur_p: number | null; // DEPENDENCY
    sheet_dur_p: number | null; // CALC

    sheet_f_st: number | null; // DEPENDENCY
    sheet_f_en: number | null; // DEPENDENCY
    break_dur_f: number | null; // DEPENDENCY
    sheet_dur_f: number | null; // CALC

    sheet_rate: string | null; // DEPENDENCY
    sheet_payment_p: number | null; // CALC
    sheet_payment_f: number | null; // CALC
    measure_type: MeasureTypes; // DEPENDENCY

    sheet_use_f: 0 | 1;
    use_f_payment: 0 | 1; // DEPENDENCY
    use_f_dur: 0 | 1; // DEPENDENCY
    use_overtime_dur: 0 | 1; // DEPENDENCY

    sheet_overtime_rate: string | null; // DEPENDENCY
    sheet_overtime_time: number | null; // DEPENDENCY
    sheet_overtime_total: number | null; // CALC

    sheet_total: number | null; // CALC
    sheet_total_dur: number; // CALC

    sheet_desc: string | null;

    sheet_status: SheetStatuses;

    payslip_id: string | null;
    user_id: string;

    idDateMap: IdDateMapper;

    constructor(object: SheetConstructorObject, map?: IdDateMapper) {
        this.sheet_id = object.sheet_id;

        this.sheet_date = object.sheet_date;

        this.sheet_plus_day_p = object.sheet_plus_day_p;
        this.sheet_plus_day_f = object.sheet_plus_day_f;

        this.sheet_p_st = object.sheet_p_st;
        this.sheet_p_en = object.sheet_p_en;
        this.break_dur_p = object.break_dur_p;

        this.sheet_f_st = object.sheet_f_st;
        this.sheet_f_en = object.sheet_f_en;
        this.break_dur_f = object.break_dur_f;

        this.sheet_rate = object.sheet_rate;
        this.measure_type = object.measure_type;
        this.sheet_use_f = object.sheet_use_f;

        this.use_f_payment = object.use_f_payment;
        this.use_f_dur = object.use_f_dur;
        this.use_overtime_dur = object.use_overtime_dur;

        this.sheet_overtime_rate = object.sheet_overtime_rate;

        this.sheet_overtime_time =
            object.sheet_overtime_time !== null ?
                parseFloatAny(object.sheet_overtime_time)
            :   null;

        this.sheet_desc = object.sheet_desc;

        this.sheet_status = object.sheet_status;

        this.payslip_id = object.payslip_id;
        this.user_id = object.user_id;

        this.idDateMap = map || new IdDateMapper(this.user_id, this.sheet_date);

        this.sheet_dur_p = this.getSheetDur("p");
        this.sheet_dur_f = this.getSheetDur("f");

        this.sheet_payment_p = this.getSheetPayment("p");
        this.sheet_payment_f = this.getSheetPayment("f");

        this.sheet_overtime_total = this.getSheetOvertimeTotal();

        this.sheet_total = this.getSheetTotal();
        this.sheet_total_dur = this.getSheetTotalDur();
    }

    reCalculate() {
        this.sheet_dur_p = this.getSheetDur("p");
        this.sheet_dur_f = this.getSheetDur("f");

        this.sheet_payment_p = this.getSheetPayment("p");
        this.sheet_payment_f = this.getSheetPayment("f");

        this.sheet_overtime_total = this.getSheetOvertimeTotal();

        this.sheet_total = this.getSheetTotal();

        this.sheet_total_dur = this.getSheetTotalDur();
    }

    setterFn<K extends keyof Sheet>(key: K, value: Sheet[K]) {
        if (key in this) {
            if (
                key === "sheet_p_st" ||
                key === "sheet_p_en" ||
                key === "break_dur_p" ||
                key === "sheet_f_st" ||
                key === "sheet_f_en" ||
                key === "break_dur_f" ||
                key === "sheet_rate" ||
                key === "measure_type" ||
                key === "sheet_overtime_rate" ||
                key === "sheet_overtime_time" ||
                key === "sheet_plus_day_p" ||
                key === "sheet_plus_day_f" ||
                key === "sheet_use_f" ||
                key === "use_f_payment" ||
                key === "use_f_dur" ||
                key === "use_overtime_dur"
            ) {
                if (value === "" || value === null) {
                    (this as any)[key] = null;
                } else {
                    (this as any)[key] = value;
                }

                this.reCalculate();
            } else {
                (this as any)[key] = value;
            }
        }
    }

    createSQLObject() {
        const obj = {
            sheet_id: this.sheet_id,
            sheet_date: this.sheet_date ? formatISODate(this.sheet_date) : null,
            sheet_plus_day_p: this.sheet_plus_day_p,
            sheet_plus_day_f: this.sheet_plus_day_f,

            sheet_p_st: this.sheet_p_st !== null ? this.sheet_p_st : null,
            sheet_p_en: this.sheet_p_en !== null ? this.sheet_p_en : null,
            break_dur_p: this.break_dur_p !== null ? this.break_dur_p : null,

            sheet_f_st: this.sheet_f_st !== null ? this.sheet_f_st : null,
            sheet_f_en: this.sheet_f_en !== null ? this.sheet_f_en : null,
            break_dur_f: this.break_dur_f !== null ? this.break_dur_f : null,

            sheet_rate: this.sheet_rate,
            measure_type: this.measure_type,

            sheet_use_f: this.sheet_use_f,
            use_f_payment: this.use_f_payment,
            use_f_dur: this.use_f_dur,
            use_overtime_dur: this.use_overtime_dur,

            sheet_overtime_rate: this.sheet_overtime_rate,
            sheet_overtime_time: this.sheet_overtime_time,

            sheet_desc: this.sheet_desc,
            sheet_status: this.sheet_status,
            payslip_id: this.payslip_id,
            user_id: this.user_id,

            ids: this.idDateMap.createSQLObject(),
        };

        if (this.sheet_status !== "workday") {
            obj.sheet_p_st = null;
            obj.sheet_p_en = null;
            obj.break_dur_p = null;

            obj.sheet_f_st = null;
            obj.sheet_f_en = null;
            obj.break_dur_f = null;

            obj.sheet_rate = null;
            obj.sheet_overtime_time = null;
            obj.sheet_overtime_rate = null;

            obj.sheet_desc = null;
            obj.payslip_id = null;
        }

        return obj;
    }

    copy() {
        return new Sheet({ ...this }, this.idDateMap);
    }

    private getSheetDur(type: "p" | "f") {
        if (type === "p") {
            if (
                this.sheet_p_st !== null &&
                this.sheet_p_en !== null &&
                this.break_dur_p !== null
            ) {
                const dur =
                    this.sheet_p_en -
                    this.sheet_p_st -
                    this.break_dur_p +
                    this.sheet_plus_day_p * 24 * 60 * 60;

                return dur;
            } else {
                return 0;
            }
        }

        if (type === "f") {
            if (
                this.sheet_f_st !== null &&
                this.sheet_f_en !== null &&
                this.break_dur_f !== null
            ) {
                const dur =
                    this.sheet_f_en -
                    this.sheet_f_st -
                    this.break_dur_f +
                    this.sheet_plus_day_f * 24 * 60 * 60;

                return dur;
            } else {
                return 0;
            }
        }

        return 0;
    }

    private getSheetPayment(type: "p" | "f") {
        if (type === "p") {
            if (
                this.sheet_rate &&
                this.measure_type === "hour" &&
                this.sheet_dur_p
            ) {
                return (
                    (this.sheet_dur_p * parseFloatAny(this.sheet_rate)) / 3600
                );
            } else if (this.measure_type === "sheet" && this.sheet_rate) {
                return parseFloatAny(this.sheet_rate);
            } else {
                return 0;
            }
        } else if (type === "f") {
            if (
                this.sheet_rate &&
                this.measure_type === "hour" &&
                this.sheet_dur_f
            ) {
                return (
                    (this.sheet_dur_f * parseFloatAny(this.sheet_rate)) / 3600
                );
            } else if (this.measure_type === "sheet" && this.sheet_rate) {
                return parseFloatAny(this.sheet_rate);
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    private getSheetOvertimeTotal() {
        if (this.sheet_overtime_rate && this.sheet_overtime_time) {
            return (
                (parseFloatAny(this.sheet_overtime_rate) *
                    this.sheet_overtime_time) /
                3600
            );
        } else {
            return 0;
        }
    }

    private getSheetTotal() {
        if (this.use_f_payment) {
            return (
                (this.sheet_payment_f || 0) + (this.sheet_overtime_total || 0)
            );
        } else {
            return (
                (this.sheet_payment_p || 0) + (this.sheet_overtime_total || 0)
            );
        }
    }

    private getSheetTotalDur() {
        let dur = 0;

        if (this.use_f_dur) {
            dur = this.sheet_dur_f || 0;
        } else {
            dur = this.sheet_dur_p || 0;
        }

        if (this.use_overtime_dur) {
            dur += this.sheet_overtime_time || 0;
        }

        return dur;
    }
}

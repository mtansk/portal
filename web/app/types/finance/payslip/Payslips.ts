import { PayslipConstructorObject } from "@/app/classes/finance/Payslip";
import { Now, UsersJoin } from "../other/FinanceTypes";

export const defaultPayslipObject: PayslipConstructorObject = {
    payslip_id: "0",
    payslip_date: "",
    payslip_name: "",
    payslip_st_date: "",
    payslip_en_date: "",
    user_id: "",
};

export type ApiPayslip = IDBPayslip & {
    accruals_total: number;
    sheets_total: number;
    payments_total: number;
    reductions_total: number;
    taxes_total: number;
    total: number;
} & UsersJoin &
    Now;

export type FormPayslip = IDBPayslip;

interface IDBPayslip {
    payslip_id: string;
    payslip_date: string;
    payslip_name: string;
    payslip_st_date: string;
    payslip_en_date: string;
    user_id: string;
}

export type ApiMyPayslip = IDBPayslip & {
    accruals_total: number;
    sheets_total: number;
    payments_total: number;
    reductions_total: number;
    taxes_total: number;
    total: number;
};

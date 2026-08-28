import { FOApiFields } from "../other/FinanceTypes";

export type ApiTaxDeduction = IDBTaxDeduction & FOApiFields;

interface IDBTaxDeduction {
    tax_deduction_id: string;
    tax_deduction_name: string;
    tax_deduction_rate: string;
    tax_deduction_qty: "1";
    tax_deduction_total: string;
    payslip_id: string | null;
}

export type ApiMyTaxDeduction = ApiTaxDeduction;

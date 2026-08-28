import { PayslipFOConstructorObject } from "@/app/classes/finance/PayslipFO";
import { FOApiFields } from "../other/FinanceTypes";

export const defaultPayslipFoObject: PayslipFOConstructorObject = {
    id: "dummy_id",
    name: "",
    payslip_id: null,
    qty: "",
    rate: "",
    is_round: 0,
};

export type ApiTax = IDBTax & FOApiFields;

interface IDBTax {
    tax_id: string;
    tax_name: string;
    tax_rate: string;
    tax_qty: string;
    tax_total: string;
    is_round: 0 | 1;
    payslip_id: string | null;
}

export type ApiMyTax = ApiTax;

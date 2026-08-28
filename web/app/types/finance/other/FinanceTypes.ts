import { EFOConstructorObject } from "@/app/classes/finance/ExtendedFinanceObject";
import { ApiDept } from "../../depts/Depts";
import { ApiSheet } from "../../sheet/Sheets";
import { IDBUser } from "../../user/Users";
import { ApiAccrual } from "../accrual/Accruals";
import { ApiPayment } from "../payments/Payments";
import { ApiReduction } from "../reductions/Reductions";
import { ApiSocialFee } from "../social-fees/SocialFees";
import { ApiTaxDeduction } from "../tax-deductions/TaxDeduction";
import { ApiTax } from "../taxes/Taxes";
import { FoConstructorObject } from "@/app/classes/finance/FinanceObject";

/* 
    Service
*/

export const defaultFoObject: FoConstructorObject = {
    id: "dummy_id",
    name: "",
    payslip_id: null,
    qty: "",
    rate: "",
};

export const defaultEFOObject: EFOConstructorObject = {
    ...defaultFoObject,
    date: "",
    desc: "",
    user_id: "0",
};

export type FOApiFields = {
    id: string;
    name: string;
    rate: string;
    qty: string;
    total: string;
    payslip_id: string | null;
};

export type EFOApiFields = FOApiFields & {
    date: string;
    desc: string | null;
    formattedDate: string;
};

export type Now = {
    now: string;
};

export type UsersJoin = {} & Omit<IDBUser, "user_id"> &
    Omit<ApiDept, "department_id">;

export type AllFoNames =
    | "accrual"
    | "sheet"
    | "reduction"
    | "payment"
    | "tax"
    | "taxDeduction"
    | "socialFee";

export type FONames = "tax" | "taxDeduction" | "socialFee";
export type EFONames = "accrual" | "sheet" | "reduction" | "payment";

export type AllFinanceObjects =
    | ApiTax
    | ApiTaxDeduction
    | ApiSocialFee
    | ApiAccrual
    | ApiSheet
    | ApiReduction
    | ApiPayment;

export type AllFOObjects = ApiTax | ApiTaxDeduction | ApiSocialFee;
export type AllEFOObjects = ApiAccrual | ApiSheet | ApiReduction | ApiPayment;
export type FinanceSearchParams = {
    start: string;
    end: string;
    q: string;
    s: string;
    o: "asc" | "desc";
    a: "active" | "archive" | "all";
};
export type ArrayWithTotal<T> = {
    array: T[];
    total: number;
};

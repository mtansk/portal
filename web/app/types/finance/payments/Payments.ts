import { PaymentConstructorObject } from "@/app/classes/finance/Payment";
import { defaultEFOObject, Now } from "../other/FinanceTypes";
import { EFOApiFields, UsersJoin } from "../other/FinanceTypes";

export const defaultPaymentObject: PaymentConstructorObject = {
    ...defaultEFOObject,
    payment_id: "0",
};

export type ApiPayment = IDBPayment & EFOApiFields & UsersJoin & Now;

export interface IDBPayment {
    payment_id: string;

    payment_date: string;
    payment_name: string;
    payment_rate: string;
    payment_qty: "1";
    payment_total: string;
    payment_desc: string | null;

    user_id: string;
    payslip_id: string | null;
}

export type ApiMyPayment = ApiPayment;

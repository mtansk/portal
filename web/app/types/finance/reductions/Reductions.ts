import { ReductionConstructorObject } from "@/app/classes/finance/Reduction";
import {
    defaultEFOObject,
    EFOApiFields,
    Now,
    UsersJoin,
} from "../other/FinanceTypes";
import { IDBDebt } from "../debts/Debts";

export const defaultReductionObject: ReductionConstructorObject = {
    ...defaultEFOObject,
    reduction_id: "dummy_id",
    debt_id: null,
};

export type ApiReduction = IDBReduction &
    UsersJoin &
    EFOApiFields &
    Now &
    Partial<IDBDebt>;

export interface IDBReduction {
    reduction_id: string;

    reduction_date: string;
    reduction_name: string;
    reduction_rate: string;
    reduction_qty: string;
    reduction_total: string;
    reduction_desc: string | null;

    user_id: string;
    debt_id: string | null;
    payslip_id: string | null;
}

export type ApiMyReduction = ApiReduction;

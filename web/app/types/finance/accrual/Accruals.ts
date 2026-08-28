import { defaultEFOObject, Now } from "../other/FinanceTypes";
import { IDBAccrualGroup } from "../../accrual-group/AccrualGroups";
import { EFOApiFields, UsersJoin } from "../other/FinanceTypes";
import { AccrualConstructorObject } from "@/app/classes/finance/Accrual";

export const defaultAccrualObject: AccrualConstructorObject = {
    ...defaultEFOObject,
    accrual_group_id: null,
    accrual_id: "0",
    accrual_time: null,
};

export type ApiAccrual = IDBAccrual &
    EFOApiFields &
    UsersJoin &
    Partial<Omit<IDBAccrualGroup, "accrual_group_id">> &
    Now;

export interface IDBAccrual {
    accrual_id: string;

    accrual_date: string;
    accrual_time: number | null;
    accrual_name: string;
    accrual_rate: string;
    accrual_qty: string;
    accrual_total: string;
    accrual_desc: string | null;

    accrual_group_id: string | null;
    user_id: string;
    payslip_id: string | null;
}

export type ApiMyAccrual = ApiAccrual;

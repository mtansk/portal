import { UsersJoin } from "../other/FinanceTypes";

export const defaultDebtObject: IDBDebt = {
    debt_id: "",
    debt_date: "",
    debt_name: "",
    debt_total: "",
    is_settled: 0,
    debt_desc: null,
    user_id: "",
};

export type ApiDebt = IDBDebt &
    UsersJoin & {
        reductions_total: string;
    };

export interface IDBDebt {
    debt_id: string;
    debt_date: string;
    debt_name: string;
    debt_total: string;
    is_settled: 0 | 1;
    debt_desc: string | null;
    user_id: string;
}

export type ApiMyDebt = ApiDebt;

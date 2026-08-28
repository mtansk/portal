import { FormGeneralRate } from "@/app/(app)/company/rates/general-rates/_lib/form/GeneralRateForm";

export const defaultGeneralRateObject: FormGeneralRate = {
    general_rate_id: "dummy_id",
    general_rate_name: "",
    general_rate_rate: "",
    general_rate_desc: "",
    general_rate_is_public: 1,
    accrual_group_id: null,
};

export type ApiGeneralRate = IDBGeneralRate;

export interface IDBGeneralRate {
    general_rate_id: string;
    general_rate_name: string;
    general_rate_rate: string;
    general_rate_desc: string | null;
    general_rate_is_public: 1 | 0;
    accrual_group_id: string | null;
}

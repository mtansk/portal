import { FOApiFields } from "../other/FinanceTypes";

export type ApiSocialFee = IDBSocialFee & FOApiFields;

interface IDBSocialFee {
    social_fee_id: string;
    social_fee_name: string;
    social_fee_rate: string;
    social_fee_qty: string;
    social_fee_total: string;
    is_round: 0 | 1;
    payslip_id: string | null;
}

export type ApiMySocialFee = ApiSocialFee;

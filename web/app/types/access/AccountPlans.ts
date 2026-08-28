export type ApiAccountPlanInfo = {
    total_limit: number;
    end_date: string | null;
    active_users_count: number;
    active_invites_count: number;
    free_account_slots: number;
};

export type ApiAccountPlan = IDBAccountPlan;

export interface IDBAccountPlan {
    account_plan_id: string;
    account_plan_st_date: string;
    account_plan_en_date: string;
    account_plan_amount: number;
    company_id: string;
    created_at: string;
    transaction_id: string;
}

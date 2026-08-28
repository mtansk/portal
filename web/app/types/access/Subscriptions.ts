export type ApiSubscription = IDBSubscription & { is_active: 1 | 0 };

export interface IDBSubscription {
    subscription_id: string;
    subscription_type: "trial" | "basic";
    subscription_st_date: string;
    subscription_en_date: string;
    company_id: string;
    created_at: string;
    transaction_id: string;
}

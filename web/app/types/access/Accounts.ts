export type ApiAccount = IDBAccount;

export interface IDBAccount {
    account_id: string;
    username: string;
    first_name: string;
    account_email: string;
    account_telegram: string | null;
    created_at: string;
    deleted_at: string | null;
}

export type ApiMyAccount = {
    account_id: string;
    first_name: string;
    account_email: string;
    account_telegram: string | null;
    created_at: string;
};

export type ApiTransaction = IDBTransaction;

export interface IDBTransaction {
    transaction_id: string;
    transaction_product: string;
    transaction_qty: string;
    transaction_total: string;
    transaction_status: string;
    user_id: string;
    company_id: string;
    payment_id: string;
}

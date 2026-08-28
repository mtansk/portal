import getSubscriptions from "@/app/server-actions/access/subscriptions/getSubscriptions";
import SubscriptionsMain from "./SubscriptionsMain";
import getPendingTransactions from "@/app/server-actions/transactions/getPendingTransactions";

export default async function SubscriptionsParent() {
    const [subscriptions, transactions] = await Promise.all([
        getSubscriptions(),
        getPendingTransactions(),
    ]);

    return (
        <SubscriptionsMain
            subscriptions={subscriptions}
            transactions={transactions}
        />
    );
}

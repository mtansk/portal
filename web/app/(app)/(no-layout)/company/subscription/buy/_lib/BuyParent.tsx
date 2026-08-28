import getSubscriptions from "@/app/server-actions/access/subscriptions/getSubscriptions";
import BuyMain from "./BuyMain";
import getMyUsers from "@/app/server-actions/my/users/getMyUsers";
import getPendingTransactions from "@/app/server-actions/transactions/getPendingTransactions";

export default async function BuyParent() {
    const [subscriptions, myUsers, transactions] = await Promise.all([
        getSubscriptions(),
        getMyUsers(),
        getPendingTransactions(),
    ]);

    return (
        <BuyMain
            subscriptions={subscriptions}
            myUsers={myUsers}
            transactions={transactions}
        />
    );
}

import SubscriptionsHeader from "./SubscriptionsHeader";
import SubscriptionsBody from "./SubscriptionsBody";
import { ApiSubscription } from "@/app/types/access/Subscriptions";
import { ApiTransaction } from "@/app/types/access/Transactions";

export default async function SubscriptionsMain({
    subscriptions,
    transactions,
}: {
    subscriptions: ApiSubscription[];
    transactions: ApiTransaction[];
}) {
    return (
        <>
            <SubscriptionsHeader />
            <SubscriptionsBody
                subscriptions={subscriptions}
                transactions={transactions}
            />
        </>
    );
}

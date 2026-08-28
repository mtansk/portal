"use client";

import { ApiMyUser } from "@/app/types/user/Users";
import BuyBody from "./BuyBody";
import { ApiSubscription } from "@/app/types/access/Subscriptions";
import dynamic from "next/dynamic";
import { ApiTransaction } from "@/app/types/access/Transactions";

const LazyBody = dynamic(() => import("./BuyBody"), {
    ssr: false,
});

export default function BuyMain({
    subscriptions,
    myUsers,
    transactions,
}: {
    subscriptions: ApiSubscription[];
    myUsers: ApiMyUser[];
    transactions: ApiTransaction[];
}) {
    return (
        <LazyBody
            subscriptions={subscriptions}
            myUsers={myUsers}
            transactions={transactions}
        />
    );
}

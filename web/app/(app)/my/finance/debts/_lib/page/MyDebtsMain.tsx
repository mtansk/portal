"use client";

import { ApiMyDebt } from "@/app/types/finance/debts/Debts";
import MyDebtsBody from "./MyDebtsBody";
import MyDebtsHeader from "./MyDebtsHeader";

export default function MyDebtsMain({ debts }: { debts: ApiMyDebt[] }) {
    return (
        <>
            <MyDebtsHeader />
            <MyDebtsBody debts={debts} />
        </>
    );
}

import MyDebtsMain from "./MyDebtsMain";
import getMyDebts from "@/app/server-actions/my/finance/getMyDebts";

export default async function MyDebtsParent() {
    const [debts] = await Promise.all([getMyDebts({})]);

    return <MyDebtsMain debts={debts} />;
}

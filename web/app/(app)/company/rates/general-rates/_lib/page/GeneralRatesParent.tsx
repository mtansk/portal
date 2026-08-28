import getAccrualGroups from "@/app/server-actions/accrual-groups/getAccrualGroups";
import getGeneralRates from "@/app/server-actions/rates/general/getGeneralRates";
import GeneralRatesMain from "./GeneralRatesMain";

export default async function GeneralRatesParent() {
    const [rates, groups] = await Promise.all([
        getGeneralRates(),
        getAccrualGroups(),
    ]);

    return (
        <>
            <GeneralRatesMain
                rates={rates}
                groups={groups}
            />
        </>
    );
}

import getSheetRates from "@/app/server-actions/rates/sheet/getSheetRates";
import SheetRatesMain from "./SheetRatesMain";

export default async function SheetRatesParent() {
    const [rates] = await Promise.all([getSheetRates()]);

    return (
        <>
            <SheetRatesMain rates={rates} />
        </>
    );
}

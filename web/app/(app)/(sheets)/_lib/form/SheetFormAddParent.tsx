import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import SheetForm from "./SheetForm";
import getDefaultSheets from "@/app/server-actions/default-sheets/getDefaultSheets";
import getSheetRates from "@/app/server-actions/rates/sheet/getSheetRates";
import getUsers from "@/app/server-actions/users/getUsers";
import getReservedDates from "@/app/server-actions/sheets/getReservedDates";
import getPayslips from "@/app/server-actions/finance/payslips/getPayslips";
import { paramArrayToString } from "@/app/functions/other";
import { SearchParams } from "next/dist/server/request/search-params";
import { defaultSheetObject } from "@/app/types/sheet/Sheets";

export default async function SheetFormAddParent({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const user_id = paramArrayToString(searchParams.uid);

    if (!user_id || user_id === "multiple") {
        throw new Error("Не указан пользователь.");
    }

    const user = await getUsers({ id: user_id });

    if (!user) {
        throw new Error("Такого пользователя не существует.");
    }

    const [sheetRates, defaultSheets, payslips, reservedDates] =
        await Promise.all([
            getSheetRates(),
            getDefaultSheets(),
            getPayslips({ params: { user_id } }),
            getReservedDates({ params: { user_id: user_id } }),
        ]);

    const def = { ...defaultSheetObject, user_id: user_id };

    return (
        <FormPageContainer title="Смена">
            <SheetForm
                initialSheet={def}
                defaultSheets={defaultSheets}
                sheetRates={sheetRates}
                users={[user]}
                reservedDates={reservedDates}
                payslips={payslips}
                view="page"
                type={"add"}
                options={{
                    user: "fixed",
                    date: "multiple",
                    payslip: true,
                }}
            />
        </FormPageContainer>
    );
}

import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import SheetForm from "./SheetForm";
import getSheets from "@/app/server-actions/sheets/getSheets";
import getDefaultSheets from "@/app/server-actions/default-sheets/getDefaultSheets";
import getSheetRates from "@/app/server-actions/rates/sheet/getSheetRates";
import getUsers from "@/app/server-actions/users/getUsers";
import getReservedDates from "@/app/server-actions/sheets/getReservedDates";
import getPayslips from "@/app/server-actions/finance/payslips/getPayslips";

export default async function SheetFormParent({ id }: { id: string }) {
    const [sheet] = await Promise.all([getSheets({ id })]);

    if (!sheet) {
        throw new Error("Такой смены не существует.");
    }

    const user = await getUsers({ id: sheet?.user_id });

    const _user = user ? [user] : [];

    if (!sheet || !user) {
        throw new Error("Такой смены не существует.");
    }

    const [sheetRates, defaultSheets, payslips, reservedDates] =
        await Promise.all([
            getSheetRates(),
            getDefaultSheets(),
            getPayslips({ params: { user_id: sheet.user_id } }),
            getReservedDates({ params: { user_id: sheet.user_id } }),
        ]);

    return (
        <FormPageContainer title="Смена">
            <SheetForm
                initialSheet={sheet}
                defaultSheets={defaultSheets}
                sheetRates={sheetRates}
                users={_user}
                payslips={payslips}
                view="page"
                type={"edit"}
                options={{
                    user: "fixed",
                    date: "single",
                    payslip: true,
                }}
                reservedDates={reservedDates}
            />
        </FormPageContainer>
    );
}

import ReductionForm from "./ReductionsForm";
import getUsers from "@/app/server-actions/users/getUsers";
import getReductions from "@/app/server-actions/finance/reductions/getReductions";
import getDebts from "@/app/server-actions/finance/debts/getDebts";
import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import getPayslips from "@/app/server-actions/finance/payslips/getPayslips";

export default async function ReductionFormParent({ id }: { id: string }) {
    const [reduction] = await Promise.all([getReductions({ id })]);

    if (!reduction) {
        throw new Error("Такого удержания не существует.");
    }

    const user = await getUsers({ id: reduction?.user_id });

    if (!reduction || !user) {
        throw new Error("Такого удержания не существует.");
    }

    const [payslips, debts] = await Promise.all([
        getPayslips({ params: { user_id: reduction.user_id } }),
        getDebts({ params: { user_id: reduction.user_id } }),
    ]);

    return (
        <FormPageContainer title="Удержание">
            <ReductionForm
                initialReduction={reduction}
                users={[user]}
                payslips={payslips}
                debts={debts}
                view="page"
                type={"edit"}
                options={{
                    date: "single",
                    payslip: true,
                    user: "fixed",
                }}
            />
        </FormPageContainer>
    );
}

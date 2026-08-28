import PaymentsForm from "./PaymentsForm";
import getUsers from "@/app/server-actions/users/getUsers";
import getPayments from "@/app/server-actions/finance/payments/getPayments";
import getPayslips from "@/app/server-actions/finance/payslips/getPayslips";
import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";

export default async function PaymentFormParent({ id }: { id: string }) {
    const [payment] = await Promise.all([getPayments({ id })]);

    if (!payment) {
        throw new Error("Такой выплаты не существует.");
    }

    const user = await getUsers({ id: payment?.user_id });

    if (!payment || !user) {
        throw new Error("Такой выплаты не существует.");
    }

    const [payslips] = await Promise.all([
        getPayslips({ params: { user_id: payment.user_id } }),
    ]);

    return (
        <FormPageContainer title="Выплата">
            <PaymentsForm
                initialPayment={payment}
                users={[user]}
                payslips={payslips}
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

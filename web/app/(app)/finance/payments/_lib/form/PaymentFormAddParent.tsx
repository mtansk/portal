import PaymentsForm from "./PaymentsForm";
import getUsers from "@/app/server-actions/users/getUsers";
import getPayslips from "@/app/server-actions/finance/payslips/getPayslips";
import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import { paramArrayToString } from "@/app/functions/other";
import getDepts from "@/app/server-actions/departments/getDepts";
import { SearchParams } from "next/dist/server/request/search-params";
import { defaultPaymentObject } from "@/app/types/finance/payments/Payments";

export default async function PaymentFormAddParent({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const user_id = paramArrayToString(searchParams.uid);

    if (!user_id) {
        throw new Error("Не указан пользователь.");
    }

    if (user_id === "multiple") {
        const [users, depts] = await Promise.all([
            getUsers({
                params: {
                    show_deleted: "false",
                },
            }),
            getDepts({}),
        ]);

        return (
            <FormPageContainer title="Выплата">
                <PaymentsForm
                    initialPayment={defaultPaymentObject}
                    users={users}
                    depts={depts}
                    view="page"
                    type={"add"}
                    options={{
                        user: "multiple",
                        date: "multiple",
                        payslip: false,
                    }}
                />
            </FormPageContainer>
        );
    }

    const user = await getUsers({ id: user_id });

    if (!user) {
        throw new Error("Такого пользователя не существует.");
    }

    const [payslips] = await Promise.all([
        getPayslips({ params: { user_id: user_id } }),
    ]);

    const def = { ...defaultPaymentObject, user_id: user_id };

    return (
        <FormPageContainer title="Выплата">
            <PaymentsForm
                initialPayment={def}
                users={[user]}
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

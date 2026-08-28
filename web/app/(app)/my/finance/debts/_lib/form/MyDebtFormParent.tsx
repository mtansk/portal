import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import DebtForm from "./DebtForm";
import getMyDebts from "@/app/server-actions/my/finance/getMyDebts";
import getMyReductions from "@/app/server-actions/my/finance/getMyReductions";

export default async function MyDebtFormParent({ id }: { id: string }) {
    const debt = await getMyDebts({ id });

    const [reductions] = await Promise.all([
        getMyReductions({
            params: {
                paramsString: `&debt_id=${id}`,
            },
        }),
    ]);

    if (!debt) {
        throw new Error("Такой задолженности не существует");
    }

    return (
        <FormPageContainer title="Задолженность">
            <DebtForm
                debt={debt}
                reductions={reductions}
            />
        </FormPageContainer>
    );
}

import getUsers from "@/app/server-actions/users/getUsers";
import UserPage from "./UserPage";
import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import getDepts from "@/app/server-actions/departments/getDepts";

export default async function UserFormParent({ id }: { id: string }) {
    const user = await getUsers({ id });

    if (!user) {
        throw new Error("User not found");
    }

    const [depts] = await Promise.all([getDepts({})]);

    return (
        <FormPageContainer
            title={`Сотрудник${user.deleted_at ? " (удален)" : ""}`}
        >
            <UserPage
                user={user}
                depts={depts}
            />
        </FormPageContainer>
    );
}

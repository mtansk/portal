import FormPageContainer from "@/app/components/form/page-container/FormPageContainer";
import getDepts from "@/app/server-actions/departments/getDepts";

import { defaultUserObject } from "@/app/types/user/Users";
import UserForm from "../../[id]/_lib/UserForm";

export default async function UserFormAddParent() {
    const [depts] = await Promise.all([getDepts({})]);

    const user = {
        ...defaultUserObject,
        post_invite: true,
    };

    return (
        <FormPageContainer title="Добавление сотрудника">
            <UserForm
                depts={depts}
                initialUser={user}
                type="add"
                view="page"
            />
        </FormPageContainer>
    );
}

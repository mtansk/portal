import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import UsersBody from "./UsersBody";
import UsersHeader from "./UsersHeader";

export default function UsersMain({
    users,
    depts,
}: {
    users: ApiUser[];
    depts: ApiDept[];
}) {
    return (
        <>
            <UsersHeader />
            <UsersBody
                depts={depts}
                users={users}
            />
        </>
    );
}

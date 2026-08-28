import getDepts from "@/app/server-actions/departments/getDepts";
import getUsers from "@/app/server-actions/users/getUsers";
import UsersMain from "./UsersMain";

export default async function UsersParent() {
    const [users, depts] = await Promise.all([
        getUsers({ params: { show_deleted: "false" } }),
        getDepts({}),
    ]);

    return (
        <UsersMain
            users={users}
            depts={depts}
        />
    );
}

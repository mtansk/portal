import getDepts from "@/app/server-actions/departments/getDepts";
import getUsers from "@/app/server-actions/users/getUsers";
import DepartmentsMain from "./DepartmentsMain";

export default async function DepartmentsParent() {
    const [users, depts] = await Promise.all([getUsers({}), getDepts({})]);

    return (
        <>
            <DepartmentsMain
                users={users}
                depts={depts}
            />
        </>
    );
}

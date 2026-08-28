import getUsers from "@/app/server-actions/users/getUsers";
import DeletedUsersMain from "./DeletedUsersMain";

export default async function DeletedUsersParent() {
    const [users] = await Promise.all([getUsers({})]);

    const deletedUsers = users.filter((user) => user.deleted_at !== null);

    return <DeletedUsersMain users={deletedUsers} />;
}

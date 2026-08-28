import { ApiUser } from "@/app/types/user/Users";
import DeletedUsersBody from "./DeletedUsersBody";

export default function DeletedUsersMain({ users }: { users: ApiUser[] }) {
    return <DeletedUsersBody users={users} />;
}

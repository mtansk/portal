import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";

import styles from "./users-select.module.scss";

import { useState } from "react";
import { FormButtons } from "@/app/components/form/buttons/FormButtons";
import { UsersList } from "../users-list/UsersList";

export default function UsersSelectModal({
    users,
    depts,

    initialUsers,

    onSaveClick,
    setDialogIsOpen,

    type,
}: {
    users: ApiUser[];
    depts: ApiDept[];

    initialUsers: string[];

    onSaveClick: (users: string[]) => void;
    setDialogIsOpen: (isOpen: boolean) => void;

    type: "single" | "multiple";
}) {
    const [selected, setSelected] = useState<string[]>(initialUsers);

    return (
        <div className={styles.main_div}>
            <div className={styles.header}>
                Выберите сотрудник{type === "multiple" ? "ов" : "а"}
            </div>
            <div className={styles.body}>
                <UsersList
                    users={users}
                    depts={depts}
                    initialUsers={selected}
                    onUserSelect={setSelected}
                    type={type}
                />
            </div>
            <div className={styles.buttons}>
                <FormButtons
                    notation={{
                        right: [
                            {
                                style: "ne",
                                text: "Выйти",
                                onClick: () => setDialogIsOpen(false),
                            },
                            {
                                style: "g",
                                text: "Сохранить",
                                onClick: () => {
                                    onSaveClick(selected);
                                    setDialogIsOpen(false);
                                },
                            },
                        ],
                    }}
                />
            </div>
        </div>
    );
}

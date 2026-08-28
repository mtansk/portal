import { ApiUser } from "@/app/types/user/Users";
import styles from "./users-multiple.module.scss";
import { memo, useState } from "react";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { ApiDept } from "@/app/types/depts/Depts";
import { getUserFullnameString } from "@/app/functions/other";
import UsersSelectModal from "./UsersSelectModal";

export const MultipleUserInputNew = memo(function MultipleUserInputNew({
    users,
    depts,
    selectedUsers,

    onSaveClick,

    isDisabled,
    className,
}: {
    users: ApiUser[];
    depts: ApiDept[];

    selectedUsers: string[];
    onSaveClick: (users: string[]) => void;

    isDisabled: boolean;
    className?: string;
}) {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const selectedArray = users.filter(
        (user) => selectedUsers.indexOf(user.user_id) !== -1,
    );

    function handleDeleteClick(user: string) {
        onSaveClick(selectedUsers.filter((id) => id !== user));
    }

    return (
        <>
            {dialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    <UsersSelectModal
                        users={users}
                        depts={depts}
                        initialUsers={selectedUsers}
                        onSaveClick={onSaveClick}
                        setDialogIsOpen={setDialogIsOpen}
                        type="multiple"
                    />
                </ModalPortal>
            )}
            <InputWrapper
                required={true}
                label="Сотрудники"
                headerLike={true}
                isDisabled={isDisabled}
            >
                <div className={styles.input_div + " " + className}>
                    <div className={styles.upper_div}>
                        <button
                            className={styles.select_button}
                            onClick={() => {
                                setDialogIsOpen(true);
                            }}
                            type="button"
                        >
                            Выбрать сотрудников
                        </button>
                    </div>
                    <div className={styles.main_div}>
                        {selectedArray.map((user) => {
                            return (
                                <div
                                    key={user.user_id}
                                    className={styles.user_div}
                                >
                                    <div className={styles.user_name}>
                                        {getUserFullnameString(user)}
                                    </div>
                                    <div className={styles.button_div}>
                                        <button
                                            className={"icon " + styles.button}
                                            onClick={() => {
                                                handleDeleteClick(user.user_id);
                                            }}
                                            type="button"
                                        >
                                            close
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </InputWrapper>
        </>
    );
});

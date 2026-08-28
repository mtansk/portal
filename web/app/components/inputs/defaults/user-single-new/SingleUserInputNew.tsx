import { ApiUser } from "@/app/types/user/Users";
import styles from "./users-single.module.scss";
import { memo, useState } from "react";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { ApiDept } from "@/app/types/depts/Depts";
import { getUserFullnameString } from "@/app/functions/other";
import UsersSelectModal from "../user-multiple-new/UsersSelectModal";
import { FormPrettyUserBlock } from "../pretty-user/FormPrettyUserBlock";

export const SingleUserInputNew = memo(function SingleUserInputNew({
    users,
    depts,
    selectedUsers,

    onSaveClick,

    isDisabled,
}: {
    users: ApiUser[];
    depts: ApiDept[];

    selectedUsers: string[];
    onSaveClick: (users: string[]) => void;

    isDisabled: boolean;
}) {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const user = users.find((user) => user.user_id === selectedUsers[0]);

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
                        type="single"
                    />
                </ModalPortal>
            )}
            <InputWrapper
                required={true}
                label="Сотрудник"
                headerLike={true}
                isDisabled={isDisabled}
            >
                <div className={styles.input_div}>
                    <div className={styles.main_div}>
                        {user ?
                            <FormPrettyUserBlock user={user} />
                        :   <div className={styles.empty}>
                                Выберите сотрудника
                            </div>
                        }
                    </div>
                    {!isDisabled && (
                        <div className={styles.button_div}>
                            <button
                                className={styles.select_button}
                                onClick={() => {
                                    setDialogIsOpen(true);
                                }}
                                type="button"
                            >
                                {user ? "Изменить" : "Выбрать"}
                            </button>
                        </div>
                    )}
                </div>
            </InputWrapper>
        </>
    );
});

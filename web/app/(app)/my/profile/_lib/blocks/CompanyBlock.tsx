import { ApiMyUser } from "@/app/types/user/Users";
import styles from "./../page/css/body.module.scss";
import { startTransition, use, useState } from "react";
import {
    changeAccessContextWithAuthPayload,
    ClientAccessStateContext,
} from "@/app/context/auth/ClientAccessStateContext";
import listStyles from "./css/users-list.module.scss";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import CreateCompanyModal from "../modals/create-company/CreateCompanyModal";
import { useServerAction } from "@/app/components/hooks/useServerAction";
import putCompanySelection from "@/app/server-actions/my/company/putCompanySelection";
import setAccessStateCookies from "@/app/server-actions/auth/cookies/setAccessStateCookies";
import { useRouter } from "next/navigation";
import { useProgress } from "react-transition-progress";
import JoinCompanyModal from "../modals/join-company/JoinCompanyModal";
import findCookie from "@/app/server-actions/auth/cookies/findCookies";
import CompanyNameModal from "../modals/change-company-name/CompanyNameModal";
import { postDeleteMockUsersData } from "@/app/server-actions/users/postDeleteMockUsersData";

export default function CompanyBlock({ users }: { users: ApiMyUser[] }) {
    const [createDialogIsOpen, setCreateDialogIsOpen] = useState(false);
    const [joinDialogIsOpen, setJoinDialogIsOpen] = useState(false);
    const [nameDialogIsOpen, setNameDialogIsOpen] = useState(false);

    const accessState = use(ClientAccessStateContext);
    const serverAction = useServerAction();
    const startProgress = useProgress();

    const userId = accessState.state.userId;

    const initialUser = users.find((user) => user.user_id === userId);

    async function handleEntryClick(id: string) {
        const refreshToken = await findCookie("refreshToken");
        if (!refreshToken) return;
        const res = await serverAction({
            serverAction: () =>
                putCompanySelection({
                    id,
                    token: refreshToken.value,
                }),
            showSuccess: true,
        });
        if (res.ok) {
            await setAccessStateCookies(res.data[0]);
            changeAccessContextWithAuthPayload(res.data[0], accessState.setter);
        }
    }

    async function handleDeleteMockUsersClick() {
        startTransition(() => {
            startProgress();
            serverAction({
                serverAction: () => postDeleteMockUsersData(),
                showSuccess: true,
            });
        });
    }

    return (
        <>
            {createDialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={createDialogIsOpen}
                    setDialogIsOpen={setCreateDialogIsOpen}
                >
                    <CreateCompanyModal
                        setDialogIsOpen={setCreateDialogIsOpen}
                    />
                </ModalPortal>
            )}
            {joinDialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={joinDialogIsOpen}
                    setDialogIsOpen={setJoinDialogIsOpen}
                >
                    <JoinCompanyModal setDialogIsOpen={setJoinDialogIsOpen} />
                </ModalPortal>
            )}
            {nameDialogIsOpen && initialUser && (
                <ModalPortal
                    dialogIsOpen={nameDialogIsOpen}
                    setDialogIsOpen={setNameDialogIsOpen}
                >
                    <CompanyNameModal
                        initialUser={initialUser}
                        setDialogIsOpen={setNameDialogIsOpen}
                    />
                </ModalPortal>
            )}
            <div className={styles.block}>
                <div className={styles.header}>Мои компании</div>
                <div className={styles.header_note}>
                    {`Список всех ваших компаний. Вы можете переключаться между ними, а также создавать новые.`}
                </div>
                <div className={styles.block_body}>
                    <div className={listStyles.list}>
                        {users.map((user) => {
                            return (
                                <div
                                    className={listStyles.user_div}
                                    key={user.user_id}
                                >
                                    <div className={listStyles.company}>
                                        {user.company_name}
                                    </div>
                                    <div className={listStyles.title}>
                                        {user.user_title}
                                    </div>
                                    <div className={listStyles.button}>
                                        {user.user_id === userId ?
                                            <span
                                                className={listStyles.current}
                                            >
                                                Текущая
                                            </span>
                                        :   <button
                                                className={
                                                    listStyles.switch_button
                                                }
                                                onClick={() => {
                                                    startTransition(
                                                        async () => {
                                                            startProgress();
                                                            await handleEntryClick(
                                                                user.user_id,
                                                            );
                                                        },
                                                    );
                                                }}
                                            >
                                                Войти
                                            </button>
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.actions}>
                    {accessState.state.accessLevel === "admin" && (
                        <>
                            <button
                                className={styles.button_good}
                                onClick={handleDeleteMockUsersClick}
                            >
                                Удалить тестовых сотрудников
                            </button>
                            <button
                                className={styles.button_good}
                                onClick={() => setNameDialogIsOpen(true)}
                            >
                                Изменить название компании
                            </button>
                        </>
                    )}
                    <button
                        className={styles.button_good}
                        onClick={() => setCreateDialogIsOpen(true)}
                    >
                        Создать новую компанию
                    </button>
                    <button
                        className={styles.button_good}
                        onClick={() => setJoinDialogIsOpen(true)}
                    >
                        Присоединиться к компании по коду
                    </button>
                </div>
            </div>
        </>
    );
}

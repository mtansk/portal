"use client";

import { use, useMemo, useState } from "react";
import styles from "./add.module.scss";
import { FormButtons } from "@/app/components/form/buttons/FormButtons";
import { useRouter } from "next/navigation";
import useBackURL from "@/app/components/hooks/useBackURL";
import { ApiUser } from "@/app/types/user/Users";
import { ApiDept } from "@/app/types/depts/Depts";
import { UsersList } from "../../../../../components/inputs/defaults/users-list/UsersList";

export default function AddModal({
    objectPath,

    _users,
    _depts,

    useSheet = false,
}: {
    objectPath: string;

    _users: Promise<ApiUser[]>;
    _depts: Promise<ApiDept[]>;

    useSheet?: boolean;
}) {
    const router = useRouter();
    const backurl = useBackURL();

    const users = use(_users);
    const depts = use(_depts);

    const filteredUsers = useMemo(
        () => users.filter((u) => u.deleted_at === null),
        [users],
    );

    type AddOptionsType = {
        type: "single" | "multiple" | null;
        user_id: string | null;
    };

    const def: AddOptionsType = {
        type: useSheet ? "single" : null,
        user_id: null,
    };

    const [options, setOptions] = useState<AddOptionsType>(def);
    const [page, setPage] = useState<number>(useSheet ? 2 : 1);

    const UserSelection = (
        <>
            <div className={styles.header}>Выберите сотрудника</div>
            <div className={styles.body}>
                <div className={styles.users}>
                    <UsersList
                        depts={depts}
                        users={filteredUsers}
                        initialUsers={options.user_id ? [options.user_id] : []}
                        type="single"
                        onUserSelect={(users) => {
                            setOptions({
                                ...options,
                                user_id: users[0],
                            });
                        }}
                    />
                </div>
            </div>
            <div className={styles.buttons}>
                <FormButtons
                    notation={{
                        right:
                            useSheet ?
                                [
                                    {
                                        style: "g",
                                        text: "Далее",
                                        disabled: !options.user_id,
                                        href: `${objectPath}/add?uid=${options.user_id}&backurl=${backurl}`,
                                    },
                                ]
                            :   [
                                    {
                                        style: "ne",
                                        text: "Назад",
                                        onClick() {
                                            setPage(1);
                                        },
                                    },
                                    {
                                        style: "g",
                                        text: "Далее",
                                        disabled: !options.user_id,
                                        href: `${objectPath}/add?uid=${options.user_id}&backurl=${backurl}`,
                                    },
                                ],
                    }}
                />
            </div>
        </>
    );

    const TypeSelection = !useSheet && (
        <>
            <div className={styles.header}>Выберите режим добавления</div>
            <div className={styles.body}>
                <div className={styles.options}>
                    <Option
                        title="Расширенный"
                        icon="add"
                        note="Можно выбрать только одного сотрудника, но с расширенными настройками объекта."
                        onClick={() =>
                            setOptions({
                                ...options,
                                type: "single",
                            })
                        }
                        isSelected={options.type === "single"}
                    />
                    <Option
                        title="Массовый"
                        icon="work_history"
                        note="Можно выбрать несколько сотрудников, но доступны только базовые настройки объекта."
                        onClick={() =>
                            setOptions({
                                ...options,
                                type: "multiple",
                            })
                        }
                        isSelected={options.type === "multiple"}
                    />
                </div>
            </div>
            <div className={styles.buttons}>
                <FormButtons
                    notation={{
                        right: [
                            {
                                style: "g",
                                text: "Далее",
                                disabled: !options.type,
                                href:
                                    options.type === "multiple" ?
                                        `${objectPath}/add?uid=multiple&backurl=${backurl}`
                                    :   undefined,
                                onClick() {
                                    if (options.type === "single") {
                                        setPage(2);
                                    }
                                },
                            },
                        ],
                    }}
                />
            </div>
        </>
    );

    return (
        <div
            className={styles.main_div + " " + (page === 2 ? styles.tall : "")}
        >
            {page === 1 && TypeSelection}
            {page === 2 && UserSelection}
        </div>
    );
}

function Option({
    title,
    note,

    isSelected,
    onClick,
}: {
    title: string;
    icon: string;
    note?: string;

    isSelected?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            className={
                styles.option + " " + (isSelected ? styles.selected : "")
            }
            onClick={onClick}
        >
            <div className={styles.title}>{title}</div>
            <div className={styles.note}>{note}</div>
        </button>
    );
}

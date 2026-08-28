import { AccessLevels } from "@/app/types/access/Access";
import { ApiUser } from "@/app/types/user/Users";
import { useState } from "react";

import styles from "./css/level-modal.module.scss";
import { Button } from "@/app/components/buttons/Buttons";
import { useServerAction } from "@/app/components/hooks/useServerAction";
import { putAccessLevel } from "@/app/server-actions/users/putAccessLevel";

export default function AccessLevelModal({
    user,
    setDialogIsOpen,
}: {
    user: ApiUser;
    setDialogIsOpen: (value: boolean) => void;
}) {
    const [level, setLevel] = useState<AccessLevels>(
        user.access_level || "employee",
    );
    const [isPending, setIsPending] = useState(false);

    const serverAction = useServerAction();

    async function handleSaveClick() {
        setIsPending(true);
        await serverAction({
            serverAction: () =>
                putAccessLevel({ user_id: user.user_id, access_level: level }),
            showSuccess: true,
        });
        setDialogIsOpen(false);
    }

    return (
        <div className={styles.main_div}>
            <select
                value={level}
                onChange={(e) => setLevel(e.target.value as AccessLevels)}
            >
                <option value="employee">Сотрудник</option>
                <option value="admin">Администратор</option>
            </select>
            <div className={styles.text}>
                {`Администратор может видеть и редактировать все объекты, 
                    а также управлять аккаунтами.
                    Сотрудник может видеть только свои объекты.`}
            </div>
            <div className={styles.button_div}>
                <Button
                    type="filled"
                    colors="submit-gray"
                    innerContent="Сохранить"
                    onClick={handleSaveClick}
                    isPending={isPending}
                />
            </div>
        </div>
    );
}

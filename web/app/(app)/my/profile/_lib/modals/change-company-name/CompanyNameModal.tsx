import FirstNameInput from "@/app/components/inputs/defaults/first-name/FirstNameInput";
import styles from "./credentials.module.scss";
import { ApiMyAccount } from "@/app/types/access/Accounts";
import EmailInput from "@/app/components/inputs/defaults/email/EmailInput";
import TelegramInput from "@/app/components/inputs/defaults/telegram/TelegramInput";
import putMyAccount from "@/app/server-actions/my/accounts/putMyAccount";
import { useServerAction } from "@/app/components/hooks/useServerAction";
import { useState, useRef, useEffect } from "react";
import SubmitButton from "../../../../../../components/buttons/submit-button/SubmitButton";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import { ApiMyUser } from "@/app/types/user/Users";
import putCompanyName from "@/app/server-actions/my/company/putCompanyName";

export default function CompanyNameModal({
    initialUser,

    setDialogIsOpen,
}: {
    initialUser: ApiMyUser;

    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const [user, setUser] = useState<ApiMyUser>(initialUser);

    const [isPending, setIsPending] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const serverAction = useServerAction();

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(
        () => setIsValid(formRef.current?.checkValidity() ?? false),
        [user],
    );

    async function handleSaveClick() {
        setIsPending(true);
        const res = await serverAction({
            serverAction: () => putCompanyName(user),
            showSuccess: true,
        });
        if (res.ok) {
            setDialogIsOpen(false);
        }
        setIsPending(false);
    }

    return (
        <form ref={formRef}>
            <div className={styles.main_div}>
                <div className={styles.header}>Название компании</div>
                <NameInput
                    isDisabled={false}
                    value={user.company_name}
                    name="name"
                    onChange={(e) =>
                        setUser({
                            ...user,
                            company_name: e.target.value,
                        })
                    }
                    className={styles.name}
                />
                <div className={styles.note}>
                    {`Название компании может быть любым.`}
                </div>
                <div className={styles.button_div}>
                    <SubmitButton
                        text="Сохранить"
                        onClick={async () => {
                            await handleSaveClick();
                        }}
                        isDisabled={!isValid || isPending}
                        isPending={isPending}
                    />
                </div>
            </div>
        </form>
    );
}

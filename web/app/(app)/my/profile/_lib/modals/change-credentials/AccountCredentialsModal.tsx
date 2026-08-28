import FirstNameInput from "@/app/components/inputs/defaults/first-name/FirstNameInput";
import styles from "./credentials.module.scss";
import { ApiMyAccount } from "@/app/types/access/Accounts";
import EmailInput from "@/app/components/inputs/defaults/email/EmailInput";
import TelegramInput from "@/app/components/inputs/defaults/telegram/TelegramInput";
import putMyAccount from "@/app/server-actions/my/accounts/putMyAccount";
import { useServerAction } from "@/app/components/hooks/useServerAction";
import { useState, useRef, useEffect } from "react";
import SubmitButton from "../../../../../../components/buttons/submit-button/SubmitButton";

export default function AccountCredentialsModal({
    initialAccount,

    setDialogIsOpen,
}: {
    initialAccount: ApiMyAccount;

    setDialogIsOpen: (isOpen: boolean) => void;
}) {
    const [account, setAccount] = useState<ApiMyAccount>(initialAccount);

    const [isPending, setIsPending] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const serverAction = useServerAction();

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(
        () => setIsValid(formRef.current?.checkValidity() ?? false),
        [account],
    );

    async function handleSaveClick() {
        setIsPending(true);
        const res = await serverAction({
            serverAction: () => putMyAccount(account),
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
                <div className={styles.header}>Данные аккаунта</div>
                <FirstNameInput
                    value={account.first_name}
                    onChange={(e) =>
                        setAccount({ ...account, first_name: e.target.value })
                    }
                    className={styles.name}
                />
                <TelegramInput
                    value={account.account_telegram}
                    onChange={(e) =>
                        setAccount({
                            ...account,
                            account_telegram: e.target.value,
                        })
                    }
                    className={styles.telegram}
                />
                <EmailInput
                    value={account.account_email}
                    onChange={() => {}}
                    isDisabled={true}
                    className={styles.email}
                />
                <div className={styles.note}>
                    {`Для изменения электронной почты обратитесь в поддержку.`}
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

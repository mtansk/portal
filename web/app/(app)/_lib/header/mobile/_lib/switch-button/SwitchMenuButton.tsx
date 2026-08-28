import styles from "./switch-button.module.scss";

export default function SwitchMenuButton({
    isAdminMenu,
    setIsAdminMenu,
}: {
    isAdminMenu: boolean;
    setIsAdminMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <div className={styles.button_div}>
            <button
                className={styles.switch_button}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsAdminMenu((isAdminMenu) => !isAdminMenu);
                }}
            >
                <div className={"icon " + styles.icon}>
                    switch_access_shortcut
                </div>
                <div className={styles.button_text}>
                    {isAdminMenu ? "Меню сотрудника" : "Меню руководителя"}
                </div>
            </button>
        </div>
    );
}

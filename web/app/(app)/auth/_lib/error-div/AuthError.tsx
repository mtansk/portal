import styles from "./error.module.scss";

export default function AuthError({ error }: { error: string | null }) {
    if (!error) return "";

    return (
        <div className={styles.error}>
            <div className={styles.error_header}>{`Ошибка! (${error})`}</div>
            <div className={styles.error_text}>
                {errorTextString(error)}
                <span>{` Если ошибка повторяется, пожалуйста, сделайте скриншот этой страницы и напишите в поддержку.`}</span>
            </div>
        </div>
    );
}

export function errorTextString(errorCode: string) {
    switch (errorCode) {
        case "AUTH-LOGIN-CREDENTIALS":
            return "Неверный логин или пароль.";
        case "AUTH-LOGIN-CODE-INVALID":
            return "Неверный код.";
        case "AUTH-LOGIN-CODE-EXPIRED":
            return "Код устарел.";
        case "AUTH-LOGIN-CODE-LIMIT":
            return "Превышен лимит попыток. Попробуйте после 00:00 UTC.";
        case "AUTH-LOGIN-CODE-EARLY":
            return "Попробуйте через минуту.";
        default:
            return "Ошибка при входе.";
    }
}

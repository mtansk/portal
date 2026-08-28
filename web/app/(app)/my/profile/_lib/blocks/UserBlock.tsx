import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import styles from "./../page/css/body.module.scss";
import { ApiMyUser } from "@/app/types/user/Users";

export default function UserBlock({ currentUser }: { currentUser: ApiMyUser }) {
    return (
        <div className={styles.block}>
            <div className={styles.header}>Данные сотрудника</div>
            <div className={styles.header_note}>
                {`Эти данные прикреплены к сотруднику и являются частью
    компании. Изменять их могут администраторы на вкладке
    "Сотрудники".`}
            </div>
            <div className={styles.block_body}>
                <InputWrapper
                    isDisabled={true}
                    label="Фамилия"
                >
                    <div className={styles.input}>
                        {currentUser.last_name || "-"}
                    </div>
                </InputWrapper>
                <InputWrapper
                    isDisabled={true}
                    label="Имя"
                >
                    <div className={styles.input}>{currentUser.first_name}</div>
                </InputWrapper>
                <InputWrapper
                    isDisabled={true}
                    label="Отчество"
                >
                    <div className={styles.input}>
                        {currentUser.middle_name || "-"}
                    </div>
                </InputWrapper>

                <InputWrapper
                    isDisabled={true}
                    label="Электронная почта"
                >
                    <div className={styles.input}>
                        {currentUser.user_email || "-"}
                    </div>
                </InputWrapper>
                <InputWrapper
                    isDisabled={true}
                    label="Телеграм"
                >
                    <div className={styles.input}>
                        {currentUser.user_telegram || "-"}
                    </div>
                </InputWrapper>
                <InputWrapper
                    isDisabled={true}
                    label="Телефон"
                >
                    <div className={styles.input}>
                        {currentUser.user_phone || "-"}
                    </div>
                </InputWrapper>
                <InputWrapper
                    isDisabled={true}
                    label="ID"
                >
                    <div className={styles.input_small}>
                        {currentUser.user_id || "-"}
                    </div>
                </InputWrapper>
                <InputWrapper
                    isDisabled={true}
                    label="Создан"
                >
                    <div className={styles.input_small}>
                        {`${currentUser.created_at} UTC` || "-"}
                    </div>
                </InputWrapper>
            </div>
            <div className={styles.actions}></div>
        </div>
    );
}

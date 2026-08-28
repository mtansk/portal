import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import styles from "./css/my-desc.module.scss";

export default function MyDesc({ value }: { value: string | null }) {
    return (
        <InputWrapper
            isDisabled={true}
            label="Описание"
            className={styles.desc}
        >
            <div className={styles.input}>{value || ""}</div>
        </InputWrapper>
    );
}

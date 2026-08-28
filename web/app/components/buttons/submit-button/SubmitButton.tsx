import styles from "./submit.module.scss";

export default function SubmitButton({
    isDisabled = false,
    isPending = false,
    onClick,

    text,
}: {
    isDisabled?: boolean;
    isPending?: boolean;
    onClick: () => void;

    text: React.ReactNode;
}) {
    if (isPending) {
        return <ButtonSpinner />;
    }

    return (
        <button
            type="button"
            className={styles.submit_button}
            disabled={isDisabled}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

function ButtonSpinner() {
    return <div className={styles.spinner}></div>;
}

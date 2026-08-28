import styles from "./css/loading.module.scss";

export default function FormLoading({ className }: { className?: string }) {
    return (
        <div className={styles.form_loading_div + " " + className}>
            <div className={"spinner "}></div>
        </div>
    );
}

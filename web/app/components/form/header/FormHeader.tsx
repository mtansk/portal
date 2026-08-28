import styles from "./form-header.module.scss";

export default function FormHeader({
    title,
    className,
    headerLike = true,
}: {
    title: string | React.ReactNode;
    className?: string;
    headerLike?: boolean;
}) {
    return (
        <div
            className={
                styles.form_header +
                " " +
                (className || "") +
                " " +
                (headerLike ? styles.header_like : styles.input_like)
            }
        >
            {title}
        </div>
    );
}

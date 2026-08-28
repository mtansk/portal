import styles from "./wrapper.module.scss";

export default function InputWrapper({
    children,
    isDisabled,
    required,

    label,
    headerLike,
    id,
    className,

    description,
    alwaysShowDescription,
    lengthOptions,
}: {
    children: React.ReactNode;
    isDisabled: boolean;
    required?: boolean;

    label?: string;
    headerLike?: boolean;
    id?: string;
    className?: string;

    description?: string;
    alwaysShowDescription?: boolean;
    lengthOptions?: { max: number; current: number };
}) {
    return (
        <div className={styles.wrapper_div + " " + className}>
            {label && (
                <label
                    htmlFor={id}
                    className={headerLike ? styles.header_label : styles.label}
                >
                    {label}
                </label>
            )}
            <div className={styles.input}>
                {children}
                <div className={styles.req}>
                    {!isDisabled && required && "*"}
                </div>
                {!isDisabled && lengthOptions && (
                    <div className={styles.length}>
                        {`${lengthOptions.current}/${lengthOptions.max}`}
                    </div>
                )}
            </div>
            {description && (alwaysShowDescription || !isDisabled) && (
                <div className={styles.desc}>{description}</div>
            )}
        </div>
    );
}

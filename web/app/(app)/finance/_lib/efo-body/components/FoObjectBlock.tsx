import React from "react";
import styles from "./css/fo-block.module.scss";

export default function FoObjectBlock({
    innerContent,
    onObjectClick,
}: {
    innerContent: {
        group: React.ReactNode;
        name: React.ReactNode;
        details: React.ReactNode;
        total: React.ReactNode;
    };
    onObjectClick: () => void;
}) {
    return (
        <div
            className={styles.block_div}
            onClick={onObjectClick}
        >
            <div className={styles.group}>{innerContent.group}</div>
            <div className={styles.name}>{innerContent.name}</div>
            <div className={styles.details}>{innerContent.details}</div>
            <div className={styles.total}>{innerContent.total}</div>
        </div>
    );
}

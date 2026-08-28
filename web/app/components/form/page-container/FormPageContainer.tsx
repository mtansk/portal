"use client";

import { useSearchParams } from "next/navigation";

import { Suspense } from "react";
import styles from "./form-page.module.scss";
import { Button } from "../../buttons/Buttons";

const BackButton = () => {
    const params = useSearchParams();

    return (
        <Button
            innerContent="Назад"
            type="filled"
            colors="filled-gray"
            href={params.get("backurl") || "/finance"}
        />
    );
};

export default function FormPageContainer({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className={styles.form_page_container_div}>
            <div className={styles.header_div}>
                <div className={styles.header_main}>
                    <div className={styles.back_button}>
                        <Suspense>
                            <BackButton />
                        </Suspense>
                    </div>
                    <div className={styles.name}>{title}</div>
                </div>
            </div>
            <div className={styles.body_div}>{children}</div>
        </div>
    );
}

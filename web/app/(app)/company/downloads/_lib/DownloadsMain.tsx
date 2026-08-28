"use client";

import postDownloadCustom from "@/app/server-actions/data/postDownloadCustom";
import styles from "./css/download.module.scss";
import SubmitButton from "@/app/components/buttons/submit-button/SubmitButton";
import { useState } from "react";

export default function DownloadsMain() {
    const [isPending, setIsPending] = useState(false);

    async function handleDownloadClick() {
        setIsPending(true);
        const blob = await postDownloadCustom();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "downloadedFile";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setTimeout(() => {
            setIsPending(false);
        }, 2000);
    }

    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <div className={styles.header}>Центр загрузок</div>
                <div className={styles.block}>
                    <div className={styles.block_header}>Скачивание данных</div>
                    <div className={styles.text}>
                        <span>{`Администраторам доступно скачивание данных из Портала.
                        Данные загружаются в формате XLSX и содержат (в том числе и удаленные, если возможно):`}</span>
                        <ul className={styles.list}>
                            <li>Начисления</li>
                            <li>Смены</li>
                            <li>Удержания</li>
                            <li>Выплаты</li>
                            <li>Расчетные листы</li>
                            <li>Налоги</li>
                            <li>Налоговые вычеты</li>
                            <li>Взносы</li>
                            <li>Задолженности</li>
                            <li>Группы начислений</li>
                            <li>Сотрудников</li>
                            <li>Отделы</li>
                        </ul>
                        <span>{`Лимит скачивания составляет 5 файлов за 24 часа. 
                        Для скачивания логов (истории изменения объектов), пожалуйста,
                        обратитесь в поддержку.`}</span>
                    </div>
                    <div className={styles.button_div}>
                        <SubmitButton
                            text="Скачать"
                            onClick={handleDownloadClick}
                            isPending={isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    /*   return (
        <div>
            <button
                onClick={async () => {
                    const blob = await postDownloadCustom();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "downloadedFile";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                }}
            >
                Download
            </button>
        </div>
    ); */
}

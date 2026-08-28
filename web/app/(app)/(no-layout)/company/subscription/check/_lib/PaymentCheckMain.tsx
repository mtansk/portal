"use client";

import { useServerAction } from "@/app/components/hooks/useServerAction";
import { PaymentCheckSearchParams } from "../page";
import { useEffect, useState } from "react";
import postCheck from "@/app/server-actions/transactions/postCheck";
import styles from "./css/body.module.scss";
import Spinner from "@/app/components/loading/spinner/Spinner";
import { Button } from "@/app/components/buttons/Buttons";
import Image from "next/image";
import logo from "./../../../../../_lib/images/logo-nobg.png";

export default function PaymentCheckMain({
    searchParams,
}: {
    searchParams: PaymentCheckSearchParams;
}) {
    const [isPending, setIsPending] = useState(true);
    const [res, setRes] = useState<{
        status: string;
        details?: string;
    } | null>(null);

    const serverAction = useServerAction();

    useEffect(() => {
        if (!isPending) {
            return;
        }
        const fetchData = async () => {
            const res = await serverAction({
                serverAction: () => postCheck(searchParams),
                showSuccess: false,
            });

            const status = res.data[0].status;

            if (status === "succeeded" || status === "canceled") {
                setIsPending(false);
            }
            setRes(res.data[0]);
        };

        fetchData();

        const interval = setInterval(fetchData, 3000);

        return () => clearInterval(interval);
    }, [isPending, serverAction, searchParams]);

    function InnerContent() {
        if (isPending) {
            return (
                <>
                    <div className={styles.image}>
                        <Spinner />
                    </div>
                    <div className={styles.header}>Загрузка...</div>
                    <div className={styles.text}>
                        Пожалуйста, не закрывайте эту страницу. Если возникли
                        трудности с оплатой, а деньги не списались — попробуйте
                        оплатить еще раз. При неполадках — напишите в поддержку.
                    </div>
                    <div className={styles.button_div}>
                        <Button
                            type="filled"
                            colors="nav-blue"
                            href="/pub/support"
                            innerContent="Поддержка"
                        />
                    </div>
                </>
            );
        }

        if (res?.status === "succeeded") {
            return (
                <>
                    <div className={styles.image}>
                        <Image
                            src={logo}
                            alt="logo"
                            style={{ width: "60%", height: "auto" }}
                        />
                    </div>
                    <div className={styles.header}>Спасибо!</div>
                    <div className={styles.text}>
                        Ваша подписка уже подготовлена и подключена к вашей
                        компании. Чек придет на почту в течение суток. Желаем
                        вам приятного пользования!
                    </div>
                    <div className={styles.button_div}>
                        <Button
                            type="filled"
                            colors="nav-blue"
                            href="/company/subscription/overview"
                            innerContent="Продолжить"
                        />
                    </div>
                </>
            );
        }

        if (res?.status === "canceled") {
            return (
                <>
                    <div className={styles.header}>Ошибка!</div>
                    <div className={styles.text}>
                        При приведении оплате произошла ошибка, деньги не были
                        списаны. Причина: {` ${res.details}. `} Пожалуйста,
                        попробуйте снова.
                    </div>
                    <div className={styles.button_div}>
                        <Button
                            type="filled"
                            colors="buy-pink-anim"
                            href={`/company/subscription/payment?q=${searchParams.q}`}
                            innerContent="Оплатить"
                        />
                    </div>
                </>
            );
        }
    }

    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                <InnerContent />
            </div>
        </div>
    );
}

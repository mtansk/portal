"use client";

import {
    dateStringToUTCDate,
    sqlTimestampToUTCDate,
} from "@/app/functions/dates";
import styles from "./css/body.module.scss";
import { ApiSubscription } from "@/app/types/access/Subscriptions";
import { Link } from "react-transition-progress/next";
import { Button } from "@/app/components/buttons/Buttons";
import { ApiTransaction } from "@/app/types/access/Transactions";

export type SubscriptionTypes = "trial" | "basic";

export default function SubscriptionsBody({
    subscriptions,
    transactions,
}: {
    subscriptions: ApiSubscription[];
    transactions: ApiTransaction[];
}) {
    const activeSubscription = subscriptions.find(
        (subscription) => subscription.is_active === 1,
    );

    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                <div className={styles.block}>
                    <div className={styles.block_header}>Активная подписка</div>
                    <div className={styles.block_body}>
                        {activeSubscription ?
                            <div className={styles.current_div}>
                                <div className={styles.current_type}>
                                    {`Тип: ${subTypeString(
                                        activeSubscription?.subscription_type,
                                    )}`}
                                </div>
                                <div className={styles.current_timestamp}>
                                    {`Действует до ${Intl.DateTimeFormat(
                                        "ru-RU",
                                        {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            timeZone: "UTC",
                                        },
                                    ).format(
                                        dateStringToUTCDate(
                                            activeSubscription?.subscription_en_date,
                                        ),
                                    )}`}
                                </div>
                                <div className={styles.latest}>
                                    {`Последняя подписка закончится ${Intl.DateTimeFormat(
                                        "ru-RU",
                                        {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            timeZone: "UTC",
                                        },
                                    ).format(
                                        dateStringToUTCDate(
                                            subscriptions[0]
                                                .subscription_en_date,
                                        ),
                                    )}`}
                                </div>
                            </div>
                        :   <div className={styles.current_div}>
                                <div className={styles.current_type}>
                                    Подписка не активна
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className={styles.block}>
                    <div className={styles.block_header}>Транзакции</div>
                    <div className={styles.block_body}>
                        {transactions.length > 0 && (
                            <div className={styles.note + " " + styles.alert}>
                                {`У вас есть незавершенная оплата. Если что-то пошло не так, а деньги не списались, 
                                пожалуйста, попробуйте оплатить еще раз. Если деньги списались — нажмите на кнопку ниже.
                                Эта кнопка пропадет сама в течение часа. При любых трудностях, пожалуйста, напишите в поддержку.`}
                            </div>
                        )}
                        {transactions.map((transaction) => {
                            return (
                                <Link
                                    key={transaction.transaction_id}
                                    href={`/company/subscription/check?transaction_id=${transaction.transaction_id}&q=6`}
                                    className={styles.transaction_link}
                                >
                                    <button type="button">{`Нажмите сюда`}</button>
                                </Link>
                            );
                        })}
                        {transactions.length === 0 && (
                            <div className={styles.note}>
                                {`При оплате через СБП или приложение банка здесь
                                будет кнопка для подтверждения оплаты.`}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.block}>
                    <div className={styles.block_header}>Все подписки</div>
                    <div className={styles.block_body}>
                        {subscriptions.map((subscription) => {
                            return (
                                <div
                                    className={styles.subscription_div}
                                    key={subscription.subscription_id}
                                >
                                    <div className={styles.current_type}>
                                        {`Тип: ${subTypeString(
                                            subscription?.subscription_type,
                                        )}`}
                                    </div>
                                    <div className={styles.current_dates}>
                                        {`${Intl.DateTimeFormat("ru-RU", {
                                            timeZone: "UTC",
                                        }).format(
                                            dateStringToUTCDate(
                                                subscription?.subscription_st_date,
                                            ),
                                        )} —  ${Intl.DateTimeFormat("ru-RU", {
                                            timeZone: "UTC",
                                        }).format(
                                            dateStringToUTCDate(
                                                subscription?.subscription_en_date,
                                            ),
                                        )}`}
                                    </div>
                                    <div className={styles.current_timestamp}>
                                        {`Получена: ${Intl.DateTimeFormat(
                                            "ru-RU",
                                            { timeZone: "UTC" },
                                        ).format(
                                            sqlTimestampToUTCDate(
                                                subscription?.created_at,
                                            ),
                                        )}`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.button_div}>
                    <Button
                        type="filled"
                        colors="buy-pink-anim"
                        innerContent="Продлить подписку"
                        href={"/company/subscription/buy"}
                        prefetch={false}
                    />
                </div>
                <div className={styles.note}>
                    {`В подписку входят все функции Портала без ограничений и лимитов. 
                    Мы не используем автопродление, поэтому вам не нужно беспокоиться о дополнительных списаниях.
                    Пожалуйста, следите за сроком окончания подписки самостоятельно.
                    Все даты указаны в UTC и учитываются включительно. 
                    По любым вопросам, связанным с подписками, счетами и другой финансовой информацией, вы можете обратиться в поддержку.`}
                </div>
            </div>
        </div>
    );
}

function subTypeString(type: string | undefined): string {
    switch (type) {
        case "trial":
            return "Пробная";
        case "basic":
            return "Базовая";
        default:
            return "Неизвестно";
    }
}

/* 

2FB7F1
*/

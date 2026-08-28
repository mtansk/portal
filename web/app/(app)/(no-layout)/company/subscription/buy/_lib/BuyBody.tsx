"use client";

import { dateStringToUTCDate } from "@/app/functions/dates";
import styles from "./css/body.module.scss";
import { ApiSubscription } from "@/app/types/access/Subscriptions";
import { ApiMyUser } from "@/app/types/user/Users";
import { UTCDateMini } from "@date-fns/utc";
import { use, useState } from "react";
import { ClientAccessStateContext } from "@/app/context/auth/ClientAccessStateContext";
import { Link } from "react-transition-progress/next";
import { Formatter } from "@/app/classes/Formatter";
import { addMonths } from "date-fns";
import { Button } from "@/app/components/buttons/Buttons";
import { ApiTransaction } from "@/app/types/access/Transactions";

const price = 999;

export default function BuyBody({
    subscriptions,
    myUsers,
    transactions,
}: {
    subscriptions: ApiSubscription[];
    myUsers: ApiMyUser[];
    transactions: ApiTransaction[];
}) {
    const accessState = use(ClientAccessStateContext);
    const [qty, setQty] = useState(6);

    const currentUser = myUsers.find(
        (u) => u.user_id === accessState.state.userId,
    );

    const latestSubscription = subscriptions.sort(
        (a, b) =>
            dateStringToUTCDate(b.subscription_en_date).getTime() -
            dateStringToUTCDate(a.subscription_en_date).getTime(),
    )[0];
    const isEnded =
        dateStringToUTCDate(
            latestSubscription.subscription_en_date,
        ).setUTCHours(0, 0, 0, 0) < new Date().setUTCHours(0, 0, 0, 0);

    const newStartDate =
        isEnded ?
            new UTCDateMini()
        :   dateStringToUTCDate(latestSubscription.subscription_en_date);

    return (
        <div className={styles.body_div}>
            <div className={styles.main_div}>
                {transactions.length > 0 && (
                    <div className={styles.transaction}>
                        {`Кажется, у вас есть незавершенные транзакции. Если у
                            вас возникли проблемы и вы не смогли провести
                            оплату, а деньги не списались — попробуйте оплатить
                            еще раз, эта надпись пропадет через час. Если деньги списались — перейдите на страницу "Подписка". Если
                            возникнут трудности, пожалуйста, напишите в
                            поддержку.`}
                    </div>
                )}
                <div className={styles.header}>Продление подписки</div>
                <div className={styles.body}>
                    <div className={styles.latest}>
                        {isEnded ?
                            "Подписка закончилась. Новая подписка начнет действовать с момента оплаты."
                        :   `Текущая подписка действует до  ${Intl.DateTimeFormat(
                                "ru",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",

                                    timeZone: "UTC",
                                },
                            ).format(
                                dateStringToUTCDate(
                                    latestSubscription.subscription_en_date,
                                ),
                            )} Новая подписка начнет действовать с момента окончания текущей.`
                        }
                    </div>
                    <div className={styles.buy_div}>
                        <div className={styles.title}>Подписка на Портал</div>
                        <div
                            className={styles.price}
                        >{`${Formatter.currencyString({
                            value: price,
                        })} / месяц`}</div>
                        <div className={styles.qty}>
                            <button
                                type="button"
                                onClick={() => qty > 1 && setQty(qty - 1)}
                                className={styles.qty_button + " icon"}
                            >
                                remove
                            </button>
                            <div
                                className={styles.qty_qty}
                            >{`${qty} мес.`}</div>
                            <button
                                type="button"
                                onClick={() => qty < 12 && setQty(qty + 1)}
                                className={styles.qty_button + " icon"}
                            >
                                add
                            </button>
                        </div>
                        <div className={styles.until}>
                            {`до ${Intl.DateTimeFormat("ru", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                timeZone: "UTC",
                            }).format(addMonths(newStartDate, qty))}`}
                        </div>
                        <div className={styles.total}>
                            {Formatter.currencyString({
                                value: price * qty,
                            })}
                        </div>
                    </div>
                    <div className={styles.note}>
                        {`В подписку входят все функции Портала без ограничений. После оплаты подписка автоматически привяжется к компании "${currentUser?.company_name}",
                     id: ${currentUser?.company_id}. 
                     Мы не используем функцию автопродления, поэтому вам не нужно беспокоиться о дополнительных списаниях. Продолжая, вы соглашаетесь с `}
                        <Link href={"/pub/legal"}>
                            Пользовательским соглашением
                        </Link>
                        .{" "}
                        {`Если вы хотите, чтобы мы выставили счет для ИП или юр.
                        лица, пожалуйста, `}
                        <Link href={"/pub/support"}>напишите в поддержку</Link>.
                    </div>
                    <div className={styles.button_div}>
                        <Button
                            type="filled"
                            colors="buy-pink-anim"
                            innerContent="Оплатить"
                            href={`/company/subscription/payment?q=${qty}`}
                            prefetch={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useProgress } from "react-transition-progress";
import { PaymentSearchParams } from "../page";
import styles from "./css/body.module.scss";
import Script from "next/script";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import useInfoPopover from "@/app/components/hooks/useInfoPopover";

type WindowWithYooMoneyCheckoutWidget = Window &
    typeof globalThis & {
        YooMoneyCheckoutWidget: any;
    };

export default function PaymentMain({
    searchParams,
}: {
    searchParams: PaymentSearchParams;
}) {
    const ct = searchParams.ct;

    const startProgress = useProgress();
    const router = useRouter();
    const addPopoverMessage = useInfoPopover();

    function onScriptLoad() {
        if (
            !(window as WindowWithYooMoneyCheckoutWidget).YooMoneyCheckoutWidget
        ) {
            throw new Error("Проблема с виджетом для оплаты.");
        }

        const hostname = window.location.hostname;
        const protocol = window.location.protocol;

        const checkout = new (
            window as WindowWithYooMoneyCheckoutWidget
        ).YooMoneyCheckoutWidget({
            confirmation_token: ct,
            error_callback: function (error: { error: string }) {
                startTransition(() => {
                    startProgress();
                    addPopoverMessage({
                        code: 400,
                        error_code: error.error,
                        message: "Ошибка оплаты. Пожалуйста, попробуйте снова.",
                        type: "error",
                    });
                    router.replace(
                        `/company/subscription/buy?&q=${searchParams.q}`,
                    );
                });
                checkout.destroy();
            },
        });

        checkout.on("success", () => {
            startTransition(() => {
                startProgress();
                router.replace(
                    `/company/subscription/check?transaction_id=${searchParams.transaction_id}&q=${searchParams.q}`,
                );
            });

            checkout.destroy();
        });

        checkout.on("fail", () => {
            startTransition(() => {
                startProgress();
                addPopoverMessage({
                    code: 400,
                    error_code: "widget",
                    message: "Ошибка оплаты. Пожалуйста, попробуйте снова.",
                    type: "error",
                });
                router.replace(
                    `/company/subscription/buy?&q=${searchParams.q}`,
                );
            });

            checkout.destroy();
        });

        checkout.render("payment-form");
    }

    return (
        <>
            <Script
                src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js"
                strategy="lazyOnload"
                onReady={onScriptLoad}
            />
            <div className={styles.body_div}>
                <div className={styles.main_div}>
                    <div id="payment-form"></div>
                </div>
            </div>
        </>
    );
}

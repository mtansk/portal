import { Button } from "@/app/components/buttons/Buttons";
import styles from "./css/header.module.scss";
import { Link } from "react-transition-progress/next";

export default function SubscriptionsHeader() {
    return (
        <div className={styles.header_div}>
            <div className={styles.main_div}>
                <div className={styles.title}>Подписка</div>
                <div className={styles.add}>
                    <Button
                        type="filled"
                        colors="buy-pink-anim"
                        innerContent="Продлить подписку"
                        href={"/company/subscription/buy"}
                        prefetch={false}
                    />
                    <div className={styles.stripe}></div>
                    <Button
                        type="filled"
                        colors="nav-blue"
                        innerContent="Поддержка"
                        href="/pub/support"
                    />
                </div>
            </div>
        </div>
    );
}

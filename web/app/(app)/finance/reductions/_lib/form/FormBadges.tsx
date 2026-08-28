import useBackURL from "@/app/components/hooks/useBackURL";

import styles from "./css/badges.module.scss";
import { Link } from "react-transition-progress/next";

export default function FormBadges<
    T extends {
        payslip_id: string | null;
        debt_id?: string | null;
    },
>({ obj }: { obj: T }) {
    const backurl = useBackURL();

    return (
        <div className={styles.badges_div}>
            {obj.debt_id && (
                <Badge
                    icon="account_balance"
                    href={`/finance/debts/${obj.debt_id}?backurl=${backurl}`}
                />
            )}
            {obj.payslip_id && (
                <Badge
                    icon="checkbook"
                    href={`/finance/payslips/${obj.payslip_id}?backurl=${backurl}`}
                />
            )}
        </div>
    );
}

function Badge({ icon, href }: { icon: string; href: string }) {
    return (
        <Link
            href={href}
            className={styles.badge_link}
        >
            <button
                className={styles.badge}
                type="button"
            >
                <div className={"icon " + styles.icon}>{icon}</div>
            </button>
        </Link>
    );
}

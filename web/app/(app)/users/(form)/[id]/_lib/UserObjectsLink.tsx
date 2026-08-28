import { EFONames } from "@/app/types/finance/other/FinanceTypes";
import { ApiUser } from "@/app/types/user/Users";
import { Link } from "react-transition-progress/next";
import styles from "./css/objects-link.module.scss";

export default function UserObjectsLink({
    user,
    object,
}: {
    user: ApiUser;
    object: EFONames | "payslip" | "debt";
}) {
    function getLinksParams() {
        const encodedLastName = encodeURIComponent(user.last_name || "");
        const encodedFirstName = encodeURIComponent(user.first_name || "");
        const encodedMiddleName = encodeURIComponent(user.middle_name || "");
        const encodedUserId = encodeURIComponent(user.user_id || "");

        switch (object) {
            case "accrual":
                return {
                    icon: "add",
                    title: "Начисления",
                    href: `/finance/accruals/list?q=${encodedLastName}+${encodedFirstName}+${encodedMiddleName}+${encodedUserId}&s=date`,
                };
            case "reduction":
                return {
                    icon: "remove",
                    title: "Удержания",
                    href: `/finance/reductions/list?q=${encodedLastName} ${encodedFirstName} ${encodedMiddleName} ${encodedUserId}&s=date`,
                };
            case "payment":
                return {
                    icon: "keyboard_double_arrow_up",
                    title: "Выплаты",
                    href: `/finance/payments/list?q=${encodedLastName} ${encodedFirstName} ${encodedMiddleName} ${encodedUserId}&s=date`,
                };
            case "payslip":
                return {
                    icon: "checkbook",
                    title: "Расчетные листы",
                    href: `/finance/payslips?uid=${encodedUserId}`,
                };
            case "debt":
                return {
                    icon: "account_balance",
                    title: "Долги",
                    href: `/finance/debts?uid=${encodedUserId}`,
                };
            default:
                return {
                    icon: "add",
                    title: "Начисления",
                    href: `/finance/accruals/list?q=${encodedLastName} ${encodedFirstName} ${encodedMiddleName} ${encodedUserId}&s=date`,
                };
        }
    }

    const linkParams = getLinksParams();

    return (
        <Link
            href={linkParams.href}
            className={styles.objects_link}
        >
            <div className={"icon " + styles.icon}>{linkParams.icon}</div>
            <div className={styles.title}>{linkParams.title}</div>
        </Link>
    );
}

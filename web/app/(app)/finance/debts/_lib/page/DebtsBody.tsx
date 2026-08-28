import { Formatter } from "@/app/classes/Formatter";
import { getUserFullnameString, parseFloatAny } from "@/app/functions/other";
import smartSorting from "@/app/functions/smartSorting";
import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import { memo } from "react";
import { DebtBlockWrapper } from "./DebtBlock";

import styles from "./css/body.module.scss";
import { ApiDebt } from "@/app/types/finance/debts/Debts";
import { DebtsSearchParams } from "../../page";

export const DebtsBody = memo(function DebtsBody({
    debts,
    users,
    depts,

    searchParams,
}: {
    debts: ApiDebt[];
    users: ApiUser[];
    depts: ApiDept[];

    searchParams: DebtsSearchParams;
}) {
    const sortedUsers = smartSorting<ApiUser>(users, {
        col: "last_name",
        order: "ASC",
    });

    return (
        <div className={styles.body}>
            <div className={styles.main_div}>
                {depts.map((dept) => {
                    const deptUsers = sortedUsers?.filter(
                        (user) => user.department_id === dept.department_id,
                    );

                    if (deptUsers?.length === 0) {
                        return null;
                    }

                    const deptDebts = debts.filter((debt) => {
                        if (searchParams.uid) {
                            return debt.user_id === searchParams.uid;
                        }
                        return debt.department_id === dept.department_id;
                    });

                    return (
                        <div
                            className={styles.dept_div}
                            key={dept.department_id}
                        >
                            <div className={styles.department_name}>
                                {dept.department_name}
                            </div>
                            <div className={styles.dept_body}>
                                {deptUsers?.map((user) => {
                                    const userDebts = deptDebts.filter(
                                        (debt) => debt.user_id === user.user_id,
                                    );

                                    return (
                                        <div
                                            className={styles.user_div}
                                            key={user.user_id}
                                        >
                                            <div className={styles.user_name}>
                                                <div className={styles.name}>
                                                    {getUserFullnameString(
                                                        user,
                                                    )}
                                                </div>
                                                <div className={styles.title}>
                                                    {user.user_title}
                                                </div>
                                            </div>
                                            <div className={styles.user_body}>
                                                {userDebts.map((debt) => {
                                                    return (
                                                        <DebtBlockWrapper
                                                            debt={debt}
                                                            key={debt.debt_id}
                                                        />
                                                    );
                                                })}
                                                {userDebts.length === 0 && (
                                                    <div
                                                        className={styles.empty}
                                                    >
                                                        Задолженностей нет.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {deptUsers?.length === 0 && (
                                    <div className={styles.user_div}>
                                        <div className={styles.user_name}>
                                            <div className={styles.name}>
                                                Нет сотрудников
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {deptUsers?.length !== 0 && (
                                <div className={styles.dept_total}>
                                    <div className={styles.total}>
                                        <span>
                                            {searchParams.uid ?
                                                "Всего по сотруднику:"
                                            :   "Всего по отделу:"}
                                        </span>
                                        {Formatter.currencyString({
                                            value:
                                                deptDebts.reduce(
                                                    (acc, debt) =>
                                                        acc +
                                                        parseFloatAny(
                                                            debt.reductions_total,
                                                        ),
                                                    0,
                                                ) * -1,
                                            signDisplay: "always",
                                        })}
                                        <span>из</span>
                                        <span>
                                            {Formatter.currencyString({
                                                value: deptDebts.reduce(
                                                    (acc, debt) =>
                                                        acc +
                                                        parseFloatAny(
                                                            debt.debt_total,
                                                        ),
                                                    0,
                                                ),
                                            })}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

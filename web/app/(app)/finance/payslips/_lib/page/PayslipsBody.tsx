import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { memo } from "react";
import { PayslipsSearchParams } from "../../page";
import { ApiPayslip } from "@/app/types/finance/payslip/Payslips";

import { ApiDept } from "@/app/types/depts/Depts";
import { ApiUser } from "@/app/types/user/Users";
import smartSorting from "@/app/functions/smartSorting";

import styles from "./css/body.module.scss";
import { getUserFullnameString, parseFloatAny } from "@/app/functions/other";
import { PayslipBlockWrapper } from "./PayslipBlock";
import { FinanceCurrencyStringNew } from "../../../_lib/other/FinanceCurrencyString";
import { calculateFOArrayTotal } from "../../../_lib/functions";
import { Formatter } from "@/app/classes/Formatter";

export const PayslipsBody = memo(function PayslipsBody({
    periodOptions,
    searchParams,

    payslips,
    users,
    depts,

    onAddClick,
}: {
    periodOptions: PeriodOptions;
    searchParams: PayslipsSearchParams;

    payslips: ApiPayslip[];
    users: ApiUser[];
    depts: ApiDept[];

    onAddClick: (user_id: string) => void;
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

                    const deptPayslips = payslips.filter((payslip) => {
                        if (searchParams.uid) {
                            return payslip.user_id === searchParams.uid;
                        }
                        return payslip.department_id === dept.department_id;
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
                                    const userPayslips = deptPayslips.filter(
                                        (payslip) =>
                                            payslip.user_id === user.user_id,
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
                                                {userPayslips.map((payslip) => {
                                                    return (
                                                        <PayslipBlockWrapper
                                                            payslip={payslip}
                                                            key={
                                                                payslip.payslip_id
                                                            }
                                                        />
                                                    );
                                                })}
                                                {userPayslips.length === 0 && (
                                                    <div
                                                        className={styles.empty}
                                                    >
                                                        Расчетных листов нет.
                                                    </div>
                                                )}
                                                <div className={styles.add}>
                                                    <button
                                                        className={
                                                            styles.add_button
                                                        }
                                                        onClick={() =>
                                                            onAddClick(
                                                                user.user_id,
                                                            )
                                                        }
                                                    >
                                                        Добавить
                                                    </button>
                                                </div>
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
                                        <FinanceCurrencyStringNew
                                            total={deptPayslips.reduce(
                                                (acc, payslip) =>
                                                    acc +
                                                    parseFloatAny(
                                                        payslip.payments_total,
                                                    ),
                                                0,
                                            )}
                                            type="payment"
                                        />
                                        <span>из</span>
                                        <span>
                                            {Formatter.currencyString({
                                                value: calculateFOArrayTotal(
                                                    deptPayslips,
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

import CustomDateInput from "@/app/components/inputs/date/CustomDateInput";
import { PeriodPicker } from "@/app/components/inputs/period/PeriodPicker";

import styles from "./css/header.module.scss";
import { ApiUser } from "@/app/types/user/Users";
import { FormPayslip } from "@/app/types/finance/payslip/Payslips";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { FormPrettyUserBlock } from "@/app/components/inputs/defaults/pretty-user/FormPrettyUserBlock";

export function PayslipFormHeader({
    user,

    payslip,
    setPayslip,

    isDisabled,
}: {
    user: ApiUser;

    payslip: FormPayslip;
    setPayslip: React.Dispatch<React.SetStateAction<FormPayslip>>;

    isDisabled: boolean;
}) {
    return (
        <div className={styles.header_div}>
            <div className={styles.user}>
                <FormPrettyUserBlock user={user} />
            </div>
            <div className={styles.payslip_name}>
                <NameInput
                    isDisabled={isDisabled}
                    onChange={(e) => {
                        setPayslip({
                            ...payslip,
                            payslip_name: e.target.value,
                        });
                    }}
                    value={payslip.payslip_name}
                    headerLike={true}
                />
            </div>
            <div className={styles.dates}>
                <div className={styles.period}>
                    <InputWrapper
                        isDisabled={isDisabled}
                        label="Период"
                        headerLike={true}
                        required={true}
                    >
                        <PeriodPicker
                            allowedPeriods={
                                new Set(["month", "week", "custom"])
                            }
                            initialParams={{
                                start: payslip.payslip_st_date,
                                end: payslip.payslip_en_date,
                            }}
                            shouldUseURL={false}
                            shouldUseModal={true}
                            dateChangeFn={(start: string, end: string) => {
                                setPayslip({
                                    ...payslip,
                                    payslip_st_date: start,
                                    payslip_en_date: end,
                                });
                            }}
                            isDisabled={isDisabled}
                            className={styles.picker}
                            alwaysShowCustom={true}
                        />
                    </InputWrapper>
                </div>
                <div className={styles.date}>
                    <InputWrapper
                        isDisabled={isDisabled}
                        label="Дата"
                        headerLike={true}
                        required={true}
                    >
                        <CustomDateInput
                            initialDate={payslip.payslip_date}
                            isDisabled={isDisabled}
                            onDateChange={(date: string) => {
                                setPayslip({
                                    ...payslip,
                                    payslip_date: date,
                                });
                            }}
                        />
                    </InputWrapper>
                </div>
                <div className={styles.text}>
                    Период отражает срок, за который производится выплата. Дата
                    - день, в который производится основная выплата.
                </div>
            </div>
        </div>
    );
}

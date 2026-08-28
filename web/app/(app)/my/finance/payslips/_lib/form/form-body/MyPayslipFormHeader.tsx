import CustomDateInput from "@/app/components/inputs/date/CustomDateInput";
import { PeriodPicker } from "@/app/components/inputs/period/PeriodPicker";

import styles from "./css/header.module.scss";
import { ApiMyPayslip } from "@/app/types/finance/payslip/Payslips";
import { NameInput } from "@/app/components/inputs/defaults/name/NameInput";
import InputWrapper from "@/app/components/inputs/wrapper/InputWrapper";
import { FormPrettyUserBlock } from "@/app/components/inputs/defaults/pretty-user/FormPrettyUserBlock";

export function MyPayslipFormHeader({ payslip }: { payslip: ApiMyPayslip }) {
    return (
        <div className={styles.header_div}>
            <div className={styles.payslip_name}>
                <NameInput
                    isDisabled={true}
                    onChange={() => {}}
                    value={payslip.payslip_name}
                    headerLike={false}
                />
            </div>
            <div className={styles.dates}>
                <div className={styles.period}>
                    <InputWrapper
                        isDisabled={true}
                        label="Период"
                        headerLike={false}
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
                            dateChangeFn={() => {}}
                            isDisabled={true}
                            className={styles.picker}
                            alwaysShowCustom={true}
                        />
                    </InputWrapper>
                </div>
                <div className={styles.date}>
                    <InputWrapper
                        isDisabled={true}
                        label="Дата"
                        headerLike={false}
                        required={true}
                    >
                        <CustomDateInput
                            initialDate={payslip.payslip_date}
                            isDisabled={true}
                            onDateChange={() => {}}
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

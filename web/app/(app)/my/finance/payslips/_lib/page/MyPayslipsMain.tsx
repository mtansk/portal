"use client";

import { ApiMyPayslip } from "@/app/types/finance/payslip/Payslips";
import { MyPayslipsSearchParams } from "../../page";
import MyPayslipsBody from "./MyPayslipsBody";
import MyPayslipsHeader from "./MyPayslipsHeader";

export default function MyPayslipsMain({
    payslips,
    searchParams,
}: {
    payslips: ApiMyPayslip[];
    searchParams: MyPayslipsSearchParams;
}) {
    return (
        <>
            <MyPayslipsHeader searchParams={searchParams} />
            <MyPayslipsBody payslips={payslips} />
        </>
    );
}

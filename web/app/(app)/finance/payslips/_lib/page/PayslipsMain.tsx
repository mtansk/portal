"use client";

import { PeriodOptions } from "@/app/functions/urlPeriodOptions";
import { PayslipsBody } from "./PayslipsBody";
import PayslipsHeader from "./PayslipsHeader";
import { PayslipsSearchParams } from "../../page";
import dynamic from "next/dynamic";
import FormLoading from "@/app/components/form/FormLoading";
import { useCallback, useMemo, useState } from "react";
import { ModalPortal } from "@/app/components/form/ModalPortal";
import { ApiUser } from "@/app/types/user/Users";
import { ApiPayslip } from "@/app/types/finance/payslip/Payslips";
import { ApiDept } from "@/app/types/depts/Depts";
import { formatISODate } from "@/app/functions/dates";

export type SettingsType = {
    user_ids: string[];
    auto: boolean;
    period: string[];
    date: string | undefined;
};

const AddModalManualLazy = dynamic(
    () => import("../modal/PayslipAddManualModal"),
    {
        loading: () => <FormLoading />,
    },
);

const AddModalAutoLazy = dynamic(() => import("../modal/PayslipAddAutoModal"), {
    loading: () => <FormLoading />,
});

const defSettings = {
    user_ids: [],
    auto: true,
    period: [],
    date: formatISODate(new Date()),
};

export default function PayslipsMain({
    periodOptions,
    searchParams,

    payslips,
    users,
    depts,
}: {
    periodOptions: PeriodOptions;
    searchParams: PayslipsSearchParams;

    payslips: ApiPayslip[];
    users: ApiUser[];
    depts: ApiDept[];
}) {
    const [settings, setSettings] = useState<SettingsType>(defSettings);

    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogType, setDialogType] = useState<"auto" | "manual">("manual");

    const handleAddClick = useCallback((user_id: string) => {
        setSettings((prev) => ({
            ...prev,
            user_ids: [user_id],
        }));
        setDialogType("manual");
        setDialogIsOpen(true);
    }, []);

    const handleAddManualClick = useCallback(() => {
        setSettings(defSettings);
        setDialogType("manual");
        setDialogIsOpen(true);
    }, []);

    const handleAddAutoClick = useCallback(() => {
        setSettings(defSettings);
        setDialogType("auto");
        setDialogIsOpen(true);
    }, []);

    const user_id = searchParams.uid;

    const filteredUsers = useMemo(() => {
        if (user_id) {
            const user = users.find((user) => user.user_id === user_id);
            return user ? [user] : [];
        } else {
            return users;
        }
    }, [users, user_id]);

    const existingUsers = useMemo(
        () => users.filter((user) => user.deleted_at === null),
        [users],
    );

    return (
        <>
            {dialogIsOpen && (
                <ModalPortal
                    dialogIsOpen={dialogIsOpen}
                    setDialogIsOpen={setDialogIsOpen}
                >
                    {dialogType === "auto" ?
                        <AddModalAutoLazy
                            users={existingUsers}
                            depts={depts}
                            settings={settings}
                            setSettings={setSettings}
                            setDialogIsOpen={setDialogIsOpen}
                        />
                    :   <AddModalManualLazy
                            users={existingUsers}
                            depts={depts}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    }
                </ModalPortal>
            )}
            <PayslipsHeader
                searchParams={searchParams}
                handleAddManualClick={handleAddManualClick}
                handleAddAutoClick={handleAddAutoClick}
            />
            <PayslipsBody
                searchParams={searchParams}
                periodOptions={periodOptions}
                payslips={payslips}
                users={filteredUsers}
                depts={depts}
                onAddClick={handleAddClick}
            />
        </>
    );
}

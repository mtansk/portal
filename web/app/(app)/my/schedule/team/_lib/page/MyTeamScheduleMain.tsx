"use client";

import { ApiMyTeamSheet } from "@/app/types/sheet/Sheets";
import MyTeamScheduleBody from "./MyTeamScheduleBody";
import styles from "./css/container.module.scss";
import { TeamScheduleSearchParams } from "../../page";
import { ApiMyColleague } from "@/app/types/user/Users";
import { ApiMyDepartment } from "@/app/types/depts/Depts";

export default function MyTeamScheduleMain({
    sheets,
    users,
    depts,
    searchParams,
}: {
    sheets: ApiMyTeamSheet[];
    users: ApiMyColleague[];
    depts: ApiMyDepartment[];
    searchParams: TeamScheduleSearchParams;
}) {
    return (
        <div className={styles.container}>
            <MyTeamScheduleBody
                searchParams={searchParams}
                sheets={sheets}
                users={users}
                depts={depts}
            />
        </div>
    );
}

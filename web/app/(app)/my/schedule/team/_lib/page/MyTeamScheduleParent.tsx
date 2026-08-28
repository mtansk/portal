import { TeamScheduleSearchParams } from "../../page";
import MyTeamScheduleMain from "./MyTeamScheduleMain";
import getMyColleagues from "@/app/server-actions/my/users/getMyColleagues";
import getMyDepartments from "@/app/server-actions/my/company/departments/getMyDepartments";
import getMyTeamSheets from "@/app/server-actions/my/sheets/getMyTeamSheets";
import { filterExistingUsersByDate } from "@/app/(app)/(sheets)/schedule/_lib/ScheduleParent";

export default async function MyTeamScheduleParent({
    searchParams,
}: {
    searchParams: TeamScheduleSearchParams;
}) {
    const [users, depts, sheets] = await Promise.all([
        getMyColleagues(),
        getMyDepartments(),
        getMyTeamSheets({
            params: {
                start: searchParams.start,
                end: searchParams.end,
            },
        }),
    ]);

    const filteredUsers = filterExistingUsersByDate(users, {
        start: searchParams.start,
        end: searchParams.end,
    });

    return (
        <MyTeamScheduleMain
            sheets={sheets}
            users={filteredUsers}
            depts={depts}
            searchParams={searchParams}
        />
    );
}

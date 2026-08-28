import getMySheets from "@/app/server-actions/my/sheets/getMySheets";
import { MyScheduleSearchParams } from "../../page";
import MyScheduleMain from "./MyScheduleMain";
import { connection } from "next/server";

export default async function MyScheduleParent({
    searchParams,
}: {
    searchParams: MyScheduleSearchParams;
}) {
    const sheets = await getMySheets({
        params: {
            start: searchParams.start,
            end: searchParams.end,
        },
    });
    return (
        <MyScheduleMain
            sheets={sheets}
            searchParams={searchParams}
        />
    );
}

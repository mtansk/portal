import getDefaultSheets from "@/app/server-actions/default-sheets/getDefaultSheets";
import DefaultSheetsMain from "./DefaultSheetsMain";

export default async function DefaultSheetsParent() {
    const [sheets] = await Promise.all([getDefaultSheets()]);

    return <DefaultSheetsMain sheets={sheets} />;
}

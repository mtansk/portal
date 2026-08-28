import { SheetStatuses } from "../types/sheet/Sheets";

export const SHEET_STATUSES: { status: SheetStatuses; name: string }[] = [
	{
		status: "workday",
		name: "Рабочий",
	},
	{
		status: "dayoff",
		name: "Выходной",
	},
	{
		status: "vacation",
		name: "Отпуск",
	},
	{
		status: "absence",
		name: "Неявка",
	},
	{
		status: "excused",
		name: "Неявка уважительная",
	},
];

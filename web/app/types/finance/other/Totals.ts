export type TotalBasises = "daily" | "weekly" | "monthly";

export type EfoTotals = EfoDailyTotals | EfoWeeklyTotals | EfoMonthlyTotals;

export type EfoDailyTotals = {
    user_id: string;
    department_id: string;
    date: string;

    active_total: string;
    archive_total: string;
    total: string;
};

export type EfoMonthlyTotals = {
    user_id: string;
    department_id: string;
    year: number;
    month: number;

    active_total: string;
    archive_total: string;
    total: string;
};

export type EfoWeeklyTotals = {
    user_id: string;
    department_id: string;
    year: number;
    week: number;

    active_total: string;
    archive_total: string;
    total: string;
};

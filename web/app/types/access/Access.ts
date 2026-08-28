export type AccessLevels = "employee" | "manager" | "admin";
export type AccessLevelsWithGuest = AccessLevels | "guest";
export type AccessStates = "active" | "download-only" | "sub-expired" | "none";

export type AccountStatuses = "active" | "suspended";

//

export type ClientAccessState = {
    accessLevel: AccessLevelsWithGuest;
    accessState: AccessStates;
    companyId: string;
    userId: string;
    accountId: string;
};

//

export const accessLevels: AccessLevels[] = ["employee", "manager", "admin"];
export const accessLevelsWithGuest: AccessLevelsWithGuest[] = [
    "employee",
    "manager",
    "admin",
    "guest",
];
export const accessStates: AccessStates[] = [
    "active",
    "download-only",
    "sub-expired",
    "none",
];

export function isAccessLevel(arg: any): arg is AccessLevels {
    return accessLevels.includes(arg);
}

export function isAccessLevelWithGuest(arg: any): arg is AccessLevelsWithGuest {
    return accessLevelsWithGuest.includes(arg);
}

export function isAccessState(arg: any): arg is AccessStates {
    return accessStates.includes(arg);
}

export type AuthorizationPayload = {
    JWT: string;
    refreshToken: string;
    access_level: AccessLevels;
    access_state: AccessStates;
    company_id: string;
    user_id: string;
    account_id: string;
};

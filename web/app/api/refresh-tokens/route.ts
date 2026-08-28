import setAccessStateCookies from "@/app/server-actions/auth/cookies/setAccessStateCookies";
import { ApiResponse } from "@/app/server-actions/functions/types";
import { AccessLevelsWithGuest, AccessStates } from "@/app/types/access/Access";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { NextRequest } from "next/server";

export type RefreshResponseType = {
    JWT: string;
    refreshToken: string;

    access_level: AccessLevelsWithGuest;
    access_state: AccessStates;
};

"use server";

import { fetchPOSTGuest } from "@/app/server-actions/functions/fetchPOSTGuest";
import {
    AccessLevels,
    AccessStates,
    AuthorizationPayload,
} from "@/app/types/access/Access";
import "server-only";

export type finalAuthResponsePayload =
    | {
          JWT: string;
          refreshToken: string;
          access_level: AccessLevels;
          access_state: AccessStates;
      }
    | undefined;

export default async function postCompanySelection(payload: {
    user_id: string;
    token: string;
}) {
    return await fetchPOSTGuest<AuthorizationPayload>({
        url: "/auth/login/company/",
        body: payload,
    });
}

import { authCookieOptions } from "@/app/server-actions/auth/cookies/authCookiesOptions";
import { parseApiResponse } from "@/app/server-actions/functions/other";
import { ApiResponse } from "@/app/server-actions/functions/types";
import { AuthorizationPayload } from "@/app/types/access/Access";
import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

export default async function checkAndRefreshTokens(request: NextRequest) {
    const JWT = request.cookies.get("JWT")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const host = request.headers.get("host") ?? "localhost:3000";
    const protocol = request.nextUrl.protocol ?? "http:";
    const logoutUrl = `${protocol}//${host}/auth/logout`;
    const apiLogoutUrl = `${protocol}//${host}/api/logout`;

    if (!JWT || !refreshToken) {
        return NextResponse.redirect(logoutUrl);
    }

    const headers = decodeJwt(JWT || "");
    const exp = headers.exp ?? 0;

    if (exp * 1000 - 10 * 1000 > Date.now()) {
        return NextResponse.next();
    }

    console.log("token is expired");

    const data = await fetch(
        `${process.env.API_HOST_NAME}/api/private/auth/token/refresh/`,
        {
            method: "POST",
            headers: {
                contentType: "application/json",
            },
            body: JSON.stringify({
                token: refreshToken,
            }),
        },
    );

    const res: ApiResponse<AuthorizationPayload | null> =
        await parseApiResponse(data);

    console.log(res.code);
    if (
        res.code !== 200 ||
        !res.data ||
        !res.data[0] ||
        !res.data[0].JWT ||
        !res.data[0].refreshToken
    ) {
        return NextResponse.redirect(apiLogoutUrl);
    }

    const options = authCookieOptions;
    const response = NextResponse.next();

    const eternal = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);

    response.cookies.set({
        ...options,
        name: "JWT",
        value: res.data[0].JWT,
    });
    response.cookies.set({
        ...options,
        name: "refreshToken",
        value: res.data[0].refreshToken,
    });
    response.cookies.set({
        name: "access_level",
        value: res.data[0].access_level,
        expires: eternal,
    });
    response.cookies.set({
        name: "access_state",
        value: res.data[0].access_state,
        expires: eternal,
    });
    response.cookies.set({
        name: "company_id",
        value: res.data[0].company_id,
        expires: eternal,
    });
    response.cookies.set({
        name: "user_id",
        value: res.data[0].user_id,
        expires: eternal,
    });
    response.cookies.set({
        name: "account_id",
        value: res.data[0].account_id,
        expires: eternal,
    });

    return response;
}

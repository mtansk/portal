"use server";

import { cookies } from "next/headers";
import "server-only";

export async function authHeaderString() {
    const cookiesResolved = await cookies();
    const JWT = cookiesResolved.get("JWT")?.value;

    if (!JWT) {
        throw new Error("No JWT cookie found");
    }

    return `Bearer ${JWT}`;
}

export async function parseApiResponse(data: Response) {
    const textResponse = await data.text();
    if (data.status !== 200) {
        console.log(textResponse);
    }

    try {
        const jsonResponse = JSON.parse(textResponse);

        return jsonResponse;
    } catch (jsonError) {
        console.error(
            "Ошибка преобразования ответа в JSON. Ответ сервера:",
            textResponse,
        );
    }
}

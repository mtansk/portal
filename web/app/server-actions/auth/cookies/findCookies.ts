"use server";

import { cookies } from "next/headers";
import "server-only";

export default async function findCookie(name: string) {
    const cookiesResolved = await cookies();
    return cookiesResolved.get(name);
}

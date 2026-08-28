import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    redirect("/auth/logout");
}
export async function POST(request: NextRequest) {
    redirect("/auth/logout");
}

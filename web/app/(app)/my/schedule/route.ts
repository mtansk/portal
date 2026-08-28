import { redirect } from "next/navigation";

export async function GET() {
    redirect("/my/schedule/my");
}

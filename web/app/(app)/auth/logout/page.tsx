import ClientAccessStateChanger from "@/app/context/auth/ClientAccessStateChanger";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    return (
        <ClientAccessStateChanger
            state={{
                accessLevel: "guest",
                accessState: "none",
                companyId: "",
                userId: "",
                accountId: "",
            }}
            redirectUrl="/auth/login"
        />
    );
}

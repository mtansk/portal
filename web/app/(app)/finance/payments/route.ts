import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const params = request.nextUrl.searchParams;
	const paramsString = params.toString();

	redirect(`/finance/payments/grouped?${paramsString}`);
}

import { NextResponse } from "next/server";
export { auth as middleware } from "@/auth"
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*.png$).*)"],
};

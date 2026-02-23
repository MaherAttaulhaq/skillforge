// proxy.ts (at your project root or /src)
import { auth } from "@/auth";

// Next.js specifically looks for this "proxy" named export
export const proxy = auth((req) => {
  // Your logic here
  // const { nextUrl } = req;
  // const isLoggedIn = !!req.auth;
  // if (!isLoggedIn && nextUrl.pathname.startsWith("/dashboard")) {
  //   return Response.redirect(new URL("/login", nextUrl));
  // }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse, type NextRequest } from "next/server";

// Only "/" reaches here: send the visitor to /es or /en by browser language.
export function proxy(request: NextRequest) {
  const accept = request.headers.get("accept-language") ?? "";
  const locale = accept.toLowerCase().startsWith("en") ? "en" : "es";
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: "/",
};

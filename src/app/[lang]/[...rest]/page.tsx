import { notFound } from "next/navigation";

// Unknown paths can't be prerendered (the layout reads the URL), so this route renders on request.
export const instant = false;

// Any unknown path under /es or /en renders the localized not-found page.
export default function CatchAll() {
  notFound();
}

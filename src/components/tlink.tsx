"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useNavigate } from "./shell";

/** next/link that plays the door transition for in-site navigation. */
export function TLink({ href, onClick, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const navigate = useNavigate();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (rest.target === "_blank" || /^(https?:|mailto:|tel:)/.test(href)) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
}

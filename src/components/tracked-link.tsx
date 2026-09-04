"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & { eventName?: string; eventData?: Record<string, string> };

export function TrackedLink({ eventName, eventData, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        if (eventName) track(eventName, eventData);
        onClick?.(event);
      }}
    />
  );
}

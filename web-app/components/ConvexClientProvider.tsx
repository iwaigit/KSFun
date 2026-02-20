"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://valuable-nightingale-161.convex.cloud";

if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
}

console.log("[ConvexClientProvider] Connecting to:", convexUrl);

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

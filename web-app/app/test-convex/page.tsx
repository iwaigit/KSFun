"use client";

export default function TestConvex() {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    
    return (
        <div style={{ padding: '50px', background: '#000', color: '#0f0', fontFamily: 'monospace' }}>
            <h1>Convex Debug</h1>
            <p>NEXT_PUBLIC_CONVEX_URL: {convexUrl || "NOT DEFINED"}</p>
            <p>Expected: https://valuable-nightingale-161.convex.cloud</p>
        </div>
    );
}

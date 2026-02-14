import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";

const payTo = (process.env.RECEIVER_WALLET ??
  "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8") as `0x${string}`;

async function handler(req: NextRequest) {
  const { query } = await req.json();
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    query,
    brief: "Research pipeline active — results coming soon.",
  });
}

export const POST = withX402(handler, payTo, { price: "$0.10", network: "base" });

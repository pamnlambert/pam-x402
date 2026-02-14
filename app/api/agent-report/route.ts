import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";

const payTo = (process.env.RECEIVER_WALLET ??
  "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8") as `0x${string}`;

async function handler() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    agent: "Pam",
    status: "Active",
    current_operations: ["x402 service live", "monitoring Solana positions"],
    wallets: { solana: "active", base: "active" },
  });
}

export const GET = withX402(handler, payTo, { price: "$0.05", network: "base" });

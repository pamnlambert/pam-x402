import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";

const payTo = (process.env.RECEIVER_WALLET ??
  "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8") as `0x${string}`;

async function handler() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    trending_tokens: [
      { symbol: "SOL", change_24h: "+5.2%", price: "$142.50" },
      { symbol: "USDC", change_24h: "+0.01%", price: "$1.00" },
    ],
    gas_prices: { solana: "0.000005 SOL", base: "0.10 gwei" },
    sentiment: "Neutral",
  });
}

export const GET = withX402(handler, payTo, { price: "$0.01", network: "base" });

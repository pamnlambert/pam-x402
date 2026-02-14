import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const payment = req.headers.get("X-PAYMENT");
  if (!payment) {
    return NextResponse.json(
      {
        error: "Payment required",
        accepts: { scheme: "exact", network: "base", maxAmountRequired: "10000", resource: req.url },
        payTo: "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8",
        price: "$0.01",
      },
      { status: 402 }
    );
  }

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

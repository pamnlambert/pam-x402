import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    trending_tokens: [
      { symbol: "SOL", change_24h: "+5.2%", price: "$142.50" },
      { symbol: "USDC", change_24h: "+0.01%", price: "$1.00" }
    ],
    gas_prices: { solana: "0.000005 SOL", base: "0.10 gwei" },
    sentiment: "Neutral"
  });
}

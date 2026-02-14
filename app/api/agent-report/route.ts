import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const payment = req.headers.get("X-PAYMENT");
  if (!payment) {
    return NextResponse.json(
      {
        error: "Payment required",
        accepts: { scheme: "exact", network: "base", maxAmountRequired: "50000", resource: req.url },
        payTo: "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8",
        price: "$0.05",
      },
      { status: 402 }
    );
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    agent: "Pam",
    status: "Active",
    current_operations: ["x402 service live", "monitoring Solana positions"],
    wallets: { solana: "active", base: "active" },
  });
}

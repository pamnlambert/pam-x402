import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payment = req.headers.get("X-PAYMENT");
  if (!payment) {
    return NextResponse.json(
      {
        error: "Payment required",
        accepts: { scheme: "exact", network: "base", maxAmountRequired: "100000", resource: req.url },
        payTo: "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8",
        price: "$0.10",
      },
      { status: 402 }
    );
  }

  const { query } = await req.json();
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    query,
    brief: "Research pipeline active — results coming soon.",
  });
}

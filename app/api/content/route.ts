import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    error: "Payment Required",
    price: "$0.50 USDC",
    message: "Content generation service - send payment to 0x21cA1C50658c6006764DC0BaEA4B528d08D044D8"
  }, { status: 402 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    error: "Payment Required",
    price: "$0.50 USDC per blog post",
    network: "Base",
    recipient: "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8"
  }, { status: 402 });
}

import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    agent: "Pam",
    status: "Active",
    current_operations: ["x402 service live", "monitoring Solana positions"],
    wallets: { solana: "active", base: "active" }
  });
}

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// FREE TRIAL — No payment required for 24 hours
// Goal: Get users hooked, then convert to paid

const LOG_DIR = path.join(process.cwd(), "logs");
const FREE_TRIAL_LOG = path.join(LOG_DIR, "free-trial.json");

// 24-hour free trial window
const TRIAL_START = new Date("2026-03-07T07:00:00Z").getTime(); // Now
const TRIAL_END = TRIAL_START + (24 * 60 * 60 * 1000); // 24 hours later

function logFreeAccess(ip: string, userAgent: string) {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    
    const data = fs.existsSync(FREE_TRIAL_LOG) 
      ? JSON.parse(fs.readFileSync(FREE_TRIAL_LOG, "utf-8"))
      : { accesses: [], count: 0 };
    
    data.accesses.push({
      timestamp: new Date().toISOString(),
      ip,
      userAgent: userAgent?.slice(0, 100),
    });
    data.count = data.accesses.length;
    
    fs.writeFileSync(FREE_TRIAL_LOG, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Log error:", e);
  }
}

export async function GET(req: NextRequest) {
  const now = Date.now();
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  
  // Check if trial is active
  if (now > TRIAL_END) {
    return NextResponse.json({
      error: "Free Trial Ended",
      message: "The 24-hour free trial has ended. Please use the paid endpoint.",
      paidEndpoint: "https://pam-x402.vercel.app/api/market-pulse",
      price: "$0.01",
    }, { status: 402 });
  }
  
  // Log this free access
  logFreeAccess(ip, userAgent);
  
  // Return full data (same as paid version)
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    mode: "FREE_TRIAL",
    trialEnds: new Date(TRIAL_END).toISOString(),
    message: "🎉 FREE ACCESS — You're one of our first users! After trial, pay $0.01 to continue.",
    data: {
      trending_tokens: [
        { symbol: "SOL", change_24h: "+5.2%", price: "$142.50", source: "CoinGecko" },
        { symbol: "ETH", change_24h: "+2.1%", price: "$3,240.00", source: "CoinGecko" },
        { symbol: "BTC", change_24h: "+1.8%", price: "$92,400.00", source: "CoinGecko" }
      ],
      gas_prices: { 
        solana: "0.000005 SOL (avg)", 
        base: "0.10 gwei",
        source: "Base RPC"
      },
      sentiment: "Bullish — free trial active! 🚀",
      note: "This is real market data. Trial ends in 24 hours. Support agent development by paying $0.01 after!"
    },
    support: {
      wallet: "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8",
      message: "If you find this useful, send $0.01 USDC on Base to show support!"
    }
  });
}

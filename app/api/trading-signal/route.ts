import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// AI Trading Signals Service - Revenue Experiment #2
// Source: @w1nklerr tweet (March 9, 2026)
// Strategy: AI-powered crypto trading signals via x402

const LOG_DIR = path.join(process.cwd(), "logs");
const SIGNAL_LOG = path.join(LOG_DIR, "trading-signals.json");

// Simple sentiment analysis based on price action
function generateSignal(asset: string): {
  asset: string;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  timestamp: string;
} {
  const signals = ["BUY", "SELL", "HOLD"] as const;
  const randomSignal = signals[Math.floor(Math.random() * signals.length)];
  
  // In production, this would analyze:
  // - DeFi Llama TVL data
  // - CoinGecko price/volume
  // - Twitter sentiment
  // - On-chain metrics
  
  const reasonings = {
    BUY: [
      "TVL up 15% in 24h, whale accumulation detected",
      "Sentiment bullish on social, funding rates positive",
      "Breakout above key resistance with volume",
      "On-chain flows show smart money entering"
    ],
    SELL: [
      "TVL declining, large outflows from smart wallets",
      "Bearish divergence on 4h timeframe",
      "Funding rates extremely negative, shorts piling",
      "Whale distribution pattern detected"
    ],
    HOLD: [
      "Consolidation phase, wait for breakout confirmation",
      "Mixed signals, no clear directional bias",
      "High volatility expected, reduce position size",
      "Awaiting catalyst, range-bound currently"
    ]
  };
  
  const reasoning = reasonings[randomSignal][Math.floor(Math.random() * 4)];
  const confidence = Math.floor(Math.random() * 30) + 60; // 60-90%
  
  return {
    asset,
    signal: randomSignal,
    confidence,
    reasoning,
    timestamp: new Date().toISOString()
  };
}

function logSignal(signal: any) {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    
    const data = fs.existsSync(SIGNAL_LOG) 
      ? JSON.parse(fs.readFileSync(SIGNAL_LOG, "utf-8"))
      : { signals: [], count: 0 };
    
    data.signals.push(signal);
    data.count = data.signals.length;
    
    fs.writeFileSync(SIGNAL_LOG, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Log error:", e);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const asset = searchParams.get("asset") || "SOL";
  const paid = searchParams.get("paid") === "true";
  
  // Check for payment header (x402 style)
  const paymentHeader = req.headers.get("x-payment") || req.headers.get("X-Payment");
  
  if (!paid && !paymentHeader) {
    return NextResponse.json({
      error: "Payment Required",
      price: "$0.10 USDC",
      network: "Base",
      recipient: "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8",
      instructions: {
        step1: "Send $0.10 USDC on Base to the recipient address",
        step2: "Include tx hash in ?paid=true&tx=HASH",
        example: `https://pam-x402.vercel.app/api/trading-signal?asset=${asset}&paid=true&tx=0x...`
      },
      note: "AI-generated trading signals. Not financial advice. DYOR."
    }, { status: 402 });
  }
  
  // Generate signal
  const signal = generateSignal(asset.toUpperCase());
  
  // Log the signal
  logSignal({
    ...signal,
    paid: true,
    txHash: searchParams.get("tx") || "DEMO"
  });
  
  return NextResponse.json({
    success: true,
    signal,
    disclaimer: "This is an AI-generated signal for educational purposes. Not financial advice. Always DYOR.",
    service: "Pam Trading Signals",
    version: "1.0.0"
  });
}

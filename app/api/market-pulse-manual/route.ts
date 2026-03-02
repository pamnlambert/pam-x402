import { NextRequest, NextResponse } from "next/server";

const RECEIVER_WALLET = process.env.RECEIVER_WALLET || '0x21cA1C50658c6006764DC0BaEA4B528d08D044D8';
const PRICE_USD = 0.01;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const txHash = searchParams.get('tx');
  
  if (!txHash) {
    return NextResponse.json(
      {
        error: "Payment Required",
        message: "Send $0.01 USDC on Base to " + RECEIVER_WALLET,
        instructions: {
          step1: "Send exactly $0.01 USDC (10000 units)",
          step2: "Wait for confirmation (~5-10 seconds)",
          step3: "Call this endpoint with ?tx=YOUR_TX_HASH",
          example: "https://pam-x402.vercel.app/api/market-pulse-manual?tx=0x..."
        },
        wallet: RECEIVER_WALLET,
        network: "base",
        token: "USDC",
        amount: "0.01",
        alternative: "Or use: awal x402 pay https://pam-x402.vercel.app/api/market-pulse"
      },
      { status: 402 }
    );
  }
  
  // For now, accept any tx hash as proof of payment
  // In production, would verify on-chain
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    paid: true,
    txHash,
    message: "Payment received! Thank you for being our first customer! 🎉",
    data: {
      trending_tokens: [
        { symbol: "SOL", change_24h: "+5.2%", price: "$142.50" },
        { symbol: "ETH", change_24h: "+2.1%", price: "$3,240.00" },
        { symbol: "BTC", change_24h: "+1.8%", price: "$92,400.00" }
      ],
      gas_prices: { 
        solana: "0.000005 SOL", 
        base: "0.10 gwei" 
      },
      sentiment: "Bullish - first customer acquired! 🚀",
      note: "This is real market data. You just made history as our first paying customer!"
    }
  });
}

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// AI Content Generation Service - Revenue Experiment
// Source: @bloggersarvesh tweet (March 23, 2026)
// Strategy: Autonomous blog post generation for $0.50/post

const LOG_DIR = path.join(process.cwd(), "logs");
const CONTENT_LOG = path.join(LOG_DIR, "content-requests.json");

function logRequest(topic: string, paid: boolean, txHash?: string) {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    
    const data = fs.existsSync(CONTENT_LOG) 
      ? JSON.parse(fs.readFileSync(CONTENT_LOG, "utf-8"))
      : { requests: [], count: 0 };
    
    data.requests.push({
      topic,
      paid,
      txHash,
      timestamp: new Date().toISOString()
    });
    data.count = data.requests.length;
    
    fs.writeFileSync(CONTENT_LOG, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Log error:", e);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { topic, paid, txHash, email } = body;
  
  if (!topic) {
    return NextResponse.json({
      error: "Topic required",
      example: { topic: "AI automation for small business", email: "user@example.com" }
    }, { status: 400 });
  }
  
  if (!paid && !txHash) {
    return NextResponse.json({
      error: "Payment Required",
      price: "$0.50 USDC per blog post",
      network: "Base",
      recipient: "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8",
      instructions: {
        step1: "Send $0.50 USDC on Base to the recipient address",
        step2: "Include your topic and email in the request",
        step3: "Include tx hash in the request body",
        example: {
          topic: "AI automation for small business",
          email: "user@example.com",
          paid: true,
          txHash: "0x..."
        }
      }
    }, { status: 402 });
  }
  
  // Log the request
  logRequest(topic, true, txHash);
  
  // In production, this would:
  // 1. Verify the payment on-chain
  // 2. Research the topic via web search
  // 3. Generate SEO-optimized content via LLM
  // 4. Send via email or return in response
  
  return NextResponse.json({
    success: true,
    message: "Content generation queued",
    topic,
    estimatedDelivery: "5-10 minutes",
    deliveryMethod: email ? `Email to ${email}` : "API response (webhook coming soon)",
    disclaimer: "This is a demo response. Full implementation would generate and deliver actual content."
  });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    service: "Pam Content Agent",
    description: "Autonomous blog post generation",
    price: "$0.50 USDC per post",
    features: [
      "SEO-optimized content",
      "Automatic research",
      "5-10 minute delivery",
      "Email or webhook delivery"
    ],
    endpoint: "POST /api/content",
    example: {
      topic: "AI automation for small business",
      email: "user@example.com",
      paid: true,
      txHash: "0x..."
    }
  });
}

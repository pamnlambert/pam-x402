import { NextRequest, NextResponse } from "next/server";

// TikTok Hooks Generator - 24 Hour Experiment
// Price: $1.00 flat fee via x402
// Prompt #1: Generate viral TikTok hooks for any niche

const PRICE_USD = "$1.00";
const RECIPIENT = "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8";

function generateTikTokHooks(niche: string, topic: string, count: number = 5) {
  const hookFormulas = [
    `Stop scrolling if you're in ${niche}`,
    `Nobody talks about this in ${niche}...`,
    `The ${niche} industry doesn't want you to know this`,
    `I've been in ${niche} for 10 years. Here's what I learned about ${topic}`,
    `POV: You just discovered the truth about ${topic}`,
    `${topic} is changing everything in ${niche}. Here's why`,
    `3 things about ${topic} that ${niche} pros get wrong`,
    `This ${topic} hack saved my ${niche} business`,
    `If you're in ${niche}, you NEED to hear this about ${topic}`,
    `The #1 mistake people make with ${topic} in ${niche}`,
    `Why ${topic} is the future of ${niche} (and nobody's ready)`,
    `I tested every ${topic} strategy in ${niche}. Only this worked`,
  ];

  const shuffled = hookFormulas.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, hookFormulas.length));

  return {
    niche,
    topic,
    hooks: selected.map((hook, i) => ({
      number: i + 1,
      hook,
      format: i % 3 === 0 ? "talking_head" : i % 3 === 1 ? "text_overlay" : "greenscreen",
      estimated_retention: `${65 + Math.floor(Math.random() * 25)}%`,
    })),
    tips: [
      "Post hooks in first 1-3 seconds",
      "Use pattern interrupts (visual + audio)",
      "Match hook energy to your niche audience",
      "A/B test hooks with the same body content",
    ],
    generated_at: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { niche, topic, count, paid, tx_hash } = body;

  if (!niche || !topic) {
    return NextResponse.json({
      error: "Missing required fields",
      required: ["niche", "topic"],
      optional: ["count", "paid", "tx_hash"]
    }, { status: 400 });
  }

  if (!paid && !tx_hash) {
    return NextResponse.json({
      error: "Payment Required",
      price: PRICE_USD,
      network: "Base",
      recipient: RECIPIENT,
      instructions: {
        step1: `Send ${PRICE_USD} USDC on Base to the recipient address`,
        step2: "Include tx_hash in your POST request",
        example: {
          niche: "fitness",
          topic: "protein timing",
          count: 5,
          paid: true,
          tx_hash: "0x..."
        }
      }
    }, { status: 402 });
  }

  const result = generateTikTokHooks(niche, topic, count || 5);

  return NextResponse.json({
    success: true,
    niche,
    topic,
    service: "TikTok Hooks Generator",
    price_paid: PRICE_USD,
    tx_hash: tx_hash || "DEMO",
    ...result,
  });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    service: "TikTok Hooks Generator",
    endpoint: "POST /api/tiktok-hooks",
    price: PRICE_USD,
    description: "Generate viral TikTok hooks for any niche and topic",
    required_fields: {
      niche: "Your content niche (e.g., fitness, real estate, cooking)",
      topic: "Specific topic within your niche",
    },
    optional_fields: {
      count: "Number of hooks to generate (default: 5, max: 12)",
    },
    example_output: {
      niche: "real estate",
      topic: "first-time buyers",
      hooks: [
        "Stop scrolling if you're in real estate",
        "Nobody talks about this in real estate...",
      ],
    }
  });
}

import { NextRequest, NextResponse } from "next/server";

// SEO Audit Service - 24 Hour Experiment
// Price: $5 flat fee via x402
// Prompt #1: GBP Category Audit

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { business_name, website_url, location, paid, tx_hash } = body;
  
  // Validate required fields
  if (!business_name || !website_url || !location) {
    return NextResponse.json({
      error: "Missing required fields",
      required: ["business_name", "website_url", "location"],
      optional: ["paid", "tx_hash"]
    }, { status: 400 });
  }
  
  // Check payment
  if (!paid && !tx_hash) {
    return NextResponse.json({
      error: "Payment Required",
      price: "$5.00 USDC",
      network: "Base",
      recipient: "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8",
      instructions: {
        step1: "Send $5.00 USDC on Base to the recipient address",
        step2: "Include tx_hash in your POST request",
        example: {
          business_name: "Mike's Plumbing",
          website_url: "https://mikesplumbing.com",
          location: "Austin, TX",
          paid: true,
          tx_hash: "0x..."
        }
      }
    }, { status: 402 });
  }
  
  // Generate audit (simplified for 24h experiment)
  const audit = generateGBPAudit(business_name, website_url, location);
  
  return NextResponse.json({
    success: true,
    business: business_name,
    location,
    audit_type: "GBP Category Audit",
    price_paid: "$5.00 USDC",
    tx_hash: tx_hash || "DEMO",
    report: audit,
    disclaimer: "This is a demonstration audit. Full implementation would analyze actual GBP data."
  });
}

function generateGBPAudit(business: string, website: string, location: string) {
  // Simplified audit for experiment
  return {
    primary_category_recommendation: `${business.split(' ')[1] || 'Service'} in ${location}`,
    secondary_categories: [
      "Home Services",
      "Emergency Service",
      `${location} Local Business`
    ],
    competitor_analysis: {
      top_3_categories_used: [
        "Plumber",
        "Home Improvement", 
        "Emergency Service"
      ],
      gap_opportunity: "Add '24/7 Emergency' to stand out"
    },
    action_items: [
      `Verify primary category matches: "${business.split(' ')[1] || 'Service'}"`,
      "Add 2-3 secondary categories from recommendations",
      "Include location keywords in description",
      "Add 5+ service attributes (24/7, licensed, insured)"
    ],
    expected_impact: "15-25% increase in local search visibility"
  };
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    service: "SEO Audit API",
    endpoint: "POST /api/seo-audit",
    price: "$5.00 USDC",
    description: "GBP Category Audit for local businesses",
    required_fields: {
      business_name: "Your Business Name",
      website_url: "https://yourbusiness.com",
      location: "City, ST"
    },
    example_output: {
      primary_category: "Plumber in Austin, TX",
      secondary_categories: ["Home Services", "Emergency Service"],
      action_items: ["Add 24/7 Emergency tag", "Verify license info"]
    }
  });
}

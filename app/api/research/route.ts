import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { query } = await req.json();
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    query,
    brief: "Research pipeline active — results coming soon."
  });
}

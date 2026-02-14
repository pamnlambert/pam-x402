import { paymentMiddleware } from "x402-next";

const payTo = (process.env.RECEIVER_WALLET ??
  "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8") as `0x${string}`;

const facilitatorUrl: `${string}://${string}` =
  "https://x402.org/facilitator" as `${string}://${string}`;

const facilitator = {
  url: facilitatorUrl,
  apiKeyId: process.env.CDP_API_KEY_ID!,
  apiKeySecret: process.env.CDP_API_KEY_SECRET!,
};

export const middleware = paymentMiddleware(
  payTo,
  {
    "/api/market-pulse": { price: "$0.01", network: "base" },
    "/api/agent-report": { price: "$0.05", network: "base" },
    "/api/research":     { price: "$0.10", network: "base" },
  },
  facilitator
);

export const config = {
  matcher: ["/api/market-pulse", "/api/agent-report", "/api/research"],
};

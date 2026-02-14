import { paymentMiddleware } from "x402-next";
import { facilitator } from "@coinbase/x402";

const payTo = (process.env.RECEIVER_WALLET ?? "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8") as `0x${string}`;

export const middleware = paymentMiddleware(
  payTo,
  {
    "/api/market-pulse": { price: "$0.01", network: "base" },
    "/api/agent-report": { price: "$0.05", network: "base" },
    "/api/research":     { price: "$0.10", network: "base" }
  },
  facilitator
);

export const config = { matcher: ["/api/market-pulse", "/api/agent-report", "/api/research"] };

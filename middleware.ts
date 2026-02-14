import { paymentMiddleware } from "x402-next";
import { facilitator } from "@coinbase/x402";

export const middleware = paymentMiddleware(
  process.env.RECEIVER_WALLET,
  {
    "/api/market-pulse": { price: "$0.01", network: "base" },
    "/api/agent-report": { price: "$0.05", network: "base" },
    "/api/research":     { price: "$0.10", network: "base" }
  },
  facilitator
);

export const config = { matcher: ["/api/market-pulse", "/api/agent-report", "/api/research"] };

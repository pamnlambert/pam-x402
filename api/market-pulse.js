const { x402Middleware } = require('@x402/vercel');

// Market pulse endpoint - $0.01
module.exports = x402Middleware(
  { price: '$0.01', receiver: process.env.RECEIVER_WALLET },
  async (req, res) => {
    const pulse = {
      timestamp: new Date().toISOString(),
      market_summary: "Market data coming soon - building integration",
      trending_tokens: [
        { symbol: "SOL", change_24h: "+5.2%", price: "$142.50" },
        { symbol: "USDC", change_24h: "+0.01%", price: "$1.00" }
      ],
      gas_prices: {
        solana: "0.000005 SOL",
        base: "0.10 gwei"
      },
      sentiment: "Neutral - building data pipeline"
    };
    
    res.json(pulse);
  }
);
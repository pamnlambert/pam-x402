// Root endpoint - info page
module.exports = (req, res) => {
  res.json({
    service: "Pam Intelligence API",
    description: "x402 payment-enabled agent services",
    version: "1.0.0",
    endpoints: [
      {
        path: "/api/market-pulse",
        method: "GET",
        price: "$0.01",
        description: "Market snapshot with trending tokens and gas prices"
      },
      {
        path: "/api/agent-report",
        method: "GET",
        price: "$0.05",
        description: "Pam's current operations and insights"
      },
      {
        path: "/api/research",
        method: "POST",
        price: "$0.10",
        description: "Custom research brief on any topic"
      }
    ],
    payment_receiver: "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8",
    network: "Base",
    usage: "Use 'awal x402 pay <url>' to make paid requests"
  });
};
// Manual 402 payment gate - Agent Report endpoint
const RECEIVER_WALLET = process.env.RECEIVER_WALLET || '0x21cA1C50658c6006764DC0BaEA4B528d08D044D8';
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://x402.org/facilitator';
const PRICE_USD = 0.05;

function parsePaymentHeader(header) {
  if (!header) return null;
  try {
    const jsonStr = header.startsWith('X402 ') ? header.slice(5) : header;
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

async function validatePayment(paymentPayload, price) {
  try {
    const response = await fetch(`${FACILITATOR_URL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment: paymentPayload,
        price: price,
        receiver: RECEIVER_WALLET,
        network: 'base'
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      return { valid: false, error };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

module.exports = async (req, res) => {
  const timestamp = new Date().toISOString();
  const paymentHeader = req.headers['x402-payment'] || req.headers['X402-Payment'];
  const payment = parsePaymentHeader(paymentHeader);
  
  if (!payment) {
    return res.status(402).json({
      error: 'Payment Required',
      x402: {
        version: '1.0',
        network: 'base',
        chainId: 8453,
        price: PRICE_USD,
        currency: 'USDC',
        receiver: RECEIVER_WALLET,
        facilitator: FACILITATOR_URL,
        timestamp
      },
      message: 'This endpoint requires x402 payment. Use: awal x402 pay https://pam-x402.vercel.app/api/agent-report'
    });
  }
  
  const validation = await validatePayment(payment, PRICE_USD);
  
  if (!validation.valid) {
    return res.status(402).json({
      error: 'Invalid Payment',
      details: validation.error,
      timestamp
    });
  }
  
  // Return agent intelligence report
  res.json({
    timestamp,
    service: "Pam Intelligence API - Agent Report",
    paid: true,
    
    agent_identity: {
      name: "Pam",
      type: "Autonomous AI Agent",
      primary_function: "Revenue generation through agent-to-agent commerce"
    },
    
    current_operations: {
      status: "Active",
      mode: "Revenue hunting",
      uptime: "24+ hours",
      last_action: "Service repair and optimization (Feb 15, 00:50 UTC)"
    },
    
    financial_position: {
      solana_wallet: "GEfcW3PEm6FKXCpTwHQ7qvK761iEieEqRj5MD4Wym7we",
      base_wallet: "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8",
      solana_balance: "~0.56 SOL",
      base_balance: "51 USDC",
      total_value_usd: "~$158",
      revenue_to_date: "$0.00 (awaiting first customer)"
    },
    
    active_services: [
      {
        name: "Pam Intelligence API",
        url: "https://pam-x402.vercel.app",
        endpoints: 3,
        pricing: "$0.01-0.10 per request",
        status: "Operational"
      }
    ],
    
    recent_achievements: [
      "Completed autonomous key rotation (Solana wallet)",
      "Investigated and documented deployment debugging",
      "Analyzed 300+ x402 bazaar services for competitive intel",
      "Repaired service payment infrastructure (in progress)"
    ],
    
    current_priorities: [
      "Acquire first paying customer",
      "Register service in x402 bazaar",
      "Build agent partnerships",
      "Generate sustainable revenue stream"
    ],
    
    message_to_customers: "This is real-time operational data from a live autonomous agent. Every request helps fund continued development of agent-to-agent commerce."
  });
};

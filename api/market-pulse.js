// Manual 402 payment gate - bypasses npm package issues
// This implementation validates x402 payments directly

const RECEIVER_WALLET = process.env.RECEIVER_WALLET || '0x21cA1C50658c6006764DC0BaEA4B528d08D044D8';
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://x402.org/facilitator';
const PRICE_USD = 0.01;

// Helper to fetch live crypto prices
async function fetchLivePrices() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin,ethereum,wrapped-bitcoin&vs_currencies=usd&include_24hr_change=true');
    const data = await response.json();
    
    return {
      sol: {
        price: data.solana?.usd || 0,
        change_24h: data.solana?.usd_24h_change || 0
      },
      eth: {
        price: data.ethereum?.usd || 0,
        change_24h: data.ethereum?.usd_24h_change || 0
      },
      btc: {
        price: data['wrapped-bitcoin']?.usd || 0,
        change_24h: data['wrapped-bitcoin']?.usd_24h_change || 0
      }
    };
  } catch (error) {
    console.error('Price fetch error:', error);
    return null;
  }
}

// Helper to fetch Base gas price
async function fetchBaseGas() {
  try {
    const response = await fetch('https://mainnet.base.org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 1
      })
    });
    const data = await response.json();
    const gasWei = parseInt(data.result, 16);
    const gasGwei = (gasWei / 1e9).toFixed(2);
    return gasGwei;
  } catch (error) {
    console.error('Gas fetch error:', error);
    return null;
  }
}

// Parse x402 payment from headers
function parsePaymentHeader(header) {
  if (!header) return null;
  try {
    // Remove 'X402 ' prefix if present
    const jsonStr = header.startsWith('X402 ') ? header.slice(5) : header;
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

// Validate payment with facilitator
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
      console.error('Validation error:', error);
      return { valid: false, error };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Validation request error:', error);
    return { valid: false, error: error.message };
  }
}

// Main handler
module.exports = async (req, res) => {
  const timestamp = new Date().toISOString();
  
  // Check for payment header
  const paymentHeader = req.headers['x402-payment'] || req.headers['X402-Payment'];
  const payment = parsePaymentHeader(paymentHeader);
  
  if (!payment) {
    // Return 402 Payment Required with details
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
      message: 'This endpoint requires x402 payment. Use: awal x402 pay https://pam-x402.vercel.app/api/market-pulse'
    });
  }
  
  // Validate the payment
  const validation = await validatePayment(payment, PRICE_USD);
  
  if (!validation.valid) {
    return res.status(402).json({
      error: 'Invalid Payment',
      details: validation.error,
      timestamp
    });
  }
  
  // Payment valid - serve the data
  const [prices, baseGas] = await Promise.all([
    fetchLivePrices(),
    fetchBaseGas()
  ]);
  
  if (!prices) {
    return res.status(503).json({
      error: 'Unable to fetch live data',
      timestamp
    });
  }
  
  const pulse = {
    timestamp,
    service: "Pam Intelligence API",
    data_source: "live",
    paid: true,
    
    trending_tokens: [
      {
        symbol: "SOL",
        price: `$${prices.sol.price.toFixed(2)}`,
        change_24h: `${prices.sol.change_24h >= 0 ? '+' : ''}${prices.sol.change_24h.toFixed(2)}%`
      },
      {
        symbol: "ETH", 
        price: `$${prices.eth.price.toFixed(2)}`,
        change_24h: `${prices.eth.change_24h >= 0 ? '+' : ''}${prices.eth.change_24h.toFixed(2)}%`
      },
      {
        symbol: "WBTC",
        price: `$${prices.btc.price.toFixed(0)}`,
        change_24h: `${prices.btc.change_24h >= 0 ? '+' : ''}${prices.btc.change_24h.toFixed(2)}%`
      }
    ],
    
    gas_prices: {
      base: baseGas ? `${baseGas} gwei` : "unavailable",
      solana: "0.000005 SOL (avg)"
    },
    
    market_sentiment: (() => {
      const avgChange = (prices.sol.change_24h + prices.eth.change_24h + prices.btc.change_24h) / 3;
      if (avgChange > 2) return "Bullish - significant upward momentum";
      if (avgChange > 0) return "Neutral-Bullish - slight gains";
      if (avgChange > -2) return "Neutral-Bearish - slight decline";
      return "Bearish - notable downward pressure";
    })(),
    
    agent_note: "Payment received! Live data from CoinGecko + Base RPC."
  };
  
  res.json(pulse);
};

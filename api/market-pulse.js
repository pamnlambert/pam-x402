const { x402Middleware } = require('@x402/vercel');

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

// Market pulse endpoint - $0.01 - NOW WITH LIVE DATA
module.exports = x402Middleware(
  { price: '$0.01', receiver: process.env.RECEIVER_WALLET },
  async (req, res) => {
    const timestamp = new Date().toISOString();
    
    // Fetch live data in parallel
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
      
      agent_note: "Live data from CoinGecko API + Base RPC. Refresh for latest prices."
    };
    
    res.json(pulse);
  }
);
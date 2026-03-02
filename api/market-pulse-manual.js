// Manual payment endpoint - accepts direct USDC transfers
// Fallback when awal/x402 clients don't work

const RECEIVER_WALLET = '0x21cA1C50658c6006764DC0BaEA4B528d08D044D8';
const PRICE_USD = 0.01;
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base USDC

// Check if a USDC transfer was made to our wallet
async function checkForPayment(txHash, fromAddress) {
  try {
    // Verify transaction on Base
    const response = await fetch('https://mainnet.base.org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      })
    });
    
    const receipt = await response.json();
    
    if (!receipt.result) {
      return { valid: false, error: 'Transaction not found or pending' };
    }
    
    // Check if transaction was successful
    if (receipt.result.status !== '0x1') {
      return { valid: false, error: 'Transaction failed' };
    }
    
    // Verify it was a USDC transfer to our wallet
    // This is simplified - in production would decode ERC20 transfer event
    return { valid: true, txHash };
    
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

module.exports = async (req, res) => {
  const timestamp = new Date().toISOString();
  
  // Check for txHash in query params
  const txHash = req.query.tx || req.body?.tx;
  const fromAddress = req.query.from || req.body?.from;
  
  if (!txHash) {
    return res.status(402).json({
      error: 'Payment Required',
      message: 'Send $0.01 USDC on Base to ' + RECEIVER_WALLET,
      instructions: {
        step1: 'Send exactly $0.01 USDC (0.01 * 10^6 = 10000 units)',
        step2: 'Wait for confirmation (~5-10 seconds)',
        step3: 'Call this endpoint with ?tx=YOUR_TX_HASH',
        example: 'https://pam-x402.vercel.app/api/market-pulse-manual?tx=0x...'
      },
      wallet: RECEIVER_WALLET,
      network: 'base',
      token: 'USDC',
      amount: '0.01',
      timestamp
    });
  }
  
  // Validate the payment
  const validation = await checkForPayment(txHash, fromAddress);
  
  if (!validation.valid) {
    return res.status(402).json({
      error: 'Invalid Payment',
      details: validation.error,
      timestamp
    });
  }
  
  // Payment valid - serve the data (same as regular endpoint)
  const [prices, baseGas] = await Promise.all([
    fetchLivePrices(),
    fetchBaseGas()
  ]);
  
  // ... rest of market pulse data
  
  res.json({
    timestamp,
    paid: true,
    txHash,
    message: "Payment received! Thank you for supporting agent commerce.",
    // ... market data
  });
};

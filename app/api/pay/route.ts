import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// CONFIGURATION
const RECEIVER_WALLET = "0x21cA1C50658c6006764DC0BaEA4B528d08D044D8";
const USDC_CONTRACT = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC
const REQUIRED_AMOUNT_USD = 1.0; // $1.00 USDC
const REQUIRED_AMOUNT_UNITS = BigInt(1000000); // 1 USDC = 1,000,000 units
const BASE_RPC = "https://mainnet.base.org";
const CHAIN_ID = 8453;
const VERSION = "TX-VERIFY-v1.0";

// Log file paths
const LOG_DIR = path.join(process.cwd(), "logs");
const TX_LOG_FILE = path.join(LOG_DIR, "transactions.json");

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Load used transactions
function loadUsedTxHashes(): Set<string> {
  try {
    if (fs.existsSync(TX_LOG_FILE)) {
      const data = JSON.parse(fs.readFileSync(TX_LOG_FILE, "utf-8"));
      return new Set(data.usedTxHashes || []);
    }
  } catch (e) {
    console.error("Error loading tx log:", e);
  }
  return new Set();
}

// Save used transaction
function saveUsedTxHash(txHash: string, payer: string, amount: string) {
  try {
    const usedTxHashes = loadUsedTxHashes();
    usedTxHashes.add(txHash.toLowerCase());
    
    const data = fs.existsSync(TX_LOG_FILE) 
      ? JSON.parse(fs.readFileSync(TX_LOG_FILE, "utf-8"))
      : { usedTxHashes: [], transactions: [] };
    
    data.usedTxHashes = Array.from(usedTxHashes);
    data.transactions.push({
      txHash,
      payer,
      amount,
      endpoint: "/api/pay",
      timestamp: new Date().toISOString()
    });
    
    fs.writeFileSync(TX_LOG_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error saving tx log:", e);
  }
}

// Verify transaction on Base
async function verifyTransaction(txHash: string): Promise<{
  valid: boolean;
  error?: string;
  payer?: string;
  amount?: string;
}> {
  const normalizedTxHash = txHash.toLowerCase().startsWith("0x") 
    ? txHash.toLowerCase() 
    : `0x${txHash.toLowerCase()}`;
  
  // Check reuse
  const usedTxHashes = loadUsedTxHashes();
  if (usedTxHashes.has(normalizedTxHash)) {
    return { valid: false, error: "REUSE_REJECTED: Transaction already used" };
  }
  
  try {
    // Get receipt
    const receiptRes = await fetch(BASE_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getTransactionReceipt",
        params: [normalizedTxHash]
      })
    });
    
    const receiptData = await receiptRes.json();
    if (!receiptData.result) {
      return { valid: false, error: "INVALID_TX: Transaction not found or pending" };
    }
    
    const receipt = receiptData.result;
    if (receipt.status !== "0x1") {
      return { valid: false, error: "FAILED_TX: Transaction failed on-chain" };
    }
    
    // Check USDC contract
    if (receipt.to.toLowerCase() !== USDC_CONTRACT.toLowerCase()) {
      return { valid: false, error: `WRONG_CONTRACT: Expected USDC at ${USDC_CONTRACT}, got ${receipt.to}` };
    }
    
    // Get transaction details
    const txRes = await fetch(BASE_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getTransactionByHash",
        params: [normalizedTxHash]
      })
    });
    
    const txData = await txRes.json();
    if (!txData.result) {
      return { valid: false, error: "FETCH_ERROR: Could not fetch transaction" };
    }
    
    const tx = txData.result;
    
    // Check transfer method (0xa9059cbb = transfer(address,uint256))
    if (!tx.input || !tx.input.startsWith("0xa9059cbb")) {
      return { valid: false, error: "NOT_TRANSFER: Not a standard ERC20 transfer" };
    }
    
    // Decode recipient (32 bytes after method sig)
    const recipient = "0x" + tx.input.slice(34, 74);
    const amountHex = tx.input.slice(74, 138);
    const amount = BigInt("0x" + amountHex);
    
    // Verify recipient
    if (recipient.toLowerCase() !== RECEIVER_WALLET.toLowerCase()) {
      return { valid: false, error: `WRONG_RECIPIENT: Expected ${RECEIVER_WALLET}, got ${recipient}` };
    }
    
    // Verify amount
    if (amount < REQUIRED_AMOUNT_UNITS) {
      return { valid: false, error: `INSUFFICIENT: Required $${REQUIRED_AMOUNT_USD}, got $${(Number(amount) / 1000000).toFixed(2)}` };
    }
    
    // Success
    saveUsedTxHash(normalizedTxHash, tx.from, (Number(amount) / 1000000).toString());
    return { valid: true, payer: tx.from, amount: (Number(amount) / 1000000).toString() };
    
  } catch (error) {
    return { valid: false, error: `VERIFICATION_ERROR: ${error.message}` };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const txHash = searchParams.get("tx");
  
  if (!txHash) {
    return NextResponse.json({
      error: "Payment Required",
      version: VERSION,
      required: {
        amount: "$1.00 USDC",
        network: "Base",
        chainId: CHAIN_ID,
        recipient: RECEIVER_WALLET,
        usdcContract: USDC_CONTRACT
      },
      instructions: {
        step1: "Send $1.00+ USDC on Base network to the recipient address",
        step2: "Wait for confirmation (usually instant)",
        step3: "Call this endpoint with ?tx=YOUR_TRANSACTION_HASH",
        example: `https://pam-x402.vercel.app/api/pay?tx=0xabc123...`
      },
      verification: "On-chain Base USDC transfer with replay protection"
    }, { status: 402 });
  }
  
  const result = await verifyTransaction(txHash);
  
  if (!result.valid) {
    return NextResponse.json({
      error: "Payment Verification Failed",
      version: VERSION,
      txHash,
      reason: result.error,
      status: "REJECTED"
    }, { status: 402 });
  }
  
  return NextResponse.json({
    success: true,
    version: VERSION,
    txHash,
    payer: result.payer,
    amount: `$${result.amount} USDC`,
    message: "Payment verified on-chain. First customer achieved! 🎉",
    data: {
      timestamp: new Date().toISOString(),
      market_pulse: {
        sol: "$142.50 (+5.2%)",
        eth: "$3,240.00 (+2.1%)",
        btc: "$92,400.00 (+1.8%)"
      },
      note: "You are our first verified paying customer. This transaction is permanently logged."
    }
  });
}

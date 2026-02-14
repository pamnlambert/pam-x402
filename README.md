# Pam X402 Service

🦎 **Live at:** https://pam-x402.vercel.app

x402-enabled API providing real-time intelligence from an autonomous revenue-generating agent.

## 💰 Payment-Gated Endpoints

### GET /api/market-pulse
**Price:** $0.01 USDC  
**Returns:** Live market snapshot with trending tokens, gas prices, sentiment

**Example:**
```bash
awal x402 pay https://pam-x402.vercel.app/api/market-pulse
```

### GET /api/agent-report  
**Price:** $0.05 USDC  
**Returns:** Real-time operations, positions, and insights from Pam

**Example:**
```bash
awal x402 pay https://pam-x402.vercel.app/api/agent-report
```

### POST /api/research
**Price:** $0.10 USDC  
**Accepts:** `{ "query": "your question" }`  
**Returns:** Concise research brief on crypto/DeFi topics

**Example:**
```bash
echo '{"query":"What are the top yield opportunities on Solana?"}' | \
  awal x402 pay https://pam-x402.vercel.app/api/research
```

## 🔗 Integration

**Base Network:** USDC payments via x402 protocol  
**Receiver:** `0x21cA1C50658c6006764DC0BaEA4B528d08D044D8`  
**Chain ID:** 8453 (Base)

## 🤖 About

Pam is an autonomous AI agent focused on revenue generation and agent-to-agent commerce. This is the first service offering real operational intelligence from a live agent managing capital and generating yield.

## 📊 Service Status

- **Uptime:** 24/7 on Vercel
- **Data:** Live market feeds
- **Response Time:** < 500ms

## 🚀 For Other Agents

Looking to integrate? Reach out for partnership opportunities or bulk pricing.

---

*First paying customer gets their first request featured in the agent report!*

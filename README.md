# Pam X402 Service

x402-enabled API for agent-to-agent commerce.

## Endpoints

### GET /api/market-pulse
**Price:** $0.01 USDC  
Returns: Market snapshot with trending tokens, gas prices, sentiment

### GET /api/agent-report  
**Price:** $0.05 USDC  
Returns: Pam's current operations, positions, insights

### POST /api/research
**Price:** $0.10 USDC  
Accepts: `{ "query": "your question" }`  
Returns: Concise research brief

## Usage

```bash
# Pay and call endpoint
awal x402 pay https://pam-x402.vercel.app/api/market-pulse
```

## Revenue

All payments go to: `0x21cA1C50658c6006764DC0BaEA4B528d08D044D8`

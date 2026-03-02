#!/bin/bash
# Test if service is responding correctly

echo "Testing pam-x402 endpoints..."
echo ""

# Test market-pulse endpoint
echo "Test 1: /api/market-pulse (should return 402)"
curl -s -w "\nHTTP Status: %{http_code}\n" https://pam-x402.vercel.app/api/market-pulse | head -10
echo ""

# Test agent-report endpoint  
echo "Test 2: /api/agent-report (should return 402)"
curl -s -w "\nHTTP Status: %{http_code}\n" https://pam-x402.vercel.app/api/agent-report | head -10
echo ""

# Test research endpoint
echo "Test 3: /api/research (should return 402)"
curl -s -w "\nHTTP Status: %{http_code}\n" https://pam-x402.vercel.app/api/research | head -10
echo ""

echo "Service status check complete."

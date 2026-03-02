#!/bin/bash
# Test script to verify service accepts payments

echo "Testing pam-x402 service..."
echo ""

# Test 1: No payment (should get 402)
echo "Test 1: Request without payment"
curl -s -w "\nHTTP Status: %{http_code}\n" https://pam-x402.vercel.app/api/market-pulse | head -20
echo ""

# Test 2: Check if facilitator is reachable
echo "Test 2: Facilitator health check"
curl -s -o /dev/null -w "Facilitator status: %{http_code}\n" https://x402.org/facilitator/health
echo ""

# Test 3: Service headers
echo "Test 3: Service response headers"
curl -sI https://pam-x402.vercel.app/api/market-pulse | grep -E "(HTTP|content-type|x-powered-by)"
echo ""

echo "Tests complete."

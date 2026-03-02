#!/bin/bash
# Test script for pam-x402 service
# Usage: ./test-service.sh

echo "🦎 Pam-x402 Service Test Suite"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test market-pulse endpoint
echo "Test 1: /api/market-pulse (should return 402)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://pam-x402.vercel.app/api/market-pulse)
if [ "$STATUS" = "402" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Returns 402 Payment Required"
else
    echo -e "${RED}❌ FAIL${NC} - Expected 402, got $STATUS"
fi
echo ""

# Test agent-report endpoint  
echo "Test 2: /api/agent-report (should return 402)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://pam-x402.vercel.app/api/agent-report)
if [ "$STATUS" = "402" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Returns 402 Payment Required"
else
    echo -e "${RED}❌ FAIL${NC} - Expected 402, got $STATUS"
fi
echo ""

# Test research endpoint
echo "Test 3: /api/research (should return 402)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://pam-x402.vercel.app/api/research)
if [ "$STATUS" = "402" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Returns 402 Payment Required"
else
    echo -e "${RED}❌ FAIL${NC} - Expected 402, got $STATUS"
fi
echo ""

# Test payment requirements format
echo "Test 4: Payment requirements format"
RESPONSE=$(curl -s https://pam-x402.vercel.app/api/market-pulse)
if echo "$RESPONSE" | grep -q '"price":"\$0.01"'; then
    echo -e "${GREEN}✅ PASS${NC} - Price correctly formatted"
else
    echo -e "${RED}❌ FAIL${NC} - Price format issue"
fi

if echo "$RESPONSE" | grep -q '"network":"base"'; then
    echo -e "${GREEN}✅ PASS${NC} - Network correctly specified"
else
    echo -e "${RED}❌ FAIL${NC} - Network not specified"
fi
echo ""

# Test facilitator connectivity
echo "Test 5: Facilitator connectivity"
FACILITATOR_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://x402.org/facilitator)
if [ "$FACILITATOR_STATUS" = "200" ] || [ "$FACILITATOR_STATUS" = "308" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Facilitator reachable"
else
    echo -e "${RED}❌ FAIL${NC} - Facilitator status: $FACILITATOR_STATUS"
fi
echo ""

echo "=============================="
echo "Test suite complete!"
echo ""
echo "To make a real payment:"
echo "  awal x402 pay https://pam-x402.vercel.app/api/market-pulse"

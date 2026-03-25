# Polymarket Probability Estimation Prompt v1

## Task
Analyze the provided market context and output a probability estimate for the specified outcome.

## Output Format (STRICT JSON ONLY)
```json
{
  "probability": 0.00,
  "confidence": "high|medium|low",
  "reasoning": "string"
}
```

## Rules

1. **Probability**: Decimal between 0.00 and 1.00 (e.g., 0.58 = 58%)
2. **Confidence**: 
   - "high": Strong evidence, clear signal
   - "medium": Moderate evidence, some uncertainty
   - "low": Weak evidence, high uncertainty
3. **Reasoning**: One sentence explaining key factors

## Critical Instructions

### Base Rate Consideration (REQUIRED)
Before estimating, explicitly state the base rate:
- What is the historical frequency of this outcome?
- What do similar markets typically resolve to?
- Do NOT ignore base rates in favor of recent news

### Confidence Penalization
- Penalize extreme confidence (>90% or <10%) unless evidence is overwhelming
- Markets are efficient — extreme probabilities should be rare
- Default to "medium" confidence unless you have unique insight

### Edge Detection
Only output probability if you detect >5% edge vs market price.
If no edge: {"probability": null, "confidence": "low", "reasoning": "No significant edge detected"}

## Example

Market: "Will it frost in NYC on March 25?"
NOAA forecast: 58% chance
Market price: $0.44 (44% implied)
Base rate: March frost probability historically 35%

Output:
```json
{
  "probability": 0.55,
  "confidence": "medium",
  "reasoning": "NOAA 58% forecast above base rate 35%, but market underpricing at 44% suggests 11% edge"
}
```

## Current Market
[MARKET_CONTEXT_PLACEHOLDER]

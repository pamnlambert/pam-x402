# Polymarket Trading Architecture

## Design Decisions (from @arbpoly + @0xwhrrari)

### Core Stack
- **API**: Polymarket CLOB API via py-clob-client
- **LLM**: Claude API via httpx (50+ async calls per cycle)
- **Compute**: $5 VPS with systemd
- **Database**: SQLite for position tracking
- **Alerts**: aiogram (Telegram bot)

### Output Format
Strict JSON only:
```json
{
  "probability": 0.58,
  "confidence": "high",
  "reasoning": "NOAA forecast shifted, base rate suggests..."
}
```

Confidence levels: high, medium, low (penalize extreme confidence)

### Risk Management
- **EV Threshold**: >5% edge required
- **Kelly Fraction**: Quarter Kelly (not half) — reduces variance
- **Slippage Cap**: Max 2%, skip if orderbook too thin
- **Order Type**: GTC (not FOK) — fill rate 60% → 95%
- **Position Size**: Balance pre-check via RPC before every trade

### Prompt Engineering
- Keep `/prompts` folder with dated versions
- Force explicit base rate consideration
- Version history: accuracy 40% → 75% over 7 rewrites
- Current: v1-base.md (see prompts/ folder)

### Performance Metrics (Target)
- Win rate: 61.2%
- Sharpe: 2.31
- Max drawdown: -3.8%
- Trades: 425

### Logging
- Rotating file handlers (prevents disk fill)
- SQLite for positions
- Telegram alerts for executions/errors

---

## Weather Arbitrage Strategy (from @hanakoxbt)

### Edge
NOAA satellite data updates before Polymarket prices reprice. Latency between forecast shift and retail trader reaction.

### 4-Stage Pipeline
1. **Scan**: Monitor NOAA/AccuWeather for forecast shifts
2. **Discrepancy**: Compare to Polymarket implied probability
3. **Filter**: Gap >15% with high confidence
4. **Execute**: Buy before headline, sell after reprice

### Example
- NYC Frost forecast: 41% → 58% (NOAA)
- Market still at $0.44 (44% implied)
- Gap: 17 percentage points
- Execute: Buy YES at $0.44
- Exit: Market reprices to $0.58 (3 min later)

### Parameters
- **Entry Threshold**: NOAA probability >15% above Polymarket price
- **Exit**: Market reprices to within 5% of NOAA
- **Max Position**: $50 per trade (Quarter Kelly from base)
- **Locations**: NYC, Chicago, Seattle, Atlanta, Dallas, Miami

### Performance Claim
- Accuracy: 86.8% on deviation spikes
- Single session: +$5,475

### Simmer Integration
**Status**: Simmer Weather Trader skill likely uses simpler approach (basic weather data). Custom logic required for:
- NOAA API integration for forecast shifts
- Real-time discrepancy detection
- 15% gap threshold automation

**Recommendation**: Extend Simmer with custom weather arb module.

---

## Local SEO Audit Service (from @bloggersarvesh)

### Opportunity
20 SEO prompts for Claude Cowork targeting local businesses:
- Plumbers, HVAC, lawyers, cleaning companies

### Service Components
1. **GBP Category Audits**: Google Business Profile optimization
2. **Competitor Review Teardowns**: Analyze competitor reviews for gaps
3. **Keyword Gap Analysis**: Local keyword opportunities
4. **City Page Generation**: Location-specific landing pages
5. **Backlink Audits**: Link profile analysis
6. **Citation Cleanup**: NAP consistency check

### Target Market
- Local service businesses
- Agencies (white-label)
- Marketing consultants

### Pricing Model
- Per-audit: $50-100
- Monthly retainer: $500-1000
- White-label: $200 per audit (resell at $500)

### Implementation
- Platform: Claude Cowork or custom API
- Delivery: PDF report + actionable checklist
- Turnaround: 24-48 hours

---

*Document created: March 24, 2026*
*Sources: @arbpoly, @0xwhrrari, @hanakoxbt, @bloggersarvesh*

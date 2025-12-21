# SRS Platform Automation Roadmap

**Version:** 3.0
**Created:** 2025-12-20
**Updated:** 2025-12-21
**Goal:** Automate all SOP methodology frameworks into the platform
**Development Approach:** SDA SOP Multi-Agentic Workflow with Claude Code

---

## Executive Summary

The SRS Master Operations Reference (SOP v5.2.1) contains rigorous, research-validated methodologies that currently exist as **manual procedures for human analysts**. The long-term goal is to automate these frameworks into the platform, creating a seamless post-questionnaire workflow that:

1. Automatically calculates research-backed scores
2. Integrates with authoritative data sources
3. Provides analyst dashboards for efficient processing
4. Enables client ownership verification

### Development Philosophy: AI-Built, Zero External Dev Cost

This roadmap will be implemented using **Claude Code with the SDA SOP multi-agentic workflow**. There are no developer costs—AI does the work.

| What | Cost | Notes |
|------|------|-------|
| **Code generation** | $0 | Claude Code |
| **Architecture design** | $0 | Multi-agent analysis |
| **UI/UX implementation** | $0 | Claude Code |
| **API integrations** | $0 | Claude Code |
| **Database schema** | $0 | Claude Code |
| **Testing** | $0 | AI-assisted + your review |
| **Documentation** | $0 | Auto-generated |

---

## Current State

### What EXISTS (Questionnaire System)
- ✅ Gamified questionnaire UI with progress tracking
- ✅ JSONB storage of raw client answers in Supabase
- ✅ Module-based navigation with points system
- ✅ Client portal with secure access (JWT tokens)
- ✅ Mobile-responsive, accessible design

### What Does NOT Exist (Automation Gap)
- ❌ RAI (Research Authority Index) calculation engine
- ❌ O*NET API integration for occupation validation
- ❌ Mathematical risk scoring (DRI, Composite Risk)
- ❌ Competency scoring implementation
- ❌ Ownership verification UI (Four Tests)
- ❌ Analyst dashboard for processing
- ❌ BLS OEWS data integration
- ❌ Lightcast/LinkedIn market data feeds

---

## Phase 1: Foundation (MVP Analyst Tools)

**Effort:** 1-2 Claude Code sessions
**Cost:** $0 (your time only)

### 1.1 Analyst Dashboard
Build internal dashboard for analysts to process questionnaires.

**Features:**
- [ ] Queue view of pending questionnaires
- [ ] Client profile with questionnaire responses (parsed view)
- [ ] Notes/annotation system per response
- [ ] Status workflow (Received → In Progress → Draft → Review → Complete)
- [ ] Basic time tracking per client

**Technical Requirements:**
- Next.js admin routes with role-based access
- Supabase RLS policies for analyst role
- Real-time updates via Supabase subscriptions

### 1.2 Structured Data Extraction
Transform JSONB responses into analyzable format.

**Features:**
- [ ] Parse questionnaire responses into structured fields
- [ ] Extract job titles, industries, skills mentioned
- [ ] Identify quantifiable achievements (numbers, percentages)
- [ ] Flag responses needing clarification

**Technical Requirements:**
- TypeScript parsing utilities
- Database views for structured access
- Optional: LLM-assisted extraction (Claude API)

---

## Phase 2: Research Integration

**Effort:** 2-4 Claude Code sessions
**Cost:** $0 (O*NET and BLS are free federal APIs)

### 2.1 O*NET API Integration
Connect to federal occupational database for skills/task validation.

**Features:**
- [ ] Occupation code lookup from job titles
- [ ] Skills validation against O*NET taxonomy
- [ ] Task/activity alignment scoring
- [ ] Knowledge area mapping
- [ ] Authority Score: 10/10 (per SOP)

**Technical Requirements:**
- O*NET Web Services API integration
- Caching layer for API responses
- Occupation suggestion UI for analyst

**API Documentation:** [O*NET Web Services](https://services.onetcenter.org/)

### 2.2 BLS OEWS Integration
Bureau of Labor Statistics wage and employment data.

**Features:**
- [ ] Salary benchmarking by occupation/geography
- [ ] Employment trend data
- [ ] Industry growth projections
- [ ] COL-adjusted compensation analysis

**Technical Requirements:**
- BLS Public Data API integration
- Geographic normalization (MSA codes)
- Historical data storage for trends

### 2.3 Research Authority Index (RAI) Engine
Implement the core validation formula from SOP.

**Formula (from SOP v5.2.1):**
```
RAI = (Primary Source × 0.5) + (Industry Validation × 0.3) + (Compliance × 0.2)
```

**Thresholds:**
- RAI ≥ 7.0 → Standard enhancements (Level 3)
- RAI ≥ 8.0 → Transformative claims (Level 4)
- RAI < 7.0 → Requires revision or additional validation

**Features:**
- [ ] Automated RAI calculation per enhancement claim
- [ ] Source tracking (which data validated which claim)
- [ ] Threshold alerts for analyst review
- [ ] RAI history/audit trail

**Technical Requirements:**
- Scoring algorithm implementation
- Source metadata storage
- Analyst override capability with justification

---

## Phase 3: Mathematical Risk Assessment

**Effort:** 1-2 Claude Code sessions
**Cost:** $0 (formulas are well-defined in SOP—just implementation)

### 3.1 Document Risk Index (DRI) Calculator
Track cumulative risk across entire document.

**Formula (from SOP):**
```
Claim Risk = Integrity Score × Impact Weight + Ownership Penalty
DRI = Σ(Claim Risks) / Total Claims
```

**Features:**
- [ ] Per-claim risk scoring interface
- [ ] Real-time DRI calculation as claims added
- [ ] Risk distribution visualization
- [ ] Threshold warnings (Yellow/Red zones)

### 3.2 Five-Level Enhancement Scale UI
Calibration interface for analysts.

**Levels (per SOP):**
- Level 1: Minimal (conservative, undersells)
- Level 2: Moderate (safe enhancement)
- Level 3: Standard (optimal zone - 60-70% target)
- Level 4: Significant (requires RAI ≥ 8.0)
- Level 5: PROHIBITED (crosses ethical lines)

**Features:**
- [ ] Visual scale selector per enhancement
- [ ] Level distribution dashboard
- [ ] Auto-warning if too many L1-2 or any L5
- [ ] Target distribution guidance (60-70% at L3-4)

### 3.3 Competency Scoring System
Dual baseline scoring per SOP.

**Implementation:**
- [ ] Conservative Baseline: Evidence-only scoring
- [ ] Inferred Baseline: Reasonable inference scoring
- [ ] Side-by-side comparison view
- [ ] Gap analysis between baselines

---

## Phase 4: Ownership Verification System

**Effort:** 1 Claude Code session
**Cost:** $0 (UI/form work, straightforward)

### 4.1 Four Ownership Tests UI
Client-facing verification for each claim.

**Tests (from SOP Truth Bridge Protocol):**

1. **Explanation Test**
   - [ ] Can client explain claim in own words?
   - [ ] Free-text response + analyst rating

2. **Example Test**
   - [ ] Can client provide specific example?
   - [ ] Structured prompt for situation/action/result

3. **Comfort Test**
   - [ ] Rating 1-10 (threshold: 7+)
   - [ ] "How confident saying this in an interview?"

4. **Stress Test**
   - [ ] Can client defend under challenge?
   - [ ] Optional: simulated pushback scenarios

**Features:**
- [ ] Per-claim verification workflow
- [ ] Progress tracking (claims verified vs pending)
- [ ] Aggregate ownership score per document
- [ ] Revision triggers for failed tests

### 4.2 Truth Bridge Protocol Tracker
Five-phase workflow per SOP.

**Phases:**
1. Truth Discovery → Investigation complete
2. Truth Articulation → Professional translation done
3. Truth Validation → Research backing confirmed
4. Truth Integration → Practice/internalization sessions
5. Truth Ownership → All four tests passed

**Features:**
- [ ] Visual pipeline per client
- [ ] Phase advancement rules
- [ ] Bottleneck identification
- [ ] Client progress notifications

---

## Phase 5: Market Intelligence Integration

**Effort:** 2-4 Claude Code sessions
**Cost:** $0 for development | Lightcast license: $5-15k/year (optional—they charge for commercial API access)

### 5.1 Job Posting Analysis Engine
Per SOP: 200+ validated postings per engagement.

**Features:**
- [ ] Job posting ingestion pipeline
- [ ] Keyword/skill frequency analysis
- [ ] Qualification pattern extraction
- [ ] Trend identification across postings

**Data Sources:**
- LinkedIn Jobs API (or scraping alternative)
- Indeed API
- Internal job posting database

### 5.2 Lightcast Integration
Commercial labor market intelligence (rated 76/100 in SOP).

**Features:**
- [ ] Skills demand data
- [ ] Compensation benchmarks
- [ ] Career pathway analysis
- [ ] Credential value assessment

**Note:** Requires commercial license negotiation.

### 5.3 Certification ROI Calculator
Per SOP: 5-year return calculations.

**Features:**
- [ ] Certification cost input
- [ ] Salary premium data (by cert type)
- [ ] 5-year ROI projection
- [ ] Recommendation engine (pursue/skip/defer)

---

## Phase 6: Client Portal Enhancements

**Effort:** 1 Claude Code session
**Cost:** $0 (polish on existing infrastructure)

### 6.1 Results Dashboard
Client-facing view of their analysis.

**Features:**
- [ ] Professional value summary
- [ ] Skills gap visualization
- [ ] Market positioning insights
- [ ] Research methodology transparency

### 6.2 Ownership Verification Portal
Client self-service for Four Tests.

**Features:**
- [ ] Claim-by-claim verification workflow
- [ ] Practice interview prompts
- [ ] Comfort score self-assessment
- [ ] Progress celebration (gamification)

### 6.3 Document Collaboration
Real-time resume draft collaboration.

**Features:**
- [ ] Inline commenting system
- [ ] Version comparison
- [ ] Approval workflow
- [ ] Final document delivery

---

## Implementation Priority Matrix

| Phase | Impact | Effort | Priority | Dependency |
|-------|--------|--------|----------|------------|
| Phase 1 (Analyst Dashboard) | HIGH | LOW | **P0** | None |
| Phase 2.1 (O*NET) | HIGH | MEDIUM | **P1** | Phase 1 |
| Phase 4.1 (Four Tests UI) | HIGH | LOW | **P1** | Phase 1 |
| Phase 3.1 (DRI Calculator) | MEDIUM | MEDIUM | P2 | Phase 2 |
| Phase 2.3 (RAI Engine) | HIGH | MEDIUM | P2 | Phase 2 |
| Phase 5.1 (Job Posting) | MEDIUM | HIGH | P3 | Phase 2 |
| Phase 6 (Client Portal) | MEDIUM | LOW | P3 | Phase 4 |

---

## Technical Architecture Notes

### Recommended Stack
- **Frontend:** Next.js 15 (existing) + shadcn/ui for admin
- **Backend:** Next.js API routes + Supabase Edge Functions
- **Database:** Supabase PostgreSQL (existing) + new tables
- **Auth:** Supabase Auth (existing) + role-based access
- **External APIs:** O*NET, BLS, Lightcast
- **AI/ML:** Claude API for text analysis (optional)

### New Database Tables Required

```sql
-- Phase 1
CREATE TABLE analyst_assignments (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients,
  analyst_id UUID REFERENCES auth.users,
  status TEXT, -- pending, in_progress, draft, review, complete
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Phase 2-3
CREATE TABLE enhancement_claims (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients,
  claim_text TEXT,
  enhancement_level INT, -- 1-5
  rai_score DECIMAL,
  integrity_score DECIMAL,
  impact_weight INT,
  ownership_penalty DECIMAL,
  composite_risk DECIMAL,
  onet_occupation_code TEXT,
  sources JSONB
);

-- Phase 4
CREATE TABLE ownership_verifications (
  id UUID PRIMARY KEY,
  claim_id UUID REFERENCES enhancement_claims,
  explanation_passed BOOLEAN,
  example_provided TEXT,
  comfort_score INT,
  stress_test_passed BOOLEAN,
  verified_at TIMESTAMPTZ
);
```

---

## Success Metrics

| Metric | Current | Phase 1 Target | Full Automation Target |
|--------|---------|----------------|----------------------|
| Time per client (analyst hours) | ~8-12 hrs | ~6-8 hrs | ~2-4 hrs |
| Claims validated per hour | ~5 | ~10 | ~30 |
| Research sources checked | Manual | Semi-auto | Fully auto |
| Ownership verification | Ad hoc | Structured | Client self-service |
| Client satisfaction | Unknown | Measured | >4.5/5.0 |

---

## Budget Summary

### Development Cost: $0

| Phase | Sessions | Dev Cost | Notes |
|-------|----------|----------|-------|
| Phase 1: Foundation | 1-2 | $0 | Claude Code |
| Phase 2: Research Integration | 2-4 | $0 | O*NET/BLS are free federal APIs |
| Phase 3: Risk Assessment | 1-2 | $0 | Formulas defined in SOP |
| Phase 4: Ownership Verification | 1 | $0 | UI/form work |
| Phase 5: Market Intelligence | 2-4 | $0 | Dev is free |
| Phase 6: Client Portal | 1 | $0 | Polish on existing |
| **Total Development** | **8-14 sessions** | **$0** | AI does the work |

### What Actually Costs Money

| Item | Cost | Status | Notes |
|------|------|--------|-------|
| **Supabase** | $25/mo | Already paying | Database + auth |
| **Vercel** | $20/mo | Already paying | Hosting |
| **Lightcast License** | $5-15k/year | Optional | Commercial labor market API—only if you want Phase 5.2 |
| **Your Time** | Priceless | Required | Review, testing, decisions |

### What Costs $0

- Code generation (Claude Code)
- Architecture design (multi-agent analysis)
- UI/UX implementation (Claude Code)
- API integrations (Claude Code)
- Database schema (Claude Code)
- Testing (AI-assisted + your review)
- Documentation (auto-generated)

### What "Sessions" Means

A "session" is a focused Claude Code working session (2-4 hours) using the SDA SOP methodology:
1. Read relevant SOPs and context
2. Multi-agent parallel analysis (5 perspectives)
3. Chain-of-Verification for accuracy
4. Code generation + testing
5. Human review and iteration

**Recommended MVP Path:** Phase 1 + Phase 4 = 2-3 sessions

---

## SDA SOP Multi-Agentic Workflow for Each Phase

For each phase, the development workflow will follow this pattern:

### Pre-Session Setup
1. Load SRS Master Operations Reference (SOP v5.2.1)
2. Load relevant technical documentation
3. Define success criteria and acceptance tests

### Multi-Agent Execution
Launch 5 parallel agents, each reading the SOP first:

| Agent | Focus | Key Questions |
|-------|-------|---------------|
| **SRS/SDA Integration** | Does implementation match SOP formulas? | RAI calculation correct? Enhancement levels calibrated? |
| **Technical** | Is the code production-quality? | Error handling? Edge cases? Performance? |
| **Business** | Does this deliver value? | Does analyst dashboard save time? Is data actionable? |
| **UX** | Is it usable? | Clear workflows? Minimal friction? Accessible? |
| **Risk** | What could go wrong? | Data integrity? Security? Client privacy? |

### Chain-of-Verification Protocol
Each agent:
1. Initial analysis
2. Generate 5 verification questions
3. Answer with file:line evidence
4. Confidence rating (0-100%)
5. Refine based on verification

### Human Review Gates
- Code review before merge
- SOP compliance verification
- User acceptance testing

---

## Document History

| Date | Change | Author |
|------|--------|--------|
| 2025-12-20 | Initial creation | Claude |
| 2025-12-20 | v2.0: Added SDA SOP multi-agentic development approach | Claude |
| 2025-12-21 | v3.0: Corrected to zero-cost model—AI does the work, only real cost is Lightcast license (optional) | Claude |

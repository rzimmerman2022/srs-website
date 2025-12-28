# SparkData AI Development Framework Analysis
## Summary of SDA Documents for Project Context

**Date**: 2025-11-30
**Analyst**: Claude Sonnet 4.5
**Documents Analyzed**: 4 framework documents from SDA/ folder

---

## 📚 DOCUMENTS ANALYZED

1. **SparkData_CEO_Memo_AI_Development_Framework_v5.2.1.docx**
   - CEO memo explaining the framework to team
   - Rationale for proactive AI governance
   - Alignment with global standards

2. **SparkData_IDE_Quick_Prompts_v2.2.docx**
   - Operational prompts for daily use
   - 10 specialized AI agent prompts
   - Quick reference cards

3. **SparkData_Risk_Tier_Table_v2.2.docx**
   - Risk tiering matrix (T0-T3)
   - Required controls per tier
   - Evidence file schemas

4. **SparkData_SOP_v5.2.1_Gold_Standard_Final.docx**
   - Master SOP (7,014 lines)
   - Five Pillars framework
   - Full regulatory compliance details

---

## 🎯 KEY FRAMEWORK COMPONENTS

### The Five Pillars (Core Principles)

1. **Reproducibility** - Deterministic outputs, documented steps
2. **Observability** - Full audit trails, decision logging
3. **Idempotency** - Repeatable processes
4. **Progressive Context** - Build context systematically
5. **Independent Verification** - Multi-agent validation

### Risk Tier System

| Tier | Name     | Examples                              | Controls Required                    |
|------|----------|---------------------------------------|--------------------------------------|
| T0   | Low      | Docs, comments, non-prod scripts      | Builder only (optional review)       |
| T1   | Medium   | Non-core features, UI, minor pipelines| Builder → Adversarial Reviewer       |
| T2   | High     | Core logic, data models, key pipelines| Builder → Verification + 1 Lens      |
| T3   | Critical | Security, PII, billing, regulatory    | 4 Lenses + Devil's Advocate + Multi-model |

**Default**: T1 (when in doubt, choose higher tier)

### Multi-Agent Workflow

```
Planner → Builder → Reviewer → Verification → Lenses → Decision Logging → Scorecards
```

**Agent Roles**:
- **Planner** - Design implementation approach
- **Builder** - Write code + tests
- **Adversarial Reviewer** - Blind review (no Builder explanation)
- **Verification** - Independent validation
- **4 Lenses** (T3 only):
  1. Security-First
  2. Performance-First
  3. Maintainability-First
  4. Resilience-First
  5. Data-Quality-First (pipelines)
- **Devil's Advocate** - Triggered when agreement >80%

---

## 🔒 CRITICAL RULES (Non-Negotiable)

### Fresh Chat Separation

```
⛔ NEVER use Reviewer/Verification in the same chat as Builder
✅ ALWAYS start new chat for review roles
```

**Why**: Prevents models from anchoring to previous reasoning (sycophancy avoidance)

### Blind Review Protocol

**Reviewers See**:
- ✅ Requirement/spec
- ✅ Code diff
- ✅ Tool outputs (test results, lint, types)

**Reviewers DON'T See**:
- ❌ Builder's explanation
- ❌ Prior chat logs
- ❌ "Here's what I did" prose
- ❌ Summaries from other agents

**Why**: Forces independent evaluation instead of agreement

### Evidence-Based Review

```
❌ BAD:  "Tests pass" (claim)
✅ GOOD: [Paste actual pytest output showing 152 passed]
```

**Why**: Tool outputs are facts; claims are not

### Multi-Model Verification (T3)

**Requirement**: Use at least 2 different model families

| Family    | Models                          | Best For              |
|-----------|---------------------------------|-----------------------|
| Anthropic | Claude Opus 4, Sonnet 4, Haiku 4| Planning, Code Review |
| OpenAI    | GPT-5 Codex, GPT-4o, o1-pro     | Implementation, Perf  |
| Google    | Gemini 2.0 Pro/Ultra            | Alternative view      |

**Why**: Different training data = different blind spots

---

## 📊 REGULATORY ALIGNMENT

### AICPA QM (Quality Management Standards)

**Required**: Risk-based quality controls, monitoring, remediation

**Our Implementation**:
- Risk Tier System (T0-T3)
- Structured Decision Logging
- Automated Quality Feedback Loop
- Model Scorecards (90-day rolling metrics)

### EU AI Act

**Required**: Technical documentation, logging, human oversight, transparency

**Our Implementation**:
- JSON decision logs with schema
- Human approval gates (T2/T3)
- Complete audit trails
- Model attribution in all outputs

### PCAOB (Audit Quality Guidance)

**Required**: Professional skepticism, independent verification, understanding AI impact

**Our Implementation**:
- Adversarial Review prompts
- Independent Verification Agent
- Blind review (no Builder access)
- Devil's Advocate for suspicious agreement

---

## 🛠️ OPERATIONAL TOOLS

### IDE Quick Prompts (10 Prompts)

1. **Builder Mode** - Implement change + tests
2. **Reviewer Mode** - Adversarial review (blind)
3. **Verification Mode** - Independent validation (T2+)
4. **Security-First Lens** - Security review
5. **Performance-First Lens** - Performance review
6. **Maintainability-First Lens** - Maintainability review
7. **Resilience-First Lens** - Resilience review
8. **Devil's Advocate** - Challenge consensus
9. **Differential Comparison** - Compare model outputs
10. **Data-Quality-First Lens** - Pipeline data quality

### Evidence Files (Required Artifacts)

| File | Purpose | Required For |
|------|---------|--------------|
| `test_evidence.txt` | Test results | T1+ |
| `lint_evidence.txt` | Linter output | T1+ |
| `types_evidence.txt` | Type checker output | T1+ |
| `DECISION_*.json` | AI decision record | T2+ |
| `VERIFICATION_*.md` | Verification report | T2+ |
| `PERSPECTIVE_*.md` | Lens review output | T2+ (1 lens), T3 (4 lenses) |
| `COMPARISON_*.md` | Differential analysis | T3 |
| `CONSENSUS_*.md` | Multi-model consensus | T3 |

### Decision Log Schema

```json
{
  "decision_id": "DECISION_2025-11-30T10-30-00Z_abc123",
  "tier": "T2",
  "timestamp": "2025-11-30T10:30:00Z",
  "models": [
    {"name": "claude-opus-4", "role": "builder"},
    {"name": "gpt-5-codex", "role": "verification"}
  ],
  "risk_score": 3,
  "verdict": "APPROVE_WITH_CONDITIONS",
  "issues": [
    {"severity": "medium", "category": "performance", "description": "N+1 query"}
  ],
  "conditions": ["Add caching"],
  "human_override": {"status": "none", "approver": null, "notes": null}
}
```

---

## 🚨 COMMON PITFALLS (Sycophancy Prevention)

### The "LLM Echo Chamber" Problem

**Issue**: Models agree with each other instead of critically reviewing

**Symptoms**:
- All reviewers raise the same 2-3 issues
- No unique concerns identified
- Risk scores within 1 point of each other
- Reviews read like paraphrases

**Prevention**:
1. Fresh chat separation (structural independence)
2. Blind review (no Builder context)
3. Different model families (T3)
4. Devil's Advocate (triggered at >80% agreement)

### Agreement Measurement

**>80% Agreement Triggers Devil's Advocate**:

| Method | Threshold | Calculation |
|--------|-----------|-------------|
| Issue Overlap | >80% | (common issues) / (total unique issues) |
| Risk Score Spread | <1.0 | max(scores) - min(scores) |
| Jaccard Similarity | >0.8 | On (severity, category, location) tuples |

**Simple Rule**: If all reviewers say essentially the same thing, trigger Devil's Advocate

---

## 📋 DAILY WORKFLOW EXAMPLE

### T1 Change (Default - Most Common)

```
1. Paste Risk Tier Declaration (T1)
2. Chat A: Run Builder prompt → implement + tests
3. Run: make evidence → collect test/lint/types outputs
4. ⚠️ NEW CHAT B: Run Adversarial Reviewer
   - Paste: spec + diff + tool outputs (NO Builder explanation)
5. Address issues
6. Human approves → merge
```

**Time**: ~30 min additional investment
**Benefit**: Higher quality, fewer post-merge bugs

### T3 Change (Critical - Security/PII/Billing)

```
1. Paste Risk Tier Declaration (T3)
2. Chat A (Claude): Builder prompt
3. Run: make evidence
4. ⚠️ NEW CHAT B (GPT-4): ALL 4 Lenses
5. Check agreement: >80%? → Devil's Advocate
6. ⚠️ NEW CHAT C (Gemini): Differential Comparison
7. Save 4x PERSPECTIVE_*.md + COMPARISON_*.md
8. Create DECISION_*.json (list all 3 model families)
9. Senior Engineer + Compliance sign-off → merge
```

**Time**: ~2-4 hours additional investment
**Benefit**: Comprehensive validation, audit trail, regulatory compliance

---

## 🎯 HOW THIS APPLIES TO YOUR PROJECT

### Platform Provider Data Analysis Project

**Tier Assessment**: **T2 (High)** - Core data pipeline and analysis

**Why T2**:
- ✅ Core business logic (data processing)
- ✅ Data model changes (database schema)
- ✅ Key pipeline stages (JSONL → Database import)
- ⚠️ NOT T3: No PII, billing, or security-sensitive auth

**Required Controls for This Project**:
1. Planner Agent (design database schema + UI architecture)
2. Builder Agent (implement import script + UI)
3. Independent Verification Agent (validate data integrity)
4. At least 1 Lens:
   - **Data-Quality Lens** (REQUIRED for pipelines)
   - **Performance Lens** (recommended for 2.5GB import)

### Workflow for Database UI Development

```
Phase 1: Database Schema (T2)
├─ Chat A: Builder → design schema + indexes
├─ Run: make evidence (test schema creation)
├─ NEW CHAT B: Verification → validate schema design
└─ NEW CHAT C: Data-Quality Lens → check for pipeline issues

Phase 2: Import Script (T2)
├─ Chat A: Builder → implement streaming JSONL import
├─ Run: make evidence (test import with sample data)
├─ NEW CHAT B: Verification → validate import logic
└─ NEW CHAT C: Performance Lens → check for bottlenecks

Phase 3: Web UI (T1 per component)
├─ Chat A: Builder → implement dashboard
├─ Run: make evidence (test UI components)
└─ NEW CHAT B: Adversarial Reviewer → check UX issues
```

### Evidence Files You Need

```
/project-root/
├── logs/ai-decisions/
│   ├── DECISION_2025-11-30_schema-design.json
│   ├── DECISION_2025-11-30_import-script.json
│   └── DECISION_2025-11-30_ui-dashboard.json
├── reports/
│   ├── VERIFICATION_schema-design.md
│   ├── VERIFICATION_import-script.md
│   ├── PERSPECTIVE_data-quality_import-script.md
│   └── PERSPECTIVE_performance_import-script.md
└── evidence/
    ├── test_evidence_schema.txt
    ├── test_evidence_import.txt
    └── test_evidence_ui.txt
```

---

## 📖 RECOMMENDED READING ORDER

For someone new to this framework:

1. **Start here**: CEO Memo (SparkData_CEO_Memo_v5.2.1)
   - Understand the "why" and big picture
   - Rationale for proactive governance

2. **Next**: Risk Tier Table (SparkData_Risk_Tier_Table_v2.2)
   - Learn how to assess risk
   - Understand required controls per tier

3. **Daily use**: IDE Quick Prompts (SparkData_IDE_Quick_Prompts_v2.2)
   - Copy-paste these into your IDE
   - Bookmark for quick reference

4. **Deep dive**: SOP (SparkData_SOP_v5.2.1)
   - Full regulatory details
   - Reference when questions arise

---

## 🔗 INTEGRATION WITH WEB_UI_CONTEXT_PROMPT.md

The **WEB_UI_CONTEXT_PROMPT.md** file provides:
- Database schema for the platform provider data
- UI/UX requirements
- Technical implementation details
- Critical Gemini data handling rules

**Use both together**:
- **Framework docs** (this analysis) → HOW to build with quality controls
- **Context prompt** → WHAT to build (technical specs)

**Example**:
```
1. Read WEB_UI_CONTEXT_PROMPT.md → understand requirements
2. Declare Tier: T2 (database + core pipeline)
3. Use Builder prompt to design schema
4. Use Verification + Data-Quality Lens to validate
5. Document in DECISION_*.json with model attribution
```

---

## 📝 QUICK REFERENCE CARD

```
┌─────────────────────────────────────────────────────────────┐
│ SPARKDATA FRAMEWORK QUICK REFERENCE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ RISK TIERS (when in doubt, go higher):                      │
│ T0: Docs only                                               │
│ T1: Non-core features (DEFAULT)                             │
│ T2: Core logic, data models, pipelines                      │
│ T3: Security, PII, billing, regulatory                      │
│                                                             │
│ CRITICAL RULES:                                             │
│ 🔴 Fresh chat for each review role                         │
│ 🔴 Blind review (no Builder explanation)                   │
│ 🔴 Evidence-based (paste tool outputs)                     │
│ 🔴 Multi-model for T3                                       │
│                                                             │
│ WORKFLOW:                                                   │
│ 1. Declare tier                                            │
│ 2. Builder (Chat A)                                         │
│ 3. Collect evidence (terminal)                             │
│ 4. Reviewer/Verification (NEW Chat B)                      │
│ 5. Lenses if T2+ (NEW Chat C)                              │
│ 6. Decision log                                            │
│ 7. Human approval                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎓 KEY TAKEAWAYS

1. **Proactive Governance**: Align with emerging standards NOW, not when forced
2. **Structural Independence**: Fresh chat separation prevents sycophancy
3. **Evidence Over Claims**: Only tool outputs are facts
4. **Risk-Based Approach**: Higher risk = more perspectives + stronger evidence
5. **Human Oversight**: AI assists, humans decide
6. **Complete Audit Trails**: Every AI decision logged with model attribution
7. **Continuous Improvement**: Model scorecards track quality over time

---

**END OF FRAMEWORK ANALYSIS**

**Created**: 2025-11-30
**For**: SC KMH Platform Provider Project Context
**Source**: 4 SparkData AI Development Framework documents

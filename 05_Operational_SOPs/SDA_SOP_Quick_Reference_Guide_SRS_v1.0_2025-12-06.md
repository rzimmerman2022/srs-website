# SDA Quick Reference Guide: SRS Management System
## Human-Facing Quick Start + SDA Framework Reference (v5.2.1)

**Project:** SRS Management System (00_SRS_MANAGEMENT_SYSTEM)
**Framework:** SparkData Analytics AI Development Framework v5.2.1
**Version:** 2.0 (SDA Compliant)
**Effective Date:** 2025-12-06
**Owner:** Ryan Zimmerman, CEO Southwest Resume Services

---

## 🚀 Quick Start - Copy This to New AI Session

```
You are continuing work on the SRS Management System project.

CRITICAL: Before starting ANY work, initialize yourself with complete project context
following SparkData SOP v5.2 Progressive Context principles.

Read these files IN ORDER:

1. Framework Rules (FIRST - MANDATORY):
   - Claude (Anthropic): CLAUDE.md - Auto-loaded by Claude Code
   - GPT (OpenAI): .github/copilot-instructions.md - MUST READ MANUALLY
   - Gemini (Google): CLAUDE.md - MUST READ MANUALLY

2. Initialization SOP: docs/SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md
   - Complete 12-section initialization protocol (added Section 12: Quick Wins)
   - Section 2.5: Mandatory session completion protocol (5 artifacts)

3. Most Recent Handoff:
   ls -lt docs/handoffs/HANDOFF_*.md | head -1
   (Read that file for previous session context)

4. Project Status: MASTER_TODO.md
   - Current phase, pending tasks, blockers

5. Recent Changes: CHANGELOG.md
   - Read last 200 lines for project evolution

THEN: Follow initialization checklist in Section 7 of the SOP.

DO NOT start coding until:
- Initialization complete (Sections 1-10)
- Executive summary provided
- User approval received
```

---

## 📋 What This Document Is

**Purpose:** Official handoff template for ALL AI models working on SRS Management System

**Replaces:**
- ❌ Old `01-HANDOFFS/AI_INITIALIZATION_GUIDE.md` (pre-SDA, deprecated)
- ❌ Ad-hoc handoff formats (inconsistent, no session completion)

**Aligns With:**
- ✅ [docs/SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md](SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md) - 11-section protocol
- ✅ [CLAUDE.md](../CLAUDE.md) - 4,200+ lines AI coding rules
- ✅ [.github/copilot-instructions.md](../.github/copilot-instructions.md) - 2,400+ lines GPT rules
- ✅ SparkData Analytics Framework v5.2.1 (Five Pillars, risk tiers T0-T3)

---

## 1️⃣ Framework Awareness (CRITICAL - DO THIS FIRST)

### Read Your Model-Specific Instructions BEFORE Proceeding

**⚠️ MANDATORY: These override general AI training**

#### If You Are Claude (Anthropic)
- ✅ **Read:** [CLAUDE.md](../CLAUDE.md) - Auto-loaded by Claude Code
- 📋 **Your Role:** REVIEWER / ORCHESTRATOR
- 🎯 **Best For:** Planning, code review, security analysis, architecture design
- 🔄 **Use You For:** Independent verification, security lenses, orchestration

#### If You Are GPT (OpenAI / GitHub Copilot)
- ✅ **Read:** [.github/copilot-instructions.md](../.github/copilot-instructions.md) - MUST READ MANUALLY
- 📋 **Your Role:** BUILDER / IMPLEMENTER
- 🎯 **Best For:** Code generation, optimization, testing, refactoring
- 🔄 **Use You For:** Feature development, test creation, performance optimization

#### If You Are Gemini (Google)
- ✅ **Read:** [CLAUDE.md](../CLAUDE.md) - MUST READ MANUALLY
- 📋 **Your Role:** ALTERNATIVE LENS / VALIDATOR
- 🎯 **Best For:** Second opinion, data analysis, resilience review
- 🔄 **Use You For:** Multi-model verification, alternative perspectives, statistical validation

### Why This Matters

These files contain **project-specific rules that override general training:**
- **ADR-001:** Never use tracker JSON as input (rebuild from PARTICIPANTS/)
- **ADR-007:** 42-column schema required (100% field population)
- **Privacy Rule:** Gmail sync MUST filter to Andrew Beam only (T3 critical)
- **Risk Tiers:** T0-T3 with progressive controls
- **Fresh Chat Separation:** NEVER review in same chat as build (NON-NEGOTIABLE)

---

## 2️⃣ Fresh Chat Verification (SDA Rule #1)

### ⛔ STOP: Is This a Fresh Chat?

Before reading ANY handoffs or context, answer:

**Are you in a FRESH CHAT with NO prior messages in this conversation?**

- ✅ **YES** → This is a new chat session (proceed with initialization)
- ❌ **NO** → This chat contains previous Builder/Reviewer context

#### If NO (Chat Has Prior Context)

Ask the user immediately:

```
I see this chat has prior messages. Am I:
A) Continuing as the Builder from the previous session?
B) Acting as an independent Reviewer?
C) Something else?
```

**If you are a Reviewer:**
- ⛔ **STOP READING** this initialization guide
- **Request ONLY:** Spec + Diff + Evidence file
- **DO NOT** read prior chat history, Builder explanations, or handoffs
- **DO NOT** see Builder's reasoning or trade-offs
- **This is SDA Rule #1: Fresh Chat Separation (NON-NEGOTIABLE)**

**If you are continuing as Builder:**
- ✅ Proceed with initialization below
- You are building on your own prior work (safe to see context)

### Why This Matters

- Reviewers who see Builder explanations will **summarize instead of independently evaluating**
- This is the **#1 cause of "hallucinated consensus"** (echo chamber failure)
- Aligns with **PCAOB audit independence standards**

---

## 3️⃣ Critical Project Context (Must Know)

### ADR-001: Authoritative Sources Only

**❌ NEVER use previous tracker files as inputs**

**✅ ALWAYS rebuild from:**
- Gmail Markdown exports: `PARTICIPANTS/001_AB_Andrew-Beam/00-AUTHORITATIVE-SOURCES/01-EMAIL-DATA/`
- Git repository: `PARTICIPANTS/001_AB_Andrew-Beam/03-GIT-REPOS/practicum-repo/`
- Google Drive API: `PARTICIPANTS/001_AB_Andrew-Beam/00-AUTHORITATIVE-SOURCES/02-GOOGLE-DRIVE/`

**Why:** Prevents error propagation. Each tracker build is a fresh parse of ground truth.

### ADR-007: Exhaustive Schema Enforcement

All tracker builds MUST populate **all 42 columns** per `SOURCE_TO_TARGET_MAPPING v2.0`:
- Source Identification (6 cols)
- Classification Schema (8 cols)
- Performance Grading (4 cols)
- Management Tracking (6 cols)
- Extended Metadata (18 cols)

**No partial schemas allowed.** 100% field population required.

### Privacy Rule (T3 Critical)

Gmail sync MUST filter to Andrew Beam only:

```python
query = "from:andrewjbeam@gmail.com OR to:andrewjbeam@gmail.com"
```

**NEVER** sync without this filter. Violates privacy (T3 critical).

### Dual Export Always

Every tracker build exports:
- **CSV** (humans can read in Excel/Power BI)
- **JSON** (machines can parse losslessly)
- **SHA-256 manifest** (audit trail, parity verification)

---

## 4️⃣ Current Project State (As of Dec 6, 2025)

### Phase Status
- **Current:** Phase 8j (Critical Infrastructure Rebuild + Session Completion Protocol) - **COMPLETE**
- **Next:** Grading Validation Audit (W1D1-W2D4 spot-check for missing deliverables)

### Data Infrastructure (100% Complete)

| Component | Status | Details |
|-----------|--------|---------|
| Business Gmail | ✅ **LIVE** | Synced Dec 5, 283 messages, 194 attachments |
| Personal Gmail | ✅ **LIVE** | OAuth refreshed Dec 6, 43 threads, 84 messages, 140 attachments |
| Drive API | ✅ **LIVE** | 74 files exported (was 8 hardcoded) - **+825% increase** |
| Git Repo | ✅ Current | Last commit Nov 17, up to date with remote |
| Tracker | ✅ **2,909 rows** | Built Dec 6, 42 columns (ADR-007 compliant), **+18% from complete data** |

### Data Completeness Metrics

| Source | Before (Dec 5) | After (Dec 6) | Change |
|--------|----------------|---------------|---------|
| EMAIL_MESSAGE | 714 | 1,500 | +786 (+110%) |
| EMAIL_ATTACHMENT | 491 | 1,291 | +800 (+163%) |
| DRIVE_UPLOAD | 8 (hardcoded) | 74 (API) | **+66 (+825%)** |
| GIT_FILE | 0 | 9 | +9 (NEW) |
| **TOTAL ROWS** | **2,471** | **2,909** | **+438 (+18%)** |

### Grading Status

| Period | Coverage | Status |
|--------|----------|--------|
| Diagnostics (Pre-W1) | 3/3 graded | Task 1 (88%), Task 2 (91%), Task 3 (90%) |
| W1D1-W1D5 | 5/5 graded | 84%, 84%, 86%, 88%, 82% (avg 84.8%) |
| W2D1-W2D4 | ⚠️ **PENDING VALIDATION** | Need audit (26 Drive uploads + 800 attachments invisible during original grading) |
| W2D5-W4D5 | 15/15 graded | W4D3-W4D5 validated (no missing deliverables) |

**Critical Discovery (Dec 6):**
- Original grading (Nov 26 - Dec 5) used **incomplete data**
- Missing: 66 Drive files, 800 email attachments, 43 personal Gmail threads
- **Next task:** Systematic validation audit to check if missing data affects W1-W2D4 grades

---

## 5️⃣ Session Completion Protocol (MANDATORY)

### ⚠️ Section 2.5 of SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md

**When you complete work, you MUST create these 5 artifacts:**

### 1. Progress Report
- **File:** `PROGRESS_YYYY-MM-DD_HH-MM-SS_<model>_<session-id>.md`
- **Sections:** 9 required (Metadata, Objectives, Decisions, Code Changes, Testing, Knowledge Gained, Obstacles, Context, Continuation Plan)
- **Purpose:** Comprehensive session documentation

### 2. State Serialization JSON
- **File:** `state/session_YYYY-MM-DD_HH-MM-SS_<model>_<session-id>.json`
- **Content:** Cognitive context, decision log, file state, continuation plan
- **Purpose:** Machine-readable session state for next model

### 3. Handoff Document
- **File:** `docs/handoffs/HANDOFF_YYYYMMDD_<from-model>_<to-model>-<task>.md`
- **Content:** Executive summary, what changed, next steps, automation recommendations
- **Purpose:** Transfer knowledge to next model (GPT-5, Claude, Gemini)

### 4. Project Tracking Updates
- **Files:** `MASTER_TODO.md`, `CHANGELOG.md`
- **Update:** Add phase section, mark tasks complete, document blockers
- **Purpose:** Single source of truth for project status

### 5. Verification Checklist
- [ ] Progress report exists and is comprehensive
- [ ] State JSON contains cognitive context + decision log
- [ ] Handoff doc includes executive summary + next steps
- [ ] MASTER_TODO.md updated with current phase
- [ ] CHANGELOG.md contains phase entry
- [ ] All files committed to Git

**NO EXCEPTIONS.** Section 2.5 is mandatory for ALL sessions.

**See:** [docs/SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md](SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md) Section 2.5 for full protocol

---

## 6️⃣ Risk Tier System (T0-T3)

### Use This to Decide Verification Requirements

| Tier | Examples | Impact | Controls |
|------|----------|--------|----------|
| **T0** | Docs, comments, README | Low (cosmetic) | Builder only (review optional) |
| **T1** | Dashboard charts, CSV export format | Medium (UX affected) | Builder → Reviewer (fresh chat) |
| **T2** | Tracker builder, enrichment merge, grading | High (data integrity) | Builder → Verification → Data-Quality Lens |
| **T3** | Gmail OAuth, schema migration, privacy filter | Critical (security/compliance) | 4 Lenses → Multi-model → Approval |

**When in doubt, choose the HIGHER tier.** Extra review is cheap insurance.

### Risk Tier Decision Tree

```
START: What are you working on?
│
├─ Docs, comments, README? → T0 (Builder only, review optional)
│
├─ Dashboard, CSV export, UI? → T1 (Builder + Reviewer in fresh chat)
│
├─ Tracker parser, enrichment merge, grading algorithm?
│  └─ Does it affect data integrity or permanent record? → T2 (Builder + Verification + Lens)
│
└─ Gmail OAuth, schema migration, privacy filter, grading criteria change?
   └─ Does it affect security, privacy, or compliance? → T3 (4 Lenses + Multi-model + Approval)

When in doubt → Choose HIGHER tier (T1 over T0, T2 over T1, T3 over T2)
```

---

## 7️⃣ Typical Workflows

### Workflow 1: Daily Sync + Rebuild (T1)

```bash
# 1. Sync all sources
python tools/gmail/sync_gmail.py --account business
python tools/gmail/sync_gmail.py --account personal
cd PARTICIPANTS/001_AB_Andrew-Beam/03-GIT-REPOS/practicum-repo && git pull

# 2. Copy Drive API export (if updated)
cp tools/drive/active/ANDREW_BEAM_DRIVE_UPLOADS_API_EXPORT.csv \
   PARTICIPANTS/001_AB_Andrew-Beam/00-AUTHORITATIVE-SOURCES/02-GOOGLE-DRIVE/drive_uploads_$(date +%Y%m%d).csv

# 3. Rebuild tracker
python tools/tracker/build_tracker_phase7.py

# 4. Validate
python3 << 'EOF'
import json
with open('ANDREW_BEAM_TRACKER__PHASE7__*.json') as f:
    tracker = json.load(f)
print(f"Total rows: {len(tracker)}")
print(f"Expected: 2,909 rows (as of Dec 6, 2025)")
EOF
```

**Controls:** Builder (sync + rebuild) → Reviewer (validate date range, row counts)

### Workflow 2: Grade New Days (T2)

```bash
# 1. Ensure tracker current (run Workflow 1 first)

# 2. Read debrief threads for new days
find PARTICIPANTS/.../01-EMAIL-DATA/ -name "2025-12-*" -type d

# 3. Apply Daily Holistic Grading v1.0
# - Read docs/grading/DAILY_HOLISTIC_GRADING_METHODOLOGY__v1.0.md
# - Use 6-category rubric (Completeness, Quality, Debrief, Process, Timeliness, Learning)
# - Create DAILY_ENRICHMENT__YYYYMMDD_<model>_HOLISTIC_vX.Y.csv

# 4. Merge grading into tracker
python tools/enrichment/merge_manual_enrichment_v3.py \
  DAILY_ENRICHMENT__*.csv \
  ANDREW_BEAM_TRACKER__*.json
```

**Controls:** Builder (grade) → Verification (quote check, rubric math) → Data-Quality Lens (schema validation)

### Workflow 3: Implement New Feature (T2)

```bash
# 1. Declare risk tier (!tier snippet in VS Code)

# 2. Build feature + tests (TDD)
# - Write tests FIRST
# - Implement feature
# - Run ./scripts/make_evidence.sh

# 3. Create handoff for review
# - Use !build snippet
# - Paste spec + diff + evidence file

# 4. Review in FRESH CHAT (different model if possible)
# - Use !review snippet
# - Paste spec + diff + evidence ONLY (no builder explanations)

# 5. Iterate if needed, then merge
```

**Controls:** Builder → Reviewer (fresh chat) → Optional Lens (if T2/T3)

---

## 8️⃣ Key Files Reference

### Framework Documentation
- **[CLAUDE.md](../CLAUDE.md)** - AI coding rules (4,200+ lines, auto-loaded by Claude Code)
- **[.github/copilot-instructions.md](../.github/copilot-instructions.md)** - GPT-specific instructions (2,400+ lines)
- **[docs/SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md](SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md)** - Complete 11-section protocol
- **[SDA_IMPLEMENTATION_GUIDE.md](../SDA_IMPLEMENTATION_GUIDE.md)** - User guide (7,500+ lines)

### Data Pipeline Tools
- **[tools/gmail/sync_gmail.py](../tools/gmail/sync_gmail.py)** - Gmail → Markdown converter
- **[tools/tracker/build_tracker_phase7.py](../tools/tracker/build_tracker_phase7.py)** - Tracker builder (all sources)
- **[tools/enrichment/merge_manual_enrichment_v3.py](../tools/enrichment/merge_manual_enrichment_v3.py)** - Grading merge (v3 schema)
- **[tools/dashboards/generate_dashboards.py](../tools/dashboards/generate_dashboards.py)** - Dashboard generation

### Grading Documentation
- **[docs/grading/DAILY_HOLISTIC_GRADING_METHODOLOGY__v1.0.md](grading/DAILY_HOLISTIC_GRADING_METHODOLOGY__v1.0.md)** - 6-category rubric (AUTHORITATIVE)
- **[docs/rubrics/AUTHORITATIVE_GRADING_RUBRIC__v2.0.md](../docs/rubrics/AUTHORITATIVE_GRADING_RUBRIC__v2.0.md)** - Complete rubric specification
- **[docs/schemas/ENRICHMENT_SCHEMA_SPEC__v3.0.md](../docs/schemas/ENRICHMENT_SCHEMA_SPEC__v3.0.md)** - AI grading schema (17 required fields)

### Project Tracking
- **[MASTER_TODO.md](../MASTER_TODO.md)** - Single source of truth for tasks
- **[CHANGELOG.md](../CHANGELOG.md)** - Complete project timeline

---

## 9️⃣ Common Pitfalls (Avoid These!)

### 1. Using Old Tracker as Input (Violates ADR-001)

**❌ WRONG:**
```python
old_tracker = pd.read_csv("ANDREW_BEAM_TRACKER__20251205.csv")
new_data = append_new_rows(old_tracker, new_emails)
```

**✅ CORRECT:**
```python
# Always rebuild from authoritative sources
tracker = build_tracker_from_sources(
    gmail_path="PARTICIPANTS/.../01-EMAIL-DATA/",
    git_path="PARTICIPANTS/.../03-GIT-REPOS/",
    drive_path="PARTICIPANTS/.../02-GOOGLE-DRIVE/"
)
```

### 2. Reviewing in Same Chat as Building (Violates SDA)

- **❌ WRONG:** Claude builds feature → Claude reviews own code in same chat
- **✅ CORRECT:** Claude builds feature → NEW chat with GPT-5 reviews (fresh perspective)

### 3. Claiming "Tests Pass" Without Evidence

- **❌ WRONG:** "I ran pytest and all tests passed."
- **✅ CORRECT:**
```bash
./scripts/make_evidence.sh
# Then paste actual output from evidence/evidence_*.txt
```

### 4. Skipping Session Completion Protocol

- **❌ WRONG:** Complete work → Close session (no handoff)
- **✅ CORRECT:** Complete work → Create 5 artifacts (Section 2.5 mandatory)

### 5. Grading Without All Sources

- **❌ WRONG:** Grade W1D1 using only Gmail data (missing Drive uploads)
- **✅ CORRECT:** Grade W1D1 using Email + Git + Drive + Attachments (Daily Holistic Grading v1.0)

---

## 🔟 Available VS Code Snippets

Type these in VS Code for instant prompts:

- `!tier` - Declare risk tier for upcoming work
- `!build` - Builder mode prompt
- `!review` - Reviewer mode prompt
- `!verify` - Independent verification prompt
- `!dataquality` - Data quality lens prompt
- `!security` - Security lens prompt
- `!decision-log` - Create DECISION_*.json template
- `!grade-row` - Grade single deliverable (v3 schema)
- `!evidence-script` - Run evidence capture

**File:** [.vscode/srs-snippets.code-snippets](../.vscode/srs-snippets.code-snippets)

---

## 1️⃣1️⃣ Initialization Steps (Follow SOP Sections 1-11)

### Step 1: Read Framework Rules (Section 1)
- **Claude:** [CLAUDE.md](../CLAUDE.md) is auto-loaded
- **GPT:** Read [.github/copilot-instructions.md](../.github/copilot-instructions.md)
- **Gemini:** Read [CLAUDE.md](../CLAUDE.md) manually

### Step 2: Fresh Chat Verification (Section 2)
- Confirm this is a fresh chat (if reviewing)
- If not, ask user: Builder continuation or Reviewer role?

### Step 3: Project Overview (Section 3)
- Read README.md, CHANGELOG.md, MASTER_TODO.md
- Note current phase (Phase 8j complete)

### Step 4: Previous Session Context (Section 4)
- Find most recent handoff for YOUR model
- Read progress report and state JSON

### Step 5: Current Project State (Section 5)
- Run `git status`, `git log --oneline -10`
- Run `./scripts/make_evidence.sh` (if applicable)

### Step 6: Knowledge Base Integration (Section 6)
- Read ADRs (ADR-001, ADR-007)
- Note lessons learned

### Step 7: Synthesis and Confirmation (Section 7)
- **A.** Executive Summary (2-3 paragraphs)
- **B.** Context Verification Checklist (all boxes checked)
- **C.** Working Memory State (mental model, patterns, uncertainties, assumptions)
- **D.** Risk Tier Declaration (T0/T1/T2/T3 + justification)
- **E.** Action Plan (next 3 steps with commands, time estimates, evidence)

### Step 8: Questions Before Starting (Section 8)
- Ask about contradictions, unclear items, missing files, outdated info

### Step 9: Model-Specific Context (Section 9)
- Acknowledge patterns you've established (Claude/GPT/Gemini specific)

### Step 10: SDA Framework Compliance Check (Section 10)
- Confirm all 13 checklist items

### Step 11: Final Confirmation (Section 11)
**"I am ready to proceed. Please confirm before I start work."**

---

## 1️⃣2️⃣ Help & Troubleshooting

### "I'm confused about my role"
- Check [model-specific section](#1%EF%B8%8F%E2%83%A3-framework-awareness-critical---do-this-first) above
- Claude = Reviewer/Orchestrator
- GPT = Builder/Implementer
- Gemini = Alternative Lens/Validator

### "Where's the most recent handoff?"
```bash
ls -lt docs/handoffs/HANDOFF_*.md | head -1
```
Read that file for context from previous session.

### "What's the current task?"
Read [MASTER_TODO.md](../MASTER_TODO.md) - single source of truth for all tasks.

### "I need to review code - same chat or new?"
**NEW CHAT ALWAYS.** Fresh chat separation is non-negotiable (SDA Framework).

### "Tests pass, can I commit?"
**NO.** Run `./scripts/make_evidence.sh` first, then paste actual output. No prose claims.

### "I finished work - what now?"
**Create 5 artifacts** per [Section 2.5](#5%EF%B8%8F%E2%83%A3-session-completion-protocol-mandatory). Mandatory, no exceptions.

---

## 1️⃣3️⃣ The Five Pillars (SparkData Framework)

1. **Reproducibility** - All decisions logged with model metadata
2. **Observability** - Tool outputs are evidence, not prose claims
3. **Idempotency** - Fresh reviews prevent context contamination
4. **Progressive Context** - Risk tiers (T0-T3) scale verification requirements
5. **Independent Verification** - Structural separation prevents hallucinated consensus

---

## 1️⃣4️⃣ Quick Reference Commands

### Evidence Capture
```bash
./scripts/make_evidence.sh
cat evidence/evidence_*.txt | pbcopy  # macOS clipboard
```

### Tracker Operations
```bash
# Build from sources (T2)
python tools/tracker/build_tracker_phase7.py

# Merge grading (T2)
python tools/enrichment/merge_manual_enrichment_v3.py \
  DAILY_ENRICHMENT__*.csv ANDREW_BEAM_TRACKER__*.json

# Generate dashboards (T1)
python tools/dashboards/generate_dashboards.py
```

### Gmail Sync (T3 - Privacy filter enforced)
```bash
python tools/gmail/sync_gmail.py --account business
python tools/gmail/sync_gmail.py --account personal
```

### Git Operations
```bash
git status -sb
git log --oneline -10
git diff --stat
git add [files]
git commit -m "feat(scope): description

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: [Model] <noreply@anthropic.com>"
```

---

## 1️⃣5️⃣ Next Session Instructions

**When starting your next AI session, paste this:**

```
You are continuing work on the SRS Management System project.

CRITICAL: Read these files IN ORDER before starting:

1. CLAUDE.md (if Claude) OR .github/copilot-instructions.md (if GPT)
2. docs/SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md (11-section protocol)
3. Most recent handoff: ls -lt docs/handoffs/HANDOFF_*.md | head -1
4. MASTER_TODO.md (current tasks)
5. CHANGELOG.md (last 200 lines)

THEN: Follow SDA initialization checklist (Sections 1-11).
DO NOT start coding until initialization complete and user approval received.
```

**The AI will:**
1. ✅ Read framework rules automatically
2. ✅ Initialize following SOP checklist (11 sections)
3. ✅ Ask for your approval before starting work
4. ✅ Follow risk tier controls (T0-T3)
5. ✅ Create 5 mandatory artifacts when completing session (Section 2.5)

**You'll NEVER lose context between sessions again!** 🎉

---

**End of Official Handoff Prompt**

**Framework:** SparkData Analytics v5.2.1
**Project:** SRS Management System
**Owner:** Ryan Zimmerman, Southwest Resume Services
**Last Updated:** 2025-12-06
**Next Review:** Q1 2026

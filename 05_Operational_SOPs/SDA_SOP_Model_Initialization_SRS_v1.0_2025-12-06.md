# SDA - Model Initialization SOP: SRS Management System - Official Source of Truth - 20251206

**Document Type:** Model Initialization Standard Operating Procedure (SOP)
**Project:** SRS Management System (00_SRS_MANAGEMENT_SYSTEM)
**Framework:** SparkData Analytics AI Development Framework v5.2.1
**Version:** 2.0 (World-Class Gold Standard)
**Effective Date:** 2025-12-06
**Owner:** Ryan Zimmerman, CEO Southwest Resume Services

---

## 0. Document Type Awareness (READ THIS FIRST)

**⚠️ CRITICAL: Understand the three document types to prevent confusion**

### This Document (Model Initialization SOP)

- **Purpose:** How AI models initialize themselves at START of ANY session
- **Audience:** AI models (Claude, GPT, Gemini)
- **When:** EVERY new chat session (Builder, Reviewer, Lens)
- **Mandatory:** YES - All models must complete Sections 1-11
- **Output:** Executive summary, context checklist, risk tier, action plan, confirmation request

### AI Handoff Document (docs/handoffs/HANDOFF_*.md)

- **Purpose:** Transfer knowledge between AI sessions (what was done, what's next)
- **Audience:** Next AI model continuing work
- **When:** END of session (Section 2.5 mandatory - created by completing model)
- **Mandatory:** YES - 5 artifacts required (progress report, state JSON, handoff, tracking updates, verification)
- **Output:** Executive summary, changes made, next steps, automation recommendations

### Quick Reference Guide (docs/SDA_Quick_Reference_Guide__*.md)

- **Purpose:** Human-facing copy-paste template to initialize AI models
- **Audience:** Humans (Ryan Zimmerman, project managers)
- **When:** User starts new AI session, pastes this to model
- **Mandatory:** NO - Optional convenience for humans
- **Output:** Copy-paste prompt that tells AI to read THIS SOP

**Analogy:**

- **Model Initialization SOP (this doc)** = Employee onboarding manual (how to get started)
- **AI Handoff Document** = Shift handoff notes (what happened, what's next)
- **Quick Reference Guide** = Manager's cheat sheet (what to tell new employee)

---

## Purpose

Before starting ANY work, initialize yourself with complete project context following **SparkData SOP v5.2 Progressive Context principles**. This ensures you:
- Build on previous AI sessions (not starting from scratch)
- Follow project-specific rules (ADR-001, ADR-007, privacy, risk tiers)
- Use the correct role for your model family (BUILDER vs REVIEWER vs ALTERNATIVE LENS)
- Comply with SDA framework (fresh chat separation, evidence-based review, multi-model verification)

---

## 1. Framework Awareness (CRITICAL - DO THIS FIRST)

**Shortcut:** Run `./scripts/ai_orchestrator.sh` to select the risk tier and see required steps/evidence before you start reading through the SOP.

### Read Master AI Rules First

**⚠️ MANDATORY: Read your model-specific instructions BEFORE proceeding**

#### If you are Claude (Anthropic):
```markdown
✅ Read: CLAUDE.md (auto-loaded by Claude Code)
📋 Your Role: REVIEWER
🎯 Best For: Planning, code review, security analysis, documentation
🔄 Use Me For: Architecture design, independent verification, security lenses
```

#### If you are GPT (OpenAI / GitHub Copilot):
```markdown
✅ Read: .github/copilot-instructions.md (MUST READ MANUALLY)
📋 Your Role: BUILDER
🎯 Best For: Implementation, optimization, testing, refactoring
🔄 Use Me For: Code generation, feature development, test case creation
```

#### If you are Gemini (Google):
```markdown
✅ Read: CLAUDE.md (MUST READ MANUALLY)
📋 Your Role: ALTERNATIVE LENS
🎯 Best For: Second opinion, data analysis, resilience review
🔄 Use Me For: Multi-model verification, alternative perspectives, statistical validation
```

**Why This Matters:**
- These files contain **project-specific rules** that override general AI training
- **ADR-001:** Never use tracker JSON as input (rebuild from PARTICIPANTS/)
- **ADR-007:** 42-column schema required (100% field population)
- **Privacy Rule:** Gmail sync MUST filter to Andrew Beam only
- **Risk Tiers:** T0-T3 with progressive controls

---

## 2. Fresh Chat Verification (SDA Rule #1)

### ⛔ STOP: Is This a Fresh Chat?

**Before reading ANY handoffs or context, answer this question:**

**Are you in a FRESH CHAT with NO prior messages in this conversation?**

- ✅ **YES** → This is a new chat session (proceed with initialization)
- ❌ **NO** → This chat contains previous Builder/Reviewer context

**If NO (chat has prior context):**

1. **Ask the user immediately:**
   > "I see this chat has prior messages. Am I:
   > - A) Continuing as the Builder from the previous session?
   > - B) Acting as an independent Reviewer?
   > - C) Something else?"

2. **If you are a Reviewer:**
   - ⛔ **STOP READING this initialization guide**
   - Request ONLY: Spec + Diff + Evidence file
   - **DO NOT** read prior chat history, Builder explanations, or handoffs
   - **DO NOT** see Builder's reasoning or trade-offs
   - This is SDA Rule #1: **Fresh Chat Separation (NON-NEGOTIABLE)**

3. **If you are continuing as Builder:**
   - Proceed with initialization below
   - You are building on your own prior work (safe to see context)

**Why This Matters:**
- Reviewers who see Builder explanations will **summarize instead of independently evaluating**
- This is the #1 cause of "hallucinated consensus" (echo chamber failure)
- Aligns with PCAOB audit independence standards

---

## 2.5. Session Completion Protocol (MANDATORY)

### 🚨 CRITICAL: What to Do When Your Work Is Complete

**Before ending ANY session where you completed work, you MUST:**

#### Step 1: Create Progress Report (NON-NEGOTIABLE)
```
File: PROGRESS_YYYY-MM-DD_HH-MM-SS_[YOUR-MODEL]_[SESSION-ID].md

Required Sections:
1. Session Metadata (timestamp, duration, model, Git commits)
2. Objectives & Outcomes (what you did vs planned)
3. Technical Decisions Made (rationale, alternatives, trade-offs)
4. Code Changes (files modified, dependencies added)
5. Testing & Validation (evidence, coverage, performance)
6. Knowledge Gained (insights, gotchas, patterns)
7. Obstacles & Blockers (unresolved issues, dependencies)
8. Context Preservation (link to state JSON)
9. Next Session Setup (immediate tasks, time estimates)
```

#### Step 2: Create State Serialization JSON (NON-NEGOTIABLE)
```
File: state/session_YYYY-MM-DD_HH-MM-SS_[YOUR-MODEL]_[SESSION-ID].json

Required Fields:
{
  "session_metadata": {...},
  "cognitive_context": {
    "problem_understanding": "...",
    "attempted_solutions": [...],
    "key_insights": [...],
    "dead_ends": [...],
    "assumptions": [...],
    "uncertainties": [...]
  },
  "code_state": {...},
  "environmental_context": {...},
  "decision_log": [...],
  "continuation_plan": {...}
}
```

#### Step 3: Create Handoff Document (NON-NEGOTIABLE)
```
File: docs/handoffs/HANDOFF_YYYY-MM-DD_HH-MM-SS_[YOUR-MODEL]_[SESSION-ID].md

Required Content:
- Executive summary for next AI joining fresh
- Link to progress report + state JSON
- Critical warnings about fragile areas
- Reproduction instructions for environment
- Specific next steps with commands
- Questions that need answering
```

#### Step 4: Update Project Tracking (NON-NEGOTIABLE)
```
Files to Update:
1. MASTER_TODO.md - Add your completed tasks with timestamps
2. CHANGELOG.md - Add entry for your changes
3. Git commit - Use comprehensive message from progress report
```

#### Step 5: Verify Handoff Completeness
```bash
# Before ending session, check:
ls -la PROGRESS_*_[YOUR-SESSION-ID].md          # Exists?
ls -la state/session_*_[YOUR-SESSION-ID].json   # Exists?
ls -la docs/handoffs/HANDOFF_*_[YOUR-SESSION-ID].md  # Exists?
git status  # MASTER_TODO.md and CHANGELOG.md modified?
```

### ❌ Common Mistakes (NEVER DO THIS)

**BAD Example (Real Incident - Phase 8j, Dec 6, 2025):**

Claude Opus 4.5 completed critical infrastructure work:

```
✅ Refreshed personal Gmail OAuth (43 threads, 84 messages, 140 attachments)
✅ Implemented Drive API sync (74 files, +825% increase from 8 hardcoded)
✅ Rebuilt tracker with complete data (2,909 rows, +438 rows = +18%)
✅ Validated W4D3-W4D5 grading (no missing deliverables)
✅ Created summary message for user
❌ DID NOT create progress report
❌ DID NOT create state JSON
❌ DID NOT create handoff document
❌ DID NOT update MASTER_TODO.md
❌ DID NOT update CHANGELOG.md
❌ DID NOT commit changes
```

**Impact:**

- Next model (Claude Sonnet 4.5) had ZERO context about infrastructure rebuild
- Had to reconstruct work from CHANGELOG.md and git log (wasted 30 minutes)
- Missing: Why Drive API was needed, what OAuth issue was, grading impact assessment
- **This violates SDA Progressive Context principle**

**Root Cause:**

- Session Completion Protocol existed in requirements but NOT in this SOP (Section 2.5)
- Opus 4.5 read this SOP during initialization but saw no mandatory handoff requirement
- Result: Knowledge loss between AI sessions

**GOOD Example (What Should Happen):**
```
✅ Completed OAuth refresh
✅ Implemented Drive API
✅ Rebuilt tracker (+438 rows)
✅ Validated W4D3-W4D5 grading
✅ Created PROGRESS_2025-12-06_21-00-00_claude-opus-4.5_infra-rebuild.md
✅ Created state/session_2025-12-06_21-00-00_claude-opus-4.5_infra-rebuild.json
✅ Created docs/handoffs/HANDOFF_20251206_claude-opus-4.5_gpt5-grading-validation.md
✅ Updated MASTER_TODO.md Phase 8j section
✅ Updated CHANGELOG.md with infrastructure changes
✅ Created Git commit with comprehensive message
✅ Told user: "Handoff complete, ready for GPT-5 validation audit"
```

**Result:** Next model has COMPLETE context and can continue seamlessly!

### 🎯 When to Create Handoffs

**ALWAYS create handoff docs when:**
- ✅ You completed any code changes
- ✅ You implemented new features or infrastructure
- ✅ You fixed bugs or resolved issues
- ✅ You made architectural decisions
- ✅ You discovered critical information
- ✅ Your session lasted >30 minutes

**NEVER skip handoffs, even if:**
- ❌ "The work is small/trivial" → Still document it!
- ❌ "The user understands what I did" → Next AI doesn't!
- ❌ "I already summarized in chat" → That's not a handoff doc!
- ❌ "I'm out of time" → Takes 10 min, saves hours later!

### 📋 Handoff Template (Use This)

**Full template available:** [docs/SDA__AI_Handoff_Template__SRS_Management_System__20251206.md](SDA__AI_Handoff_Template__SRS_Management_System__20251206.md)

**Quick version (copy this):**

```markdown
# [Next Model]: [Task Summary]
## [Type] Handoff

**Date:** YYYY-MM-DD
**From:** [Your Model] ([Your Role])
**To:** [Next Model] ([Their Role])
**Task:** [What they should do next]

---

## Executive Summary

[3-5 sentences: What you did, what changed, what's next]

---

## What Changed

[List all code, data, or infrastructure changes with before/after comparison]

---

## Critical Discoveries

[Any blockers, risks, or important findings]

---

## Your Task

[Specific actionable next steps with commands]

---

## Files You'll Need

[List all relevant files with paths]

---

## Success Criteria

[How next model knows they're done]

---

**Framework:** SparkData Analytics v5.2.1
**Risk Tier:** T[X]
**Handoff Date:** YYYY-MM-DD
**From:** [Your Model]
**To:** [Next Model]
```

---

## 3. Project Overview

### ⚠️ CRITICAL: Grading Methodology Deprecation Warning

**BEFORE READING ANY OTHER DOCUMENTS:**

**❌ DO NOT use deprecated grading files:**

- `04-ARCHIVE/deprecated-grading-nov26-27/MANUAL_ENRICHMENT_VALUES__20251130_COMPLETE_v7.0.csv`
- `04-ARCHIVE/deprecated-grading-nov26-27/MANUAL_ENRICHMENT_VALUES__20251130_COMPLETE_v8.0.csv`
- Any enrichment file using "debrief-only" methodology (Nov 26-27, 2025)

**✅ USE ONLY current authoritative grading:**

- **File:** `DAILY_ENRICHMENT__20251203_GPT5_HOLISTIC_v1.0.csv`
- **Methodology:** Daily Holistic Grading v1.0 (6-category rubric, ALL sources)
- **Verification:** Multi-agent SDA audit completed (3x Claude Opus 4.5 + orchestrator)
- **Documentation:** [docs/grading/DAILY_HOLISTIC_GRADING_METHODOLOGY__v1.0.md](grading/DAILY_HOLISTIC_GRADING_METHODOLOGY__v1.0.md)

**Why the Old Grading Was Deprecated:**

The old "debrief-only" approach (Nov 26-27) graded ONLY email debrief text using a 5-section rubric. This was **fundamentally flawed** because it:

- ❌ Ignored Git commits and deliverable files
- ❌ Ignored Drive uploads and documents
- ❌ Ignored Email attachments and supporting materials
- ❌ Penalized poor writing while ignoring productive work

**Example of Inaccuracy:**

| Day | Old Grade (Debrief-Only) | New Grade (Holistic) | What Old Grading Missed |
|-----|--------------------------|----------------------|-------------------------|
| W1D3 (Nov 12) | **D+ (68%)** | **B+ (86%)** | **78 email attachments**, citation validation work, RAI scoring |

**Old reasoning:** "Formal EOD debrief missing, check-ins only"
**Reality:** Andrew completed substantial citation validation work with 78 attachments, but didn't write a formal debrief summary.

**The new Daily Holistic Grading methodology considers ALL deliverables per day (Email + Git + Drive + Attachments) for accurate assessment.**

**Verification Reports (REQUIRED READING):**

- [reports/VERIFICATION_2025-12-03_gpt5-daily-grading-audit.md](../reports/VERIFICATION_2025-12-03_gpt5-daily-grading-audit.md)
- [logs/ai-decisions/DECISION_2025-12-03_gpt5-daily-grading-verification.json](../logs/ai-decisions/DECISION_2025-12-03_gpt5-daily-grading-verification.json)
- [04-ARCHIVE/deprecated-grading-nov26-27/README_DEPRECATED_GRADING.md](../04-ARCHIVE/deprecated-grading-nov26-27/README_DEPRECATED_GRADING.md)

---

### Read Project Foundation Documents

**Read in this order:**

1. **[README.md](../README.md)** - Project purpose, setup, quick start
   - What: QA tracking for Andrew Beam's AI Learning Partnership practicum
   - Why: Evidence-based learning evaluation with AI-assisted grading
   - How: Data pipeline (Gmail → Git → Drive → Tracker → Dashboards)

2. **[CHANGELOG.md](../CHANGELOG.md)** - Recent changes and project evolution
   - Focus on last 3-5 entries
   - Note current phase (Phase 8i: Daily Holistic Grading complete for W1)

3. **[docs/grading/DAILY_HOLISTIC_GRADING_METHODOLOGY__v1.0.md](grading/DAILY_HOLISTIC_GRADING_METHODOLOGY__v1.0.md)** - **NEW: Grading methodology**
   - 6-category holistic rubric (Completeness, Quality, Debrief Accuracy, Process, Timeliness, Learning)
   - Letter grade scale (A+ to F)
   - Example grading for reference
   - Comparison to old debrief-only approach

4. **[SDA_FRAMEWORK_COMPLETE.md](../SDA_FRAMEWORK_COMPLETE.md)** - Quick reference for SDA rules
   - The Three Golden Rules (fresh chat, evidence-based, multi-model)
   - Risk tier table (T0-T3)
   - Model-specific quick starts

5. **[MASTER_TODO.md](../MASTER_TODO.md)** - Current project task list
   - See what's completed, in-progress, pending
   - Note blockers and priority levels
   - **IMPORTANT:** Read DEPRECATED warning section at top of Grading Results Summary

**Summarize your understanding:**
- [ ] What this project does (in 1 sentence)
- [ ] Current development phase
- [ ] Recent major changes (Phase 8i: Daily Holistic Grading)
- [ ] **NEW:** Why old debrief-only grading was deprecated
- [ ] **NEW:** What grading file to use (DAILY_ENRICHMENT__20251203_GPT5_HOLISTIC_v1.0.csv)

---

## 4. Previous Session Context

### Your Model Lineage

**You are:** [MODEL_NAME: claude-sonnet-4-5 OR gpt-5-codex-high OR gemini-2.0-flash]

**Read YOUR most recent handoff (not handoffs from other models):**

#### For Claude Sonnet:
```bash
# Find your most recent handoff
ls -lt docs/handoffs/HANDOFF_*_claude-sonnet-*_*.md | head -1

# Read it
cat [that file]
```
**What to look for:** Context from your previous Claude sessions, decisions you made, patterns you established

#### For GPT-5 Codex:
```bash
# Find your most recent handoff
ls -lt docs/handoffs/HANDOFF_*_gpt-*_*.md | head -1

# Read it
cat [that file]
```
**What to look for:** Context from your previous GPT sessions, code you generated, optimizations you made

#### For Gemini:
```bash
# Find your most recent handoff
ls -lt docs/handoffs/HANDOFF_*_gemini-*_*.md | head -1

# Read it
cat [that file]
```
**What to look for:** Context from your previous Gemini sessions, alternative perspectives you provided, data analysis you performed

---

### Last Progress Report (Any Model)

**Read the most recent progress report regardless of model:**

```bash
# Find most recent progress report
ls -lt PROGRESS_*.md | head -1

# Read it
cat [that file]
```

**What to look for:**
- What was accomplished in the last session
- Technical decisions made (with rationale)
- Code changes (files created/modified)
- Testing & validation results
- Known issues and blockers
- Next steps planned

---

### Session State (If Available)

**Load the most recent session state JSON:**

```bash
# Find most recent state file
ls -lt state/session_*.json | head -1

# Read it
cat [that file]
```

**What to look for:**
- Cognitive context (mental model, key insights, assumptions)
- Code state (files created/modified, git status)
- Environmental context (OS, tools, practicum data)
- Decision log (major decisions with rationale)
- Continuation plan (immediate/short-term/long-term goals)

---

## 5. Current Project State

### Repository Status

**Run and analyze:**

```bash
# Current branch and status
git status -sb

# Recent commits (last 10)
git log --oneline -10

# Changes in last commit
git diff --stat HEAD~1

# Any uncommitted changes
git diff --stat
```

**Document your findings:**
- Current branch: [main / feature branch]
- Uncommitted changes: [yes / no - list if yes]
- Last commit: [SHA + message]
- Untracked files: [list tracker JSON files - expected per ADR-001]

---

### Build, Test, and Evidence Status

**Run project-specific checks:**

```bash
# 1. Evidence capture (SDA Framework - project-specific)
./scripts/make_evidence.sh

# 2. Git metadata
git rev-parse HEAD
git rev-parse --abbrev-ref HEAD
git status --porcelain

# 3. Python checks (if applicable)
# Note: Script skips missing tools with warnings
pytest -v --cov=. --cov-report=term-missing 2>&1 || echo "pytest not installed or no tests"
ruff check . 2>&1 || echo "ruff not installed"
mypy . --strict 2>&1 || echo "mypy not installed"

# 4. Tracker validation (project-specific)
TRACKER_JSON=$(ls -t ANDREW_BEAM_TRACKER*.json 2>/dev/null | head -1)
if [ -n "$TRACKER_JSON" ]; then
  python3 -c "
import json
with open('$TRACKER_JSON') as f:
    data = json.load(f)
    print(f'Tracker: {len(data)} rows, {len(data[0])} columns')
    print(f'Expected: 571 rows, 42 columns')
  "
fi

# 5. ADR-001 compliance check (no legacy paths)
grep -r "data/raw\|01-EMAIL-THREADS" . \
  --exclude-dir=04-ARCHIVE \
  --exclude-dir=.git 2>/dev/null || echo "ADR-001 compliant (no legacy paths found)"

# 6. Gmail privacy filter check (T3 security)
grep "default=" tools/gmail/sync_gmail.py | grep "andrewjbeam" || echo "⚠️ WARNING: Gmail privacy filter missing!"
```

**What the evidence script checks:**
- Git metadata (SHA, branch, working directory status)
- Test results (pytest with coverage)
- Lint results (ruff)
- Type check results (mypy)
- Tracker validation (row/column counts, schema compliance)
- ADR-001 compliance (no legacy paths like data/raw or 01-EMAIL-THREADS)
- Gmail privacy filter (must be present: `from:andrewjbeam@gmail.com OR to:andrewjbeam@gmail.com`)
- Gitignore compliance (tracker artifacts untracked, OAuth tokens untracked)

**Document your findings:**
- Evidence file generated: [yes / no - path]
- Tests: [passing / failing / not present]
- Linting: [clean / warnings - list if warnings]
- Tracker validation: [correct / incorrect - expected 571 rows, 42 cols]
- ADR-001 compliance: [compliant / violations found]
- Gmail privacy filter: [present / missing]

---

### Open Work Items

**Review:**

1. **Uncommitted changes** (from `git status`)
2. **MASTER_TODO.md** (project-wide task list)
3. **Most recent handoff** (immediate next steps section)
4. **TODO comments in recently modified files:**
   ```bash
   git diff HEAD~5..HEAD | grep -i "TODO\|FIXME\|XXX"
   ```

**Document:**
- Pending tasks: [list from MASTER_TODO.md with status "pending"]
- Blockers: [list from MASTER_TODO.md or handoff]
- Recent TODOs: [list from git diff if any]

---

## 6. Knowledge Base Integration

### Read Accumulated Knowledge

**If these files exist, read them:**

1. **docs/context/KNOWLEDGE_BASE.md** (lessons learned)
   - Not yet created for this project
   - Will accumulate patterns, pitfalls, solutions over time

2. **docs/decisions/ADR_*.md** (architectural decisions)
   - Currently: ADR-001 (Authoritative Sources Only)
   - Currently: ADR-007 (Exhaustive Schema Enforcement)
   - Read most recent 3-5 ADRs

3. **docs/runbooks/*.md** (operational procedures)
   - Not yet created for this project
   - Will contain step-by-step procedures (e.g., "How to Add New Practicum Week")

**Document your understanding:**
- Key ADRs: [ADR-001: never use tracker JSON as input, ADR-007: 42-column schema required]
- Lessons learned: [none yet - first SDA adoption]

---

## 7. Synthesis and Confirmation

### A. Executive Summary (2-3 paragraphs)

**Synthesize the project's current state, including:**

1. **What this project does and why it exists:**
   - [1 paragraph: QA tracking for Andrew Beam's AI Learning Partnership practicum, evidence-based grading, permanent record]

2. **Current development phase and recent progress:**
   - [1 paragraph: Phase 8e complete (SDA Framework v5.2.1 deployed), Gmail privacy fixed (T3), 19,900+ lines of documentation added]

3. **Your understanding of the immediate priorities:**
   - [1 paragraph: W3D2 grading merge fix (90% complete), first T1 workflow using SDA framework, evidence-based adoption]

---

### B. Context Verification Checklist

**Confirm you understand:**

#### Project Fundamentals
- [ ] Project purpose: QA tracking for Andrew Beam's AI practicum
- [ ] Architecture: Data pipeline (Gmail → Git → Drive → Tracker → Enrichment → Dashboards)
- [ ] Current phase: Phase 8e (SDA Framework Deployment) complete
- [ ] Recent changes: SDA framework deployed (11 files, 19,900+ lines)

#### Session Context
- [ ] Previous session's accomplishments: [Phase 8d + 8e completed, 18 tasks]
- [ ] Current branch: [main]
- [ ] Uncommitted changes: [list if any]
- [ ] Your model's previous context: [from YOUR handoffs, not other models]
- [ ] Immediate next steps: [W3D2 merge fix, first T1 workflow, DECISION_*.json creation]
- [ ] Blockers: [W3D2 CSV escaping issue - row 8, not urgent]

#### Critical Project Rules (ADRs)
- [ ] **ADR-001:** Never use tracker JSON as input (rebuild from PARTICIPANTS/ authoritative sources)
- [ ] **ADR-007:** 42-column schema required (SOURCE_TO_TARGET_MAPPING v2.0, 100% field population)
- [ ] **Privacy Rule:** Gmail sync MUST filter to Andrew Beam only (`from:andrewjbeam@gmail.com OR to:andrewjbeam@gmail.com`)
- [ ] **Dual Export:** Always export CSV (humans) + JSON (machines) + SHA-256 manifest (audit trail)

#### SDA Framework Compliance
- [ ] **Risk tier system:** T0 (docs) → T1 (features) → T2 (core logic) → T3 (security/privacy)
- [ ] **Fresh chat separation:** NEVER review in same chat as build (NON-NEGOTIABLE)
- [ ] **Evidence-based review:** Actual tool outputs required, not prose claims
- [ ] **Multi-model verification:** T3 requires 2+ different model families
- [ ] **My role:** [REVIEWER / BUILDER / ALTERNATIVE LENS based on model family]
- [ ] **Evidence script:** `./scripts/make_evidence.sh` for proof-of-work
- [ ] **VS Code snippets:** `!tier`, `!build`, `!review`, `!verify`, etc.

#### Practicum Data Context
- [ ] Participant: Andrew Beam
- [ ] Practicum start: 2025-11-10
- [ ] Current week: W3
- [ ] Total tracker rows: 571
- [ ] Schema columns: 42
- [ ] Source types: EMAIL_MESSAGE (363), EMAIL_ATTACHMENT (159), GIT_COMMIT (35), DRIVE_UPLOAD (8), ROLLUP_DEBRIEF (6)

---

### C. Working Memory State

**Describe your current understanding:**

#### Mental Model of System Architecture
```
Example format:

AUTHORITATIVE SOURCES (PARTICIPANTS/)
  ├── 01-EMAIL-DATA/ → Gmail Markdown (363 messages)
  ├── 02-GOOGLE-DRIVE/ → Drive API (8 uploads)
  └── 03-GIT-REPOS/ → Git commits (35 commits)
         ↓
   tracker-builder (Python script)
         ↓
   ANDREW_BEAM_TRACKER.json (571 rows, 42 cols)
         ↓
   enrichment merge (manual grading + rollup generation)
         ↓
   ANDREW_BEAM_TRACKER_ENRICHED.json
         ↓
   dashboards (analysis + visualization)
```

**Your mental model:** [Draw or describe your understanding of the data flow]

#### Key Patterns and Conventions
- Tracker JSON files are **untracked** (gitignored per ADR-001)
- Gmail Markdown format: `*__Thread.md` (double underscore)
- Attachment pattern: `Msg*_Att*` (e.g., Msg001_Att001.pdf)
- Week number derived from practicum start date (2025-11-10 = W1D1)
- Evidence files generated to `evidence/` directory (gitignored)
- Handoff documents in `docs/handoffs/` (committed)

**Your observations:** [List patterns you've noticed]

#### Areas of Uncertainty
- [List anything unclear or ambiguous]
- [Example: "I don't understand why there are multiple ANDREW_BEAM_TRACKER__PHASE7__*.json files in working directory"]
- [Example: "I'm unsure whether W3D2 grading merge should be prioritized or can wait"]

#### Assumptions You're Making
- [List assumptions explicitly]
- [Example: "I assume user has pytest, ruff, mypy installed (evidence script will skip if missing)"]
- [Example: "I assume tracker JSON files in working directory are expected untracked artifacts per ADR-001"]

---

### D. Risk Tier Declaration (MANDATORY)

**Before proposing an action plan, declare the risk tier for the work ahead:**

**Tier:** [T0 / T1 / T2 / T3]

**Justification:** [Why this tier? What's the impact if something goes wrong?]

**Risk Tier Guide:**

| Tier | Examples | Impact | Controls |
|------|----------|--------|----------|
| **T0** | Docs, comments, README updates | Low (cosmetic) | Builder only (review optional) |
| **T1** | Dashboard charts, CSV export format | Medium (UX affected) | Builder → Reviewer (fresh chat) |
| **T2** | Tracker builder parser, enrichment merge, grading algorithms | High (data integrity) | Builder → Verification → Data-Quality Lens |
| **T3** | Gmail OAuth, tracker schema migration, privacy filters | Critical (security/compliance) | 4 Lenses → Multi-model → Senior approval |

**When in doubt, choose the HIGHER tier (extra review is cheap insurance).**

**Example Declarations:**

```markdown
**Tier:** T2
**Justification:** Fixing W3D2 grading merge (CSV escaping issue affects data integrity, grading affects permanent record)

**Tier:** T1
**Justification:** Adding new dashboard chart type (non-critical feature, doesn't affect core data pipeline)

**Tier:** T3
**Justification:** Modifying Gmail sync query filter (privacy-critical, affects PII handling)
```

---

### E. Action Plan

**Based on the context and risk tier, what are your next 3 concrete steps?**

**Format:**
```markdown
1. [First action with specific command]
   - Estimated time: [X minutes]
   - Risk: [T0/T1/T2/T3]
   - Evidence: [How you'll prove it works]

2. [Second action with specific command]
   - Estimated time: [X minutes]
   - Risk: [T0/T1/T2/T3]
   - Evidence: [How you'll prove it works]

3. [Third action with specific command]
   - Estimated time: [X minutes]
   - Risk: [T0/T1/T2/T3]
   - Evidence: [How you'll prove it works]
```

**Example:**
```markdown
1. Fix W3D2 grading merge (row 8 CSV escaping issue)
   - Command: `vim MANUAL_ENRICHMENT_VALUES__v8.0.csv` (fix row 8)
   - Command: `python tools/enrichment/merge_manual_enrichment_v3.py MANUAL_ENRICHMENT_VALUES__v8.0.csv ANDREW_BEAM_TRACKER__v8.0.json`
   - Estimated time: 30 minutes
   - Risk: T2 (grading integrity)
   - Evidence: `./scripts/make_evidence.sh` (validate 571 rows, 42 cols, no merge errors)

2. Independent review with different model (T2 requirement)
   - Start fresh chat with GPT-5 Codex (different model family)
   - Paste: Spec + Diff + Evidence file ONLY (no Builder explanation)
   - Estimated time: 15 minutes
   - Risk: T2 (review quality)
   - Evidence: Review report in `reports/VERIFICATION_*.md`

3. Create DECISION_*.json for W3D2 merge
   - Use `!decision-log` snippet in `logs/ai-decisions/DECISION_2025-12-01_w3d2-grading-merge.json`
   - Document: decision, rationale, alternatives, approval
   - Estimated time: 10 minutes
   - Risk: T0 (documentation)
   - Evidence: File exists, validates against schema
```

---

## 8. Questions Before Starting

**Ask the user about anything that seems:**

### Contradictory Between Documents
- [Example: "README.md says 'Phase 8 complete' but MASTER_TODO.md shows pending tasks"]
- [Example: "Handoff says 'W3D2 merge urgent' but MASTER_TODO.md says 'medium priority'"]

### Unclear or Ambiguous
- [Example: "Should W3D2 grading merge be prioritized, or can it wait?"]
- [Example: "What should be the first T1 workflow task to test SDA framework?"]

### Missing but Necessary
- [Example: "I don't see a MANUAL_ENRICHMENT_VALUES__v8.0.csv file - should I create it?"]
- [Example: "Evidence script requires pytest, but it's not installed - should I install it?"]

### Potentially Outdated
- [Example: "CHANGELOG.md last updated 2025-11-30, but handoff is dated 2025-12-01 - is CHANGELOG missing the SDA deployment entry?"]
- [Example: "Git log shows commits after handoff timestamp - should I re-read the handoff?"]

---

## 9. Model-Specific Context Acknowledgment

### If you're Claude Sonnet:

**Acknowledge any Claude-specific patterns you've established:**
- Architectural decisions you've explored (example: multi-model verification strategy)
- Documentation you've created (example: CLAUDE.md, handoff documents)
- Code reviews you've performed (example: Gmail privacy fix review)
- Security analyses you've conducted (example: T3 privacy lens on Gmail sync)

### If you're GPT-5 Codex:

**Acknowledge any GPT-specific patterns you've employed:**
- Code generation approaches (example: tracker builder implementation style)
- Testing strategies (example: pytest fixtures for data pipeline testing)
- Performance optimizations (example: pandas vectorization in enrichment merge)
- Refactoring patterns (example: extract function for repeated logic)

### If you're Gemini:

**Acknowledge any Gemini-specific patterns you've provided:**
- Alternative perspectives (example: resilience review of tracker builder)
- Data analysis (example: statistical validation of grading distribution)
- Resilience reviews (example: error handling in Gmail sync)
- Multi-model verification contributions (example: T3 security lens on schema migration)

---

## 10. SDA Framework Compliance Check

**Before proceeding, confirm:**

- [ ] I have read my model-specific instructions ([CLAUDE.md](../CLAUDE.md) or [.github/copilot-instructions.md](../.github/copilot-instructions.md))
- [ ] I understand my role (REVIEWER / BUILDER / ALTERNATIVE LENS)
- [ ] I have verified this is a fresh chat (if reviewing)
- [ ] I have declared a risk tier for the upcoming work
- [ ] I understand ADR-001 (never use tracker JSON as input)
- [ ] I understand ADR-007 (42-column schema required, 100% field population)
- [ ] I understand the privacy rule (Gmail sync MUST filter to Andrew Beam)
- [ ] I understand dual export (CSV + JSON + manifest)
- [ ] I will use evidence script (`./scripts/make_evidence.sh`) before claiming work is complete
- [ ] I will follow fresh chat separation if this becomes a review task
- [ ] I will NOT review code in the same chat where I generated it (NON-NEGOTIABLE)
- [ ] I will NOT accept "tests pass" without seeing actual evidence file output
- [ ] I will use VS Code snippets (`!tier`, `!build`, `!review`) to streamline workflows

---

## 11. Final Confirmation

**Only after completing this initialization and receiving the user's confirmation should you proceed with actual work.**

**This ensures we're building on previous context rather than starting fresh.**

**If any files are missing or inaccessible, list them explicitly so the user can provide them.**

**Your response should include:**

1. ✅ **Executive Summary** (Section 7.A)
2. ✅ **Context Verification Checklist** (Section 7.B - all boxes checked)
3. ✅ **Working Memory State** (Section 7.C - mental model, patterns, uncertainties, assumptions)
4. ✅ **Risk Tier Declaration** (Section 7.D - tier + justification)
5. ✅ **Action Plan** (Section 7.E - next 3 steps with commands)
6. ✅ **Questions Before Starting** (Section 8 - anything unclear)
7. ✅ **Model-Specific Context** (Section 9 - patterns you've established)
8. ✅ **SDA Compliance Check** (Section 10 - all boxes checked)
9. ✅ **Confirmation Request:** "I am ready to proceed. Please confirm before I start work."

---

## Appendix A: Quick Reference Commands

### Evidence Capture
```bash
./scripts/make_evidence.sh
cat evidence/evidence_*.txt | pbcopy  # Copy to clipboard (macOS)
```

### Tracker Operations
```bash
# Build tracker from authoritative sources (T2)
python tools/tracker-builder/build_tracker_from_sources.py

# Merge enrichment CSV (T2)
python tools/enrichment/merge_manual_enrichment_v3.py \
  MANUAL_ENRICHMENT_VALUES__v8.0.csv \
  ANDREW_BEAM_TRACKER__v8.0.json

# Generate dashboards (T1)
python tools/dashboards/generate_dashboards.py
```

### Gmail Sync (Andrew Only - T3)
```bash
# Business account (privacy filter enforced by default)
python tools/gmail/sync_gmail.py --account business
```

### Git Operations
```bash
# Current status
git status -sb

# Recent history
git log --oneline -10

# Uncommitted changes
git diff --stat

# Stage SDA artifacts (evidence, decision logs, reports are gitignored)
git add [files]

# Commit with conventional format
git commit -m "feat(scope): description

[body]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: [Model Name] <noreply@[provider].com>"
```

---

## Appendix B: File Locations

### Core Framework Files
- [CLAUDE.md](../CLAUDE.md) - Master AI rules (4,200+ lines, auto-loaded by Claude Code)
- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - GPT-specific instructions (2,400+ lines)
- [.vscode/srs-snippets.code-snippets](../.vscode/srs-snippets.code-snippets) - VS Code snippets (9 snippets)
- [scripts/make_evidence.sh](../scripts/make_evidence.sh) - Evidence capture script (executable)

### Documentation
- [README.md](../README.md) - Project overview, quick start
- [CHANGELOG.md](../CHANGELOG.md) - Project history, recent changes
- [MASTER_TODO.md](../MASTER_TODO.md) - Project-wide task list
- [SDA_IMPLEMENTATION_GUIDE.md](../SDA_IMPLEMENTATION_GUIDE.md) - Complete user guide (7,500+ lines)
- [SDA_FRAMEWORK_COMPLETE.md](../SDA_FRAMEWORK_COMPLETE.md) - Quick reference (1,500+ lines)
- [docs/SDA_FRAMEWORK_DEPLOYMENT_SUMMARY.md](../docs/SDA_FRAMEWORK_DEPLOYMENT_SUMMARY.md) - Deployment details (3,500+ lines)

### Handoffs & Progress Reports
- `docs/handoffs/HANDOFF_*_[model]_*.md` - Model-specific handoffs
- `PROGRESS_*.md` - Session progress reports
- `state/session_*.json` - Session state serialization

### Evidence & Decision Logs (Gitignored)
- `evidence/evidence_*.txt` - Proof-of-work logs
- `logs/ai-decisions/DECISION_*.json` - T2/T3 decision records
- `reports/VERIFICATION_*.md` - Review reports
- `logs/ai-runs/AI_RUN_*.json` - AI run metadata

---

## Appendix C: Risk Tier Decision Tree

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

## 12. Quick Wins (For Returning Models)

### When to Use Quick Wins

Use the abbreviated initialization ONLY if ALL criteria below are met:

- ✅ You have previous context from THIS project (not similar projects)
- ✅ Your last session was <7 days ago
- ✅ No major architecture changes since your last session (check CHANGELOG.md date)
- ✅ User confirms Quick Wins is appropriate
- ✅ You are continuing as BUILDER (not starting fresh as Reviewer)

**If ANY criterion is false → Use full initialization (Sections 1-11)**

### 5-Minute Refresh Checklist

If all criteria are met, complete this abbreviated initialization:

#### 1. Read Status Line (30 seconds)

```bash
head -5 MASTER_TODO.md  # Current phase status
```

**What to look for:** Phase number, completion status, tracker row count, data source status

#### 2. Read Latest Changes (60 seconds)

```bash
head -100 CHANGELOG.md  # Most recent entry
```

**What to look for:** Date of last change, what was added/fixed/changed, who did it

#### 3. Check Git Status (30 seconds)

```bash
git status -sb && git log --oneline -3
```

**What to look for:** Current branch, uncommitted changes, last 3 commits

#### 4. Read YOUR Most Recent Handoff (2 minutes)

```bash
# Find your model's most recent handoff
ls -lt docs/handoffs/HANDOFF_*_claude-sonnet-*_*.md | head -1  # For Claude
ls -lt docs/handoffs/HANDOFF_*_gpt-*_*.md | head -1            # For GPT
ls -lt docs/handoffs/HANDOFF_*_gemini-*_*.md | head -1         # For Gemini

# Read it
cat [that file]
```

**What to look for:** What you did last time, what you planned next, any blockers

#### 5. Declare Risk Tier (30 seconds)

Based on upcoming work, declare:

```
**Tier:** [T0 / T1 / T2 / T3]
**Justification:** [One sentence why]
```

#### 6. Provide Abbreviated Summary (1 minute)

```markdown
**Quick Wins Summary:**

- Last session: [Date and what you did]
- Current phase: [Phase number and status]
- Upcoming work: [1-sentence description]
- Risk tier: [T0-T3]
- Ready to proceed: [YES - pending user confirmation]
```

### What Quick Wins Skips

The abbreviated initialization skips:

- ❌ Framework file re-reading (assumes you've read CLAUDE.md or copilot-instructions.md)
- ❌ Full repository status check (assumes familiarity with file structure)
- ❌ ADR re-reading (assumes you remember ADR-001, ADR-007)
- ❌ Detailed mental model reconstruction (assumes existing context)

### Quick Wins Failure Recovery

If user says "No, do full initialization" or you realize you need more context:

**IMMEDIATELY:**

1. Acknowledge the request
2. Start from Section 1 (Framework Awareness)
3. Complete ALL sections 1-11
4. DO NOT skip any steps

**Example:**

> "Understood. I'll complete the full initialization protocol starting from Section 1 to ensure I have complete, current project context."

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | 2025-12-06 | Claude Sonnet 4.5 | **World-Class Gold Standard Update:** (1) Added Section 0 "Document Type Awareness" to clarify SOP vs Handoff vs Quick Reference, (2) Enhanced Section 2.5 with real Phase 8j incident showing handoff failure impact, (3) Added Section 12 "Quick Wins" for returning models (<7 days, 5-min refresh), (4) Updated filename to naming standard: `SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md`, (5) Updated title to include "SDA" prefix and date suffix per user naming convention |
| 1.0 | 2025-12-01 | Claude Sonnet 4.5 | Initial SOP created based on SDA Framework v5.2.1 deployment |

---

**END OF SOP**

**Framework:** SparkData Analytics v5.2.1
**Project:** SRS Management System
**Owner:** Ryan Zimmerman, Southwest Resume Services
**Next Review:** Q1 2026

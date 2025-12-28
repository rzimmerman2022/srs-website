# SparkData Agentic - Model Initialization

## SC KMH - 1. Platform Provider Official Source of Truth

**Framework**: SparkData Agentic v0.2.0
**Project**: SC KMH Platform Provider Official Source of Truth
**Updated**: 2025-12-06 00:45:00 MST
**Purpose**: Standard model initialization for NEW AI sessions

---

## 🔴 CRITICAL: Copy This to Start New AI Sessions

**Use this prompt when starting a NEW AI model session (Claude, GPT-5, Gemini, etc.)**

---

## Session Initialization Prompt

```markdown
You are continuing work on the SC KMH Platform Provider Official Source of Truth project using SparkData Agentic Framework v0.2.0.

CRITICAL FIRST STEPS (DO THESE IMMEDIATELY):
1. Read: AI_HANDOFF_CURRENT.md (single source of truth for project status)
2. Read: CLAUDE.md (project rules - anti-sycophancy, Gemini integrity constraints)
3. Read: MASTER_TODO_UPDATED.md (current task list with priorities)
4. Check: Git status, recent commits
5. Verify: Test status (expect 36/36 or 37/37 passing)

YOUR ROLE: ORCHESTRATOR (NOT BUILDER)
- You coordinate and verify work between builder (GPT-5 Codex) and reviewers (spawned agents)
- You send specifications to GPT-5 Codex for implementation
- You run tests, collect evidence, spawn review agents
- You commit code with comprehensive evidence trails
- You do NOT write production code yourself

PROJECT CONTEXT:
- **Purpose**: Legal case file database for court use (scientifically accurate)
- **Data**: 251,138 AI conversation messages (2.5GB canonical JSONL)
- **Platforms**: OpenAI (189,579), Anthropic (44,114), Gemini (17,445), Cline
- **Database**: DuckDB (messages.duckdb, read-only, 2.5GB local file)
- **Web UI**: Flask app (functional, read-only queries)
- **Current Phase**: Phase 3 COMPLETE ✅

CRITICAL CONSTRAINT (NEVER VIOLATE - LEGALLY REQUIRED):
Gemini records are STANDALONE ACTIVITIES (NOT conversations)
- conversation_id MUST equal id for ALL Gemini records
- Each Gemini record is an independent activity log entry
- DO NOT group Gemini records by time proximity
- DO NOT create conversation threading for Gemini data
- MUST verify 0 violations after ANY database-touching work:

  python3 -c "import duckdb; conn = duckdb.connect('messages.duckdb', read_only=True); print(f'Violations: {conn.execute('SELECT COUNT(*) FROM messages WHERE platform=\"gemini\" AND conversation_id <> id').fetchone()[0]}')"

  This MUST always return: Violations: 0

SPARKDATA AGENTIC FRAMEWORK v0.2.0:
This project uses T2 workflow for database/pipeline work:
- **T0**: Documentation only (no review)
- **T1**: Standard features (1 Verification Agent)
- **T2**: Database/pipelines (Verification + Data-Quality Agents) ← CURRENT
- **T3**: Critical changes (4 agents, multi-model, senior approval)

Key Principles:
1. **Fresh Context Separation**: Builder chat ≠ Reviewer chat (prevents AI sycophancy)
2. **Evidence-Based**: Paste actual pytest/ruff/mypy output, never just claims
3. **Risk-Tiered**: Match review rigor to change criticality
4. **Role Separation**: Builder (GPT-5) vs Orchestrator (you) vs Reviewer (agents)

CURRENT STATUS (as of 2025-12-06):
- **Phase**: Phase 3 COMPLETE (DuckDB + Flask Web UI working)
- **Tests**: 36/36 passing (targeting 37/37 after P1 fixes)
- **Gemini Violations**: 0 (MUST maintain)
- **Database**: DuckDB (NOT PostgreSQL or SQLite)
- **Framework**: SparkData Agentic v0.2.0
- **Git**: 5 commits ahead of origin/main
- **Current Task**: [Check AI_HANDOFF_CURRENT.md - changes frequently]

IMMEDIATE TASK:
After reading AI_HANDOFF_CURRENT.md, respond with:

"I've initialized on SC KMH Platform Provider project (SparkData Agentic v0.2.0).

I understand:
- Phase 3 is COMPLETE (DuckDB + Web UI functional)
- My role: ORCHESTRATOR (coordinate GPT-5 Codex, not build myself)
- Workflow: T2 (Verification + Data-Quality agents for database work)
- Current task: [state current task from AI_HANDOFF_CURRENT.md]
- Tests: [current]/[target] passing
- Gemini violations: 0 (legally required - must maintain)
- Database: DuckDB (read-only connection)

Ready to proceed with [next step from AI_HANDOFF_CURRENT.md]."

DO NOT proceed with any work until you've read AI_HANDOFF_CURRENT.md and confirmed understanding above.
```

---

## Why This Works (Industry Best Practices)

### 1. **Clear Entry Point**
Points to **AI_HANDOFF_CURRENT.md** as single source of truth (living document pattern)

### 2. **Role Clarity Upfront**
States **"ORCHESTRATOR (NOT BUILDER)"** in first 100 lines to prevent implementation confusion

### 3. **Framework Context**
Explains SparkData Agentic v0.2.0 and T2 workflow (industry-standard tiered risk approach)

### 4. **Critical Constraints First**
Gemini constraint is legally critical - mentioned before line 40

### 5. **Anti-Hallucination**
Explicitly prevents common mistakes:
- ❌ "Starting Phase 3" → ✅ "Phase 3 COMPLETE"
- ❌ "PostgreSQL" → ✅ "DuckDB"
- ❌ "26/26 tests" → ✅ "36/36 or 37/37"
- ❌ "I'll implement" → ✅ "I'll coordinate GPT-5"

### 6. **Verification Template**
Requires specific confirmation format before proceeding

### 7. **Evidence-Based**
Demands actual numbers, not assumptions

---

## Usage Instructions

### When to Use

**✅ Use this prompt for**:
- Starting new Claude Code session
- Switching AI models (Opus → Sonnet, Claude → GPT-5, etc.)
- After conversation context reset
- Returning to project after days/weeks away
- User says "start fresh" or "initialize"

**❌ Do NOT use for**:
- AI-to-AI handoff continuation (use docs/handoffs/HANDOFF_*.md instead)
- Mid-session clarifications (context already loaded)
- Quick status questions

### How to Use

1. **Copy** "Session Initialization Prompt" section (lines 17-84)
2. **Paste** as first message to new AI session
3. **Wait** for AI to read files (30-60 seconds)
4. **Verify** response matches template
5. **Proceed** only after confirmation

### Verification Checklist

After AI responds, verify:
- ✅ States Phase 3 is **COMPLETE** (not "starting")
- ✅ States database is **DuckDB** (not PostgreSQL/SQLite)
- ✅ States **36/36 or 37/37 tests** (not 26/26 - outdated)
- ✅ States role as **ORCHESTRATOR** (not builder/developer)
- ✅ States will **coordinate GPT-5 Codex** (not implement itself)
- ✅ States **Gemini violations = 0** (legally required)
- ✅ States **T2 workflow** for database work
- ✅ References **AI_HANDOFF_CURRENT.md** for current task

---

## Red Flags (Incorrect Initialization)

**STOP IMMEDIATELY if AI says**:

### Phase Confusion
- ❌ "I see we're starting Phase 3"
- ❌ "Transitioning from Phase 2 to Phase 3"
- ❌ "Phase 3 database work is pending"

### Database Confusion
- ❌ "Let me set up PostgreSQL"
- ❌ "I'll create the SQLite schema"
- ❌ Mentions any database other than DuckDB

### Test Count Confusion
- ❌ "26/26 tests are passing" (outdated count)
- ❌ Doesn't mention test count at all
- ❌ Wrong test numbers

### Role Confusion
- ❌ "Let me implement the P1 fixes"
- ❌ "I'll write the code for..."
- ❌ "Here's my implementation..."
- ❌ Doesn't mention orchestrator role

### Constraint Confusion
- ❌ "Let me group Gemini records by conversation"
- ❌ "I'll thread Gemini activities together"
- ❌ Doesn't mention Gemini constraint
- ❌ Doesn't mention 0 violations requirement

### File Confusion
- ❌ Doesn't mention AI_HANDOFF_CURRENT.md
- ❌ References November handoffs (outdated)
- ❌ Says "couldn't find" critical files

**If you see ANY red flag → Send emergency recovery message (see below)**

---

## Emergency Recovery

### Symptoms: AI is Confused

- Multiple wrong facts (phase, database, tests, role)
- Offers to implement code directly
- Doesn't mention required files
- Can't answer basic status questions correctly

### Recovery Procedure

**Step 1: STOP** - Don't let confused AI make changes

**Step 2: Send This Message**
```
STOP. You have incorrect context.

Read these files in exact order:
1. AI_HANDOFF_CURRENT.md (current status)
2. CLAUDE.md (project rules)
3. MASTER_TODO_UPDATED.md (task list)

Then answer these questions:
- What phase is the project in?
- What database are we using?
- How many tests are passing?
- What is your role?
- What is the current task?
- What is the Gemini constraint?
```

**Step 3: Verify Correct Answers**
- Phase 3 **COMPLETE** (not starting)
- **DuckDB** (not PostgreSQL)
- **36/36 or 37/37** tests (not 26/26)
- **ORCHESTRATOR** (not builder)
- [Whatever AI_HANDOFF_CURRENT.md says for current task]
- Gemini: conversation_id = id, **0 violations**

**Step 4: If Still Wrong**
- Close session completely
- Start fresh session
- Use initialization prompt again
- If still confused → escalate to human review

---

## Quick Reference Tables

### What Is True RIGHT NOW (2025-12-06)

| What | Reality | Wrong Answer (Don't Say This) |
|------|---------|------------------------------|
| **Phase** | Phase 3 COMPLETE ✅ | "Starting Phase 3" |
| **Database** | DuckDB (messages.duckdb) | PostgreSQL, SQLite |
| **Tests** | 36/36 → 37/37 (after P1) | 26/26 (outdated) |
| **Your Role** | ORCHESTRATOR | Builder, Developer, Implementer |
| **Who Codes** | GPT-5 Codex (you coordinate) | "I implement", "I write" |
| **Gemini Model** | Standalone (conversation_id = id) | Grouped, threaded, conversational |
| **Gemini Violations** | 0 (MUST maintain) | Any number > 0 |
| **Framework** | SparkData Agentic v0.2.0 | No framework, old SOP |
| **Workflow** | T2 (2 agents for DB work) | T1, no workflow |

### Where to Find Information

| Question | File | Specific Section |
|----------|------|------------------|
| Current status? | [AI_HANDOFF_CURRENT.md](AI_HANDOFF_CURRENT.md) | Lines 1-100 |
| Project rules? | [CLAUDE.md](CLAUDE.md) | Anti-sycophancy, Gemini rules |
| Pending tasks? | [MASTER_TODO_UPDATED.md](MASTER_TODO_UPDATED.md) | P0/P1/P2/P3 sections |
| Previous work? | [docs/handoffs/HANDOFF_2025-12-06_*.md](docs/handoffs/) | Session summary |
| Cognitive context? | [state/session_2025-12-06_*.json](state/) | Decision log, insights |
| Framework docs? | [sparkdata-agentic-framework/](sparkdata-agentic-framework/) | Workflows, API reference |
| Gemini constraint? | [GEMINI_DATA_STRATEGY.md](GEMINI_DATA_STRATEGY.md) | Legal framing |

---

## Differences: Initialization vs Handoff

Understanding these differences prevents confusion:

### 🆕 Model Initialization (This File)
- **File**: SDA_MODEL_INITIALIZATION_SC-KMH.md
- **Purpose**: Cold start for NEW AI session
- **Trigger**: User starts fresh session
- **Audience**: Any AI model (Claude, GPT-5, Gemini)
- **Content**: High-level overview → pointers to detailed docs
- **Focus**: "What is this project? What is your role? Read these files first."
- **Depth**: Executive summary level
- **When**: User explicitly initializes new session

### 🔄 AI-to-AI Handoff (docs/handoffs/)
- **File**: docs/handoffs/HANDOFF_YYYY-MM-DD_HH-MM-SS_MODEL_SESSION.md
- **Purpose**: Warm transfer of ongoing work
- **Trigger**: Previous AI completes session or runs out of context
- **Audience**: Next AI picking up mid-stream
- **Content**: What I did, decisions made, what's next, mental models
- **Focus**: "Here's my cognitive context, here are the obstacles, here's what needs doing."
- **Depth**: Detailed (600+ lines typical)
- **When**: AI passes baton to another AI

### 📍 Current State (AI_HANDOFF_CURRENT.md)
- **File**: AI_HANDOFF_CURRENT.md (root level)
- **Purpose**: Living "source of truth" for current status
- **Trigger**: Read FIRST in every session (both init and handoff)
- **Audience**: All AIs (initialized or handed-off)
- **Content**: Current phase, task, status, role, critical facts
- **Focus**: "What is factually true RIGHT NOW?"
- **Depth**: Current status only (not history)
- **When**: ALWAYS - every session starts here

**Rule**: Regardless of how you start (initialization or handoff), ALWAYS read AI_HANDOFF_CURRENT.md first.

---

## Maintenance

### Update This File When

**Required updates**:
- ✅ Project phase changes (e.g., Phase 4 starts)
- ✅ Test count changes significantly (e.g., 37→50)
- ✅ Database migration (unlikely, but if DuckDB→PostgreSQL)
- ✅ Framework version update (e.g., v0.2.0→v0.3.0)
- ✅ Builder model changes (e.g., GPT-5→Claude Opus for building)

**Optional updates**:
- 🔄 Task description changes (usually just update AI_HANDOFF_CURRENT.md)
- 🔄 Minor test count adjustments (±1-2 tests)

### Who Updates
Current AI orchestrator before completing session

### Version History

**v1.1 (2025-12-06)**:
- Renamed: AI_INITIALIZATION_PROMPT.md → SDA_MODEL_INITIALIZATION_SC-KMH.md
- Added: SparkData Agentic Framework v0.2.0 context
- Added: T2 workflow explanation
- Added: Fresh context separation principle
- Added: Role clarity (ORCHESTRATOR vs BUILDER) emphasized
- Added: Comprehensive red flags section
- Added: Emergency recovery procedures
- Added: "Differences" section (initialization vs handoff vs current state)
- Updated: Current status (Phase 3 COMPLETE, 36/36→37/37 tests)
- Aligned: Industry best practices for model initialization

**v1.0 (2025-11-30)**:
- Initial creation
- Basic project context
- Gemini constraints
- Test requirements

---

## Support & Troubleshooting

### Initialization Still Failing?

1. **Verify files exist**:
   ```bash
   ls -la AI_HANDOFF_CURRENT.md CLAUDE.md MASTER_TODO_UPDATED.md
   ```

2. **Check file dates**:
   ```bash
   ls -l AI_HANDOFF_CURRENT.md
   # Should be recent (December 2025)
   ```

3. **Verify git status**:
   ```bash
   git status
   git log --oneline -5
   ```

4. **Check test status**:
   ```bash
   pytest tests/test_adapters_v3.py tests/test_duckdb_import.py web_ui/tests/test_search_export.py -v
   # Should show 36/36 or 37/37 passing
   ```

### Questions?

- **Project rules**: See [CLAUDE.md](CLAUDE.md)
- **Current status**: See [AI_HANDOFF_CURRENT.md](AI_HANDOFF_CURRENT.md)
- **Framework docs**: See [sparkdata-agentic-framework/docs/](sparkdata-agentic-framework/docs/)
- **Workflow guides**: See [sparkdata-agentic-framework/docs/WORKFLOWS.md](sparkdata-agentic-framework/docs/WORKFLOWS.md)

---

**Document Version**: 1.1
**Created**: 2025-11-30
**Updated**: 2025-12-06 00:45:00 MST
**Framework**: SparkData Agentic v0.2.0
**Purpose**: Standard model initialization for SC KMH Platform Provider project
**Replaces**: Any initialization prompts dated before 2025-12-06

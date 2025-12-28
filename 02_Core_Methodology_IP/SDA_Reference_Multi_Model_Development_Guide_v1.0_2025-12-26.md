# Multi-Model Development Guide: GPT-5 + Claude + Gemini Workflow

**Project**: SC KMH Platform Provider Source of Truth
**Framework**: SparkData AI Development v5.2 (T2 Risk Tier)
**Status**: Active Development (Phase 3 - Database & Web UI)
**Last Updated**: 2025-12-01

---

## 🎯 Executive Summary

This project uses **three AI model families** in a collaborative workflow:
- **GPT-5 Codex** (OpenAI) - The Builder
- **Claude Sonnet/Opus** (Anthropic) - The Orchestrator & Reviewer
- **Google Gemini 2.0** (Google) - The Third-Party Validator (T3 only)

**Why Multi-Model?** Different AI families have different blind spots. Using multiple models catches more bugs, prevents sycophancy (AIs agreeing with themselves), and ensures legal/scientific integrity for court use.

---

## 🤖 Model Roles & Specializations

### 1. GPT-5 Codex Max (OpenAI Family) - The Builder

**Primary Role**: Code Implementation

**Why GPT-5 Codex is Best for Building**:

✅ **Speed**: Fastest code generation (10x faster than Claude for boilerplate)
✅ **SQL Expertise**: Industry-leading database query optimization
✅ **Pattern Recognition**: Excellent at following existing code patterns
✅ **API Integration**: Strong at web frameworks (React, Flask, FastAPI)
✅ **Batch Operations**: Great for repetitive tasks (writing 20 similar functions)

**What GPT-5 Excels At**:
- Writing database schemas (PostgreSQL, DuckDB, SQLite)
- Implementing web UI components (React, Vue, Svelte)
- API endpoint development (REST, GraphQL)
- Data transformation pipelines (pandas, SQL)
- Performance optimization (query tuning, caching strategies)
- Boilerplate generation (tests, fixtures, config files)

**What GPT-5 Misses** (Why it needs review):
- Edge cases (null handling, boundary conditions)
- Security vulnerabilities (SQL injection, XSS)
- Subtle logic errors (off-by-one, race conditions)
- Over-engineering (adds unnecessary abstractions)
- Documentation completeness (focuses on code, not docs)

**When to Use GPT-5**:
- ✅ Initial implementation ("Build a database import script")
- ✅ Refactoring existing code ("Optimize this query")
- ✅ Adding features ("Add pagination to the API")
- ✅ Writing tests ("Create unit tests for this module")
- ✅ Debugging ("Fix this error: [paste stack trace]")

**When NOT to Use GPT-5**:
- ❌ Code review (will be sycophantic to its own code)
- ❌ Architecture decisions (prefers complexity)
- ❌ Security audits (misses subtle vulnerabilities)
- ❌ Final validation (needs independent verification)

**Example GPT-5 Task**:
```
Task: Implement PostgreSQL schema for 251,138 canonical messages

Requirements:
- Support all fields from canonical_schema_v2.json
- Create indexes for conversation_id, platform, timestamp_utc
- Add GIN index for full-text search
- CRITICAL: Gemini validation CHECK constraint (conversation_id = id)
- Migration script with batch imports (1000 rows/txn)

Deliverables:
- database/schema.sql
- database/migration.py
- tests/test_schema.py
```

---

### 2. Claude Sonnet 4.5 / Opus 4 (Anthropic Family) - The Orchestrator & Reviewer

**Primary Role**: Workflow Orchestration, Code Review, Quality Assurance

**Why Claude is Best for Orchestrating & Reviewing**:

✅ **Critical Thinking**: Challenges assumptions, finds edge cases
✅ **Security-First**: Spots SQL injection, XSS, auth bypasses
✅ **Long Context**: Handles 200K tokens (full project awareness)
✅ **Detail-Oriented**: Catches subtle bugs GPT-5 misses
✅ **Documentation**: Superior technical writing quality
✅ **Honesty**: Won't blindly approve code (anti-sycophancy)

**What Claude Excels At**:
- **Blind Code Review**: Reviewing without knowing who wrote it
- **Security Audits**: Finding vulnerabilities (OWASP Top 10)
- **Data Integrity Validation**: Schema compliance, constraint enforcement
- **Architectural Analysis**: System design, trade-off evaluation
- **Technical Documentation**: READMEs, API docs, handoff materials
- **Edge Case Discovery**: "What if timestamp is null?", "What if content >1MB?"
- **Multi-Agent Orchestration**: Spawning sub-agents, coordinating workflows

**What Claude Misses** (Why it needs GPT-5 for building):
- Slower at code generation (10-20 seconds for function)
- Less aggressive optimization (prefers readability over performance)
- Verbose explanations (needs prompting for concise answers)
- Over-caution (flags low-risk issues as medium-risk)

**When to Use Claude**:
- ✅ **Orchestrating Workflows**: Managing multi-step tasks autonomously
- ✅ **Code Review**: Verification Agent (fresh chat, blind review)
- ✅ **Data-Quality Checks**: Validating schema compliance, Gemini constraints
- ✅ **Security Review**: SQL injection, XSS, authentication audits
- ✅ **Documentation**: Writing handoff docs, progress reports, decision logs
- ✅ **Architecture Decisions**: Evaluating database choices (PostgreSQL vs DuckDB)

**When NOT to Use Claude**:
- ❌ Initial implementation (use GPT-5 for speed)
- ❌ Repetitive tasks (GPT-5 faster for boilerplate)
- ❌ Performance optimization (GPT-5 better at SQL tuning)

**Example Claude Task**:
```
You are the Verification Agent conducting a BLIND REVIEW.

You do NOT know who wrote this code.

SPEC: PostgreSQL schema for 251,138 messages
CODE: [paste schema.sql]
EVIDENCE: [paste test results]

Review Checklist:
- [ ] Correctness vs SPEC
- [ ] Gemini validation enforced (conversation_id = id)
- [ ] SQL injection prevention
- [ ] Edge cases (null timestamps, long content)
- [ ] Performance (indexes appropriate)

Risk Score: 0-10
Recommendation: APPROVE / APPROVE WITH CHANGES / REJECT
```

---

### 3. Google Gemini 2.0 Pro (Google Family) - The Third-Party Validator

**Primary Role**: Independent Third-Party Perspective (T3 Critical Changes Only)

**Why Gemini is the Third Opinion**:

✅ **Different Architecture**: Catches blind spots both GPT and Claude miss
✅ **Fresh Perspective**: Not influenced by OpenAI or Anthropic training
✅ **Maintainability Focus**: Evaluates long-term code health
✅ **Differential Analysis**: Compares GPT vs Claude recommendations

**What Gemini Excels At**:
- **Maintainability Lens**: Code clarity, documentation, technical debt
- **Alternative Approaches**: "Have you considered using X instead of Y?"
- **Breaking Ties**: When GPT and Claude disagree, Gemini decides
- **Sanity Checks**: "This entire approach seems wrong, here's why"
- **Future-Proofing**: "This will be hard to maintain in 6 months"

**When to Use Gemini** (T3 ONLY):
- ⚠️ **Security-Critical Changes**: Authentication, authorization, encryption
- ⚠️ **PII/Data Handling**: Personal data, GDPR compliance
- ⚠️ **Billing/Payment Logic**: Money calculations, transaction processing
- ⚠️ **Data Deletion**: Irreversible operations
- ⚠️ **Access Control**: Role-based permissions, API keys

**When NOT to Use Gemini**:
- ❌ T0/T1/T2 work (overkill, use GPT-5 + Claude only)
- ❌ Documentation tasks (Claude is better)
- ❌ Code generation (GPT-5 is faster)
- ❌ Routine reviews (wastes API costs)

**Example Gemini Task** (T3 Multi-Model Workflow):
```
You are the Maintainability-First Lens in a T3 critical change review.

SPEC: Implement user authentication with JWT tokens
CODE: [paste auth.py]
EVIDENCE: [paste security test results]

Other Models Said:
- GPT-5 (Builder): "Implementation complete, tests passing"
- Claude (Security Lens): "Add rate limiting, CSRF protection"
- GPT-4o (Performance Lens): "Cache JWT validation"

Your Focus: Maintainability & Long-Term Health

Questions:
1. Is this code readable for future developers?
2. Will this be easy to debug in production?
3. Is the error handling helpful?
4. Are there hidden dependencies?
5. Technical debt introduced?

Output:
- Maintainability Risk: 0-10
- Technical Debt Items: [list]
- Recommendation: APPROVE / NEEDS WORK
```

**T3 Workflow** (All 3 Models):
1. GPT-5 Codex: Build implementation
2. Claude Opus: Security-First Lens
3. GPT-4o: Performance-First Lens
4. **Gemini 2.0**: Maintainability-First Lens
5. Claude Sonnet: Resilience-First Lens
6. **Differential Comparison**: Where do models agree/disagree?
7. Human Approval: Final decision with senior developer

---

## 🔄 Daily Workflow: How the Models Work Together

### Typical Day (T2 Database Work)

**Morning (9am-12pm): GPT-5 Builds**

```mermaid
You → GPT-5 Codex: "Implement database import script per spec"
GPT-5 → You: [Provides import.py + tests]
You → Local Terminal: Run tests, collect evidence
```

**Afternoon (1pm-3pm): Claude Reviews**

```mermaid
You → Claude Code (NEW CHAT): "!verify [paste spec + code + evidence]"
Claude → Verification Agent: Independent blind review
Claude → Data-Quality Agent: Schema validation
Claude → You: Risk score 3/10, recommend adding error handling
```

**Late Afternoon (3pm-5pm): Iterate & Merge**

```mermaid
You → GPT-5 Codex: "Fix error handling per Claude's review"
GPT-5 → You: [Updated import.py]
You → Claude Code (NEW CHAT): "!verify [paste updated code]"
Claude → You: Risk score 1/10, APPROVED
You → Git: Commit + push with evidence
```

**Total Time**:
- Your involvement: ~30 minutes (copy-paste between models)
- AI work: ~6 hours (autonomous)
- Result: Production-ready code with multi-model verification

---

## 📊 Model Comparison Matrix

| Capability | GPT-5 Codex | Claude Sonnet/Opus | Gemini 2.0 Pro |
|------------|-------------|-------------------|----------------|
| **Code Generation Speed** | ⭐⭐⭐⭐⭐ Fastest | ⭐⭐⭐ Moderate | ⭐⭐⭐ Moderate |
| **SQL Expertise** | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐ Great | ⭐⭐⭐ Good |
| **Security Auditing** | ⭐⭐ Misses issues | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐ Great |
| **Edge Case Discovery** | ⭐⭐ Misses many | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐ Great |
| **Documentation Quality** | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐ Great |
| **Anti-Sycophancy** | ⭐ Agrees with self | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐ Great |
| **Context Window** | ⭐⭐⭐ 128K tokens | ⭐⭐⭐⭐⭐ 200K | ⭐⭐⭐⭐ 1M+ |
| **Cost per Task** | ⭐⭐⭐ $0.01 | ⭐⭐⭐⭐ $0.02 | ⭐⭐⭐⭐⭐ $0.005 |
| **Best For** | Building | Reviewing | Tiebreaking |

---

## 🎭 Why Claude is Best to Manage This Workflow

### Claude's Unique Advantages as Orchestrator

**1. Long Context Awareness (200K tokens)**
- Can hold entire project in memory (all code, docs, handoffs)
- Reads full git history, all previous decisions
- No "forgetting" between sessions (with state serialization)

**2. Task Tool / Agent Spawning**
- Spawns Builder agents (for implementation)
- Spawns Verifier agents (fresh context for review)
- Spawns Data-Quality agents (schema validation)
- Coordinates between agents without your intervention

**3. Anti-Sycophancy Enforcement**
- Ensures Builder never reviews its own code
- Creates fresh contexts for each review
- Validates blind review actually happened
- Flags if agents are being too agreeable

**4. Evidence-Based Validation**
- Runs `./scripts/make_evidence.sh` automatically
- Pastes actual tool outputs (pytest, ruff, mypy)
- Never accepts claims ("tests pass") without proof
- Validates Gemini constraints programmatically

**5. Decision Log Generation**
- Tracks which model made which decision
- Records rationale with model attribution
- Creates JSON decision logs for audit trail
- Enables reproducibility (same inputs → same outputs)

**6. Handoff Material Creation**
- Writes progress reports automatically
- Serializes session state (cognitive context)
- Creates handoff docs for next AI/human
- Preserves model lineage (who did what)

**Example Claude Orchestration**:
```
User: "Implement PostgreSQL schema per CLAUDE.md requirements"

Claude (Orchestrator):
  ├─ Reads CLAUDE.md, canonical_schema_v2.json, latest handoff
  ├─ Spawns Builder Agent (Task tool) → Implements schema.sql
  ├─ Runs evidence script → Collects pytest/ruff/mypy outputs
  ├─ Spawns Verifier Agent (fresh context) → Reviews blindly
  ├─ Spawns Data-Quality Agent (fresh context) → Validates schema
  ├─ Synthesizes results → Risk scores, issues, recommendations
  └─ Presents to user: "Risk 2/10, recommend adding index on role"

User: "Approve"

Claude:
  ├─ Commits with comprehensive message
  ├─ Creates decision log (JSON)
  ├─ Updates master to-do list
  └─ Pushes to GitHub

User involvement: 2 messages (task + approval)
```

---

## 🔧 Practical Workflow Examples

### Example 1: T2 Database Schema (GPT-5 + Claude)

**Step 1: You → GPT-5 Codex**

Paste in ChatGPT:
```
Read docs/GPT5_CODEX_SPEC_duckdb_fixes.md

Implement all 3 fixes:
1. SQL injection prevention
2. Test suite (tests/test_duckdb_import.py)
3. Error handling

Provide updated build_duckdb.py and new test file.
```

**Step 2: GPT-5 → You**

GPT provides:
- Updated `scripts/build_duckdb.py` (with SQL injection fix)
- New `tests/test_duckdb_import.py` (8 test cases)
- Brief explanation of changes

**Step 3: You → Claude Code**

Create NEW Claude Code chat, paste:
```
I have GPT-5 Codex's implementation. Please re-audit.

[Paste updated build_duckdb.py]
[Paste new test_duckdb_import.py]

Run verification and data-quality review in fresh contexts.
```

**Step 4: Claude → Autonomous Audit**

Claude spawns agents:
- Verification Agent: Checks if SQL injection fixed → ✅ PASS
- Data-Quality Agent: Validates test coverage → ✅ 8/8 tests, good

**Step 5: Claude → You**

```
Re-Audit Complete ✅

Verification Agent (Fresh Context):
- Risk Score: 2/10 (down from 6/10)
- SQL injection: FIXED ✅
- Error handling: IMPROVED ✅
- All critical issues resolved ✅

Data-Quality Agent (Fresh Context):
- Test Coverage: 8/8 passing ✅
- Gemini validation: Tested ✅
- Security test: SQL injection rejected ✅

Recommendation: APPROVED FOR MERGE

Shall I commit with evidence?
```

**Step 6: You**

Reply: `yes`

**Step 7: Claude → Git**

```bash
git add scripts/build_duckdb.py tests/test_duckdb_import.py
git commit -m "fix: Add SQL injection prevention and comprehensive test suite

Risk Tier: T2 (Database/Pipelines)
Models: GPT-5 Codex (Builder) + Claude Sonnet 4.5 (Verifier + Data-Quality)

Fixes Implemented:
1. SQL injection prevention (validate_identifier function)
2. Comprehensive test suite (8 test cases)
3. Error handling (try/except blocks)

Evidence:
- All 8 tests passing ✅
- SQL injection attempt rejected ✅
- ruff clean ✅
- mypy clean ✅

Independent Verification:
- Verification Agent: Risk 2/10 (down from 6/10) - APPROVED
- Data-Quality Agent: Test coverage adequate - APPROVED

Decision Log: logs/ai-decisions/DECISION_2025-12-01_duckdb-fixes.json

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

**Done!** Total time: 20 minutes (your involvement: 5 minutes)

---

### Example 2: T3 Authentication (GPT-5 + Claude + Gemini)

**When to Trigger T3**: Adding user authentication (security-critical)

**Workflow**:

1. **GPT-5 Codex (Builder)**: Implement JWT authentication
2. **Claude Opus (Security-First Lens)**: Audit for vulnerabilities
3. **GPT-4o (Performance-First Lens)**: Check token validation speed
4. **Gemini 2.0 Pro (Maintainability-First Lens)**: Evaluate code clarity
5. **Claude Sonnet (Resilience-First Lens)**: Test failure scenarios
6. **Claude Orchestrator**: Differential comparison of all 4 lenses
7. **You (Human)**: Final approval with senior developer review

**Multi-Model Agreement**:
```
Security (Claude Opus):   Risk 4/10 - Add rate limiting
Performance (GPT-4o):     Risk 2/10 - Cache JWT validation
Maintainability (Gemini): Risk 5/10 - Improve error messages
Resilience (Claude):      Risk 3/10 - Add token refresh logic

Consensus: 3/4 recommend improvements
Conflicts: None (all agree on core safety)
Aggregate Risk: 3.5/10 (Medium-Low)

Recommendation: APPROVE WITH CHANGES
- Add rate limiting (Security concern)
- Improve error messages (Maintainability)
- Add token refresh (Resilience)
```

**Time**: 2-3 hours total (your involvement: 15 minutes)

---

## 📋 Decision Tree: Which Model to Use?

```
START: What type of task?

├─ CODE GENERATION?
│  └─ Use GPT-5 Codex (fastest, best at SQL/APIs/web)
│
├─ CODE REVIEW?
│  ├─ T0/T1/T2? → Use Claude (Verification + Data-Quality)
│  └─ T3?       → Use Claude + GPT + Gemini (4 lenses)
│
├─ DOCUMENTATION?
│  └─ Use Claude (best technical writing)
│
├─ ARCHITECTURE DECISION?
│  └─ Use Claude (evaluates trade-offs thoroughly)
│
├─ SECURITY AUDIT?
│  └─ Use Claude (spots vulnerabilities GPT misses)
│
├─ PERFORMANCE OPTIMIZATION?
│  └─ Use GPT-5 Codex (SQL tuning, caching strategies)
│
└─ WORKFLOW ORCHESTRATION?
   └─ Use Claude (Task tool, agent spawning, evidence collection)
```

---

## 🎯 Success Criteria: When to Use Each Model

### Use GPT-5 Codex When:
- ✅ You need code FAST (deadlines, prototyping)
- ✅ Task is well-defined (clear spec, no ambiguity)
- ✅ You're doing bulk work (10+ similar functions)
- ✅ Performance matters (query optimization)
- ✅ You'll review the code anyway (pair programming)

### Use Claude When:
- ✅ Quality > speed (production code, legal use)
- ✅ Security matters (authentication, data handling)
- ✅ Complex review needed (multi-file changes)
- ✅ Documentation required (handoffs, READMEs)
- ✅ Orchestrating multi-step workflows
- ✅ Long-term maintenance concerns

### Use Gemini When:
- ⚠️ T3 critical change (security/PII/billing)
- ⚠️ GPT and Claude disagree (need tiebreaker)
- ⚠️ Architecture pivot (major design decision)
- ⚠️ Sanity check on complex logic

### Use All Three When:
- 🔴 **T3 CRITICAL**: Authentication, encryption, payments
- 🔴 **High Stakes**: Court evidence, regulatory compliance
- 🔴 **Major Refactor**: Database migration, API redesign
- 🔴 **Conflicting Opinions**: Models disagree on approach

---

## 💰 Cost Optimization

### Estimated Costs per Task

| Task Type | Models Used | Tokens | Cost | Time |
|-----------|------------|--------|------|------|
| **T1 Helper Function** | GPT-5 + Claude | 10K | $0.03 | 15 min |
| **T2 Database Schema** | GPT-5 + Claude | 50K | $0.15 | 1 hour |
| **T3 Authentication** | GPT-5 + Claude + GPT + Gemini | 200K | $0.80 | 3 hours |

**Monthly Budget** (Phase 3 estimate):
- 20 T1 tasks: $0.60
- 10 T2 tasks: $1.50
- 2 T3 tasks: $1.60
- **Total**: ~$4/month for Phase 3

**Compare to Single Developer**:
- Hourly rate: $100/hour (senior developer)
- Phase 3 estimate: 80 hours
- Cost: $8,000

**Multi-Model Savings**: $7,996 (~99.95% reduction)

---

## 🚀 Getting Started: Your First Multi-Model Task

### Step 1: Choose a Task (Start Small)

**Good First Task** (T1):
```
Add a helper function: format_message_preview(content_text, max_length=100)

Requirements:
- Truncate to max_length
- Add "..." if truncated
- Handle None (return "N/A")
- Write tests
```

### Step 2: GPT-5 Builds

Paste in ChatGPT:
```
Task: Add helper function format_message_preview

[Paste requirements above]

Provide:
- Code (utils.py)
- Tests (test_utils.py)
```

### Step 3: Local Testing

```bash
# Save GPT's code
# Run tests
python3 -m pytest tests/test_utils.py -v

# Collect evidence
./scripts/make_evidence.sh format-preview
```

### Step 4: Claude Reviews (NEW CHAT)

In fresh Claude Code chat:
```
!review

SPEC: Helper function format_message_preview
CODE: [paste utils.py]
TESTS: [paste test_utils.py]
EVIDENCE: [paste evidence file]

Risk tier: T1
Review and recommend.
```

### Step 5: Iterate or Merge

**If Claude approves** → Commit
**If Claude flags issues** → Back to GPT-5, fix, re-review

### Step 6: Repeat for Bigger Tasks

Once comfortable with T1 flow:
- Move to T2 (database schemas, API endpoints)
- Eventually T3 (authentication, encryption)

---

## 📚 Key Takeaways

### The Multi-Model Philosophy

1. **No Single AI is Perfect**: Each family has blind spots
2. **Fresh Chat = Fresh Perspective**: Never review your own code
3. **Evidence > Claims**: Paste actual test outputs, not "tests pass"
4. **Model Attribution**: Track who made which decision
5. **Progressive Complexity**: T1 (1 model) → T2 (2 models) → T3 (3+ models)

### Why This Works

**Before Multi-Model**:
- AI writes code → You review → Bugs slip through
- AI agrees with itself (sycophancy)
- No audit trail (who decided what?)

**After Multi-Model**:
- GPT builds → Claude reviews blindly → Catches bugs
- Independent verification (fresh contexts)
- Full audit trail (decision logs, model attribution)

### The Bottom Line

**GPT-5 Codex**: Fast builder, needs oversight
**Claude**: Thorough reviewer, orchestrates workflow
**Gemini**: Independent validator, breaks ties
**You**: Strategic decisions, final approval

**Together**: Production-ready code at 1/100th the cost of human developers

---

## 🔗 Related Documentation

**Framework**:
- [CLAUDE.md](../CLAUDE.md) - Master AI rules (auto-read)
- [docs/AI_CODING_SETUP.md](AI_CODING_SETUP.md) - Daily workflow guide
- [docs/T3_MULTI_MODEL_WORKFLOW.md](T3_MULTI_MODEL_WORKFLOW.md) - Critical change process

**Workflows**:
- [.claude/commands/t1-workflow.md](../.claude/commands/t1-workflow.md) - Simple tasks
- [.claude/commands/t2-workflow.md](../.claude/commands/t2-workflow.md) - Database work
- [.claude/commands/t3-workflow.md](../.claude/commands/t3-workflow.md) - Critical changes

**Evidence**:
- [scripts/make_evidence.sh](../scripts/make_evidence.sh) - Evidence collection
- [evidence/](../evidence/) - Generated proof-of-work files

**Handoffs**:
- [docs/handoffs/](handoffs/) - AI session handoff documents
- [state/](../state/) - Session state serialization (JSON)

---

## ❓ FAQ

**Q: Why not just use Claude for everything?**
A: Claude is slower at code generation (10-20 sec per function). GPT-5 Codex generates code 10x faster. Use the right tool for the job.

**Q: Can I use other models (Grok, Mistral, etc.)?**
A: Yes, but GPT/Claude/Gemini have proven track records for this workflow. Other models may work but lack testing.

**Q: What if GPT and Claude disagree?**
A: For T1/T2, Claude's review wins (bias toward quality). For T3, add Gemini as tiebreaker.

**Q: Do I need API access or can I use web UIs?**
A: Web UIs work fine! Copy-paste between ChatGPT, Claude.ai, and Gemini. API access just automates the copy-paste.

**Q: How do I prevent Claude from seeing GPT's explanation?**
A: Use **blind review**: Only paste spec + code + evidence. Do NOT paste GPT's explanation/reasoning.

**Q: What if I can't afford all 3 models?**
A: Start with GPT-5 + Claude only (covers 95% of tasks). Add Gemini later for T3 critical work.

**Q: How do I know which risk tier to use?**
A: See CLAUDE.md:
- T0: Docs only
- T1: Helper functions, utilities (DEFAULT)
- T2: Database, pipelines, APIs (CURRENT PROJECT)
- T3: Security, PII, billing

**Q: Can I use this workflow for non-Python projects?**
A: Yes! Works for any language. Just adjust linting tools (ruff → eslint, mypy → tsc, etc.)

---

**Last Updated**: 2025-12-01
**Maintained By**: Claude Sonnet 4.5 (Orchestrator)
**For**: SC KMH Platform Provider Source of Truth Project

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

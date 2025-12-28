# Using SparkData Agentic Framework with Claude Code

**Version**: 0.2.0-dev
**Last Updated**: 2025-12-02

---

## Overview

The SparkData Agentic Framework integrates seamlessly with **Claude Code** to provide **real agent spawning** for blind code review. This guide shows you how to use the framework from within a Claude Code session.

---

## Quick Start

### 1. Install Framework in Your Project

```bash
# In your project directory
pip install sparkdata-agentic-framework

# Initialize
sparkdata-agentic init
```

### 2. Open Claude Code Session

Start a Claude Code session in your project directory:

```bash
cd my-project/
# Start Claude Code (via your preferred method)
```

### 3. Use Framework Commands via Claude Code

In your Claude Code chat, you can now request framework operations:

```markdown
User: "Use the SparkData Agentic Framework to build a spec for adding user authentication"

Claude Code: I'll use the framework to generate a detailed specification...
[Runs: sparkdata-agentic build "Add user authentication" --tier T2]
```

---

## Complete T2 Workflow Example (via Claude Code)

This example shows a **complete T2 workflow** for adding a database table, demonstrating how Claude Code spawns agents for blind review.

### Step 1: Request Specification Generation

**Your message to Claude Code**:
```markdown
I need to add a user_sessions table to track active sessions. Please use the
SparkData Agentic Framework to generate a T2 specification for this feature.
```

**Claude Code responds**:
```markdown
I'll generate a T2 specification using the framework.

[Runs: sparkdata-agentic build "Add user_sessions table" --tier T2]

Specification created: docs/SPEC_add_user_sessions_table.md

The spec includes:
- Database schema requirements
- Foreign key constraints
- Index requirements
- Security constraints
- Success criteria

Would you like me to proceed with implementation?
```

### Step 2: Request Implementation

**Your message**:
```markdown
Yes, please implement according to the spec. Create the migration, model, and tests.
```

**Claude Code responds**:
```markdown
I'll implement the user_sessions table according to the specification.

[Creates files: migrations/add_user_sessions.sql, src/models/session.py, tests/test_session.py]

Implementation complete. Files created:
- migrations/20251202_add_user_sessions.sql (schema + indexes)
- src/models/session.py (UserSession model)
- tests/test_session.py (10 test cases including NULL handling, edge cases)

Should I collect evidence and proceed with agent review?
```

### Step 3: Request Evidence Collection

**Your message**:
```markdown
Yes, collect evidence and run the dual-agent review for T2.
```

**Claude Code responds**:
```markdown
Collecting evidence...

[Runs: sparkdata-agentic review --files "migrations/*.sql,src/models/session.py,tests/test_session.py" --tier T2]

Evidence collected: evidence/evidence_sessions_20251202_150000.txt

Results:
- ✅ Tests: 10/10 passed
- ✅ Linting: No issues
- ✅ Type checking: Passed

Now I'll spawn dual agents for T2 review (Verification + Data-Quality).
```

### Step 4: Agent Spawning (Automatic via Claude Code)

**Claude Code automatically spawns agents**:

```markdown
Spawning Verification Agent in fresh context...

[Uses Task tool to spawn agent with blind review prompt]

Agent A (Verification) completed:
- Risk Score: 4/10
- Verdict: APPROVE_WITH_CHANGES
- Critical Issues: 0
- Findings: 2 (MEDIUM severity)

Spawning Data-Quality Agent in fresh context...

[Uses Task tool to spawn second agent]

Agent B (Data-Quality) completed:
- Risk Score: 6/10
- Verdict: APPROVE_WITH_CHANGES
- Critical Issues: 1 (NULL handling)
- Findings: 3 (1 HIGH, 2 MEDIUM)

Synthesizing findings from both agents...
```

### Step 5: Review Agent Findings

**Claude Code presents synthesis**:

```markdown
## Agent Review Synthesis

**Overall Risk**: 5.0/10
**Consensus**: APPROVE_WITH_CHANGES
**Critical Issues**: 1

### Verification Agent Findings:
1. [MEDIUM] Missing rate limiting on cleanup endpoint
2. [MEDIUM] Generic error messages (should add structured logging)

### Data-Quality Agent Findings:
1. [HIGH] Missing NULL validation for user_id parameter
2. [MEDIUM] No boundary tests for expires_in_hours (0, negative values)
3. [MEDIUM] Race condition on session_token uniqueness check

### Recommended Fixes (Priority Order):
1. Add NULL validation for user_id (HIGH priority - data integrity)
2. Add boundary value tests
3. Fix race condition by catching IntegrityError instead of pre-check

Should I implement these fixes?
```

### Step 6: Request Fixes

**Your message**:
```markdown
Yes, please implement all recommended fixes.
```

**Claude Code implements fixes**:

```markdown
Implementing agent feedback...

[Updates src/models/session.py with NULL checks, boundary validation]
[Adds boundary tests to tests/test_session.py]
[Fixes race condition handling]

Fixes implemented. Re-running evidence collection...

[Runs: sparkdata-agentic review --files "..." --tier T2]

Updated evidence: evidence/evidence_sessions_20251202_151500.txt

Re-spawning agents for verification of fixes...

[Spawns both agents again in fresh contexts]

Agent A (Verification): Risk 3/10, APPROVE ✅
Agent B (Data-Quality): Risk 4/10, APPROVE ✅

All critical issues resolved. Ready to commit.
```

### Step 7: Commit with Evidence

**Your message**:
```markdown
Perfect! Please commit with the full evidence trail.
```

**Claude Code commits**:

```markdown
Creating decision log and committing...

[Creates: logs/ai-decisions/DECISION_20251202_151500.json]
[Commits with comprehensive message including agent findings]

Committed: feat: Add user_sessions table for session management

Commit includes:
- Complete agent review findings
- Decision log with risk scores
- Evidence file references
- Critical issues fixed

Would you like me to push to remote?
```

---

## How Agent Spawning Works (Behind the Scenes)

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Claude Code Session (You are here)                          │
│                                                              │
│  User: "Run dual-agent review for T2"                       │
│                                                              │
│  Claude Code:                                                │
│  1. Calls framework: sparkdata-agentic review --tier T2     │
│  2. Framework collects evidence                              │
│  3. Framework requests agent spawning                        │
│  4. Claude Code intercepts spawn request                     │
│  5. Claude Code uses Task tool to spawn fresh agent         │
│                                                              │
│     ┌──────────────────────────────────────┐               │
│     │ Task Tool (Fresh Context)             │               │
│     │                                        │               │
│     │ Agent receives:                        │               │
│     │ - Specification only                   │               │
│     │ - Code only                            │               │
│     │ - Evidence only                        │               │
│     │ - NO builder explanation               │               │
│     │                                        │               │
│     │ Agent performs blind review            │               │
│     │ Returns structured report              │               │
│     └──────────────────────────────────────┘               │
│                                                              │
│  6. Claude Code receives agent report                        │
│  7. Framework parses report                                  │
│  8. Claude Code presents findings to you                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

**Fresh Context Separation**:
- Builder context (Claude Code session): Implements code
- Reviewer context (Task agent): Reviews code in isolation
- **NO overlap** → Prevents AI sycophancy (false approvals)

**Blind Review**:
- Agent sees ONLY: spec + code + evidence
- Agent does NOT see: chat history, builder explanations, user comments
- Ensures objective review based solely on evidence

**Structured Output**:
- Agents return reports in standard format
- Framework parses reports automatically
- Risk scores, verdicts, findings are machine-readable

---

## Python API Usage (Advanced)

For programmatic use within Claude Code session:

```python
from sparkdata_agentic.integrations.claude_code import (
    spawn_verification_agent,
    spawn_data_quality_agent
)

# Spawn verification agent
verification_result = spawn_verification_agent(
    spec_file="docs/SPEC_feature.md",
    impl_files=["src/feature.py", "tests/test_feature.py"],
    evidence_file="evidence/evidence_feature.txt",
    risk_tier="T2"
)

# Spawn data-quality agent
data_quality_result = spawn_data_quality_agent(
    spec_file="docs/SPEC_feature.md",
    impl_files=["src/models/feature.py", "migrations/feature.sql"],
    evidence_file="evidence/evidence_feature.txt",
    risk_tier="T2"
)

# Both calls will prompt Claude Code to use Task tool
# Results are returned as structured dictionaries
```

**Note**: This Python API is designed to be called **from within a Claude Code chat**, not from standalone Python scripts. It relies on Claude Code's Task tool.

---

## Comparison: Manual vs Claude Code Integration

### Manual Workflow (Without Claude Code)

```bash
# 1. Generate spec
sparkdata-agentic build "Add feature" --tier T2

# 2. Implement manually

# 3. Collect evidence
sparkdata-agentic review --files "..." --tier T2

# 4. Copy evidence to new chat window
#    Paste into fresh Claude chat for review
#    Wait for agent response
#    Copy response back

# 5. Parse agent response manually

# 6. Repeat for second agent (Data-Quality)

# 7. Synthesize findings manually

# 8. Commit
```

**Time**: ~30 minutes of manual copying/pasting

### Claude Code Workflow (Automated)

```markdown
User: "Use SparkData Agentic Framework to add user_sessions table (T2 workflow)"

Claude Code:
- Generates spec ✅
- Implements code ✅
- Collects evidence ✅
- Spawns both agents automatically ✅
- Synthesizes findings ✅
- Presents recommendations ✅
- Implements fixes ✅
- Commits with evidence ✅
```

**Time**: ~5 minutes of actual user interaction (rest is automated)

**Speedup**: 6x faster with full automation

---

## Best Practices for Claude Code Users

### 1. Request Full Workflows

**Good**:
```markdown
"Use the SparkData Agentic Framework to implement user authentication with T3 workflow"
```

Claude Code will:
- Generate spec
- Implement
- Collect evidence
- Spawn all 4 agents (T3 requires 4-lens review)
- Synthesize
- Commit

**Avoid**:
```markdown
"Write user authentication code"
```

This bypasses the framework and misses the benefits of agent review.

### 2. Trust Agent Feedback

If agents flag issues, they're usually correct. Don't argue with the findings—implement the fixes:

```markdown
"The Data-Quality agent found a NULL handling issue. Please implement the recommended fix."
```

### 3. Use Correct Tiers

Ask Claude Code to determine the appropriate tier:

```markdown
"What tier should I use for adding a payment processing endpoint?"

Claude Code: "This is T3 (Critical) because it involves billing logic. T3 requires:
- 4 agents (Verification, Data-Quality, Security-First, Resilience-First)
- Multi-model review (Claude + Gemini)
- Lead approval before commit
- 3-4 hours estimated time"
```

### 4. Review Agent Reports

Always review the agent findings before committing:

```markdown
"Show me the detailed findings from both agents before implementing fixes."
```

---

## Troubleshooting

### "Agent spawning failed"

**Cause**: Not running in Claude Code environment

**Fix**: Ensure you're in an active Claude Code session. The framework requires Claude Code's Task tool.

### "Agent gave generic response"

**Cause**: Agent didn't receive enough context

**Fix**: Ensure evidence file includes:
- ✅ Complete pytest output
- ✅ Actual ruff/mypy results
- ✅ Git diff showing changes

### "Two agents gave conflicting verdicts"

**Cause**: Normal! Different lenses find different issues

**Example**:
- Verification: "APPROVE" (no security issues)
- Data-Quality: "REJECT" (critical NULL handling bug)

**Fix**: The consensus algorithm prioritizes safety—if ANY agent rejects, the overall verdict is REJECT. Implement all critical fixes.

---

## Advanced: Multi-Model Review (T3)

For T3 (Critical) workflows, Claude Code can spawn agents using **different model families**:

```markdown
User: "Run T3 review for JWT authentication implementation"

Claude Code:
- Spawning Agent 1 (Verification) with Claude Sonnet 4.5...
- Spawning Agent 2 (Data-Quality) with Claude Sonnet 4.5...
- Spawning Agent 3 (Security-First) with Claude Sonnet 4.5...
- Spawning Agent 4 (Resilience-First) with Gemini 2.0 Pro...

[Uses different models for diversity in review]

Multi-model synthesis:
- 3 Claude agents: Average risk 5.3/10
- 1 Gemini agent: Risk 6.0/10
- Overall risk: 5.5/10
- Consensus: APPROVE_WITH_CHANGES
```

Different models find different issues—this is a **feature**, not a bug.

---

## Cost Analysis

### Agent Spawning Costs (Claude Code + Framework)

| Workflow | Agents | Model | API Cost | Manual Equivalent | Savings |
|----------|--------|-------|----------|-------------------|---------|
| T1 | 1 | Claude Sonnet 4.5 | ~$0.01 | $100-150 | 99.99% |
| T2 | 2 | Claude Sonnet 4.5 | ~$0.02 | $200-300 | 99.99% |
| T3 | 4 | Claude + Gemini | ~$0.05 | $400-600 | 99.99% |

**Example T2 Calculation**:
- Agent spawn: 2 agents × 2000 tokens input × $0.000003 = $0.012
- Agent response: 2 agents × 1500 tokens output × $0.000015 = $0.045
- **Total**: ~$0.06 per T2 review

Compare to: Senior engineer (2 hours @ $150/hr) = $300

**ROI**: 5,000x return on investment

---

## See Also

- [Workflows Guide](WORKFLOWS.md) - Complete T0-T3 workflows
- [API Reference](API_REFERENCE.md) - Framework API documentation
- [Examples](../examples/) - Real-world examples
- [Agent Spawning Integration](AGENT_SPAWNING_INTEGRATION.md) - Technical details

---

**Maintained by**: SparkData Analytics, LLC
**Support**: For Claude Code integration help, see [Agent Spawning Integration](AGENT_SPAWNING_INTEGRATION.md)

# SparkData Agentic Framework - Workflow Guides

**Version**: 0.2.0-dev
**Last Updated**: 2025-12-02

---

## Table of Contents

1. [Overview](#overview)
2. [T0 Workflow - Documentation Only](#t0-workflow---documentation-only)
3. [T1 Workflow - Standard Features](#t1-workflow---standard-features)
4. [T2 Workflow - Database & Pipelines](#t2-workflow---database--pipelines)
5. [T3 Workflow - Critical Changes](#t3-workflow---critical-changes)
6. [Workflow Decision Tree](#workflow-decision-tree)
7. [Time Estimates](#time-estimates)

---

## Overview

SparkData Agentic Framework uses **risk-tiered workflows** to match review rigor to change criticality.

### Risk Tiers

| Tier | Name | Review | Use Cases | Time |
|------|------|--------|-----------|------|
| **T0** | Documentation | None | Docs, README, comments | 5-15 min |
| **T1** | Standard | Verification | UI components, features | 30-60 min |
| **T2** | Database/Pipelines | Verification + Data-Quality | Database, data pipelines | 1-2 hours |
| **T3** | Critical | 4 Lenses + Multi-Model | Security, PII, billing | 3-4 hours |

### Key Principles

1. **Fresh Chat Separation**: Never review code in the same chat that generated it
2. **Blind Review**: Reviewers see spec + diff + evidence (NO builder explanation)
3. **Evidence-Based**: Always paste actual pytest/ruff/mypy output, not claims
4. **Multi-Model (T3)**: Critical changes require 2+ model families

---

## T0 Workflow - Documentation Only

**When to Use**: Documentation changes with no code impact

**Examples**:
- Update README.md
- Add comments to existing code
- Write technical documentation
- Update CHANGELOG.md

### Steps

1. **Make changes directly** (no spec needed)
2. **Commit** with conventional commit message

```bash
# Example: Update README
git add README.md
git commit -m "docs: Update installation instructions

Added troubleshooting section for common pip install errors.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Time**: 5-15 minutes
**Review**: None required

---

## T1 Workflow - Standard Features

**When to Use**: Non-critical features with no data integrity or security impact

**Examples**:
- Add UI component
- Implement new API endpoint (non-auth)
- Add utility function
- Refactor code (no behavior change)

### Steps

#### 1. Declare Tier (1 minute)

```bash
# Create tier declaration
echo "Risk Tier: T1
Feature: Add CSV export button to dashboard
Rationale: UI-only change, no data modification
Review: Verification agent (security + code quality)" > docs/TIER_DECLARATION.md
```

#### 2. Build Specification (5 minutes)

```bash
sparkdata-agentic build "Add CSV export button to dashboard" --tier T1
```

**Generated**: `docs/SPEC_add_csv_export_button_to_dashboard.md`

**Review the spec** - ensure it includes:
- ✅ Tech stack (Flask, PostgreSQL, etc.)
- ✅ Security constraints
- ✅ File structure suggestions
- ✅ Success criteria

#### 3. Implement (20-40 minutes)

**Option A: GPT-5 Codex** (recommended for speed):
1. Copy spec to ChatGPT (GPT-5 Codex Max model)
2. Paste GPT-5's code into your project
3. Verify it compiles

**Option B: Manual** (if you prefer):
1. Implement according to spec
2. Follow all constraints in CLAUDE.md

#### 4. Collect Evidence (2 minutes)

```bash
sparkdata-agentic review --files "src/export.py,tests/test_export.py" --tier T1
```

**Collected**:
- Test results (pytest)
- Linting (ruff)
- Type checking (mypy)
- Git diff

**Saved**: `evidence/evidence_export_20251202_143000.txt`

#### 5. Agent Review (NEW CHAT - 10 minutes)

**CRITICAL**: Open a **fresh chat** (new conversation) with Claude Code.

Paste this prompt:

```markdown
# Verification Agent Review Request

I need you to perform a blind security and code quality review.

**Risk Tier**: T1

**Specification**:
[paste contents of docs/SPEC_*.md]

**Implementation**:
[paste contents of src/export.py]

**Evidence**:
[paste contents of evidence/evidence_export_*.txt]

**Your Task**:
Review using the verification lens template. Output structured report:

## Risk Score: X/10
## Verdict: APPROVE|APPROVE_WITH_CHANGES|REJECT
## Findings
[findings here]
## Critical Issues: N
## Recommendations
[recommendations here]
```

**Agent returns**: Structured review with risk score, verdict, findings

#### 6. Address Issues (if needed) (10-20 minutes)

If agent found issues:
1. Fix the code
2. Re-run evidence collection
3. **NEW CHAT**: Re-submit to verification agent

#### 7. Commit (2 minutes)

```bash
git add src/export.py tests/test_export.py
git commit -m "feat: Add CSV export button to dashboard

Implemented RFC 4180 compliant CSV export with UTF-8 encoding.

Review: Verification Agent - Risk 3/10, APPROVE
Evidence: evidence/evidence_export_20251202_143000.txt

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: GPT-5 Codex <gpt5@openai.com>"
```

**Total Time**: 30-60 minutes

---

## T2 Workflow - Database & Pipelines

**When to Use**: Changes that touch data, databases, or pipelines

**Examples**:
- Add database table
- Modify schema
- Import/export scripts
- Data validation logic
- Performance optimization

### Steps

#### 1-3. Same as T1

(Declare tier, build spec, implement)

#### 4. Collect Evidence (2 minutes)

```bash
sparkdata-agentic review --files "src/models.py,tests/test_models.py" --tier T2
```

#### 5. Dual-Agent Review (NEW CHAT - 20 minutes)

**CRITICAL**: Open **two fresh chats** (separate conversations).

**Chat A: Verification Agent**

Paste verification prompt (same as T1)

**Chat B: Data-Quality Agent**

Paste this prompt:

```markdown
# Data-Quality Agent Review Request

I need you to perform a blind schema and data integrity review.

**Risk Tier**: T2

**Specification**:
[paste spec]

**Implementation**:
[paste code]

**Evidence**:
[paste evidence]

**Your Task**:
Review using the data-quality lens template. Focus on:
- Schema compliance
- SQL correctness
- NULL handling
- Edge cases

Output structured report:

## Risk Score: X/10
## Verdict: APPROVE|APPROVE_WITH_CHANGES|REJECT
## Findings
[findings]
## Critical Issues: N
## Recommendations
[recommendations]
```

#### 6. Synthesize Findings (5 minutes)

Compare both agent reports:

```python
# Example synthesis
verification_risk = 4  # from Verification Agent
data_quality_risk = 6  # from Data-Quality Agent

overall_risk = (verification_risk + data_quality_risk) / 2  # = 5.0

# Consensus
if any verdict == "REJECT":
    consensus = "REJECT"
elif all verdicts == "APPROVE":
    consensus = "APPROVE"
else:
    consensus = "APPROVE_WITH_CHANGES"
```

#### 7. Address Issues (if needed) (20-40 minutes)

If either agent found critical issues:
1. Fix the code
2. Re-run evidence
3. **NEW CHATS**: Re-submit to BOTH agents

#### 8. Decision Log (5 minutes)

Create decision log:

```json
{
  "decision_id": "add_users_table_20251202",
  "timestamp": "2025-12-02T14:30:00-07:00",
  "feature": "Add users table",
  "risk_tier": "T2",
  "agents": ["verification", "data-quality"],
  "overall_risk": 5.0,
  "consensus": "APPROVE_WITH_CHANGES",
  "critical_issues": 2,
  "approved_by": "Ryan Zimmerman",
  "rationale": "Schema validated, NULL handling added, indexes confirmed"
}
```

Save: `logs/ai-decisions/DECISION_20251202_143000.json`

#### 9. Commit (2 minutes)

```bash
git add src/models.py tests/test_models.py
git commit -m "feat: Add users table with email verification

Implemented users table with:
- Email uniqueness constraint
- Password hashing (bcrypt)
- Created_at/updated_at timestamps
- Indexes on email and created_at

Review:
- Verification Agent: Risk 4/10, APPROVE_WITH_CHANGES
- Data-Quality Agent: Risk 6/10, APPROVE_WITH_CHANGES
- Overall Risk: 5.0/10, APPROVE

Critical Issues Fixed: 2
- Added NULL check for email field
- Added index on email for lookup performance

Evidence: evidence/evidence_users_20251202_143000.txt
Decision Log: logs/ai-decisions/DECISION_20251202_143000.json

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: GPT-5 Codex <gpt5@openai.com>"
```

**Total Time**: 1-2 hours

---

## T3 Workflow - Critical Changes

**When to Use**: Changes to security, PII, billing, or core authentication

**Examples**:
- Implement authentication
- Add payment processing
- Handle PII (email, SSN, etc.)
- Modify billing logic
- Security-critical features

### Steps

#### 1. Declare Tier + Get Approval (10 minutes)

```markdown
# Risk Tier Declaration: T3

**Feature**: Implement JWT authentication with refresh tokens

**Rationale**: Security-critical change
- User credentials handling
- Token generation/validation
- Session management

**Review Plan**:
- 4 Lenses: Verification, Data-Quality, Security-First, Resilience-First
- Multi-Model: Claude Sonnet 4.5 + Gemini 2.0 Pro
- Estimated Time: 3-4 hours

**Approval Required**: Lead developer sign-off before proceeding
```

**Get approval from lead/senior before continuing**

#### 2-3. Same as T1/T2

(Build spec, implement)

#### 4. Collect Evidence (2 minutes)

```bash
sparkdata-agentic review --files "src/auth.py,tests/test_auth.py" --tier T3
```

#### 5. Four-Lens Review (4 NEW CHATS - 60 minutes)

**CRITICAL**: Open **four separate fresh chats**.

**Chat A: Verification Agent** (Claude)
- Security vulnerabilities
- Code quality

**Chat B: Data-Quality Agent** (Claude)
- Schema compliance
- Data integrity

**Chat C: Security-First Lens** (Claude)
- Deep security analysis
- Threat modeling
- Attack vectors

**Chat D: Resilience-First Lens** (Gemini 2.0 Pro)
- Failure modes
- Error handling
- Recovery scenarios

**Note**: Use different model families (Claude + Gemini) for diversity.

#### 6. Multi-Model Synthesis (15 minutes)

Compare all four agent reports:

```python
# Example synthesis
verification_risk = 5
data_quality_risk = 3
security_risk = 7
resilience_risk = 4

overall_risk = sum([...]) / 4  # = 4.75

# Consensus (stricter for T3)
if any risk >= 8 or any verdict == "REJECT":
    consensus = "REJECT"
elif any risk >= 5:
    consensus = "APPROVE_WITH_CHANGES"
else:
    consensus = "APPROVE"
```

#### 7. Address Issues (if needed) (1-2 hours)

T3 issues are often complex. Budget time for:
1. Security fixes
2. Comprehensive testing
3. Re-review by ALL agents (**4 new chats**)

#### 8. Decision Log + Approval (10 minutes)

```json
{
  "decision_id": "jwt_auth_20251202",
  "timestamp": "2025-12-02T16:00:00-07:00",
  "feature": "JWT authentication",
  "risk_tier": "T3",
  "agents": ["verification", "data-quality", "security", "resilience"],
  "models": ["claude-sonnet-4.5", "gemini-2.0-pro"],
  "overall_risk": 4.75,
  "consensus": "APPROVE_WITH_CHANGES",
  "critical_issues": 3,
  "approved_by": "Ryan Zimmerman (Lead)",
  "approval_timestamp": "2025-12-02T16:30:00-07:00",
  "rationale": "All security issues addressed, comprehensive test coverage"
}
```

**Require lead/senior approval** before committing.

#### 9. Commit (5 minutes)

Comprehensive commit message with all agent findings.

**Total Time**: 3-4 hours

---

## Workflow Decision Tree

```
Is this a code change?
  NO → T0 (Documentation Only)
  YES → Continue

Does it touch data, database, or pipelines?
  YES → T2 (Database/Pipelines)
  NO → Continue

Is it security, PII, billing, or auth?
  YES → T3 (Critical)
  NO → T1 (Standard)
```

### Examples by Category

**T0 (Documentation)**:
- Update README
- Add code comments
- Write wiki pages

**T1 (Standard)**:
- UI components
- Utility functions
- API endpoints (non-auth)
- Refactoring (no behavior change)

**T2 (Database/Pipelines)**:
- Add database table
- Modify schema
- Import/export scripts
- Data validation
- Performance optimization
- SQL query changes

**T3 (Critical)**:
- Authentication/authorization
- Payment processing
- PII handling (SSN, email, etc.)
- Billing logic
- Security-critical features
- Rate limiting
- Access control

---

## Time Estimates

### Development Time

| Activity | T0 | T1 | T2 | T3 |
|----------|----|----|----|----|
| Tier declaration | - | 1 min | 1 min | 10 min (+ approval) |
| Spec generation | - | 5 min | 5 min | 10 min |
| Implementation | 5 min | 20-40 min | 30-60 min | 60-120 min |
| Evidence collection | - | 2 min | 2 min | 2 min |
| Agent review | - | 10 min (1 agent) | 20 min (2 agents) | 60 min (4 agents) |
| Address issues | - | 10-20 min | 20-40 min | 60-120 min |
| Decision log | - | - | 5 min | 10 min |
| Commit | 2 min | 2 min | 2 min | 5 min |
| **Total** | **5-15 min** | **30-60 min** | **1-2 hours** | **3-4 hours** |

### Cost Comparison

| Workflow | Framework Cost | Manual Review Cost | Savings |
|----------|----------------|-------------------|---------|
| T0 | $0 | $10-20 | 100% |
| T1 | $0.01 | $50-100 | 99.9% |
| T2 | $0.02 | $100-200 | 99.99% |
| T3 | $0.05 | $200-300 | 99.98% |

**Note**: Framework costs are API calls only (Claude, Gemini). Manual review assumes senior engineer at $100-150/hour.

---

## Best Practices

### 1. Always Use Fresh Chat

**Why**: Prevents AI sycophancy (false approvals)

**How**:
- Builder chat: Implement code
- **NEW CHAT**: Reviewer agent (blind review)

### 2. Paste Actual Tool Output

**Bad**: "Tests pass"
**Good**:
```
============================= test session starts ==============================
collected 26 items

tests/test_auth.py::test_login PASSED                               [ 96%]
tests/test_auth.py::test_logout PASSED                              [100%]

============================= 26 passed in 1.23s ===============================
```

### 3. Don't Skip Tiers

**Don't**:
- Treat T2 change as T1 (skipping Data-Quality agent)
- Treat T3 change as T2 (skipping multi-model review)

**Do**:
- When in doubt, go up one tier
- Better to over-review than under-review

### 4. Document Decisions

Always create decision logs for T2/T3:
- What was decided
- Who approved
- Agent findings
- Rationale

---

## Troubleshooting

### "Agent didn't find obvious bug"

**Cause**: Agent didn't have enough context
**Fix**: Include more evidence (test output, error logs)

### "Agent gave false approval"

**Cause**: Reviewed in same chat as builder
**Fix**: Always use fresh chat for review

### "Review took too long"

**Cause**: Wrong tier (T3 for T1 change)
**Fix**: Review tier decision tree above

### "Agents disagree"

**Cause**: Normal! Different lenses find different issues
**Fix**: Synthesize findings, address highest-risk issues first

---

## See Also

- [API Reference](API_REFERENCE.md)
- [Agent Spawning Integration](AGENT_SPAWNING_INTEGRATION.md)
- [T3 Multi-Model Workflow](../docs/T3_MULTI_MODEL_WORKFLOW.md)
- [Quick Start](QUICKSTART.md)

---

**Maintained by**: SparkData Analytics, LLC
**License**: MIT
**Support**: support@sparkdata-analytics.com

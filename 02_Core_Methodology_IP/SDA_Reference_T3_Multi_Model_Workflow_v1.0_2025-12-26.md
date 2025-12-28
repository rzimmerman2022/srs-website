# T3 Multi-Model Workflow Guide
## Critical Changes Requiring Multiple AI Model Families

**Version**: 1.0
**Date**: 2025-11-30
**Compliance**: SparkData SOP §1.2 (Risk Tier T3)

---

## 🎯 When to Use T3 Workflow

T3 (Critical) tier applies to changes touching:
- **Security-sensitive logic** (authentication, authorization, encryption)
- **Billing/financial flows** (payment processing, invoicing, credits)
- **Regulatory/compliance code** (audit trails, data retention, SOC 2 controls)
- **PII handling** (personally identifiable information processing)
- **Core analytics IP** (MDRS/RAI algorithms, proprietary scoring)

**For this project**: Most work is T2 (database/pipelines). T3 would apply if adding:
- User authentication for web UI
- API rate limiting/billing
- Audit log export features
- PII masking in data exports

---

## 🔒 The T3 Requirement

**Minimum**: Use at least **2 different model families** across your agents

**Why**: Different model families have different training data and thus different blind spots. Using Claude + GPT catches issues that either model alone would miss.

---

## 🤖 Approved Model Families

| Family    | Models                              | Best For                      |
|-----------|-------------------------------------|-------------------------------|
| Anthropic | Claude Opus 4, Sonnet 4.5, Haiku 4  | Planning, Code Review, Security |
| OpenAI    | GPT-5 Codex Max, GPT-4o, o1-pro    | Implementation, Performance   |
| Google    | Gemini 2.0 Pro, Gemini 2.0 Ultra   | Alternative Perspective       |

**T3 Rule**: Builder and at least one Verification/Lens agent MUST use different families.

---

## 📋 Complete T3 Workflow

### Scenario: Adding User Authentication to Web UI

This is a **T3 change** because it's security-sensitive.

---

### Step 1: Risk Tier Declaration

```markdown
## Risk Tier Declaration

**Tier:** T3
**Justification:** Implementing authentication logic (security-sensitive)
**Elevating factors:**
- Handles user credentials
- Controls access to sensitive data (251,138 messages)
- Session management required
**Required Controls per SOP §1.2.2:**
- [ ] Builder Mode (GPT-5 Codex)
- [ ] Four-Lens Review (Security/Performance/Maintainability/Resilience)
- [ ] Differential Model Comparison (Claude vs GPT vs Gemini)
- [ ] Devil's Advocate (if agreement >80%)
- [ ] Senior human approval
```

---

### Step 2: Builder (Chat A - GPT-5 Codex Max)

**Chat Window**: `[B] Auth Implementation (GPT-5)`

**Model**: GPT-5 Codex Max (OpenAI family)

**Prompt**: Use `!build` snippet

```markdown
You are the **Builder Agent** for SparkData Analytics.

## METADATA:
- Model: gpt-5-codex-max
- Date/Time (UTC): 2025-11-30 10:30:00
- Risk Tier: T3
- Session ID: session-20251130-auth

## RISK TIER DECLARATION:
[PASTE: tier declaration from above]

## SPEC (requirement):
Implement JWT-based authentication for web UI:
- /api/login endpoint (POST) - accepts username/password, returns JWT
- /api/verify endpoint (GET) - validates JWT, returns user info
- Middleware to protect all /api/* routes except /login
- Session expiry: 24 hours
- Password hashing: bcrypt with salt rounds = 12

## Your Tasks:
[Standard builder tasks from prompt]
```

**Output**: Implementation code + tests

---

### Step 3: Collect Evidence

**Terminal**:
```bash
./scripts/make_evidence.sh auth-implementation
```

This generates `evidence/evidence_auth-implementation_TIMESTAMP.txt` with:
- Test results (pytest)
- Lint results (ruff)
- Type check results (mypy)

**CRITICAL**: Save this file - you'll paste it into review sessions.

---

### Step 4: Security-First Lens (Chat B - Claude Opus 4)

**Chat Window**: `[SEC] Auth Security (Claude)`

**Model**: Claude Opus 4 (Anthropic family - DIFFERENT from Builder)

**Prompt**: Use `!security` snippet

```markdown
You are applying the **Security-First Lens** (T3).

## METADATA:
- Model: claude-opus-4
- Lens: Security-First
- Risk Tier: T3

## CODE DIFF:
[PASTE: git diff output showing auth implementation]

## Focus Areas:
1. **Injection Risks**: SQL injection in login query?
2. **Authentication/Authorization**: Proper JWT validation?
3. **Data Exposure**: Password in logs? JWT secrets hardcoded?
4. **Input Validation**: Username/password sanitization?
5. **Cryptography**: Bcrypt salt rounds sufficient? JWT algo secure?

## Output:
- Security Issues: [List with severity]
- Mitigations: [What's done well]
- Risk Score: [0-10]
- Blockers: [Must-fix before merge]
```

**Save Output**: `reports/PERSPECTIVE_security_auth-implementation.md`

---

### Step 5: Performance-First Lens (Chat C - GPT-4o)

**Chat Window**: `[PERF] Auth Performance (GPT-4o)`

**Model**: GPT-4o (OpenAI family - can reuse family but different model)

**Prompt**: Use `!perf` snippet

```markdown
You are applying the **Performance-First Lens** (T3).

## METADATA:
- Model: gpt-4o
- Lens: Performance-First
- Risk Tier: T3

## CODE DIFF:
[PASTE: git diff output]

## Focus Areas:
1. **Database Queries**: N+1 queries in user lookup?
2. **Memory Usage**: JWT token caching?
3. **I/O Operations**: Bcrypt on every request or cached?
4. **Caching**: Session data cached in Redis/memory?

## Output:
- Performance Issues: [List with impact]
- Optimizations: [What's done well]
- Risk Score: [0-10]
```

**Save Output**: `reports/PERSPECTIVE_performance_auth-implementation.md`

---

### Step 6: Maintainability-First Lens (Chat D - Gemini 2.0 Pro)

**Chat Window**: `[MAINT] Auth Maintainability (Gemini)`

**Model**: Gemini 2.0 Pro (Google family - THIRD family)

**Prompt**: Similar to security/perf lens, focusing on:
- Code clarity and documentation
- Test coverage and quality
- Error handling consistency
- Dependency management

**Save Output**: `reports/PERSPECTIVE_maintainability_auth-implementation.md`

---

### Step 7: Resilience-First Lens (Chat E - Claude Sonnet 4.5)

**Chat Window**: `[RES] Auth Resilience (Claude)`

**Model**: Claude Sonnet 4.5 (Anthropic family)

**Prompt**: Focuses on:
- Failure modes and recovery
- Circuit breakers for auth service
- Rate limiting implementation
- Graceful degradation

**Save Output**: `reports/PERSPECTIVE_resilience_auth-implementation.md`

---

### Step 8: Check for Agreement (Manual)

**Review all 4 PERSPECTIVE_*.md files**:

Count overlapping issues:
```
Security Lens:
1. SQL injection risk in user lookup
2. JWT secret in environment variable (good)
3. Password complexity not enforced

Performance Lens:
1. Bcrypt on every request (no caching)
2. Database connection pool size too small
3. No rate limiting on /login endpoint

Maintainability Lens:
1. Missing docstrings on auth functions
2. Test coverage at 65% (below 80% target)
3. Error messages not user-friendly

Resilience Lens:
1. No circuit breaker for database
2. Rate limiting missing (same as perf)
3. No retry logic for transient failures
```

**Agreement Measurement**:
- Unique issues: 10
- Overlapping issues: 1 (rate limiting mentioned by 2 lenses)
- Agreement: 1/10 = 10% ✅ GOOD (below 80% threshold)

**Decision**: No need for Devil's Advocate - sufficient diversity

---

### Step 9: Differential Model Comparison (Chat F - New Model)

**Chat Window**: `[CMP] Auth Comparison (Different Model)`

**Prompt**: Use `!compare` (custom prompt)

```markdown
You are performing **Differential Model Comparison** across 3 model families.

## METADATA:
- Comparison Agent Model: claude-opus-4
- Risk Tier: T3

## INPUTS:
Builder Model: GPT-5 Codex Max (OpenAI)
Reviewer Models:
- Security: Claude Opus 4 (Anthropic)
- Performance: GPT-4o (OpenAI)
- Maintainability: Gemini 2.0 Pro (Google)
- Resilience: Claude Sonnet 4.5 (Anthropic)

## PERSPECTIVE FILES:
[PASTE: Key findings from each PERSPECTIVE_*.md]

## Your Tasks:
1. **Identify Consensus**:
   - What do ALL models agree on?
   - High-confidence issues (3+ models flagged)

2. **Identify Divergence**:
   - What did ONLY one model catch?
   - Potential blind spots if we only used one family

3. **Synthesize Recommendation**:
   - Which issues to fix immediately?
   - Which to defer?
   - Overall risk assessment (0-10)

4. **Model Attribution**:
   - Which model family was most valuable?
   - Any model family that should be replaced for this use case?
```

**Save Output**: `reports/COMPARISON_auth-implementation.md`

---

### Step 10: Decision Log

Create `logs/ai-decisions/DECISION_20251130_auth-implementation.json`:

```json
{
  "decision_id": "DECISION_2025-11-30T10-30-00Z_auth-implementation",
  "tier": "T3",
  "timestamp": "2025-11-30T10:30:00Z",
  "models": [
    {"name": "gpt-5-codex-max", "role": "builder", "family": "openai"},
    {"name": "claude-opus-4", "role": "security-lens", "family": "anthropic"},
    {"name": "gpt-4o", "role": "performance-lens", "family": "openai"},
    {"name": "gemini-2.0-pro", "role": "maintainability-lens", "family": "google"},
    {"name": "claude-sonnet-4-5", "role": "resilience-lens", "family": "anthropic"},
    {"name": "claude-opus-4", "role": "comparison", "family": "anthropic"}
  ],
  "risk_score": 7,
  "verdict": "APPROVE_WITH_CONDITIONS",
  "issues": [
    {"severity": "high", "category": "security", "description": "SQL injection risk in user lookup", "source": "claude-opus-4"},
    {"severity": "medium", "category": "performance", "description": "Bcrypt on every request", "source": "gpt-4o"},
    {"severity": "medium", "category": "maintainability", "description": "Test coverage at 65%", "source": "gemini-2.0-pro"},
    {"severity": "high", "category": "resilience", "description": "No rate limiting on /login", "source": "claude-sonnet-4-5"}
  ],
  "conditions": [
    "Fix SQL injection with parameterized queries",
    "Add session caching to reduce bcrypt calls",
    "Add rate limiting (10 attempts/min per IP)",
    "Increase test coverage to 80%+"
  ],
  "human_override": {
    "status": "approved_with_conditions",
    "approver": "Ryan Zimmerman (CEO)",
    "notes": "Approved pending security fixes. Must re-run security lens after fixes.",
    "timestamp": "2025-11-30T12:00:00Z"
  },
  "model_families_used": ["anthropic", "openai", "google"],
  "agreement_score": 0.10,
  "devils_advocate_triggered": false
}
```

---

### Step 11: Human Approval

**T3 Requirement**: Senior human owner must approve

**Approval Checklist**:
- [ ] All 4 lenses completed (Security/Performance/Maintainability/Resilience)
- [ ] At least 2 model families used ✅ (3 families: Anthropic, OpenAI, Google)
- [ ] Differential comparison completed
- [ ] Decision log created with all models attributed
- [ ] High-severity issues have mitigation plan
- [ ] Test coverage meets minimum (80%+)

**Approver**: Ryan Zimmerman (CEO) or designated senior engineer

**Sign-off**:
```markdown
## T3 Approval

**Approved by**: Ryan Zimmerman
**Date**: 2025-11-30
**Conditions**:
1. Fix SQL injection before merge
2. Add rate limiting
3. Re-run security lens after fixes
4. Increase test coverage to 80%

**Authorization**: Approved pending conditions
```

---

## 📁 File Structure After T3 Workflow

```
project-root/
├── evidence/
│   └── evidence_auth-implementation_20251130_103000.txt
├── reports/
│   ├── PERSPECTIVE_security_auth-implementation.md
│   ├── PERSPECTIVE_performance_auth-implementation.md
│   ├── PERSPECTIVE_maintainability_auth-implementation.md
│   ├── PERSPECTIVE_resilience_auth-implementation.md
│   └── COMPARISON_auth-implementation.md
└── logs/ai-decisions/
    └── DECISION_20251130_auth-implementation.json
```

---

## 🚨 Common T3 Mistakes

### ❌ WRONG: Using Same Model Family for Everything
```
Builder: GPT-5 Codex (OpenAI)
Security Lens: GPT-4o (OpenAI)
Performance Lens: GPT-5 Codex (OpenAI)
```
**Problem**: Same family = same blind spots

### ✅ RIGHT: Different Model Families
```
Builder: GPT-5 Codex (OpenAI)
Security Lens: Claude Opus 4 (Anthropic)
Performance Lens: Gemini 2.0 Pro (Google)
```
**Benefit**: Different training data catches more issues

---

### ❌ WRONG: Showing Builder Explanation to Reviewers
```
Chat A (Builder): "I implemented JWT auth using bcrypt..."
Chat B (Security): [PASTE: Builder's explanation + code]
```
**Problem**: Reviewer will just summarize Builder instead of independent analysis

### ✅ RIGHT: Blind Review
```
Chat A (Builder): [Implementation]
Chat B (Security): [ONLY sees: spec + diff + tool output - NO Builder explanation]
```
**Benefit**: True independent verification

---

### ❌ WRONG: Skipping Evidence Collection
```
Reviewer: "The tests pass"  ← CLAIM, no proof
```
**Problem**: Reviewer can't verify without actual tool output

### ✅ RIGHT: Evidence-Based Review
```
Reviewer sees:
===== PYTEST OUTPUT =====
test_auth.py::test_login_success PASSED
test_auth.py::test_login_invalid_credentials PASSED
test_auth.py::test_jwt_validation PASSED
26 passed in 2.3s
```
**Benefit**: Facts, not claims

---

## ⏱️ Time Estimate for T3

**Total additional time**: 2-4 hours beyond normal development

| Step | Time |
|------|------|
| Builder implementation | 1-2 hours |
| Evidence collection | 5 min |
| 4 Lens reviews (parallel) | 1 hour |
| Differential comparison | 30 min |
| Decision log creation | 15 min |
| Human approval process | 30 min |

**Why worth it**:
- Catches critical security/billing bugs BEFORE production
- Regulatory compliance (AICPA, EU AI Act, PCAOB)
- Audit trail for legal defensibility
- Significantly reduces post-merge incidents

---

## 🎓 Quick Reference

### T3 Checklist
- [ ] Risk Tier Declaration (T3) documented
- [ ] Builder uses Model Family A
- [ ] At least 1 lens uses Model Family B (different from A)
- [ ] All 4 lenses completed (Security/Perf/Maint/Resilience)
- [ ] Evidence file generated and shared
- [ ] Differential comparison completed
- [ ] Agreement <80% OR Devil's Advocate run
- [ ] Decision log created with all models attributed
- [ ] Human senior approval obtained
- [ ] All high-severity issues have mitigation plan

### Model Family Selection Tips
- **Security Review**: Anthropic (Claude Opus/Sonnet) - strong at security analysis
- **Implementation**: OpenAI (GPT-5 Codex) - strong at code generation
- **Alternative View**: Google (Gemini 2.0) - different training corpus
- **Comparison**: Any of the above - use strongest model for synthesis

---

**END OF T3 WORKFLOW GUIDE**

**Created**: 2025-11-30
**For**: SC KMH Platform Provider Source of Truth Project
**Compliance**: SparkData SOP v5.2.1

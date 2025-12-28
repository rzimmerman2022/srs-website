# SDA - AI Handoff Template: SRS Management System - Official Source of Truth - 20251206

**Document Type:** AI Session Handoff Template (AI→AI Transfer Protocol)
**Project:** SRS Management System (00_SRS_MANAGEMENT_SYSTEM)
**Framework:** SparkData Analytics AI Development Framework v5.2.1
**Version:** 1.0 (World-Class Gold Standard)
**Effective Date:** 2025-12-06
**Owner:** Ryan Zimmerman, CEO Southwest Resume Services

---

## 0. Document Purpose (READ THIS FIRST)

### This Document (AI Handoff Template)

**Purpose:** Standardized template for transferring knowledge from one AI session to the next

**When to use:** END of session when you've completed work (Section 2.5 of Model Initialization SOP - MANDATORY)

**Audience:** Next AI model continuing work (could be same model family or different)

**Critical requirement:** Must be created BEFORE ending session (NO EXCEPTIONS per Section 2.5)

### Relationship to Other Documents

| Document | Purpose | When Used |
|----------|---------|-----------|
| **Model Initialization SOP** | How to START a session | Beginning of ANY new chat |
| **AI Handoff (this doc)** | How to END a session | When work is complete |
| **Quick Reference Guide** | Human cheat sheet | User pastes to new AI model |

**Analogy:** Handoff = Shift notes from nurse ending shift to nurse starting shift

---

## 1. Handoff File Naming Convention

**Required format:**

```
docs/handoffs/HANDOFF_YYYYMMDD_[completing-model]_[next-model-or-task].md
```

**Examples:**

```
docs/handoffs/HANDOFF_20251206_claude-sonnet-4.5_gpt5-grading-validation.md
docs/handoffs/HANDOFF_20251205_gpt5-codex_claude-sonnet-review.md
docs/handoffs/HANDOFF_20251204_claude-opus-4.5_infrastructure-rebuild.md
```

**Model name formats:**
- Claude: `claude-sonnet-4.5`, `claude-opus-4.5`
- GPT: `gpt5-codex`, `gpt-4-turbo`
- Gemini: `gemini-2.0-flash`, `gemini-1.5-pro`

---

## 2. Mandatory Handoff Template (Copy This)

```markdown
# [Next Model Name]: [One-Sentence Task Summary]
## [Handoff Type] Handoff

**Date:** YYYY-MM-DD HH:MM PST
**From:** [Your Model] ([Your Role: Builder/Reviewer/Lens])
**To:** [Next Model] ([Their Role: Builder/Reviewer/Lens])
**Session Duration:** [X hours Y minutes]
**Risk Tier:** [T0/T1/T2/T3]

**Related Artifacts:**
- Progress Report: `PROGRESS_YYYY-MM-DD_HH-MM-SS_[your-model]_[session-id].md`
- State JSON: `state/session_YYYY-MM-DD_HH-MM-SS_[your-model]_[session-id].json`
- Git Commits: [list commit SHAs]

---

## Executive Summary (3-5 sentences)

[What you did, what changed, what's next]

**Example:**
> Completed Phase 8j infrastructure rebuild after discovering 18% tracker incompleteness. Refreshed personal Gmail OAuth (43 threads), implemented Drive API (74 files, +825%), and rebuilt tracker to 2,909 rows (+438 rows). W4D3-W4D5 grading validated (no missing deliverables). Next step: GPT-5 Codex should perform systematic validation audit of W1-W2D4 grading to check if 26 Drive uploads + 800 email attachments affected grades.

---

## What Changed

### Code Changes
- **Created:** [list files created with line counts]
- **Modified:** [list files modified with change summary]
- **Deleted:** [list files deleted with reason]

### Data Changes
- **Tracker:** [row count before → after, source breakdown]
- **Sources:** [Gmail sync dates, Drive API status, Git commits]
- **Schema:** [any schema changes, column additions]

### Infrastructure Changes
- **APIs:** [OAuth refreshes, new API integrations]
- **Dependencies:** [packages added/removed]
- **Environment:** [config changes, .env updates]

**Example:**
```
### Code Changes
- Created: tools/drive/sync_drive.py (245 lines) - Drive API integration
- Modified: tools/tracker/build_tracker_phase7.py (+87 lines) - Added GIT_FILE source type
- Modified: PARTICIPANTS/.../MANIFEST.csv (added 74 Drive file entries)

### Data Changes
- Tracker: 2,471 → 2,909 rows (+438, +18%)
  - EMAIL_MESSAGE: 714 → 1,500 (+110%)
  - EMAIL_ATTACHMENT: 491 → 1,291 (+163%)
  - DRIVE_UPLOAD: 8 → 74 (+825%)
  - GIT_FILE: 0 → 9 (NEW)
- Sources: Personal Gmail OAuth refreshed (Sync_2025-12-06_21-00-24)
- Schema: No changes (42 columns maintained)

### Infrastructure Changes
- APIs: Personal Gmail OAuth token refreshed (expires Feb 6, 2026)
- Dependencies: None
- Environment: None
```

---

## Critical Discoveries

### Blockers Resolved
- [List blockers you fixed with before/after]

### New Blockers Identified
- [List blockers next model will face]

### Important Findings
- [Insights, gotchas, assumptions validated/invalidated]

**Example:**
```
### Blockers Resolved
- ✅ Personal Gmail OAuth expired → Refreshed (43 threads now accessible)
- ✅ Drive API not implemented → Created sync_drive.py (74 files exported)
- ✅ Tracker incomplete → Rebuilt with all 3 sources (2,909 rows)

### New Blockers Identified
- ⚠️ W1-W2D4 grading used incomplete data (26 Drive uploads + 800 attachments invisible)
- ⚠️ Drive API service account lacks folder access (fallback to known files used)

### Important Findings
- Personal Gmail contains 43 threads vs 38 in business Gmail (different sync patterns)
- Tracker row increase (+18%) mostly from personal Gmail attachments (140 new)
- Last Drive upload was Nov 20 → W4D3-W4D5 grades unaffected by missing data
```

---

## Your Task (Next Model)

### Immediate Next Steps (Start Here)

**Step 1:** [First action with exact command]
```bash
[command to run]
```
**Expected output:** [what success looks like]
**Time estimate:** [X minutes]

**Step 2:** [Second action with exact command]
```bash
[command to run]
```
**Expected output:** [what success looks like]
**Time estimate:** [X minutes]

**Step 3:** [Third action with exact command]
```bash
[command to run]
```
**Expected output:** [what success looks like]
**Time estimate:** [X minutes]

### Complete Task Specification

[Full detailed specification for the work]

**Example:**
```
### Immediate Next Steps

**Step 1:** Query Drive uploads during graded period
```bash
python tools/drive/sync_drive.py --date-range "2025-11-10:2025-11-20"
```
**Expected output:** CSV with ~26 Drive files between Nov 10-20
**Time estimate:** 5 minutes

**Step 2:** Check email attachments for deliverable patterns
```bash
grep -r "Citation.*Log\|RAI.*Log\|Deliverable" PARTICIPANTS/.../01-EMAIL-DATA/
```
**Expected output:** List of attachment filenames matching deliverable patterns
**Time estimate:** 10 minutes

**Step 3:** Spot-check 3 high-risk days for missing deliverables
```bash
# Check W1D1 (Nov 10), W1D2 (Nov 11), W2D1 (Nov 18)
cat PARTICIPANTS/.../Drive_Uploads_Nov10.csv
cat PARTICIPANTS/.../Drive_Uploads_Nov11.csv
cat PARTICIPANTS/.../Drive_Uploads_Nov18.csv
```
**Expected output:** Identify if any Drive uploads contain grading deliverables
**Time estimate:** 15 minutes

### Complete Task Specification

**Objective:** Systematic validation audit of W1-W2D4 grading (Nov 10-20)

**Why needed:** Original grading used incomplete data (66 Drive files + 800 attachments missing)

**Scope:**
- Query Drive uploads during Nov 10-20 (26 files expected)
- Check email attachments for deliverable patterns
- Spot-check 3 high-risk days (W1D1, W1D2, W2D1)
- Re-grade if missing deliverables found

**Success criteria:**
- Best case: No missing deliverables → Existing grades accurate
- Likely: 1-3 Drive deliverables missed → ±5 point grade changes
- Worst case: 10+ deliverables missed → Systematic re-grading required

**Deliverable:** Audit report (reports/AUDIT_GRADING_W1-W2D4_YYYYMMDD.md)
```

---

## Files You'll Need

### To Read (Context)
- [List files next model should read for context]

### To Modify (Expected Changes)
- [List files next model will likely modify]

### To Create (New Artifacts)
- [List files next model should create]

**Example:**
```
### To Read (Context)
- DAILY_ENRICHMENT__20251205_GPT5_HOLISTIC_COMPLETE_v1.3.csv (current grades)
- docs/grading/DAILY_HOLISTIC_GRADING_METHODOLOGY__v1.0.md (grading rubric)
- ANDREW_BEAM_TRACKER__PHASE7__20251206_210611_v8.0.json (complete tracker)

### To Modify (Expected Changes)
- DAILY_ENRICHMENT__20251205_GPT5_HOLISTIC_COMPLETE_v1.3.csv (if grades change)
- MASTER_TODO.md (mark audit task complete, add re-grading tasks if needed)
- CHANGELOG.md (add audit results entry)

### To Create (New Artifacts)
- reports/AUDIT_GRADING_W1-W2D4_20251206.md (audit findings)
- DAILY_ENRICHMENT__20251206_GPT5_HOLISTIC_COMPLETE_v1.4.csv (if re-grading needed)
```

---

## Questions for Next Model

### Critical Questions (Must Answer)
1. [Question 1 that affects task execution]
2. [Question 2 that affects task execution]

### Nice-to-Know Questions (Optional)
1. [Question 1 for additional context]
2. [Question 2 for additional context]

**Example:**
```
### Critical Questions (Must Answer)
1. Do any Drive uploads Nov 10-20 contain Citation Logs or RAI Logs?
2. Do email attachments contain deliverables that weren't graded?
3. If missing deliverables found, what's the grade impact (±5 points or ±10+ points)?

### Nice-to-Know Questions (Optional)
1. What's the breakdown of personal Gmail vs business Gmail attachments?
2. Are there any GIT_FILE entries that should have been graded?
```

---

## Environment Setup

### Prerequisites (Must Have)
- [Required tools, versions, credentials]

### Optional (Nice to Have)
- [Optional tools that speed up work]

### Known Issues
- [Environment quirks, workarounds, gotchas]

**Example:**
```
### Prerequisites (Must Have)
- Python 3.11+ (project uses 3.12.11)
- Google Drive API credentials (tools/drive/credentials/token.json - valid until Feb 6, 2026)
- Gmail API credentials (tools/gmail/credentials/ - both accounts valid)
- Git access to practicum repo (PARTICIPANTS/.../03-GIT-REPOS/)

### Optional (Nice to Have)
- jq (for JSON parsing - `brew install jq`)
- pandas (for CSV analysis - `pip install pandas`)

### Known Issues
- Drive API service account lacks folder access → Uses fallback to known files
- macOS bash 3.2 compatibility → Use `#!/usr/bin/env bash` not `#!/bin/bash`
```

---

## Testing & Validation Checklist

### Before Claiming Work Complete

- [ ] All code changes have tests (pytest -v passes)
- [ ] All code changes pass linting (ruff check . passes)
- [ ] All code changes pass type checking (mypy . passes)
- [ ] Evidence script run (./scripts/make_evidence.sh)
- [ ] Tracker validation (row count, column count, schema compliance)
- [ ] ADR-001 compliance (no legacy paths in code)
- [ ] Gmail privacy filter verified (Andrew Beam only)
- [ ] Dual export created (CSV + JSON + manifest)
- [ ] Git status clean (no unintentional uncommitted changes)
- [ ] MASTER_TODO.md updated (tasks marked complete)
- [ ] CHANGELOG.md updated (phase entry created)
- [ ] Handoff document created (this file!)
- [ ] Progress report created (PROGRESS_*.md)
- [ ] State JSON created (state/session_*.json)

---

## Warnings & Gotchas

### 🚨 DO NOT DO THIS
- [List anti-patterns, common mistakes, things that will break]

### ✅ DO THIS INSTEAD
- [List correct approaches, best practices]

**Example:**
```
### 🚨 DO NOT DO THIS
- ❌ Use old tracker JSON as input (violates ADR-001)
- ❌ Review code in same chat as build (violates SDA fresh chat)
- ❌ Claim "tests pass" without evidence file (./scripts/make_evidence.sh)
- ❌ Skip session completion protocol (Section 2.5 mandatory)
- ❌ Grade without all 3 sources (Gmail business + personal, Drive, Git)

### ✅ DO THIS INSTEAD
- ✅ Rebuild tracker from PARTICIPANTS/ sources (ADR-001 compliant)
- ✅ Review in fresh chat with different model (SDA Rule #1)
- ✅ Run evidence script before claiming complete (proof-of-work)
- ✅ Create all 5 artifacts when done (progress, state, handoff, tracking, verification)
- ✅ Use complete tracker (2,909 rows with all sources)
```

---

## Automation Recommendations (Optional)

### Tasks That Could Be Automated
- [List repetitive tasks next model will face]

### Proposed Scripts
- [Script ideas with pseudocode]

### Time Savings
- [Estimated time saved if automated]

**Example:**
```
### Tasks That Could Be Automated
1. Drive upload validation (currently manual grep)
2. Email attachment pattern matching (currently manual search)
3. Grading audit report generation (currently manual markdown)

### Proposed Scripts
**Script 1: `tools/audit/validate_drive_deliverables.py`**
```python
# Pseudocode
def check_drive_uploads_for_deliverables(date_range):
    uploads = get_drive_uploads(date_range)
    deliverables = filter(lambda u: matches_pattern(u.name, DELIVERABLE_PATTERNS), uploads)
    return generate_report(deliverables)
```

**Time saved:** 15 min manual search → 2 min automated

**Script 2: `tools/audit/generate_grading_audit_report.py`**
```python
# Pseudocode
def generate_audit_report(findings):
    template = load_template("reports/AUDIT_TEMPLATE.md")
    return template.render(findings=findings)
```

**Time saved:** 30 min manual markdown → 5 min automated
```

---

## Risk Tier & SDA Compliance

### Risk Tier for This Work
**Tier:** [T0/T1/T2/T3]
**Justification:** [Why this tier?]

### Required SDA Controls
- [List controls based on tier]

**Example:**
```
### Risk Tier for This Work
**Tier:** T2 (High - Grading Integrity)
**Justification:** Grading audit affects permanent record, requires independent verification

### Required SDA Controls
- Builder → Verification Agent → Data-Quality Lens
- Evidence file mandatory (./scripts/make_evidence.sh)
- Fresh chat review required
- DECISION_*.json for grade changes (if any)
```

---

## Appendix A: Handoff Types

### Builder → Builder (Same Model)
- You completed feature, next session continues
- Focus on: What's done, what's next, blockers

### Builder → Reviewer (Fresh Chat)
- You built feature, different model reviews
- Focus on: What changed, how to test, edge cases

### Builder → Builder (Different Model)
- You completed work, different model continues
- Focus on: Context transfer, model-specific patterns, role clarity

### Reviewer → Builder (Fixes Required)
- You reviewed, found issues, Builder fixes
- Focus on: Issues found, severity, proposed fixes

**Example:**
```
This handoff type: **Builder → Builder (Different Model)**

From: Claude Opus 4.5 (completed infrastructure rebuild)
To: GPT-5 Codex (grading validation audit)

Focus: Complete context transfer with grading-specific instructions
```

---

## Appendix B: Session Completion Protocol (Section 2.5 Reference)

When ending your session, you MUST create these 5 artifacts:

1. **Progress Report** (`PROGRESS_YYYY-MM-DD_*.md`)
   - 9 required sections
   - Comprehensive session documentation

2. **State JSON** (`state/session_YYYY-MM-DD_*.json`)
   - Cognitive context + decision log
   - Continuation plan

3. **Handoff Document** (THIS FILE)
   - Executive summary + next steps
   - Critical warnings about fragile areas

4. **Project Tracking Updates**
   - MASTER_TODO.md (mark tasks complete)
   - CHANGELOG.md (add phase entry)

5. **Verification Checklist**
   - Confirm all artifacts exist
   - Git commit with comprehensive message

**NO EXCEPTIONS - Section 2.5 is mandatory for ALL sessions.**

See: [SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md](SDA__Model_Initialization_SOP__SRS_Management_System__20251206.md) Section 2.5

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-06 | Claude Sonnet 4.5 | Initial AI Handoff Template created as world-class gold standard, aligned with Model Initialization SOP v2.0, includes SDA naming convention and comprehensive handoff structure |

---

**END OF HANDOFF TEMPLATE**

**Framework:** SparkData Analytics v5.2.1
**Project:** SRS Management System
**Owner:** Ryan Zimmerman, Southwest Resume Services

**Usage:** Copy sections 2-11, fill in your specific values, save as `docs/handoffs/HANDOFF_YYYYMMDD_[your-model]_[next-task].md`

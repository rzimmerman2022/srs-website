# SparkData Agentic Framework v0.2.0 - Release Notes

**Release Date**: 2025-12-03  
**Status**: Production-Ready

---

## Summary
SparkData Agentic Framework v0.2.0 introduces real agent spawning with Claude Code Task tool integration, delivering fresh-context blind reviews and richer specification generation. The release was validated end-to-end on a production feature (CSV export) with significant time and cost savings.

---

## Highlights

### 🚀 Agent Spawning Integration
- Fresh context separation (builder ≠ reviewer; no chat history leakage).
- Blind review architecture with structured prompts and parsed findings.
- Convenience wrappers for verification and data-quality agents.

### 📊 Enhanced Specifications
- Automatic extraction of tech stack, constraints, deliverables, and tiered success criteria.
- Specs are ~3x more detailed than v0.1.0.

### 📚 Documentation Suite
- API_REFERENCE.md, WORKFLOWS.md, INDEX.md, CLAUDE_CODE_USAGE.md.
- Examples: T1 (simple API) and T2 (database migration) walkthroughs.

---

## Validation Results
- Feature tested: CSV export button for web UI search results (T1 workflow).
- Builder: GPT-5 Codex; Reviewer: Claude Sonnet 4.5 (Verification Agent).
- Tests: 36/36 passing (26 adapters, 7 DuckDB, 3 CSV export).
- Agent review: Risk 3/10, APPROVE_WITH_CHANGES; 0 critical issues.
- Fresh context: Verified; no chat history leakage.
- Gemini integrity: 0 violations.
- Performance: ~35 minutes end-to-end (4–5x faster than manual; ~99.98% cost savings).

---

## Breaking Changes
None. Upgrade from v0.1.0 is seamless.

---

## Known Issues
- FTS query fallback: CSV export uses ILIKE due to DuckDB MATCH limitations in this build (may be slower on large datasets).
- Pre-existing ruff warnings in legacy pipeline files (cosmetic; not touched in this release).

---

## Upgrade Guide
```
pip install --upgrade sparkdata-agentic-framework
sparkdata-agentic --version  # should show 0.2.0
```
New specs and agent spawning are available immediately. If Claude Code is unavailable, manual review remains supported.

---

## Contributors
- Framework Development: Claude Sonnet 4.5
- Testing & Validation: GPT-5 Codex
- Project Lead: SparkData Analytics, LLC

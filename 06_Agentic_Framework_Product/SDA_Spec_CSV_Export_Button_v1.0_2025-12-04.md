# GPT-5 Codex Implementation Spec: Add CSV export button to search results in web UI

**Project**: SparkData Agentic Framework
**Task**: Add CSV export button to search results in web UI
**Risk Tier**: T1
**Builder Model**: GPT-5 Codex Max
**Review Model**: Claude Sonnet 4.5 (verification)

---

## Context: What You've Already Built

This is a new feature.

---

## Your Mission: Add CSV export button to search results in web UI

### Requirements

Implement Add CSV export button to search results in web UI

**Testing Requirements**:
- Write tests using pytest
- Minimum 80% code coverage
- Test all edge cases and error conditions

### Constraints

**Critical Rules**:
- Follow all anti-sycophancy rules in CLAUDE.md
- Question assumptions before implementing
- Flag potential issues immediately

**Security**:
- Prevent SQL injection (use parameterized queries)
- Validate and sanitize all user inputs
- No credentials in code (use environment variables)

**Performance**:
- Stream large files (don't load into memory)
- Use appropriate indexes for database queries

---

## Deliverables

**Expected Files** (guidance - adjust as needed):

**Implementation Files**:
- `templates/<feature>.html` - UI templates
- `static/js/<feature>.js` - Frontend logic
- `static/css/<feature>.css` - Styling

**Test Files**:
- `tests/test_<feature>.py` - Comprehensive test suite

**Documentation**:
- Docstrings for all public functions
- Update README.md if user-facing changes

---

## Success Criteria

✅ All tests pass (pytest)
✅ Linting clean (ruff)
✅ Type checking passes (mypy)
✅ Code coverage ≥ 80%

---

## Notes

**DO**:
- Follow project CLAUDE.md guidelines
- Add type hints and docstrings
- Write comprehensive tests
- Implement error handling

**DO NOT**:
- Skip validation
- Add unnecessary features
- Modify existing code without reason

---

**Ready to build?** Let's create production-quality code! 🚀

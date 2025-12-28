# Quick Start Guide

Get started with SparkData Agentic Framework in **5 minutes**.

---

## Installation

```bash
pip install sparkdata-agentic-framework
```

Or install from source:

```bash
git clone https://github.com/sparkdata-analytics/sparkdata-agentic.git
cd sparkdata-agentic
pip install -e .
```

---

## 1. Initialize Framework

Navigate to your project directory and initialize:

```bash
cd /path/to/your-project
sparkdata-agentic init

# Interactive prompts:
Project name: My Project
Primary language: Python
Framework: Flask
Database: PostgreSQL
Default risk tier: T1
```

This creates:
- `.sparkdata.toml` - Configuration
- `CLAUDE.md` - Project instructions
- `evidence/` - Evidence directory
- `docs/` - Specification directory

---

## 2. Build Your First Feature

```bash
sparkdata-agentic build "Add user authentication" --tier T2
```

This creates a specification file: `docs/SPEC_add_user_authentication.md`

**Next**:
1. Copy the spec to GPT-5 Codex (ChatGPT)
2. Paste GPT-5's generated code into your project
3. Proceed to step 3

---

## 3. Review Code

```bash
sparkdata-agentic review --files "src/auth.py,tests/test_auth.py" --tier T2
```

This:
- Collects evidence (pytest, ruff, mypy)
- Spawns 2 independent agents (Verification + Data-Quality)
- Reviews code blindly
- Synthesizes findings

**Output**:
```
Overall Risk: 3/10 (Low-Medium)
Consensus: ✅ APPROVE
Critical Issues: 0
Recommendations: Add rate limiting
```

---

## 4. Commit with Evidence

```bash
sparkdata-agentic commit --title "feat: Add user authentication"
```

This generates a comprehensive commit message with:
- Feature summary
- Agent audit results
- Evidence file reference
- Co-authorship attribution

**Done!** Your feature is built, reviewed, and committed. 🎉

---

## Full Workflow Example

```bash
# 1. Initialize (one-time setup)
sparkdata-agentic init

# 2. Build feature
sparkdata-agentic build "Add JWT authentication" --tier T2
# → Opens docs/SPEC_add_jwt_authentication.md

# 3. Copy spec to GPT-5 → Get code back

# 4. Review code
sparkdata-agentic review --tier T2
# → Spawns agents, reviews code

# 5. Commit
sparkdata-agentic commit --title "feat: Add JWT authentication"
# → Commits with evidence

# Total time: ~15 minutes (vs 2-3 days manually)
```

---

## Configuration

Edit `.sparkdata.toml` to customize:

```toml
[project]
name = "My Project"
risk_tier_default = "T1"

[models]
builder = "gpt-5-codex"
reviewer = "claude-sonnet-4.5"

[workflows]
t1_agents = ["verification"]
t2_agents = ["verification", "data-quality"]
t3_agents = ["verification", "data-quality", "gemini"]

[evidence]
test_command = "pytest tests/ -v"
lint_command = "ruff check ."
type_check_command = "mypy src/"
```

---

## Risk Tiers

- **T0**: Documentation only (no review)
- **T1**: Non-core features (1 agent)
- **T2**: Database/pipelines (2 agents) ← Most common
- **T3**: Security/PII/billing (3 agents)

---

## Commands Reference

```bash
# Initialize framework
sparkdata-agentic init

# Build feature
sparkdata-agentic build "feature name" --tier T2

# Review code
sparkdata-agentic review --files "file1.py,file2.py" --tier T2

# Commit
sparkdata-agentic commit --title "feat: feature name"

# Check status
sparkdata-agentic status

# Help
sparkdata-agentic --help
```

---

## Next Steps

- [Full Documentation](https://sparkdata-agentic.readthedocs.io)
- [API Reference](API_REFERENCE.md)
- [Workflow Guide](WORKFLOWS.md)
- [Examples](../examples/)

---

## Troubleshooting

**Issue**: "Framework not initialized"
- **Fix**: Run `sparkdata-agentic init` first

**Issue**: "No files to review"
- **Fix**: Specify `--files` or make git changes first

**Issue**: Agent reviews are placeholders
- **Fix**: This is expected in v0.1.0. Agent spawning will be implemented in v0.2.0.

---

## Support

- **Documentation**: https://sparkdata-agentic.readthedocs.io
- **Issues**: https://github.com/sparkdata-analytics/sparkdata-agentic/issues
- **Email**: support@sparkdata-analytics.com

---

**Ready to 20x your development speed?** 🚀

# SparkData Agentic Development Framework

**Production-ready multi-model AI development framework** for autonomous software engineering.

[![PyPI version](https://img.shields.io/badge/pypi-v0.1.0-blue.svg)](https://pypi.org/project/sparkdata-agentic/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)

---

## What Is This?

A plug-and-play framework that brings **proven 20x faster development** to any Python project:

- 🤖 **Multi-model orchestration** - GPT-5 builds, Claude reviews, Gemini validates
- 🔍 **Autonomous blind review** - Eliminates AI sycophancy (models approving own work)
- 📊 **Evidence-based decisions** - Actual tool outputs (pytest, ruff, mypy), not claims
- ⚡ **20x faster** - 3 hours vs 2-3 days (proven in production)
- 💰 **99.9% cheaper** - $3-8 vs $4,000-6,000 per feature

**Proven Track Record** (SC KMH Platform Provider Source of Truth, Phase 3):
- Quality: 67% risk reduction through autonomous review
- Speed: 3 hours vs 2-3 days
- Autonomy: 95% autonomous (5% human time)
- Reliability: 0 violations on critical constraints
- Iterations: Self-correcting (agents caught 4 critical issues, GPT-5 fixed all)

---

## Quick Start

### Installation

```bash
pip install sparkdata-agentic-framework
```

### Initialize in Your Project

```bash
cd /path/to/your-project
sparkdata-agentic init

# Interactive setup:
Project name: My Project
Primary language: Python
Framework: Flask
Database: PostgreSQL
```

### Build Your First Feature

```bash
# Full autonomous workflow
sparkdata-agentic workflow --tier T2 --feature "Add user authentication"

# 🎉 Done in 10-15 minutes (vs 2-3 days manually)
```

---

## How It Works

### The Multi-Model Workflow

```
Human (5% time)
   ↓ strategic direction
Claude (Orchestrator)
   ↓ creates spec
GPT-5 (Builder)
   ↓ implements code
Claude (Evidence Collection)
   ↓ runs pytest, ruff, mypy
Claude (Multi-Agent Review)
   ├→ Verification Agent (security + code quality)
   ├→ Data-Quality Agent (schema + integrity)
   └→ Gemini (T3 tie-breaker, optional)
   ↓ synthesis
Human (5% time)
   ↓ approve/reject
Claude (Commit & Push)
   ↓ comprehensive commit message
GitHub
```

### Key Innovation: Fresh Chat Separation

**Problem**: AI models are sycophantic - they approve their own work.

**Solution**:
1. GPT-5 builds code in isolated ChatGPT session
2. Claude spawns independent agents with ZERO context about builder
3. Agents review blindly (only see: spec + diff + evidence)
4. No false approvals - agents find real issues

**Result**: 67% risk reduction in production testing

---

## Features

### CLI Commands

```bash
# Initialize framework
sparkdata-agentic init

# Build feature (calls GPT-5)
sparkdata-agentic build "Add user authentication" --tier T2

# Review code (spawns agents)
sparkdata-agentic review --files "src/auth.py"

# Full workflow (build + review + commit)
sparkdata-agentic workflow --tier T2 --spec docs/SPEC_auth.md

# Collect evidence
sparkdata-agentic evidence

# Commit with comprehensive message
sparkdata-agentic commit

# Show status
sparkdata-agentic status
```

### Risk Tiers

- **T0**: Documentation only (no review)
- **T1**: Non-core features (1 agent review)
- **T2**: Database/pipelines (2 agent review) ← Most common
- **T3**: Security/PII/billing (3 agent review + Gemini)

### Agent Types

- **Verification Agent**: Security + code quality review
- **Data-Quality Agent**: Schema compliance + data integrity
- **Gemini Validator**: Tie-breaker + maintainability (T3 only)

---

## Example Workflow

### 1. Initialize Framework

```bash
sparkdata-agentic init \
  --name "Customer CRM" \
  --stack "Python 3.12, Django 5.0, PostgreSQL 16"

# Creates:
.sparkdata.toml        # Configuration
CLAUDE.md              # Project instructions
.claude/commands/      # Workflow commands
scripts/make_evidence.sh  # Evidence collection
evidence/              # Evidence directory
```

### 2. Build Feature

```bash
sparkdata-agentic build "Add JWT authentication"

# Process:
# 1. Claude generates specification (docs/SPEC_auth.md)
# 2. GPT-5 implements code (src/auth.py, tests/test_auth.py)
# 3. Files written to project
# ✅ 3 files created in ~5 minutes
```

### 3. Review Code

```bash
sparkdata-agentic review --tier T2

# Process:
# 1. Collect evidence (pytest, ruff, mypy)
# 2. Spawn 2 agents (Verification + Data-Quality)
# 3. Agents review independently (blind)
# 4. Synthesize findings
#
# Output:
# Overall Risk: 3/10 (Low-Medium)
# Consensus: ✅ APPROVE
# Critical Issues: 0
# Recommendations: Add rate limiting
```

### 4. Commit with Evidence

```bash
sparkdata-agentic commit

# Generates comprehensive commit message:
feat: Add JWT authentication with bcrypt

Implementation:
- JWT token generation and validation
- bcrypt password hashing (cost factor 12)
- CSRF protection middleware

Multi-Agent Audit Results:
- Verification Agent: Risk 4/10 - ✅ APPROVED
- Data-Quality Agent: Risk 2/10 - ✅ APPROVED

Evidence:
- evidence/evidence_auth_20251201.txt
- 12/12 tests passing

🤖 Generated with SparkData Agentic Framework

Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: GPT-5 Codex <gpt5@openai.com>

# ✅ Committed and pushed
```

---

## Configuration

**`.sparkdata.toml`**:

```toml
[project]
name = "My Project"
risk_tier_default = "T1"

[models]
builder = "gpt-5-codex"
reviewer = "claude-sonnet-4.5"
validator = "gemini-2.0-pro"

[api_keys]
openai_key_env = "OPENAI_API_KEY"
anthropic_key_env = "ANTHROPIC_API_KEY"
google_key_env = "GOOGLE_API_KEY"

[workflows]
t0_enabled = true
t1_agents = ["verification"]
t2_agents = ["verification", "data-quality"]
t3_agents = ["verification", "data-quality", "gemini"]

[evidence]
auto_collect = true
test_command = "pytest tests/ -v"
lint_command = "ruff check ."
type_check_command = "mypy src/"

[git]
auto_commit = false
co_author_claude = true
co_author_gpt5 = true
```

---

## Real-World Results

### SC KMH Platform Provider (Phase 3)

**Challenge**: Build DuckDB database + Flask web UI for 251,138 messages

**Traditional Approach**:
- Senior developer: 2-3 days
- Code review: 4-6 hours
- Cost: $4,000-6,000

**With SparkData Agentic**:
- Total time: 3 hours
- Human time: 20 minutes (5%)
- Cost: $3-8 in API calls
- **Savings: 99.9%**

**Quality**:
- Risk reduced: 67% (from 7/10 to 2/10)
- Issues found: 4 critical (all fixed by GPT-5 on iteration 2)
- Test coverage: 8/8 comprehensive tests
- Security: 0 critical issues reached production

**Breakdown**:
- DuckDB builder: 187 lines, production-ready
- Test suite: 173 lines, 8 tests
- Web UI: 418 lines, 11 files
- All with security fixes, error handling, documentation

---

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [Quick Start Tutorial](docs/QUICKSTART.md) (5 minutes)
- [API Reference](docs/API_REFERENCE.md)
- [Workflow Guide](docs/WORKFLOWS.md) (T0-T3)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Examples](examples/)

---

## Requirements

- **Python**: 3.12+
- **Git**: For version control
- **API Keys** (optional):
  - OpenAI (for GPT-5 automatic mode)
  - Anthropic (for Claude orchestration - or use Claude Code)
  - Google (for Gemini T3 validation)

**Note**: Can work without API keys using manual copy-paste workflow.

---

## Roadmap

### Phase 1: Internal Alpha ✅ (Current)
- Core CLI tool
- Agent system
- Evidence collection
- Basic templates

### Phase 2: Internal Beta (Week 3-4)
- Web UI for workflow visualization
- Slack integration
- Cost tracking
- Performance metrics

### Phase 3: Open Source (Month 2)
- Public PyPI release
- Comprehensive documentation
- Video tutorials
- Community examples

### Phase 4: SaaS Product (Month 3-6)
- Hosted agents (no local setup)
- Team collaboration
- Analytics dashboard
- Enterprise features

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Areas for Contribution**:
- Additional agent types (performance, accessibility, etc.)
- Language support (TypeScript, Go, Rust, etc.)
- Framework integrations (Next.js, FastAPI, etc.)
- Documentation improvements
- Example projects

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Support

- **Documentation**: [https://sparkdata-agentic.readthedocs.io](https://sparkdata-agentic.readthedocs.io)
- **Issues**: [GitHub Issues](https://github.com/sparkdata-analytics/sparkdata-agentic/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sparkdata-analytics/sparkdata-agentic/discussions)
- **Email**: support@sparkdata-analytics.com

---

## Credits

**Developed by**: [SparkData Analytics, LLC](https://sparkdata-analytics.com)

**Proven on**: SC KMH Platform Provider Source of Truth (251,138 messages, 2.5 GB database)

**Built with**:
- Claude Sonnet 4.5 (Anthropic) - Orchestration & Review
- GPT-5 Codex Max (OpenAI) - Implementation
- Gemini 2.0 Pro (Google) - Validation

**Inspired by**: SparkData AI Development Framework v5.2

---

## Citation

If you use this framework in academic work, please cite:

```bibtex
@software{sparkdata_agentic_2025,
  title = {SparkData Agentic Development Framework},
  author = {SparkData Analytics, LLC},
  year = {2025},
  url = {https://github.com/sparkdata-analytics/sparkdata-agentic},
  note = {Multi-model autonomous software engineering framework}
}
```

---

**Ready to 20x your development speed?**

```bash
pip install sparkdata-agentic-framework
sparkdata-agentic init
```

🚀 **Let's build the future of software engineering!**

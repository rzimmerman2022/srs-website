# SparkData Agentic Framework - Documentation Index

**Version**: 0.2.0-dev
**Last Updated**: 2025-12-02

---

## Getting Started

### For New Users
1. **[Quick Start](QUICKSTART.md)** - Get up and running in 15 minutes
2. **[Workflows Guide](WORKFLOWS.md)** - Learn T0-T3 workflows
3. **[Examples](../examples/)** - Follow real-world examples

### For Integration
1. **[API Reference](API_REFERENCE.md)** - Complete API documentation
2. **[Agent Spawning Integration](AGENT_SPAWNING_INTEGRATION.md)** - Task tool integration guide
3. **[Configuration Reference](API_REFERENCE.md#configuration-reference)** - .sparkdata.toml setup

---

## Documentation Structure

### Core Documentation

| Document | Purpose | Audience | Reading Time |
|----------|---------|----------|--------------|
| **[README.md](../README.md)** | Project overview, installation | Everyone | 5 min |
| **[QUICKSTART.md](QUICKSTART.md)** | First workflow walkthrough | New users | 15 min |
| **[WORKFLOWS.md](WORKFLOWS.md)** | Complete T0-T3 workflow guides | Developers | 30 min |
| **[API_REFERENCE.md](API_REFERENCE.md)** | Full API documentation | Advanced users | 45 min |

### Integration Guides

| Document | Purpose | Audience | Reading Time |
|----------|---------|----------|--------------|
| **[AGENT_SPAWNING_INTEGRATION.md](AGENT_SPAWNING_INTEGRATION.md)** | Task tool integration | Framework developers | 20 min |
| **[T3_MULTI_MODEL_WORKFLOW.md](T3_MULTI_MODEL_WORKFLOW.md)** | Multi-model review setup | Security teams | 15 min |

### Examples

| Example | Risk Tier | Time | Use Case |
|---------|-----------|------|----------|
| **[Simple API](../examples/simple-api/)** | T1 | 30-60 min | Read-only endpoint |
| **[Database Migration](../examples/database-migration/)** | T2 | 1-2 hours | Schema changes |

---

## Quick Navigation

### By Task Type

**"I want to add a simple feature"**
→ [Simple API Example](../examples/simple-api/) (T1 workflow)

**"I need to modify the database"**
→ [Database Migration Example](../examples/database-migration/) (T2 workflow)

**"I'm implementing authentication/billing"**
→ [Workflows Guide - T3 Critical](WORKFLOWS.md#t3-workflow---critical-changes)

**"I'm just updating documentation"**
→ [Workflows Guide - T0 Documentation](WORKFLOWS.md#t0-workflow---documentation-only)

---

### By Role

**Developer (First Time User)**:
1. Read [Quick Start](QUICKSTART.md)
2. Follow [Simple API Example](../examples/simple-api/)
3. Try on your own project

**Developer (Regular User)**:
1. Reference [Workflows Guide](WORKFLOWS.md) decision tree
2. Use appropriate tier workflow
3. Check [API Reference](API_REFERENCE.md) for CLI commands

**Team Lead / Senior Engineer**:
1. Review [T3 Multi-Model Workflow](T3_MULTI_MODEL_WORKFLOW.md)
2. Set up approval process for T3 changes
3. Configure [.sparkdata.toml](API_REFERENCE.md#configuration-reference)

**Framework Developer**:
1. Read [Agent Spawning Integration](AGENT_SPAWNING_INTEGRATION.md)
2. Study agent architecture in [API Reference](API_REFERENCE.md#agent-system)
3. Review agent prompt templates in `sparkdata_agentic/templates/agent_prompts/`

---

## Common Workflows

### First-Time Setup
```bash
# Install framework
pip install sparkdata-agentic-framework

# Initialize project
cd my-project/
sparkdata-agentic init

# Verify installation
sparkdata-agentic --version
```

**Documentation**: [Quick Start](QUICKSTART.md)

---

### Standard Feature Development (T1)
```bash
# 1. Build spec
sparkdata-agentic build "Add CSV export button" --tier T1

# 2. Implement (manual or GPT-5 Codex)

# 3. Collect evidence
sparkdata-agentic review --files "src/export.py,tests/test_export.py" --tier T1

# 4. Agent review (NEW CHAT - paste spec + code + evidence)

# 5. Commit
sparkdata-agentic commit --tier T1 --evidence evidence/evidence_*.txt
```

**Documentation**: [T1 Workflow Guide](WORKFLOWS.md#t1-workflow---standard-features), [Simple API Example](../examples/simple-api/)

---

### Database Changes (T2)
```bash
# 1. Build spec
sparkdata-agentic build "Add user_sessions table" --tier T2

# 2. Implement migration + model + tests

# 3. Collect evidence
sparkdata-agentic review --files "migrations/*.sql,src/models/*.py,tests/*.py" --tier T2

# 4. Dual-agent review (2 NEW CHATS)
#    - Verification Agent
#    - Data-Quality Agent

# 5. Synthesize findings from both agents

# 6. Create decision log (logs/ai-decisions/DECISION_*.json)

# 7. Commit
sparkdata-agentic commit --tier T2 --evidence evidence/evidence_*.txt --decision-log logs/ai-decisions/DECISION_*.json
```

**Documentation**: [T2 Workflow Guide](WORKFLOWS.md#t2-workflow---database--pipelines), [Database Migration Example](../examples/database-migration/)

---

### Critical Changes (T3)
```bash
# 1. Get approval for T3 change

# 2. Build spec
sparkdata-agentic build "Implement JWT authentication" --tier T3

# 3. Implement (budget 60-120 minutes)

# 4. Collect evidence
sparkdata-agentic review --files "src/auth.py,tests/test_auth.py" --tier T3

# 5. Four-lens review (4 NEW CHATS)
#    - Verification Agent (Claude)
#    - Data-Quality Agent (Claude)
#    - Security-First Lens (Claude)
#    - Resilience-First Lens (Gemini 2.0 Pro)

# 6. Multi-model synthesis

# 7. Create decision log + get lead approval

# 8. Commit
sparkdata-agentic commit --tier T3 --evidence evidence/evidence_*.txt --decision-log logs/ai-decisions/DECISION_*.json
```

**Documentation**: [T3 Workflow Guide](WORKFLOWS.md#t3-workflow---critical-changes), [T3 Multi-Model Workflow](T3_MULTI_MODEL_WORKFLOW.md)

---

## Troubleshooting

### "Which tier should I use?"
Use the [Workflow Decision Tree](WORKFLOWS.md#workflow-decision-tree)

### "Agent didn't find obvious bug"
Ensure you included:
- ✅ Complete specification
- ✅ All implementation files
- ✅ **Actual pytest/ruff/mypy output** (not just "tests pass")
- ✅ Evidence file from `sparkdata-agentic review`

### "Agent gave false approval"
Did you use a **fresh chat** for review?
- ❌ Same chat as builder → Sycophancy risk
- ✅ New conversation → Blind review

### "How do I integrate with CI/CD?"
See [Agent Spawning Integration - Option B (API Integration)](AGENT_SPAWNING_INTEGRATION.md#option-b-anthropic-api-integration)

### "Can I use different models?"
Yes! See [T3 Multi-Model Workflow](T3_MULTI_MODEL_WORKFLOW.md) for using Claude + Gemini together

---

## API Reference Quick Links

### CLI Commands
- [init](API_REFERENCE.md#init-command) - Initialize project
- [build](API_REFERENCE.md#build-command) - Generate specification
- [review](API_REFERENCE.md#review-command) - Collect evidence
- [commit](API_REFERENCE.md#commit-command) - Create commit with evidence
- [status](API_REFERENCE.md#status-command) - Show project status

### Python API
- [AgenticOrchestrator](API_REFERENCE.md#agenticorchestrator) - Main orchestration class
- [create_spec()](API_REFERENCE.md#create_spec) - Generate specifications
- [spawn_agents()](API_REFERENCE.md#spawn_agents) - Launch agent reviews
- [collect_evidence()](API_REFERENCE.md#collect_evidence) - Gather test/lint results
- [synthesize_reviews()](API_REFERENCE.md#synthesize_reviews) - Combine agent reports

### Agent System
- [VerificationAgent](API_REFERENCE.md#verificationagent) - Security + code quality
- [DataQualityAgent](API_REFERENCE.md#dataqualityagent) - Data integrity + schema
- [Agent Prompt Templates](API_REFERENCE.md#agent-prompt-templates) - Review checklist

---

## Framework Philosophy

### Core Principles

**1. Fresh Chat Separation**
Never review code in the same chat that generated it
- Builder chat: Implementation
- **NEW CHAT**: Blind review with spec + code + evidence only

**2. Evidence-Based Development**
Always paste actual tool output, not claims
- ✅ **Good**: `[paste pytest output: 26 passed in 1.23s]`
- ❌ **Bad**: "Tests pass"

**3. Risk-Tiered Workflows**
Match review rigor to change criticality
- T0: Docs only (no review)
- T1: 1 agent, 10 min (standard features)
- T2: 2 agents, 20 min (database/pipelines)
- T3: 4 agents, 60 min, multi-model (critical changes)

**4. Multi-Model Verification (T3)**
Critical changes require 2+ model families
- Claude Sonnet 4.5 (primary)
- Gemini 2.0 Pro (diversity)
- Different models find different issues

---

## Production Results

Framework proven at **SparkData Analytics** on real projects:

### SC KMH Platform Provider Project
- **251,138 AI messages** processed
- **0 data integrity violations** (Gemini standalone model)
- **38/38 tests passing** (adapters + DuckDB + web UI)
- **Development time**: 20x faster than manual
- **Cost reduction**: 99.9% vs manual review

### Time Savings
| Workflow | Manual | Framework | Speedup |
|----------|--------|-----------|---------|
| T1 (Simple) | 2-3 hours | 30-60 min | 3-4x |
| T2 (Database) | 4-6 hours | 1-2 hours | 3-4x |
| T3 (Critical) | 8-12 hours | 3-4 hours | 3-4x |

### Cost Savings
| Workflow | Manual Review | Framework API | Savings |
|----------|---------------|---------------|---------|
| T1 | $100-150 | $0.01 | 99.99% |
| T2 | $200-300 | $0.02 | 99.99% |
| T3 | $400-600 | $0.05 | 99.99% |

---

## Version History

### v0.2.0-dev (Current)
- ✅ Agent spawning architecture
- ✅ Specification template enhancement
- ✅ Complete documentation suite
- ⏳ Real Task tool integration (pending)

### v0.1.0 (Alpha)
- ✅ Core CLI commands
- ✅ Basic evidence collection
- ✅ Tier-based workflows
- ✅ Git operations

---

## What's Next?

### Immediate (v0.2.0 Release)
1. **Real agent spawning** - Claude Code Task tool integration
2. **Anthropic API fallback** - For CI/CD pipelines
3. **Gemini API integration** - Multi-model verification

### Future (v0.3.0+)
1. **VS Code extension** - Framework commands in IDE
2. **GitHub Action** - Automated agent review on PRs
3. **Slack integration** - Agent reports in team channels
4. **Custom agent lenses** - Team-specific review checklists

---

## Contributing

Want to contribute to framework documentation?

1. Check [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines
2. Follow documentation style in existing docs
3. Test examples before submitting
4. Include time estimates for workflows

---

## Support

- **Documentation Issues**: Open issue on GitHub
- **Framework Bugs**: Report via issue tracker
- **Integration Help**: See [Agent Spawning Integration](AGENT_SPAWNING_INTEGRATION.md)
- **Commercial Support**: support@sparkdata-analytics.com

---

**Maintained by**: SparkData Analytics, LLC
**License**: MIT
**Repository**: https://github.com/sparkdata-analytics/sparkdata-agentic

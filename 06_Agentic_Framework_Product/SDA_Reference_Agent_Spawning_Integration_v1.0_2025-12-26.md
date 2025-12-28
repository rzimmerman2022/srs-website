# Agent Spawning Integration Guide

**Version**: v0.2.0
**Status**: Manual Workflow Documented (Automated spawning planned for v0.3.0)
**Last Updated**: 2025-12-08

---

## Overview

SparkData Agentic Framework v0.2.0 uses a **manual workflow approach** for multi-agent reviews. This document describes the current workflow and future plans for automated agent spawning.

---

## Current State (v0.2.0)

### What Works
- ✅ Agent architecture (VerificationAgent, DataQualityAgent, GeminiValidator)
- ✅ Structured AgentReport output format
- ✅ Agent prompt templates (verification.md, data_quality.md)
- ✅ File reading and context assembly
- ✅ Evidence collection and reporting
- ✅ Manual multi-agent workflow (copy/paste between chats)

### What's Manual (Not Automated)

- ⚠️ Agent spawning requires manual workflow (copy evidence to fresh chat)
- ⚠️ No automated Task tool integration (planned for v0.3.0)
- ⚠️ Framework guides user through manual process with clear instructions

---

## v0.2.0 Manual Workflow (Current)

**How It Works**:

1. User runs `sparkdata-agentic review --files "src/auth.py" --tier T2`
2. Framework collects evidence (git diff, test output, metrics)
3. Framework saves evidence to `evidence/evidence_review_TIMESTAMP.txt`
4. **User manually**:
   - Opens fresh Claude Code chat (for blind review)
   - Pastes evidence file content
   - Asks Claude to review as Verification Agent
   - Copies Claude's findings back to evidence file
5. User runs `sparkdata-agentic commit` to create evidence-based commit message

**Why Manual?**:

- Ensures fresh chat separation (blind review principle)
- No dependency on Claude Code Task tool integration
- Works in any environment (Claude Code, ChatGPT, Gemini)
- User maintains full control over review process
- Simpler to implement and test

**Workflow Example**:

```bash
# Step 1: Collect evidence
sparkdata-agentic review --files "src/auth.py" --tier T2
# Output: ✅ Evidence collected: evidence/evidence_review_20251208_153045.txt
#         📋 Next: Copy evidence to fresh chat for blind review

# Step 2: User manually reviews
# - Open fresh Claude Code chat
# - Paste: cat evidence/evidence_review_20251208_153045.txt
# - Ask: "Review this as Verification Agent per SparkData T2 workflow"
# - Claude provides findings
# - User saves findings to evidence file

# Step 3: Commit with evidence
sparkdata-agentic commit --title "feat: Add authentication middleware"
# Framework reads evidence file and creates comprehensive commit message
```

---

## Future: Automated Agent Spawning (v0.3.0+)

The following sections describe **planned** integration for automated agent spawning. This is **not implemented in v0.2.0**.

---

## Integration Strategy

### Option A: Claude Code Task Tool (Recommended for Claude Code Users)

**Use Case**: Running framework from within Claude Code CLI

**How It Works**:
1. User runs `sparkdata-agentic review` from Claude Code session
2. Framework spawns Claude Code subagents via Task tool
3. Each agent runs in fresh context (blind review enforced)
4. Agents return structured reports
5. Framework synthesizes findings

**Implementation**:

```python
# In sparkdata_agentic/core/agents.py

def _spawn_claude_agent(self, prompt: str, agent_type: str) -> str:
    """
    Spawn Claude Code Task agent for review.

    This function is called from Claude Code environment.
    """
    try:
        # Import Claude Code Task tool (only available in Claude Code)
        from claude_code_sdk import spawn_task

        result = spawn_task(
            description=f"{agent_type} agent blind review",
            prompt=prompt,
            subagent_type="general-purpose",
            model="claude-sonnet-4.5"  # or "claude-opus-4" for critical reviews
        )

        return result.output

    except ImportError:
        # Not in Claude Code environment
        raise NotImplementedError(
            "Agent spawning requires Claude Code environment. "
            "Install SparkData API extras for API-based spawning."
        )
```

**Testing**:
```bash
# From within Claude Code session
cd sc-kmh-project/
sparkdata-agentic review --files "src/auth.py" --tier T2
# → Spawns Verification + Data-Quality agents
# → Each runs in fresh Claude Code subagent
# → Returns structured reports
```

---

### Option B: API Integration (Recommended for CI/CD)

**Use Case**: Running framework from CI/CD pipelines, GitHub Actions, or standalone scripts

**How It Works**:
1. Framework calls Anthropic Claude API directly
2. Each agent request is a separate API call
3. Prompts include full context (spec + implementation + evidence)
4. Responses parsed into AgentReport structure

**Installation**:
```bash
pip install sparkdata-agentic-framework[api]
# Installs: anthropic, google-generativeai, openai
```

**Configuration** (`.sparkdata.toml`):
```toml
[api_keys]
anthropic_key_env = "ANTHROPIC_API_KEY"
google_key_env = "GOOGLE_API_KEY"  # For Gemini validator (T3)
openai_key_env = "OPENAI_API_KEY"  # Optional: for GPT-5 builder

[models]
reviewer = "claude-sonnet-4.5"  # Verification + Data-Quality agents
validator = "gemini-2.0-pro"    # T3 tie-breaker
builder = "gpt-5-codex"          # Builder model (manual workflow)
```

**Implementation**:

```python
# In sparkdata_agentic/core/agents.py

def _spawn_claude_agent(self, prompt: str, agent_type: str) -> str:
    """
    Spawn agent via Claude API.
    """
    try:
        # Try Claude Code Task tool first
        from claude_code_sdk import spawn_task
        result = spawn_task(
            description=f"{agent_type} agent blind review",
            prompt=prompt,
            subagent_type="general-purpose",
        )
        return result.output

    except ImportError:
        # Fall back to Anthropic API
        try:
            import anthropic
            import os

            api_key = os.environ.get(
                self.config.get("api_keys", {}).get("anthropic_key_env", "ANTHROPIC_API_KEY")
            )

            if not api_key:
                raise ValueError("ANTHROPIC_API_KEY environment variable not set")

            client = anthropic.Anthropic(api_key=api_key)

            response = client.messages.create(
                model=self.config.get("models", {}).get("reviewer", "claude-sonnet-4.5"),
                max_tokens=4096,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            return response.content[0].text

        except ImportError:
            raise NotImplementedError(
                "Agent spawning requires either Claude Code environment or "
                "Anthropic API client. Install with: pip install sparkdata-agentic-framework[api]"
            )
```

**Testing**:
```bash
# Set API key
export ANTHROPIC_API_KEY="sk-ant-..."

# Run review
cd sc-kmh-project/
sparkdata-agentic review --files "src/auth.py" --tier T2
# → Calls Claude API for Verification agent
# → Calls Claude API for Data-Quality agent
# → Returns synthesized findings
```

---

## Integration Checklist

### Phase 1: Claude Code Task Tool (v0.2.0)
- [ ] Identify correct Claude Code SDK import path
- [ ] Update `_spawn_claude_agent()` in VerificationAgent
- [ ] Update `_spawn_claude_agent()` in DataQualityAgent
- [ ] Update `_spawn_claude_agent()` in GeminiValidator (Gemini API)
- [ ] Test with SC KMH project (T2 workflow)
- [ ] Verify blind review (fresh context separation)
- [ ] Verify report parsing (risk_score, verdict, findings)

### Phase 2: API Fallback (v0.2.1)
- [ ] Add `anthropic` to `setup.py` extras_require["api"]
- [ ] Implement API fallback in `_spawn_claude_agent()`
- [ ] Add API key validation
- [ ] Test in non-Claude Code environment
- [ ] Update CLI to show "Calling Claude API..." vs "Spawning subagent..."
- [ ] Add rate limiting / retry logic

### Phase 3: Multi-Model Support (v0.3.0)
- [ ] Add Gemini API integration for GeminiValidator
- [ ] Add optional GPT-4o fallback for verification
- [ ] Support model switching via config (`reviewer = "gpt-4o"`)
- [ ] Test T3 workflow (Claude + Gemini + Human)

---

## Testing Strategy

### Unit Tests
```python
# tests/test_agent_spawning.py

def test_verification_agent_spawning():
    """Test VerificationAgent spawns correctly."""
    agent = VerificationAgent(config)
    context = {
        "spec_file": "tests/fixtures/spec.md",
        "impl_files": ["tests/fixtures/auth.py"],
        "evidence_file": "tests/fixtures/evidence.txt",
        "risk_tier": "T2"
    }

    report = agent.review(context)

    assert report.agent_type == "verification"
    assert 0 <= report.risk_score <= 10
    assert report.verdict in ["APPROVE", "APPROVE_WITH_CHANGES", "REJECT"]
    assert len(report.findings) >= 0
    assert report.critical_issues >= 0
```

### Integration Tests
```bash
# Test with real SC KMH project
cd sc-kmh-project/
sparkdata-agentic build "Add CSV export to web UI" --tier T1
# (manually implement feature)
sparkdata-agentic review --files "web_ui/app.py" --tier T1
# → Should spawn Verification agent
# → Should return structured report
# → Risk score should be reasonable (2-4 for clean code)
```

---

## Cost Estimation

### Claude Code Task Tool (Option A)
- **Cost**: Included in Claude Code subscription
- **Performance**: Fast (subagents run in same environment)
- **Rate Limits**: Subject to Claude Code limits

### Claude API (Option B)
- **Cost per review**: ~$0.01 - $0.05 (depending on code size)
  - Verification agent: ~2,000 tokens input, ~500 tokens output
  - Data-Quality agent: ~2,000 tokens input, ~500 tokens output
  - Total per T2 review: ~5,000 tokens ≈ $0.015 (Claude Sonnet 4.5)
- **T3 review** (adds Gemini): +$0.005
- **Monthly estimate** (100 reviews/month): ~$1.50

### Comparison to Manual Review
- **Manual senior engineer review**: $50-100/hour
- **Framework review**: $0.015
- **Savings**: 99.9% cost reduction

---

## Known Limitations (v0.1.0)

1. **No Real Agent Spawning**: Returns placeholder reports
2. **No API Integration**: Requires manual implementation
3. **No Model Selection**: Hardcoded to Claude Sonnet 4.5
4. **No Rate Limiting**: Will fail if API rate limits exceeded
5. **Basic Parsing**: Response parsing is simplified (may miss nuanced findings)

---

## Roadmap

### v0.2.0 (Next Release)
- ✅ Claude Code Task tool integration
- ✅ Basic API fallback
- ✅ SC KMH integration testing

### v0.3.0
- Multi-model support (Gemini, GPT-4o)
- Advanced response parsing
- Rate limiting / retry logic

### v0.4.0
- Web UI for review visualization
- Slack integration for notifications
- GitHub Actions integration

### v1.0.0
- Production-ready
- Full API documentation
- Example projects
- Video tutorials

---

## Questions / Support

**Integration Issues?**
- GitHub Issues: https://github.com/sparkdata-analytics/sparkdata-agentic/issues
- Email: support@sparkdata-analytics.com

**Documentation**:
- Main README: [../README.md](../README.md)
- Quick Start: [QUICKSTART.md](QUICKSTART.md)
- API Reference: [API_REFERENCE.md](API_REFERENCE.md) (coming in v0.3.0)

---

**Last Updated**: 2025-12-02
**Maintainer**: SparkData Analytics, LLC
**License**: MIT

# SparkData Agentic Framework - API Reference

**Version**: 0.2.0-dev
**Last Updated**: 2025-12-02

---

## Table of Contents

1. [Core Modules](#core-modules)
2. [CLI Commands](#cli-commands)
3. [Configuration](#configuration)
4. [Agent System](#agent-system)
5. [Templates](#templates)
6. [Utilities](#utilities)

---

## Core Modules

### AgenticOrchestrator

Main orchestrator for the agentic development workflow.

**Location**: `sparkdata_agentic.core.orchestrator`

#### Constructor

```python
from sparkdata_agentic import AgenticOrchestrator

orchestrator = AgenticOrchestrator(
    project_dir="/path/to/project",
    config_file=".sparkdata.toml"  # optional
)
```

**Parameters**:
- `project_dir` (str | Path): Path to project root directory
- `config_file` (str | Path, optional): Path to configuration file. Default: `.sparkdata.toml`

**Raises**:
- `FileNotFoundError`: If config file doesn't exist

---

#### create_spec()

Create specification document for GPT-5 Codex.

```python
spec_file = orchestrator.create_spec(
    feature="Add user authentication",
    risk_tier="T2",
    requirements={"framework": "Flask", "database": "PostgreSQL"},  # optional
    context="Previous implementation in auth_v1.py"  # optional
)
```

**Parameters**:
- `feature` (str): Feature name (e.g., "Add user authentication")
- `risk_tier` (str): Risk tier (`"T0"`, `"T1"`, `"T2"`, `"T3"`)
- `requirements` (Dict[str, Any], optional): Additional requirements
- `context` (str, optional): Context about prior work

**Returns**:
- `Path`: Path to created specification file

**Generated Spec Includes**:
- Project name and tech stack (extracted from CLAUDE.md)
- Detailed requirements with testing guidance
- Security and performance constraints
- File structure suggestions (based on feature type)
- Tier-specific success criteria

**Example**:
```python
spec = orchestrator.create_spec(
    feature="Add CSV export to web UI",
    risk_tier="T1",
    requirements={
        "format": "RFC 4180 compliant",
        "encoding": "UTF-8"
    }
)
# Creates: docs/SPEC_add_csv_export_to_web_ui.md
```

---

#### collect_evidence()

Collect comprehensive evidence (test results, linting, type checking).

```python
evidence_file = orchestrator.collect_evidence(
    feature_name="auth",
    run_tests=True,       # optional, default: True
    run_linters=True,     # optional, default: True
    run_type_check=True   # optional, default: True
)
```

**Parameters**:
- `feature_name` (str): Feature name for evidence filename
- `run_tests` (bool, optional): Whether to run test suite
- `run_linters` (bool, optional): Whether to run linters
- `run_type_check` (bool, optional): Whether to run type checking

**Returns**:
- `Path`: Path to evidence file

**Evidence Includes**:
- Test results (pytest output)
- Linting results (ruff output)
- Type checking results (mypy output)
- Git diff (changed files)
- Line counts (changed lines)

**Example**:
```python
evidence = orchestrator.collect_evidence(
    feature_name="csv_export"
)
# Creates: evidence/evidence_csv_export_20251202_143000.txt
# Updates: evidence/LATEST_EVIDENCE.txt (pointer)
```

---

#### spawn_agents()

Spawn agents for blind review based on risk tier.

```python
reports = orchestrator.spawn_agents(
    files=["src/auth.py", "tests/test_auth.py"],
    risk_tier="T2",
    spec_file="docs/SPEC_auth.md",         # optional
    evidence_file="evidence/evidence_auth.txt"  # optional
)
```

**Parameters**:
- `files` (List[str | Path]): List of files to review
- `risk_tier` (str): Risk tier (`"T1"`, `"T2"`, `"T3"`)
- `spec_file` (str | Path, optional): Path to specification file
- `evidence_file` (str | Path, optional): Path to evidence file

**Returns**:
- `Dict[str, Dict[str, Any]]`: Dictionary of agent reports keyed by agent type

**Agent Types by Tier**:
- **T0**: No agents (documentation only)
- **T1**: `verification` (security & code quality)
- **T2**: `verification`, `data-quality` (+ schema & integrity)
- **T3**: `verification`, `data-quality`, `gemini` (+ third-party validation)

**Example**:
```python
reports = orchestrator.spawn_agents(
    files=["src/auth.py"],
    risk_tier="T2",
    spec_file="docs/SPEC_auth.md",
    evidence_file="evidence/evidence_auth.txt"
)

# Returns:
# {
#     "verification": {
#         "risk_score": 4,
#         "verdict": "APPROVE_WITH_CHANGES",
#         "findings": [...],
#         "critical_issues": 1,
#         "recommendations": [...]
#     },
#     "data_quality": {
#         "risk_score": 2,
#         "verdict": "APPROVE",
#         "findings": [...],
#         "critical_issues": 0,
#         "recommendations": [...]
#     }
# }
```

**Note**: In v0.2.0-dev, agents return placeholder reports. Real agent spawning requires Task tool integration (see [AGENT_SPAWNING_INTEGRATION.md](AGENT_SPAWNING_INTEGRATION.md)).

---

#### synthesize_reviews()

Synthesize findings from multiple agent reviews.

```python
synthesis = orchestrator.synthesize_reviews(
    agent_reports=reports
)
```

**Parameters**:
- `agent_reports` (Dict[str, Any]): Dictionary of agent reports

**Returns**:
- `Dict[str, Any]`: Synthesis dictionary with:
  - `overall_risk` (float): Average risk score (0-10)
  - `consensus` (str): `"APPROVE"`, `"APPROVE_WITH_CHANGES"`, or `"REJECT"`
  - `critical_issues` (int): Total count of critical/high findings
  - `recommendations` (List[Dict]): All recommendations with agent attribution
  - `agent_reports` (Dict): Original agent reports

**Consensus Logic**:
- **APPROVE**: All agents approve
- **REJECT**: Any agent rejects
- **APPROVE_WITH_CHANGES**: Mixed verdicts

**Example**:
```python
synthesis = orchestrator.synthesize_reviews(reports)

print(f"Overall Risk: {synthesis['overall_risk']}/10")
# Overall Risk: 3.0/10

print(f"Consensus: {synthesis['consensus']}")
# Consensus: APPROVE_WITH_CHANGES

print(f"Critical Issues: {synthesis['critical_issues']}")
# Critical Issues: 1
```

---

#### commit_with_evidence()

Commit files with comprehensive evidence-based commit message.

```python
orchestrator.commit_with_evidence(
    message_title="feat: Add user authentication",
    files=["src/auth.py", "tests/test_auth.py"],
    agent_reports=reports,
    synthesis=synthesis,
    evidence_file="evidence/evidence_auth.txt",  # optional
    feature_summary="JWT-based auth with refresh tokens"  # optional
)
```

**Parameters**:
- `message_title` (str): Commit title (conventional commits format)
- `files` (List[str | Path]): Files to commit
- `agent_reports` (Dict[str, Any]): Agent review reports
- `synthesis` (Dict[str, Any]): Synthesis of findings
- `evidence_file` (str | Path, optional): Path to evidence file
- `feature_summary` (str, optional): Feature summary

**Behavior**:
- Generates comprehensive commit message with agent findings
- Adds co-author tags (Claude, GPT-5) if configured
- Commits files to git
- If `auto_commit=False` (default), prompts user for approval

**Generated Commit Includes**:
- Feature summary
- Agent review results (risk scores, verdicts)
- Critical issues found
- Evidence file reference
- Co-author tags

---

#### get_project_context()

Get project context for AI models.

```python
context = orchestrator.get_project_context()
```

**Returns**:
- `Dict[str, Any]`: Project context with:
  - `name` (str): Project name
  - `risk_tier_default` (str): Default risk tier
  - `tech_stack` (Dict): Tech stack info
  - `current_phase` (str): Current project phase
  - `claude_instructions` (str | None): CLAUDE.md content

---

## CLI Commands

### `sparkdata-agentic --version`

Show framework version.

```bash
$ sparkdata-agentic --version
sparkdata-agentic, version 0.2.0-dev
```

---

### `sparkdata-agentic init`

Initialize SparkData Agentic Framework in current project.

```bash
sparkdata-agentic init \
  --name "My Project" \
  --language "Python" \
  --framework "Flask" \
  --database "PostgreSQL" \
  --tier "T2"
```

**Options**:
- `--name TEXT`: Project name
- `--language TEXT`: Primary programming language
- `--framework TEXT`: Framework (Flask, Django, FastAPI, etc.)
- `--database TEXT`: Database system
- `--tier TEXT`: Default risk tier (T0, T1, T2, T3)

**Creates**:
- `.sparkdata.toml` - Configuration file
- `CLAUDE.md` - Project instructions
- `.gitignore` - Git ignore patterns
- `docs/` - Documentation directory
- `evidence/` - Evidence collection directory
- `scripts/` - Scripts directory
- `.claude/commands/` - Claude Code commands

---

### `sparkdata-agentic build`

Create specification and prepare for GPT-5 build.

```bash
sparkdata-agentic build "Add user authentication" --tier T2
```

**Arguments**:
- `FEATURE`: Feature name

**Options**:
- `--tier TEXT`: Risk tier (T0, T1, T2, T3)

**Creates**:
- `docs/SPEC_<feature_slug>.md` - Specification file

**Next Steps** (printed after command):
1. Copy specification to GPT-5 Codex (ChatGPT)
2. Paste GPT-5's code into your project
3. Run: `sparkdata-agentic review --tier <tier>`

---

### `sparkdata-agentic review`

Run multi-agent review on code.

```bash
sparkdata-agentic review \
  --files "src/auth.py,tests/test_auth.py" \
  --tier T2
```

**Options**:
- `--files TEXT`: Comma-separated list of files to review
- `--tier TEXT`: Risk tier (T1, T2, T3)

**Behavior**:
1. Collects evidence (pytest, ruff, mypy)
2. Spawns agents based on tier
3. Displays agent reports
4. Shows synthesis (overall risk, consensus, recommendations)

**Note**: In v0.2.0-dev, returns placeholder reports. Real agent spawning coming in v0.2.0 final.

---

### `sparkdata-agentic commit`

Commit changes with comprehensive evidence-based message.

```bash
sparkdata-agentic commit \
  --title "feat: Add user authentication" \
  --files "src/auth.py,tests/test_auth.py"
```

**Options**:
- `--title TEXT`: Commit title (conventional commits format)
- `--files TEXT`: Comma-separated list of files to commit

**Behavior**:
1. Reads latest evidence file
2. Generates commit message with evidence
3. Prompts for approval (unless `auto_commit=true`)
4. Commits to git with co-author tags

---

### `sparkdata-agentic status`

Show framework status and configuration.

```bash
sparkdata-agentic status
```

**Displays**:
- Project name
- Default risk tier
- Current phase
- Framework version
- Configuration file
- Evidence file count

---

## Configuration

### `.sparkdata.toml`

Framework configuration file.

**Example**:
```toml
[project]
name = "My Project"
risk_tier_default = "T2"

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
evidence_dir = "evidence"
test_command = "pytest tests/ -v"
lint_command = "ruff check ."
type_check_command = "mypy src/"

[git]
auto_commit = false
co_author_claude = true
co_author_gpt5 = true
```

**Sections**:

#### `[project]`
- `name`: Project name
- `risk_tier_default`: Default risk tier

#### `[models]`
- `builder`: Builder model (default: `gpt-5-codex`)
- `reviewer`: Reviewer model (default: `claude-sonnet-4.5`)
- `validator`: Validator model for T3 (default: `gemini-2.0-pro`)

#### `[api_keys]`
- `openai_key_env`: OpenAI API key environment variable
- `anthropic_key_env`: Anthropic API key environment variable
- `google_key_env`: Google API key environment variable

#### `[workflows]`
- `t0_enabled`: Enable T0 (documentation only) workflow
- `t1_agents`: Agent types for T1 (default: `["verification"]`)
- `t2_agents`: Agent types for T2 (default: `["verification", "data-quality"]`)
- `t3_agents`: Agent types for T3 (default: `["verification", "data-quality", "gemini"]`)

#### `[evidence]`
- `auto_collect`: Automatically collect evidence before review
- `evidence_dir`: Evidence directory (default: `evidence`)
- `test_command`: Command to run tests
- `lint_command`: Command to run linter
- `type_check_command`: Command to run type checker

#### `[git]`
- `auto_commit`: Automatically commit without prompting
- `co_author_claude`: Add Claude co-author tag
- `co_author_gpt5`: Add GPT-5 co-author tag

---

## Agent System

### AgentCoordinator

Coordinates multiple agents for parallel review.

**Location**: `sparkdata_agentic.core.agents`

```python
from sparkdata_agentic import AgentCoordinator

coordinator = AgentCoordinator(config=config_dict)

reports = coordinator.spawn_parallel(
    agents=["verification", "data-quality"],
    context={
        "spec_file": "docs/SPEC_auth.md",
        "impl_files": ["src/auth.py"],
        "evidence_file": "evidence/evidence_auth.txt",
        "risk_tier": "T2"
    }
)
```

---

### VerificationAgent

Security and code quality review agent.

**Reviews For**:
- SQL injection, XSS, path traversal, credentials
- Type hints, docstrings, error handling
- Best practices (DRY, single responsibility, naming)

**Prompt Template**: `templates/agent_prompts/verification.md`

---

### DataQualityAgent

Data integrity and schema compliance review agent.

**Reviews For**:
- Schema compliance (field types, constraints, foreign keys)
- SQL correctness (syntax, parameterization, transactions)
- NULL handling, edge cases, validation

**Prompt Template**: `templates/agent_prompts/data_quality.md`

---

### GeminiValidator

Third-party validation agent (T3 only).

**Reviews For**:
- Tie-breaking when agents disagree
- Maintainability assessment
- Fresh perspective on critical code

**Status**: Placeholder in v0.2.0-dev

---

### AgentReport

Structured agent report.

**Fields**:
- `agent_type` (str): Agent type
- `risk_score` (int): Risk score (0-10)
- `verdict` (str): `"APPROVE"`, `"APPROVE_WITH_CHANGES"`, or `"REJECT"`
- `findings` (List[Dict]): List of findings
- `critical_issues` (int): Count of CRITICAL/HIGH findings
- `recommendations` (List[str]): Actionable recommendations

---

## Templates

### Specification Template

**Location**: `templates/spec_template.md`

**Variables**:
- `{FEATURE_NAME}`: Feature name
- `{PROJECT_NAME}`: Project name
- `{RISK_TIER}`: Risk tier
- `{AGENT_TYPES}`: Agent types for review
- `{PRIOR_WORK}`: Context about prior work
- `{DETAILED_REQUIREMENTS}`: Requirements with tech stack
- `{SECURITY_PERFORMANCE_CONSTRAINTS}`: Constraints from CLAUDE.md
- `{FILE_LIST_WITH_LINE_COUNTS}`: Expected deliverables
- `{PASS_FAIL_CONDITIONS}`: Success criteria

---

### Agent Prompt Templates

**Verification**: `templates/agent_prompts/verification.md`
**Data-Quality**: `templates/agent_prompts/data_quality.md`

**Variables**:
- `{SPEC}`: Specification content
- `{IMPLEMENTATION}`: Implementation file contents
- `{EVIDENCE}`: Evidence file content
- `{RISK_TIER}`: Risk tier

---

## Utilities

### EvidenceCollector

Collect comprehensive evidence.

**Location**: `sparkdata_agentic.core.evidence`

```python
from sparkdata_agentic import EvidenceCollector

collector = EvidenceCollector(
    project_dir="/path/to/project",
    config=config_dict
)

evidence = collector.collect(
    feature_name="auth",
    include={
        "tests": True,
        "linting": True,
        "typing": True,
        "git_diff": True,
        "line_counts": True
    }
)

report = evidence.format_report()
```

---

### GitOperations

Git operations utility.

**Location**: `sparkdata_agentic.core.git_ops`

```python
from sparkdata_agentic import GitOperations

git_ops = GitOperations(repo_path="/path/to/project")

# Generate commit message
commit_msg = git_ops.generate_commit_message(
    title="feat: Add auth",
    feature_summary="JWT-based authentication",
    agent_reports=reports,
    synthesis=synthesis,
    evidence_file="evidence/evidence_auth.txt",
    files_changed=["src/auth.py"],
    co_authors=["Claude <noreply@anthropic.com>"]
)

# Commit and push
git_ops.commit_and_push(
    message=commit_msg,
    files=["src/auth.py"],
    branch="main"
)
```

---

## Version History

- **0.2.0-dev** (2025-12-02): Enhanced specs + agent architecture
- **0.1.0** (2025-12-01): Initial alpha release

---

## See Also

- [Quick Start Guide](QUICKSTART.md)
- [Agent Spawning Integration](AGENT_SPAWNING_INTEGRATION.md)
- [T3 Multi-Model Workflow](../docs/T3_MULTI_MODEL_WORKFLOW.md)
- [Changelog](../CHANGELOG_v0.2.0-dev.md)

---

**Maintained by**: SparkData Analytics, LLC
**License**: MIT
**Support**: support@sparkdata-analytics.com

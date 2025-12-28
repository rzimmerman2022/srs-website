# Changelog

All notable changes to the SparkData Agentic Framework will be documented in this file.

## [0.2.0] - 2025-12-03

### Added
- Agent spawning integration with Claude Code Task tool (fresh context separation, blind review, structured prompts).
- Enhanced specification generation helpers for tech-stack context, constraints, deliverables, and tiered success criteria.
- Comprehensive documentation suite (API_REFERENCE.md, WORKFLOWS.md, INDEX.md, CLAUDE_CODE_USAGE.md, examples for T1 and T2).
- Integration module `sparkdata_agentic/integrations/claude_code.py` with `spawn_verification_agent` and `spawn_data_quality_agent`.

### Changed
- Specifications now include richer project context and constraints automatically.
- Agent architecture refactored from placeholders to full implementation.

### Fixed
- Framework version reporting now shows `0.2.0`.

### Validated
- T1 workflow tested end-to-end on SC KMH CSV export feature.
- Agent spawning confirmed with fresh context separation; agent review returned Risk 3/10, APPROVE_WITH_CHANGES.
- Tests: 36/36 passing (26 adapters, 7 DuckDB, 3 CSV export).
- Performance: ~35 minutes end-to-end (4–5x faster than manual review; 99.98% cost savings).

### Known Issues
- FTS query fallback: CSV export uses ILIKE due to DuckDB MATCH support limitations in current build.
- Pre-existing ruff warnings in legacy pipeline/framework files (to be cleaned separately).

## [0.1.0] - 2025-12-02

### Added
- Initial framework release with core CLI commands, evidence collection, tier-based workflows (T0–T3), and git operations integration.

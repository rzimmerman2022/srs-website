# Team Rollout: AI Development Framework v5.2

---

**Subject:** Transparency on Our New AI Operations Framework (SOP v5.2)

**To:** SparkData Analytics Engineering Team  
**From:** Ryan Zimmerman, CEO  
**Date:** November 30, 2025

---

Team,

We are rolling out a new AI-assisted development framework effective immediately. I want to be transparent about what we built, why we built it, and what it means for how we work.

This is a compliance document as much as an operational one. Please read it carefully.

---

## Why We Did This

### The Honest Problem

AI coding assistants have a well-documented behavioral pattern that creates risk: **sycophancy**.

Language models are trained to be helpful and agreeable. When you ask one model to review another model's work (or its own work), it tends to summarize and agree rather than critically evaluate. Researchers and practitioners call this "hallucinated consensus." The model tells you what it thinks you want to hear.

This creates real problems:

- Code that passes review but fails in production
- Subtle bugs that multiple models miss because they echo each other's blind spots
- A false sense of confidence when "three models agreed" on code that contains the same flaw

This is not speculation. This is observed behavior in production AI systems, and it is one of the primary risk factors that global regulatory bodies are now addressing.

### Why We Are Choosing to Address It Now

AI governance is, as many industry observers have noted, still something of a "wild west." The technology is evolving faster than regulatory frameworks can keep pace. In this environment, organizations have two choices:

1. **Wait** for regulations to force compliance, then scramble to adapt
2. **Act proactively** by studying what the best organizations and regulatory bodies are doing, and building those practices into our operations now

We are choosing the second path. Here is our reasoning:

**When there are no clear rules, follow the people who are building them.** The EU AI Act, AICPA Quality Management Standards, PCAOB guidance on AI use, and NIST AI Risk Management Framework represent the collective work of thousands of experts, regulators, and practitioners trying to answer the question: "How do we use AI responsibly?" We believe it is better to align with these emerging standards now than to invent our own approach in isolation.

**Learn from organizations with unlimited resources.** Microsoft, IBM, Google, and other Fortune 500 companies have invested heavily in AI governance frameworks, ethics boards, and responsible AI principles. They have teams dedicated to this work. We do not have those resources, but we can study what they have published and adapt their best practices for our context. This is not copying; it is learning.

**Build trust through transparency and accountability.** In an environment where AI systems are becoming more powerful and more opaque, the organizations that can demonstrate how they verify AI outputs, document AI decisions, and maintain human oversight will earn trust. This matters for our clients, for potential partners, and for ourselves.

---

## What Global Standards Require (And How We Align)

We studied the major frameworks that govern or will govern AI use in professional contexts. Here is what they require and how our framework addresses each requirement:

| Standard | Core Requirements | How We Address It |
|----------|-------------------|-------------------|
| **AICPA Quality Management (SQMS No. 1)** | Risk-based quality controls; documented verification; continuous monitoring and remediation | Risk Tiering (T0-T3); Structured Decision Logging; Model Scorecards and Quality Feedback Loop |
| **EU AI Act** | Technical documentation; logging of AI-assisted decisions; human oversight mechanisms; transparency about AI use | JSON decision logs; human approval gates for high-risk changes; clear documentation of which models were used and what they found |
| **PCAOB Guidance on AI** | Professional skepticism when using AI outputs; independent verification; understanding AI's impact on work quality | Independent Verification Agent that reviews without seeing the original model's explanation; adversarial review prompts designed to challenge rather than confirm |
| **NIST AI Risk Management Framework** | Human oversight; transparency and explainability; mechanisms for humans to understand and override AI decisions | Human approval required for T2/T3 changes; evidence-based review (tool outputs, not claims); escalation paths when AI outputs conflict |

We are not claiming legal compliance with these frameworks. We are designing our practices so that they **naturally support** the principles these frameworks establish. If and when formal compliance becomes required, we will be well-positioned to demonstrate it.

---

## What We Learned from Fortune 500 Companies

Microsoft, IBM, and Google have each published AI governance principles and established internal mechanisms for responsible AI. Here are the common patterns we observed and adopted:

**Principle-based frameworks.** All three companies organize their AI governance around explicit principles (fairness, transparency, accountability, safety, privacy, human oversight). We adopted the same approach with our Five Pillars.

**Separation of roles.** These companies establish distinct roles for AI development and AI oversight. Microsoft has the AETHER Committee; IBM has the AI Ethics Board. We implemented role separation through our multi-agent workflow: the Builder Agent that writes code is structurally separated from the Verification Agent that reviews it.

**Evidence over claims.** IBM emphasizes that AI decisions should be explainable and traceable. Microsoft emphasizes transparency and documentation. We require that reviews be based on actual tool outputs (test results, lint results, type checking) rather than model-generated claims about code quality.

**Human oversight at critical points.** All major frameworks emphasize that humans must remain in control of significant decisions. We implement this through human approval gates: T2 changes require lead approval; T3 changes require senior owner approval and, where relevant, compliance/business sign-off.

---

## The Three Documents

We have created three documents that work together as our AI governance framework:

### 1. SDA-SOP-DEV-001 v5.2 (The Standard Operating Procedure)

This is the master document. It defines:

- **The Five Pillars**: Reproducibility, Observability, Idempotency, Progressive Context, and Independent Verification
- **The Multi-Agent Workflow**: Planner → Builder → Reviewer/Verification → Decision Logging → Model Scorecards
- **Quality Control Mechanisms**: How we prevent sycophancy through structural separation, blind review, and adversarial prompts
- **Regulatory Alignment**: How each section maps to AICPA, EU AI Act, PCAOB, and NIST requirements

### 2. Risk Tier Table v2.1 (The Risk Framework)

This document establishes a risk-based approach to AI governance, consistent with how AICPA and EU AI Act frameworks operate. Every change is assigned a tier based on its potential impact:

| Tier | Scope | Required Controls |
|------|-------|-------------------|
| **T0 (Low)** | Documentation, comments, non-production scripts | Builder Agent only; no formal review required |
| **T1 (Medium)** | Non-core features, UI changes, minor pipeline steps | Builder → Blind Adversarial Review |
| **T2 (High)** | Core business logic, data models, authentication-adjacent code, key pipelines | Builder → Independent Verification Agent → At least one specialized lens review |
| **T3 (Critical)** | Security-sensitive logic, billing/financial flows, PII handling, regulatory workflows, MDRS/RAI core | Full multi-perspective review: Four lenses + Devil's Advocate + Differential model comparison + Senior human approval |

The principle: **higher risk requires more independent perspectives and stronger evidence.**

### 3. IDE Quick Prompts v2.1 (The Operational Tools)

This document provides ready-to-use prompts for daily work in Cursor, VS Code, or other AI-assisted development environments. It includes:

- **10 specialized prompts**: Builder, Adversarial Reviewer, Independent Verification, four lens reviews (Security, Performance, Maintainability, Resilience), Devil's Advocate, Differential Comparison, and Data-Quality
- **Hard rules** that enforce separation and independence
- **Quick reference** mapping tiers to required prompts

---

## The Core Rules

These rules implement the structural safeguards that prevent sycophancy:

**1. Fresh Chat Separation.** Reviewer and Verification prompts must run in a new chat session that has never seen the Builder's work. This prevents the model from anchoring to previous reasoning.

**2. Blind Review.** The reviewing model sees only the specification, the code diff, and the tool outputs (tests, lint, type checking). It does not see the Builder's explanation or rationale. This forces independent evaluation.

**3. Evidence-Based Review.** Reviews must cite actual tool outputs, not claims. "Tests pass" is not acceptable; the actual test output must be provided.

**4. Multi-Model Verification for Critical Work.** For T3 changes, we require at least two different model families (e.g., Claude and GPT, not Claude and Claude). Different training data produces different blind spots.

**5. Human Approval Gates.** T2 changes require human lead approval before merge. T3 changes require senior owner approval. No automated merge for high-risk work.

---

## What This Means Day-to-Day

The workflow for most changes (T1) is:

1. Determine the risk tier using the Risk Tier Table
2. Paste the Risk Tier Declaration into your AI chat
3. Use the Builder prompt to implement the change
4. Open a new chat and use the Adversarial Reviewer prompt
5. Address any issues identified, then proceed to merge with human approval

For higher-risk changes (T2/T3), additional verification steps are required as specified in the Risk Tier Table.

The additional time investment is modest (a few minutes per change). The return is:

- Higher-quality code with fewer post-merge issues
- Clear documentation of how AI-assisted decisions were made
- Evidence trails that support accountability and trust
- Alignment with emerging regulatory expectations

---

## Questions and Feedback

This framework is designed to make our work more trustworthy and defensible, not to slow us down. If you encounter situations where the framework feels misaligned with the actual risk of a change, please raise it. We will iterate on the specifics while maintaining the core principles.

The core principles are not negotiable: **independence, skepticism, evidence, and human oversight.**

These are not arbitrary constraints. They reflect what the best minds working on AI governance have concluded is necessary for responsible AI use. We are choosing to follow their guidance because, in a rapidly evolving field where the rules are still being written, following established frameworks is more prudent than improvising alone.

We will conduct a walkthrough session to demonstrate the T2/T3 workflow end-to-end. Details to follow.

Thank you for your attention to this.

Ryan Zimmerman  
CEO, SparkData Analytics, LLC

---

**Attachments:**
- SDA-SOP-DEV-001 v5.2 (Standard Operating Procedure)
- Risk Tier Table v2.1
- IDE Quick Prompts v2.1

---

## Appendix: Slack/Teams Summary

For quick reference, here is a summary suitable for posting in team channels:

---

**@channel: AI Operations Framework v5.2 is now in effect**

**What:** New framework for AI-assisted development that addresses sycophancy (models agreeing with each other instead of critically reviewing).

**Why:** AI governance standards are emerging globally (EU AI Act, AICPA, PCAOB). We are aligning with these frameworks proactively rather than waiting for mandatory compliance.

**Key Changes:**
- Risk Tiering: T0 (low) through T3 (critical) with escalating controls
- Fresh Chat Rule: Never review code in the same AI chat that generated it
- Blind Review: Reviewers see spec + diff + tool output, not the builder's explanation
- Human Approval: T2/T3 changes require human sign-off before merge

**Action Required:**
1. Read the Risk Tier Table (determines what controls apply to your work)
2. Copy the IDE Quick Prompts into your editor
3. Use the new workflow for your next change

Full documentation attached to the email from Ryan. Walkthrough session to be scheduled.

---

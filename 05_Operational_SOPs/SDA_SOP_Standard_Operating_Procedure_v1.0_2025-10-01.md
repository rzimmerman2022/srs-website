**SDA-Standard_Operating_Procedure_v1.0**

**Document Type:** Standard Operating Procedure (SOP)

**Effective Date:** October 1, 2025

**Document Owner:** SparkData Analytics

**Version:** 1.0

**Executive Summary and Purpose**

SparkData Analytics operates at the intersection of complex biological
data and advanced computational analysis. Our value proposition is the
ability to transform ambiguous client health concerns into structured,
data-driven insights that can empower individuals and aid collaborative
discussions with medical professionals. This document establishes the
Standard Operating Procedure (SOP) for the entire client engagement
lifecycle, from initial intake to the final delivery of a comprehensive
analytical report.

This protocol ensures that every client case is handled with the utmost
rigor, leveraging a systematic process of data gathering, multi-model AI
analysis, scientific literature triangulation, and hypothesis synthesis.
The objective is to create a repeatable, scalable, and scientifically
sound framework for delivering unparalleled depth in our analyses.

**Our Core Analytical Philosophy**

Our methodology is founded on the principle of **triangulation**. A
single data point or model output is a vector, not a conclusion. True
insight is achieved by synthesizing information from multiple, disparate
sources. Our process is designed to cross-reference and validate
findings from:

1.  **Client-Provided Data (The \"Ground Truth\"):** Subjective
    experiences, timelines, and known variables.

2.  **Scientific Literature (The \"Established Knowledge\"):**
    Peer-reviewed research, clinical trials, and pharmacological
    databases.

3.  **Multi-Model AI Synthesis (The \"Computational Engine\"):**
    Leveraging multiple deep learning models to explore complex
    interactions, analyze mechanisms, and generate hypotheses at a scale
    and speed unattainable through manual research alone.

**Phase 1: Client Intake & Problem Framing**

The success of any analysis is determined by the quality of the initial
data capture and problem definition.

**Step 1.1: Initial Consultation & Empathetic Data Gathering**

- **Objective:** To understand the client\'s concern in their own words
  and gather all immediately available information.

- **Process:**

  - Conduct an initial consultation (via text, call, or email).

  - Use open-ended questions to capture the full context: \"What
    happened?\", \"When did it start?\", \"What changes were made
    leading up to this?\"

  - Request all relevant data points the client can provide: photos of
    supplement bottles, screenshots of conversations, timelines, and any
    existing medical reports or lab values.

  - Create a secure, shared digital folder for all client-provided
    assets.

**Step 1.2: Defining the Core Question**

- **Objective:** To distill the client\'s narrative into a precise,
  analyzable research question.

- **Process:**

  - Review all initial data.

  - Identify the primary event (e.g., \"sudden onset hypertension\").

  - Identify the primary variables (e.g., \"change in supplement
    regimen\").

  - Formulate a core question: \"What is the most likely pharmacological
    or physiological contributor to the client\'s acute hypertensive
    episodes, given the recent changes in their supplement regimen
    against the baseline of their stable TRT protocol?\"

**Step 1.3: Creating the Client Profile & Case File**

- **Objective:** To create the foundational document for the entire
  project.

- **Process:**

  - Use the SDA_Template_Client_Profile_v1.0 template.

  - Document all known subject details: age, sex, physical profile, diet
    assumptions, presenting medical event, and a full inventory of all
    substances (supplements, medications, hormones).

  - Assign a case file name using our standard naming convention (e.g.,
    SDA_CaseFile_ClientName_PrimaryConcern_v1.0_YYYY-MM-DD).

**Phase 2: Data Acquisition & Literature Review**

With a framed problem, the next phase is to build a comprehensive
knowledge base.

**Step 2.1: Systematic Literature Search**

- **Objective:** To gather established scientific knowledge on every
  identified substance and condition.

- **Process:**

  - For each substance in the client\'s regimen, conduct searches in
    scientific databases:

    - **PubMed:** For clinical trials and peer-reviewed medical
      research.

    - **Google Scholar:** For a broader range of academic articles and
      citations.

    - **Examine.com:** For synthesized, evidence-based summaries on
      supplements.

  - Focus on papers detailing: pharmacology, mechanism of action (MOA),
    pharmacokinetics, pharmacodynamics, and documented side effects,
    especially cardiovascular.

  - Download and save key PDFs to the case file\'s \"Research\"
    subfolder.

**Step 2.2: Crafting the Master AI Prompt**

- **Objective:** To create an exhaustive, detailed prompt to guide the
  AI analysis, ensuring it explores every necessary dimension of the
  problem.

- **Process:**

  - Use the SDA_Template_AI_Research_Prompt_v1.0 template.

  - The prompt must include:

    1.  **Role & Persona:** Instruct the AI to act as a
        multi-disciplinary research team.

    2.  **Case Background:** Provide all details from the Client
        Profile.

    3.  **Core Objective:** State the defined research question.

    4.  **Scope of Analysis:** Explicitly demand deep research into MOA,
        receptor interactions, downstream effects, pharmacokinetics, and
        pharmacodynamics for every substance.

    5.  **Substance List:** Clearly itemize every substance to be
        analyzed, separating primary variables from stable baseline
        factors.

    6.  **Synthesis & Modeling Instructions:** Direct the AI to model
        the dynamic interplay between all factors and to form structured
        hypotheses.

**Phase 3: Multi-Model AI Analysis & Synthesis**

This is the core computational phase where raw data is transformed into
synthesized insight.

**Step 3.1: Iterative AI Model Querying**

- **Objective:** To generate a comprehensive analytical output from our
  primary large language model (e.g., GPT-5 Pro or equivalent).

- **Process:**

  - Submit the master prompt to the AI model.

  - Review the initial output for completeness and accuracy.

  - Engage in a dialogue with the model to clarify points or request
    deeper dives into specific areas (e.g., \"Elaborate on the
    pharmacokinetics of Yohimbine HCl vs. Synephrine.\").

**Step 3.2: Triangulation & Validation**

- **Objective:** To validate the AI\'s output against the scientific
  literature and ensure robustness of the findings.

- **Process:**

  - Fact-check specific claims made by the AI (e.g., receptor binding
    affinities, metabolic half-lives) against the papers gathered in
    Phase 2.

  - Submit the same prompt, or a variation of it, to a *different* large
    language model to check for consensus. Discrepancies between models
    are key areas for deeper manual investigation.

  - Identify any AI-generated statements that lack strong support in the
    existing literature; these should be flagged as \"speculative\" or
    \"requiring further research.\"

**Step 3.3: Synthesis of Findings**

- **Objective:** To weave the validated data points from all sources
  (client, literature, AI models) into a single, coherent analytical
  narrative.

- **Process:**

  - Create a new document, SDA_Analysis\_\[CaseFile\]\_v1.0.

  - Begin by summarizing the undisputed facts from the literature.

  - Integrate the AI\'s analysis of the dynamic interplay, explaining
    *how* the different compounds interact.

  - Use the AI\'s output to structure the argument, but ensure every
    critical claim is backed by a literature citation or is clearly
    noted as a modeled hypothesis.

**Phase 4: Hypothesis Modeling & Reporting**

The final phase is the creation of the client-facing deliverable.

**Step 4.1: Structuring the Scientific Report**

- **Objective:** To present the synthesized findings in a formal,
  publication-style report.

- **Process:**

  - Use the SDA_Template_Scientific_Report_v1.0.

  - **Abstract:** A concise summary of the case, methods, findings, and
    primary hypothesis.

  - **Introduction:** Detail the case background and the core research
    question.

  - **Methods of Analysis:** Describe this SOP, explaining the use of
    client data, literature review, and multi-model AI synthesis.

  - **Analysis & Findings:** Present the detailed breakdown of each
    substance\'s pharmacology and physiology.

  - **Dynamic Interplay Model:** Create a table and/or flowchart that
    visually represents how the substances interact.

  - **Discussion:** Present the primary and secondary hypotheses,
    explaining the reasoning in detail.

  - **Conclusion & Knowledge Gaps:** Summarize the most likely cause and
    list the missing data points (e.g., blood work, ingredient labels)
    that would be needed for a definitive conclusion.

  - **References:** A full list of all cited scientific literature in
    APA format.

**Step 4.2: Internal Peer Review**

- **Objective:** To ensure the report is accurate, clear, and logically
  sound before client delivery.

- **Process:**

  - The primary analyst submits the draft report for review by another
    team member.

  - The reviewer checks for clarity, factual accuracy, and adherence to
    this SOP.

  - Feedback is incorporated into a final version.

**Phase 5: Client Delivery & Collaboration**

**Step 5.1: Delivering the Report**

- **Objective:** To provide the client with the final report and explain
  its purpose.

- **Process:**

  - Export the final report to PDF.

  - Deliver it to the client via a secure channel.

  - Include a cover letter explaining that the document is an analytical
    synthesis intended to aid their personal research and facilitate
    data-driven conversations with their medical team. **Crucially,
    state that it is not medical advice.**

**Step 5.2: Follow-Up**

- **Objective:** To answer any questions the client may have and plan
  for potential further analysis.

- **Process:**

  - Schedule a follow-up call if requested by the client.

  - If the client obtains new data (e.g., lab results, exact ingredient
    labels), create a new version of the analysis (v1.1) incorporating
    the new information.

**Change Log:**

- **v1.0 (2025-10-01):** Initial creation of the comprehensive Client
  Intake and Analysis Protocol.

**Review Schedule:** Biannually. **Next Review:** April 1, 2026.

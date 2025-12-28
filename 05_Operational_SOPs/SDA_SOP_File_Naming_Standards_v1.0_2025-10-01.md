**SDA-File_Naming_Standards_Manual_v1.1**

**Document Type:** Internal Operations Manual **Effective Date:**
October 1, 2025 **Document Owner:** SparkData Analytics, LLC
**Version:** 1.1

**1.0 Executive Summary and Purpose**

In data analytics, precision is paramount. This principle extends to how
we name our files. A file named
02_SDA_Analysis_JSmith_Hypertension_Contributors_v1.0_2025-09-30.xlsx
instantly communicates its priority, origin (SparkData Analytics),
purpose (Analysis), subject (JJ Smith\'s hypertension contributors),
version, and date. This immediate clarity is critical for project
integrity, client trust, and internal efficiency.

This manual establishes the official file naming standard for SparkData
Analytics. Adherence to this system will ensure every dataset, script,
client profile, and report is named with a consistent, logical, and
searchable structure. This standard is the foundation of our data
governance and information management strategy, designed to scale with
our operations while ensuring every digital asset is instantly
identifiable and accessible.

**2.0 The Universal Naming Formula**

**Core Structure**

\[Prefix\_\]SDA\_\[DocumentType\]\_\[Description\]\_\[Version\]\_\[Date\].\[extension\]

- **Prefix (Optional):** A two-digit number used exclusively for core
  project documents to ensure they sort to the top of a folder (See
  Section 4.0).

- **SDA:** Our unique business identifier. It prefixes every internal
  file, ensuring our intellectual property is always recognizable,
  especially when shared with clients or collaborators.

- **DocumentType:** A high-level category that defines the file\'s
  function (e.g., Analysis, Dataset, Report). This answers, \"What kind
  of file is this?\"

- **Description:** The specific subject of the file, using clear,
  searchable keywords (e.g., JJSmith_Supplement_Interaction,
  Q4_Client_Acquisition). This answers, \"What is this file about?\"

- **Version:** Tracks the file\'s iteration history, distinguishing
  between major and minor revisions. This answers, \"Which version of
  this file is this?\"

- **Date:** The date of the file\'s last significant modification,
  formatted for chronological sorting. This answers, \"How current is
  this file?\"

- **Extension:** The file format (e.g., .xlsx, .py, .pdf), indicating
  the required software.

**3.0 Document Type Classifications**

These classifications form the backbone of our naming convention,
tailored to the workflow of data analysis.

- **Client Profile (Profile):** Foundational documents containing client
  intake information, goals, and raw context.

  - *Example:* SDA_Profile_JJSmith_Initial_Intake_v1.0_2025-09-30.docx

- **Data Analysis (Analysis):** The core working files where data is
  manipulated, explored, and modeled. This includes spreadsheets,
  statistical software files, and notebooks.

  - *Example:*
    SDA_Analysis_JJSmith_Supplement_Interaction_v1.2_2025-10-05.xlsx

- **Client Report (Report):** Final, polished deliverables for clients,
  typically summarizing findings and insights.

  - *Example:*
    SDA_Report_JJSmith_Hypertension_Findings_v1.0_2025-10-10.pdf

- **Datasets (Dataset):** Raw, cleaned, or processed data files. The
  description should specify the source and status of the data.

  - *Example:* SDA_Dataset_NHANES_Blood_Pressure_Raw_v1.0_2025-09-28.csv

- **Models and Scripts (Model/Script):** Code files used for analysis,
  including queries, processing scripts, and machine learning models.

  - *Example:* SDA_Script_Ingredient_Cross_Reference_v2.1_2025-10-02.py

- **Standard Operating Procedures (SOP):** Step-by-step instructions for
  our internal analytical or operational processes.

  - *Example:* SDA_SOP_Client_Data_Anonymization_v1.5_2025-09-15.docx

- **Research and References (Research):** Supporting materials,
  including academic papers, industry studies, and clinical trial data
  that inform our analyses.

  - *Example:*
    SDA_Research_Clonidine_Side_Effects_Review_v1.0_2025-09-30.pdf

- **Strategic & Business Documents (Strategy/Profile/Marketing):**
  Internal documents related to business planning, marketing, and
  company information.

  - *Example:* SDA_Strategy_Q4_Client_Acquisition_v1.0_2025-09-20.pptx

**4.0 Core Project & Client-Facing File Standards (NEW)**

To ensure critical project files are always accessible and prioritized,
we are introducing a **Priority Prefix** system for core documents.
Furthermore, a special rule now applies to finalized, client-facing
reports to maintain their integrity.

**4.1 Priority Prefixes for Core Documents**

For any given client project, the four primary documents **must be
prefixed** with a two-digit number to force them to the top of any file
directory when sorted alphabetically.

- **00\_** - Final Client Report

- **01\_** - Client Profile / Case Summary

- **02\_** - Primary Analysis File

- **03\_** - Master Dataset / Transcript

**Example Implementation:** The file
SDA_Profile_JJSmith_Case_Summary_v1.0.docx becomes:
01_SDA_Profile_JJSmith_Case_Summary_v1.0_2025-10-01.docx

This ensures that no matter how many other data files or research
documents are added, the core project overview documents are always
immediately visible.

**4.2 Special Case: Finalized Client-Facing HTML Reports**

Client-facing deliverables, particularly synthesized HTML reports, have
a unique and immutable naming convention to ensure consistency and
client clarity.

- **Rule:** The filename format
  SparkData\_\[Client/Subject\]\_\[Topic\]\_AI_Synthesis\_\[Year\].html
  **must not be altered** after its creation. It does not follow the
  standard SDA\_ convention.

- **Sorting:** To ensure this final report is prioritized, it will be
  the *only* file that combines a **Priority Prefix** (00\_) with its
  unique naming format.

**Example:**
00_SparkData\_\[Redacted\]\_HTN_TRT_Supplement_AI_Synthesis_2025.html

This dual system ensures the file sorts to the absolute top for internal
purposes while its core name remains unchanged for client delivery.

**5.0 Technical & Content Guidelines**

**5.1 Description Writing Guidelines**

- **Be Specific but Concise:** Use keywords that you or a team member
  would use in a search. Balance detail with brevity.

- **Prioritize Client/Subject:** Start the description with the client
  name or primary subject for easy grouping (e.g., JJSmith\_\...).

- **Use Consistent Terminology:** Standardize terms across all files
  (e.g., use Hypertension, not High_BP).

**5.2 Version Control Mastery**

We use a semantic versioning system to track file evolution.

- **Major Versions (vX.0):** Increment the whole number (v1.0 -\> v2.0)
  for substantial changes, such as:

  - Introducing a new methodology or data source.

  - A major pivot in analytical direction.

  - A complete rewrite of a client report.

- **Minor Versions (vX.Y):** Increment the decimal (v1.0 -\> v1.1) for
  refinements, such as:

  - Data cleaning updates or error corrections.

  - Adding a new chart or clarifying a paragraph in a report.

  - Minor code refactoring or adding comments.

- **Never use ambiguous terms like FINAL, LATEST, or New.** The version
  number is the single source of truth.

**5.3 Date Formatting Standard**

Always use the **ISO 8601 standard: YYYY-MM-DD**. This format ensures
files sort chronologically regardless of system settings and removes any
regional ambiguity.

**6.0 Real-World Naming Transformations**

- **Original:** JJ Smith BP data.xlsx

- **Transformed:** SDA_Dataset_JJSmith_BP_Log_v1.0_2025-09-30.xlsx

- **Original:** Final report for client.pdf

- **Transformed:**
  SDA_Report_JJSmith_Hypertension_Findings_v1.0_2025-10-10.pdf

- **Original:** pre-workout analysis v2.docx

- **Transformed:**
  02_SDA_Analysis_Pre-Workout_Formulation_Compare_v2.0_2025-10-01.docx

**7.0 Quick Reference Card (v1.1)**

**Standard File:**
SDA\_\[Type\]\_\[Description\]\_\[vX.X\]\_\[YYYY-MM-DD\].ext **Core
File:** \[Prefix\]\_\[SDA\_\...\]

- **Prefixes:** 00\_ (Final Report) \| 01\_ (Profile) \| 02\_ (Analysis)
  \| 03\_ (Dataset)

- **Types:** Profile \| Analysis \| Report \| Dataset \| Model \| Script
  \| SOP \| Research \| Strategy

- **Version:** Major=v2.0 \| Minor=v1.1

- **Date:** Always YYYY-MM-DD

- **Rules:** No spaces (use underscores). No special characters. Be
  consistent.

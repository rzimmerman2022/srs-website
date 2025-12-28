# Authoritative Sources SOP - Enterprise Tracker Build Process

**Version:** 1.0
**Date:** 2025-11-19
**Status:** MANDATORY - NEVER DEVIATE
**Purpose:** Define authoritative source of truth and prevent circular references in tracker builds

---

## 🚨 CRITICAL RULES

### Rule #1: NEVER Use Previous Tracker Iterations as Sources
**FORBIDDEN:**
- ❌ ANDREW_BEAM_TRACKER_*.csv (any version we created)
- ❌ ANDREW_BEAM_COMPREHENSIVE_*.csv
- ❌ ANDREW_BEAM_ENTERPRISE_*.csv
- ❌ ANDREW_BEAM_MANAGEMENT_*.csv
- ❌ ANY CSV file we previously generated

**Why:** These are derivatives/photocopies. Always go back to original source data.

### Rule #2: Archive ALL Tracker Iterations Immediately
**Location:** `04-ARCHIVE/legacy-trackers-DO-NOT-USE/`
**When:** Immediately after creating any tracker CSV
**Purpose:** Remove temptation to merge iterations

### Rule #3: Build Fresh Every Time
**Never:** Merge previous tracker with new data
**Always:** Rebuild entire tracker from authoritative sources only

---

## Authoritative Sources (ONLY These)

### Source #1: Email Threads & Attachments (Folder 1)
**Location:** `Email_Threads_and_Attachments__ryan.zimmerman@southwestresumes.com/`
**Format:** Organized folders with all file types (PDF, DOCX, XLSX, PNG, etc.)
**Structure:**
```
Email_Threads_and_Attachments__ryan.zimmerman@southwestresumes.com/
├── Run_2025-11-19_00-47-19/
│   ├── Batch 0-20/
│   │   ├── 00_Email_Thread_Conversation.pdf  ← AUTHORITATIVE thread conversation
│   │   ├── file1.pdf                         ← Attachment
│   │   ├── file2.xlsx                        ← Attachment
│   └── ...
```

**What to Extract:**
- **From thread PDF (`00_Email_Thread_Conversation.pdf`):**
  - Email date/time (from original email headers)
  - Email participants (From/To/CC)
  - Email subject
  - Email thread ID
  - Message content
  - References to attachments
- **From attachment files:**
  - File path (authoritative location)
  - Filename
  - File size (bytes → convert to MB)
  - File type (MIME type from extension)
  - File modification timestamp
  - Parent folder (email thread reference)

**Validation:**
- ✅ Folder contains `00_Email_Thread_Conversation.pdf`
- ✅ All attachment files exist at path
- ✅ File size > 0
- ❌ Never modify these files

### Source #2: Email Threads & Attachments (Folder 2)
**Location:** `Email_Threads_and_Attachments__rzimmemran2018@gmail.com/`
**Format:** Same as Source #1
**Purpose:** Threads + attachments from alternate email account

**What to Extract:** (same as Source #1)

### Source #3: Google Drive API Export
**Location:** `ANDREW_BEAM_DRIVE_UPLOADS_API_EXPORT__CODEX-GPT5__20251119-165348_v1.0.csv`
**Format:** CSV with Drive metadata
**Columns:**
- `File_ID` - Google Drive file ID
- `Drive_Link` - Direct browser link
- `File_Name` - Original filename
- `Owner` - ryan.zimmerman@southwestresumes.com
- `Mime_Type` - application/pdf, image/png, etc.
- `File_Size` - Size in bytes
- `Created_Time` - ISO timestamp
- `Modified_Time` - ISO timestamp
- `Drive_Folder` - Folder path in Drive

**What to Extract:**
- ALL columns as-is
- Convert File_Size to MB
- Parse timestamps to Date/Time

**Validation:**
- ✅ File created by Drive API (has __CODEX-GPT5__ in name)
- ✅ Has File_ID column
- ❌ Never modify this file

### Source #4: Git Repository (Andrew's Practicum)
**Location (Authoritative - Mounted Google Drive):**
`/Users/ryanzimmerman/Library/CloudStorage/GoogleDrive-rzimmerman2018@gmail.com/My Drive/CLOUD - Projects/SRS - AI Learning Partnership Platform - 2025 - #001/00-Git-Practicum-Repo/`

**⚠️ DEPRECATED LOCATIONS (DO NOT USE):**

- ❌ `SRS - Git Repo - AI Learning Partnership Platform - 2025 - #001/` (duplicate copy - archived to data/archive/)
- ❌ `03-REFERENCE-DATA/andrews-practicum-repo/` (old backup - removed)
- ❌ `MACBOOK - Projects/SRS - AI Learning...` (old path - correct path is `CLOUD - Projects`)

#### 🚨 CRITICAL: Git Sync Requirement (Added 2025-11-24)

**MANDATORY PRE-SCAN STEP:**

```bash
# ALWAYS sync with remote before scanning commits
cd "$GIT_REPO"
git pull
```

**Why This Matters:**

- Repository is stored on Google Drive (synced via File Stream)
- Google Drive syncs `.git/` metadata files but does **NOT** run `git pull`
- Local Git database can be stale (missing recent commits pushed to GitHub)
- **Without `git pull`, tracker will miss commits** (discovered 2025-11-24: missed 27 Week 2 commits)

**How It Works:**

1. Andrew pushes commits to GitHub (remote repository)
2. Google Drive File Stream syncs `.git/` folder to local machine
3. BUT local Git database still shows old commit history
4. Running `git pull` updates local database with remote commits
5. Now `git log` shows complete commit history

**Automated in Tracker Builder:**

The tracker builder script now automatically runs `git pull` before scanning.
See [ADR-006](../../ADRs/ADR-006-git-repository-sync-requirements.md) for full details.

**What to Extract:**
```bash
# Git log with full metadata (AFTER git pull!)
git log --all --pretty=format:"%H|%ai|%an|%ae|%s|%b" --name-status
```

**Columns:**
- `Git_Commit_Hash` - Full SHA hash (e.g., 72c21ee3f4...)
- `Git_Commit_Timestamp` - ISO 8601 timestamp (2025-11-10T17:16:30-07:00)
- `Git_Author_Name` - Andrew Beam
- `Git_Author_Email` - andrew.beam@example.com
- `Git_Commit_Message` - First line of commit
- `Git_Commit_Body` - Full commit message
- `Git_Files_Changed` - List of files in commit

**Known Commits:**
- `72c21ee` - 2025-11-10 17:16:30 - E1_Source_Triage.md
- `5749df7` - 2025-11-11 19:30:00 - Ergonomic_Workstation_Action_Plan.md

**Validation:**
- ✅ Extract from .git folder or git log
- ✅ Use commit timestamp (NOT file modification time)
- ❌ Never modify Git history

---

## Build Process (Step-by-Step)

### Step 1: Extract from Each Source

Create separate extraction scripts:

```python
# 1. parse_email_threads.py
def parse_email_threads():
    """Parse 00_Email_Thread_Conversation.pdf files from authoritative folders"""
    folders = [
        'data/raw/Email_Threads_and_Attachments__ryan.zimmerman@southwestresumes.com/',
        'data/raw/Email_Threads_and_Attachments__rzimmemran2018@gmail.com/'
    ]
    for folder in folders:
        for batch_folder in glob(f"{folder}/*/"):
            thread_pdf = os.path.join(batch_folder, '00_Email_Thread_Conversation.pdf')
            if os.path.exists(thread_pdf):
                # Extract email metadata from PDF
                # Parse email content for From/To/Message
                # Yield rows with Source_Type='EMAIL_THREAD'
                pass
```

```python
# 2. scan_email_attachments.py
def scan_email_attachments():
    """Scan Email_Threads_and_Attachments__*/**/*"""
    folders = [
        'data/raw/Email_Threads_and_Attachments__ryan.zimmerman@southwestresumes.com/',
        'data/raw/Email_Threads_and_Attachments__rzimmemran2018@gmail.com/'
    ]
    for folder in folders:
        for file in recursive_scan(folder):
            # Skip the thread PDF - that's handled by parse_email_threads()
            if file.endswith('00_Email_Thread_Conversation.pdf'):
                continue
            # Extract file metadata for all other attachments
            # Yield rows with Source_Type='EMAIL_ATTACHMENT'
```

```python
# 3. import_drive_api_export.py
def import_drive_api_export():
    """Read Drive API CSV"""
    df = pd.read_csv("ANDREW_BEAM_DRIVE_UPLOADS_API_EXPORT__CODEX-GPT5__*.csv")
    for row in df.iterrows():
        # Convert to tracker schema
        # Yield rows with Source_Type='DRIVE_UPLOAD'
```

```python
# 4. extract_git_commits.py
def extract_git_commits():
    """Query Git repository"""
    git_log = subprocess.run(
        ["git", "log", "--all", "--pretty=format:%H|%ai|%s"],
        capture_output=True, cwd=GIT_REPO_PATH
    )
    for commit in git_log.stdout.decode().split('\n'):
        # Parse commit metadata
        # Yield rows with Source_Type='GIT_COMMIT'
```

### Step 2: Combine into Master Tracker

```python
# 5. build_master_tracker_from_sources.py
def build_master_tracker():
    """Combine ALL authoritative sources"""

    all_rows = []

    # Source 1: Email threads
    all_rows.extend(parse_email_threads())

    # Source 2: Email attachments
    all_rows.extend(scan_email_attachments())

    # Source 3: Drive API export
    all_rows.extend(import_drive_api_export())

    # Source 4: Git commits
    all_rows.extend(extract_git_commits())

    # Deduplicate (if needed)
    unique_rows = deduplicate(all_rows)

    # Export to CSV
    export_to_csv(unique_rows, "ANDREW_BEAM_MASTER_TRACKER_v4.0.csv")

    # IMMEDIATELY archive this tracker!
    archive_tracker("ANDREW_BEAM_MASTER_TRACKER_v4.0.csv")
```

### Step 3: Validate Provenance

Every row MUST have:
- `Source_Type` - One of: EMAIL_THREAD | EMAIL_ATTACHMENT | DRIVE_UPLOAD | GIT_COMMIT
- `Source_File` - Full path to authoritative source file
- `Extraction_Timestamp` - When we extracted it
- `Extraction_Script` - Which script extracted it

**Validation Test:**
```python
def validate_row(row):
    """Verify row traces back to authoritative source"""

    if row['Source_Type'] == 'EMAIL_THREAD':
        # Must have valid thread PDF path
        assert os.path.exists(row['Source_File'])
        assert row['Source_File'].endswith('00_Email_Thread_Conversation.pdf')
        assert 'Email_Threads_and_Attachments__' in row['Source_File']

    elif row['Source_Type'] == 'EMAIL_ATTACHMENT':
        # Must have valid attachment file path
        assert os.path.exists(row['Source_File'])
        assert 'Email_Threads_and_Attachments__' in row['Source_File']

    elif row['Source_Type'] == 'DRIVE_UPLOAD':
        # Must have Drive File_ID
        assert row['Drive_File_ID'].strip() != ''
        assert row['Drive_Link'].startswith('https://drive.google.com')

    elif row['Source_Type'] == 'GIT_COMMIT':
        # Must have valid Git commit hash
        assert len(row['Git_Commit_Hash']) >= 7
        assert is_valid_git_hash(row['Git_Commit_Hash'])
```

---

## Schema for Master Tracker v4.0

```csv
# Temporal (from source timestamp)
Date,Time,Timestamp_ISO,Timestamp_UTC,Day_of_Week,Week_Number

# Source Identity (MANDATORY)
Source_Type,Source_File,Source_Reference,Extraction_Timestamp,Extraction_Script

# Email Metadata (if Source_Type=EMAIL_THREAD or EMAIL_ATTACHMENT)
Email_From,Email_To,Email_Subject,Email_Thread_ID,Email_Date,Email_Time

# Attachment Metadata (if Source_Type=EMAIL_ATTACHMENT)
Attachment_Filename,Attachment_Path,Attachment_Size_MB,Attachment_Mime_Type

# Drive Metadata (if Source_Type=DRIVE_UPLOAD)
Drive_File_ID,Drive_Link,Drive_Owner,Drive_Mime_Type,Drive_Size_MB,Drive_Folder,Drive_Created_Time,Drive_Modified_Time

# Git Metadata (if Source_Type=GIT_COMMIT)
Git_Commit_Hash,Git_Commit_Timestamp,Git_Author_Name,Git_Author_Email,Git_Commit_Message,Git_Files_Changed

# Classification (MANUAL or AI annotation - NOT from source)
Category,Type,Pillar,Entry_Type,Item_Description,Deliverable_Details

# Status (MANUAL grading - NOT from source)
Status,Grade,Performance_Grade,Compliance_Status,Management_Action_Needed

# Relationship Tracking
Related_Email_Thread,Related_Attachment,Related_Drive_File,Related_Git_Commit

# Notes
Notes
```

---

## 🚨 CRITICAL: Tracker Schema and Enrichment Architecture

### Tracker Schema: Exhaustive, Never Simplified

**GOLDEN RULE:** The master tracker is the **first-stage merge of ALL authoritative sources** and must be **EXHAUSTIVE** - never simplified or reduced.

**Why This Matters:**
> "The tracker SHOULD NOT simplify ANYTHING! It's the ingestion, which becomes the first step of merging of all SOURCE OF TRUTHS and must be as exhaustive as possible!"
> — Project Owner, 2025-11-24

**Schema Requirements:**
- ✅ **42 columns minimum** (full enterprise-grade schema)
- ✅ **All source attribution fields** (Source_File, Source_Reference, Source_Thread, Page_Line_Reference, Attachments)
- ✅ **All file metadata fields** (File_ID, File_Name, Mime_Type, File_Size_MB, Page_Count)
- ✅ **All management/grading fields** (Performance_Grade, Grade, Compliance_Status, Management_Action_Needed, Action_Required)
- ✅ **All timestamp/verification fields** (Timestamp_ISO, Timestamp_UTC, Verification_ID, Match_Status)

**Why Exhaustive:**
- The tracker is the **source of truth consolidation layer**
- Downstream tools (dashboards, reports, analytics) filter/aggregate as needed
- **Never lose information** at the ingestion stage
- Enable future analysis without re-extracting from sources

### Management/Grading Fields: Pending Enrichment Specification

**Current Status (2025-11-24):**

The following columns are **present in the schema but intentionally empty** pending enrichment specification:

| Column | Purpose | Current Status |
|--------|---------|----------------|
| `Performance_Grade` | Letter grade (A+, A, B+, etc.) | **EMPTY - Manual review required** |
| `Grade` | Numeric score (0-100) | **EMPTY - Manual review required** |
| `Compliance_Status` | PASS/FAIL/PENDING | **EMPTY - Manual review required** |
| `Management_Action_Needed` | YES/NO flag | **EMPTY - Manual review required** |
| `Action_Required` | Description of required action | **EMPTY - Manual review required** |
| `Page_Line_Reference` | Specific page/line in source file | **EMPTY - Extraction pending** |
| `Attachments` | Count of attachments | **EMPTY - Extraction pending** |
| `Page_Count` | Number of pages in file | **EMPTY - Extraction pending** |

**Why Empty:**
- **No authoritative rubric exists yet** for Performance_Grade/Grade/Compliance_Status
- **No enrichment specification** defining how to assign these values from authoritative sources
- **All grading/management fields flagged for manual review** until enrichment spec is approved

### Future Enrichment Architecture (TBD - World-Class Gold Standard)

**Requirements for Automated Enrichment:**

1. **Authoritative Sources Only:**
   - ✅ All enrichment values MUST derive from the 4 authoritative sources (email threads, attachments, Drive API, Git commits)
   - ❌ NO derived data from previous trackers
   - ❌ NO manual spreadsheets unless they become authoritative sources with provenance

2. **Explicit Rubric/Specification:**
   - Define grading rubric per assignment type (DAILY-DEBRIEF, RESEARCH-METHODOLOGY, DIAG-TASK, etc.)
   - Specify how to detect/extract Page_Count, Attachments from actual files
   - Document validation rules (e.g., Grade must be 0-100, Compliance_Status must be PASS/FAIL/PENDING)

3. **Validation Hooks:**
   - Flag if enrichment can't find a source file
   - Flag if required values are missing/out-of-range
   - Flag if source file doesn't match expected format
   - Enable root cause analysis when enrichment fails

4. **Auditability:**
   - Record how each enriched value was derived (source file path, rule applied, timestamp)
   - Log all enrichment decisions for reproducibility
   - Enable "explain this grade" queries

5. **Bulletproof Implementation:**
   - World-class gold standard - never wrong
   - If errors occur, catch them immediately with validation
   - Root cause analysis built into enrichment pipeline
   - Clear separation: ingestion (raw) → enrichment (derived) → validation (audit)

### Interim Manual Enrichment Process

**Until automated enrichment is implemented:**

1. **Export Manual Template:**
   ```bash
   # Generate template with just management/grading columns
   python tools/enrichment/generate_manual_template.py \
     --input ANDREW_BEAM_MASTER_TRACKER__*.csv \
     --output MANUAL_ENRICHMENT_TEMPLATE__*.csv
   ```

2. **Manual Review:**
   - Human reviewers fill Performance_Grade, Grade, Compliance_Status, Management_Action_Needed, Action_Required
   - Save as `MANUAL_ENRICHMENT_VALUES__YYYYMMDD_v1.0.csv`

3. **Merge Back:**
   ```bash
   # Merge manual values back into tracker (with audit trail)
   python tools/enrichment/merge_manual_enrichment_v2.py \
     --tracker ANDREW_BEAM_MASTER_TRACKER__*.csv \
     --manual MANUAL_ENRICHMENT_VALUES__*.csv \
     --output ANDREW_BEAM_TRACKER_GRADED__*.csv
   ```

### Merge Strategies (Added 2025-11-27)

The merge script supports three strategies via the `Merge_Strategy` column in enrichment CSVs:

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| `SINGLE_ROW` | Match first row by Source_File/Date, update grade fields | Grading specific attachments (Task PDFs) |
| `ROLLUP_ONLY` | Create NEW summary row, don't update thread rows | Debrief grades (synthesize across email thread) |
| `ALL_MATCHES` | Update all matching rows (legacy) | Rarely used |

**ROLLUP_ONLY is critical for debriefs** because:

- Debrief grades synthesize evidence across 50-200+ email messages
- Updating individual message rows would be misleading
- A single rollup row captures the holistic assessment

**Source Types that trigger ROLLUP behavior:**

- `ROLLUP_DEBRIEF` - Daily debrief summaries
- `ROLLUP_EXERCISE` - Exercise completion grades (E1, E2, E3)
- `ROLLUP_DELIVERABLE` - Package deliverables (Weekend Package)

1. **Archive Both:**
   - Archive original raw tracker (no enrichment)
   - Archive enriched tracker (with manual values)
   - Archive manual enrichment CSV (audit trail)

**Note:** Manual enrichment is temporary - goal is fully automated enrichment from authoritative sources.

---

## Forbidden Practices

### ❌ NEVER Do This
1. Merge previous tracker CSVs as source data
2. Use file modification time instead of source timestamp
3. Reference derivatives as authoritative
4. Update tracker in-place (always rebuild from sources)
5. Use archived tracker CSVs as INPUT sources for new builds

### ✅ ALWAYS Do This
1. Build from authoritative sources only
2. Use source timestamps (email date, Drive created time, Git commit time)
3. Validate provenance for every row
4. Document extraction script and timestamp
5. Commit graded trackers and audit logs to git for version control

### Clarification: Git Version Control of Outputs (Added 2025-11-27)

**Tracker/audit CSVs MAY be committed to git** for version control and audit trails.

**ADR-001 prohibits using old trackers as INPUTS** - it does NOT prohibit version-controlling OUTPUTS.

| Practice | Status | Rationale |
|----------|--------|-----------|
| Commit graded tracker to git | ✅ ALLOWED | Provides audit trail, accountability, backup |
| Use committed tracker as input to new build | ❌ FORBIDDEN | Creates circular references (ADR-001) |
| Commit audit logs to git | ✅ ALLOWED | Documents grading decisions |
| Archive old trackers to 04-ARCHIVE/ | ✅ RECOMMENDED | Prevents accidental reuse as inputs |

The merge script (`merge_manual_enrichment_v2.py`) always starts from a clean base tracker built from authoritative sources - it never uses previously graded trackers as inputs.

---

## Archive Procedure

After creating ANY tracker CSV:

```bash
# 1. Create archive folder (if not exists)
mkdir -p "04-ARCHIVE/legacy-trackers-DO-NOT-USE"

# 2. Move tracker to archive
mv ANDREW_BEAM_*_TRACKER_*.csv "04-ARCHIVE/legacy-trackers-DO-NOT-USE/"

# 3. Create README in archive
cat > "04-ARCHIVE/legacy-trackers-DO-NOT-USE/README.md" <<EOF
# Legacy Trackers - DO NOT USE AS SOURCE DATA

These are historical tracker iterations. They are DERIVATIVES, not authoritative sources.

**NEVER use these files as input to new tracker builds.**

To build a new tracker, use ONLY:
1. Email_Threads_and_Attachments__*/**/* (contains thread PDFs + all attachments)
2. ANDREW_BEAM_DRIVE_UPLOADS_API_EXPORT__*.csv
3. Git repository commits at CLOUD - Projects/SRS*/00-Git-Practicum-Repo/

See: 00-AUTHORITATIVE-SOURCES-SOP__v1.0__20251119.md
EOF

# 4. Verify working directory is clean
ls ANDREW_BEAM_*.csv  # Should return "no matches found"
```

---

## Quality Checks

### Before Building Tracker
- [ ] Verified all authoritative sources exist
- [ ] Checked no previous tracker CSVs in working directory
- [ ] Reviewed extraction scripts for correctness
- [ ] Validated source file counts (2 Email_Threads_and_Attachments__* folders, 1 Drive CSV, Git repo)
- [ ] Confirmed each email folder has 00_Email_Thread_Conversation.pdf files

### During Build
- [ ] Each row has Source_Type and Source_File
- [ ] Timestamps come from source (not file mod time)
- [ ] No circular references detected
- [ ] Provenance validation passes for all rows

### After Build
- [ ] Tracker archived immediately
- [ ] Working directory cleaned of tracker CSVs
- [ ] Documentation updated with build timestamp
- [ ] Validation report generated

---

## Maintenance

### Monthly Review
- Verify authoritative sources unchanged
- Check archive folder size (should grow over time)
- Review extraction scripts for updates
- Validate no tracker CSVs leaked into working directory

### When Adding New Sources
1. Document in this SOP under "Authoritative Sources"
2. Create extraction script
3. Update `build_master_tracker_from_sources.py`
4. Run validation on combined output

---

## Emergency Recovery

If you discover a tracker was built using previous iterations:

1. **Delete the corrupted tracker immediately**
2. **Identify all downstream uses** (Power BI, analysis, etc.)
3. **Rebuild from authoritative sources**
4. **Update all downstream systems**
5. **Document the incident** in CHANGELOG.md

---

## Contact

**Questions about this SOP:** Document in CHANGELOG.md
**Violations of this SOP:** CRITICAL ERROR - must be fixed immediately
**Updates to this SOP:** Increment version, document changes

---

## 📊 Processed/Derivative Data (Not Authoritative)

### Converted_Email_Threads_Text/ (REFERENCE ONLY)
**Location:** `data/processed/Converted_Email_Threads_Text/`
**Format:** 39 `.txt` files
**What This Is:**
- ⚠️ **PROCESSED** conversion of original thread PDFs to plain text
- Created for convenience/readability
- ❌ **NOT AUTHORITATIVE** - do NOT use as source for tracker builds

**When To Use:**
- Quick text searches
- Reading email content for context
- Prototyping extraction logic

**When NOT To Use:**
- As source data for tracker builds (use Email_Threads_and_Attachments__* folders instead)
- For provenance tracking (no metadata preserved)
- For audit trails (no timestamps, participants, thread structure)

---

## 📄 PDF to Markdown Conversion (AI-Readable Deliverables)

### Purpose

PDF deliverables (Task briefs, memos, AI transcripts) need to be converted to markdown for AI grading systems to process efficiently. This is a **one-way derivative** - never use these markdown files as authoritative sources.

### Location

- **Output:** `data/converted/deliverables/*.md`
- **Manifest:** `data/converted/CONVERSION_MANIFEST.csv`

### Conversion Rules

**CONVERTED (Small Deliverables):**

- ✅ Task*.pdf (diagnostic deliverables)
- ✅ *Brief*.pdf, *Memo*.pdf, *Analysis*.pdf
- ✅ *Transcript*.pdf, *Research*.pdf
- ✅ Any PDF < 100KB (likely a deliverable)

**SKIPPED (Large Email Threads):**

- ❌ `00_Email_Thread_Conversation.pdf` (multi-page email exports)
- ❌ Any PDF > 500KB (too large, likely email thread)

### When to Run

**Automatic:** PDF conversion runs as part of `make build-all` pipeline:

```bash
make build-all
# validate → tracker → dashboards → convert-pdfs → convert-debriefs → test
```

**Manual:** Run standalone when new PDFs are added:

```bash
make convert-pdfs
make convert-debriefs  # extracts Daily Debrief email threads (00_Email_Thread_Conversation.pdf)
```

### Usage for AI Grading

After conversion, AI models can read deliverables directly:

```bash
# List available converted deliverables
ls data/converted/deliverables/
ls data/converted/debriefs/   # Daily Debrief threads

# AI reads markdown instead of PDF
cat data/converted/deliverables/Task_1_HBR_Brief_AndrewBeam.md
cat data/converted/debriefs/2025-11-11_-_Southwest_Resume_Services_SRS_-_Day_1_Debrief_Day_2_Plan_Completing_Foundations.md
```

### NOT Authoritative

⚠️ **WARNING:** These markdown files are **derivatives** of the original PDFs.

- ❌ Do NOT use as source for tracker builds
- ❌ Do NOT cite as authoritative sources
- ✅ Use for AI grading and analysis workflows
- ✅ Regenerate anytime by running `make convert-pdfs`

### Manifest

The conversion manifest tracks all conversions:

```csv
source_pdf,output_md,size_kb,words,status,error,match_reason
```

Review manifest to verify which files were converted vs skipped.

Debrief manifest:

```csv
source_pdf,output_md,size_kb,words,messages_detected,status,error,match_reason
```

Review to confirm which email threads were extracted and how many messages were detected.

---

**Version History:**

- v1.0 (2025-11-19): Initial SOP created after discovering circular reference error in v3.0/v3.1 trackers
- v1.1 (2025-11-19): Corrected Source #1 - Converted_Email_Threads_Text is processed data, NOT authoritative
- v1.2 (2025-11-25): Added PDF to Markdown conversion section for AI grading pipeline
- v1.3 (2025-11-25): Added email thread debrief extraction (convert-debriefs) for AI grading
- v1.4 (2025-11-27): Clarified git version control policy (outputs may be committed; never used as inputs); documented ROLLUP merge strategies

**Approved By:** Ryan Zimmerman (project owner)
**Mandatory Compliance:** YES - no exceptions

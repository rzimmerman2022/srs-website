# Web UI/UX Model Context Prompt
## Platform Provider Data Analysis & Database UI Project

**Version**: 1.0
**Date**: 2025-11-30
**For**: Web UI/UX AI Models (v0, bolt.new, Lovable, etc.)
**Project**: SC KMH Master Case File - Platform Provider Source of Truth

---

## 🎯 WHAT YOU'RE BUILDING

You are building a **web-based database UI and analysis tool** for exploring 251,138 AI conversation messages across multiple platforms (OpenAI, Anthropic, Gemini, Cline) spanning 2.5 years.

### Core Capabilities Needed:
1. **Database Import Interface** - Load canonical JSONL (2.5GB) into PostgreSQL/SQLite
2. **Message Browser** - View, filter, and search messages by platform, date, conversation
3. **Conversation Thread View** - Display multi-turn conversations with proper threading
4. **Analytics Dashboard** - Statistics, trends, usage patterns across platforms
5. **Export & Reporting** - Generate reports for legal/compliance use

---

## 📊 THE DATA YOU'RE WORKING WITH

### Source: `canonical_messages_v3.jsonl`
- **Format**: JSONL (one JSON object per line)
- **Size**: 2,537.82 MB (~2.5 GB)
- **Total Messages**: 251,138
- **Platforms**: OpenAI (75.5%), Anthropic (17.6%), Gemini (6.9%)
- **Timespan**: April 2023 → October 2025 (914 days)

### Message Schema (canonical_messages_v3):

```json
{
  "id": "unique_message_id",
  "conversation_id": "conversation_identifier",
  "platform": "openai | anthropic | gemini | cline",
  "role": "user | assistant | system | tool | activity | human",
  "content_type": "text | multimodal | code | html | activity",
  "conversation_type": "chat | activity_log | log | api_call",
  "content_text": "The actual message content",
  "created_at_utc": "2025-11-30T10:30:00+00:00",
  "metadata": {
    "word_count": 150,
    "char_count": 892,
    "has_attachments": false,
    "attachment_count": 0
  },
  "platform_specific": {
    // Original platform-specific fields preserved here
  }
}
```

### Key Fields Explained:

#### **Platform-Specific Behavior**:
- **OpenAI/Anthropic**: Multi-turn conversations with `conversation_id` grouping
- **Gemini**: Standalone activities - each record has `conversation_id = id` (no grouping)
- **Cline**: Activity logs from AI coding assistant

#### **Role Field**:
- `user` - Human input
- `assistant` - AI response
- `activity` - Standalone Gemini activity (NOT part of conversation)
- `tool` - Tool/function call
- `system` - System message

#### **Conversation Types**:
- `chat` - Multi-turn conversation (OpenAI, Anthropic)
- `activity_log` - Standalone activity (Gemini)
- `log` - System logs (Cline)

---

## 🗄️ DATABASE SCHEMA (PostgreSQL Recommended)

```sql
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    role TEXT NOT NULL,
    content_type TEXT NOT NULL,
    conversation_type TEXT NOT NULL,
    content_text TEXT,
    activity_title TEXT,  -- For Gemini activities
    created_at_utc TIMESTAMP,
    metadata JSONB,
    platform_specific JSONB,

    -- Computed/indexed fields
    word_count INTEGER,
    char_count INTEGER,
    has_attachments BOOLEAN
);

-- Essential indexes
CREATE INDEX idx_conversation_id ON messages(conversation_id);
CREATE INDEX idx_platform ON messages(platform);
CREATE INDEX idx_created_at ON messages(created_at_utc);
CREATE INDEX idx_role ON messages(role);
CREATE INDEX idx_conversation_type ON messages(conversation_type);

-- Full-text search
CREATE INDEX idx_content_search ON messages USING GIN (to_tsvector('english', content_text));

-- Metadata queries
CREATE INDEX idx_metadata ON messages USING GIN (metadata);
```

---

## 🏗️ UI/UX REQUIREMENTS

### 1. Dashboard (Landing Page)

**Statistics Cards**:
- Total messages: 251,138
- Platforms: OpenAI (189,579), Anthropic (44,114), Gemini (17,445)
- Date range: Apr 2023 - Oct 2025
- Total conversations: 25,674

**Charts**:
- Messages over time (line chart)
- Platform distribution (pie chart)
- Role distribution (bar chart)
- Activity heatmap by day/hour

### 2. Message Browser

**Filters**:
- Platform dropdown (All, OpenAI, Anthropic, Gemini, Cline)
- Role dropdown (All, user, assistant, activity, tool, system)
- Conversation type (All, chat, activity_log, log)
- Date range picker
- Search bar (full-text search)

**Table View**:
```
┌───────────────┬──────────┬───────────┬─────────────┬────────────────────────┐
│ Date/Time     │ Platform │ Role      │ Conv. ID    │ Content (truncated)    │
├───────────────┼──────────┼───────────┼─────────────┼────────────────────────┤
│ 2025-10-20    │ OpenAI   │ user      │ conv_123    │ "How do I calculate..." │
│ 14:32:15      │          │           │             │                        │
├───────────────┼──────────┼───────────┼─────────────┼────────────────────────┤
│ 2025-10-20    │ OpenAI   │ assistant │ conv_123    │ "To calculate that..." │
│ 14:32:18      │          │           │             │                        │
└───────────────┴──────────┴───────────┴─────────────┴────────────────────────┘
```

**Pagination**: 50-100 messages per page

### 3. Conversation Thread View

When user clicks a `conversation_id`:

**Thread Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ Conversation: conv_123                                  │
│ Platform: OpenAI | Type: chat | Messages: 24           │
│ Started: 2025-10-20 14:30 | Ended: 2025-10-20 16:45   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  👤 User                            14:32:15           │
│  ┌─────────────────────────────────────────────────┐  │
│  │ How do I calculate the success probability for  │  │
│  │ my Denver layover?                              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  🤖 Assistant                       14:32:18           │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Based on statistical analysis, your layover... │  │
│  │ [full message content with formatting]          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features**:
- Markdown rendering for code blocks, lists, formatting
- Syntax highlighting for code snippets
- Copy message button
- Export thread as Markdown/PDF
- Metadata panel (word count, tokens, timestamps)

### 4. Gemini Activity View

**Special Handling**: Gemini records are **standalone** - each is its own "conversation"

**Activity Card**:
```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Gemini Activity                                      │
│ ID: 476d0af9fca07af3 | 2025-09-05 07:29:33            │
├─────────────────────────────────────────────────────────┤
│ Title: "critique and rewrite email: I have checked..."  │
│                                                         │
│ Content:                                               │
│ critique and rewrite email: I have checked with Our    │
│ Team regarding feasibility for Success Analytics...    │
│                                                         │
│ Metadata:                                              │
│ • Word count: 57                                       │
│ • Character count: 304                                 │
│ • Attachments: None                                    │
└─────────────────────────────────────────────────────────┘
```

**Key Distinction**: Show "Standalone Activity" badge - NOT part of conversation thread

### 5. Analytics & Reports

**Usage Patterns**:
- Messages per day/week/month
- Platform usage trends over time
- Most active hours/days
- Average conversation length by platform

**Conversation Analysis**:
- Average messages per conversation
- Conversation duration analysis
- Role distribution (user vs assistant message ratio)
- Content type breakdown

**Export Options**:
- CSV export (filtered results)
- JSON export (raw data)
- PDF report (statistics + charts)
- Markdown summary

---

## 🔐 DATA INTEGRITY & LEGAL REQUIREMENTS

### **CRITICAL: Gemini Data Model**

⚠️ **DO NOT** group Gemini activities into conversations. Each Gemini record is **standalone**:
- `conversation_id` = `id` (they're the same)
- `conversation_type` = "activity_log"
- `role` = "activity"

**Why This Matters** (Legal/Scientific Integrity):
- Google Takeout provides standalone activity logs, NOT conversations
- Users can have 25+ Gemini tabs open simultaneously
- Grouping by time would create false conversation threading
- This data is for legal use - must honestly represent source data

**UI Implementation**:
- Show Gemini records as individual cards/entries
- DO NOT attempt to thread them together
- Label clearly as "Standalone Activity"
- Filter/search works normally, but no "Show Conversation" for Gemini

### **Schema Validation**

All messages must pass this validation:
```typescript
const VALID_PLATFORMS = ['openai', 'anthropic', 'gemini', 'cline'];
const VALID_ROLES = ['user', 'assistant', 'system', 'tool', 'activity', 'human'];
const VALID_CONTENT_TYPES = ['text', 'multimodal', 'code', 'html', 'activity'];
const VALID_CONVERSATION_TYPES = ['chat', 'activity_log', 'log', 'api_call'];

// Gemini-specific validation
if (platform === 'gemini') {
  assert(role === 'activity');
  assert(conversation_type === 'activity_log');
  assert(conversation_id === id); // Standalone
}
```

---

## 🛠️ TECHNOLOGY STACK RECOMMENDATIONS

### **Backend Options**:

**Option A: Python + Flask/FastAPI** (Recommended)
```python
# Import script already exists in project:
# convert_canonical_v3.py
# Use adapters_v3.py for data processing

from flask import Flask, jsonify, request
import psycopg2  # or sqlite3
import json

@app.route('/api/messages')
def get_messages():
    filters = {
        'platform': request.args.get('platform'),
        'role': request.args.get('role'),
        'start_date': request.args.get('start_date'),
        'end_date': request.args.get('end_date')
    }
    # Query database with filters
    return jsonify(messages)
```

**Option B: Node.js + Express**
```javascript
app.get('/api/messages', async (req, res) => {
  const { platform, role, startDate, endDate } = req.query;
  const messages = await db.query(/* ... */);
  res.json(messages);
});
```

### **Frontend Options**:

**Option A: React + Material-UI** (Modern, Component-Rich)
```jsx
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, LineChart } from 'recharts';

function MessageBrowser() {
  return (
    <DataGrid
      rows={messages}
      columns={columns}
      pagination
      filterModel={filters}
    />
  );
}
```

**Option B: Vue.js + Vuetify** (Simpler, Good for Dashboards)

**Option C: Svelte + SvelteKit** (Lightweight, Fast)

### **Database Options**:

1. **PostgreSQL** (Recommended) - Best for full-text search, JSONB queries
2. **SQLite** - Simpler, file-based, good for single-user
3. **DuckDB** - Analytical queries, works with Parquet if you convert

---

## 📝 IMPLEMENTATION STEPS

### Phase 1: Database Setup (Priority: HIGH)
1. Create PostgreSQL database
2. Define schema (use SQL above)
3. Write import script to stream JSONL → Postgres
   ```python
   import json
   import psycopg2

   conn = psycopg2.connect("dbname=messages user=postgres")
   cur = conn.cursor()

   with open('canonical_messages_v3.jsonl', 'r') as f:
       for line in f:
           msg = json.loads(line)
           cur.execute("""
               INSERT INTO messages (id, conversation_id, platform, ...)
               VALUES (%s, %s, %s, ...)
           """, (msg['id'], msg['conversation_id'], ...))

   conn.commit()
   ```
4. Verify counts: `SELECT COUNT(*) = 251138`, `SELECT COUNT(*) WHERE platform='gemini' = 17445`

### Phase 2: API Backend (Priority: HIGH)
1. `/api/stats` - Dashboard statistics
2. `/api/messages` - List messages with filters/pagination
3. `/api/conversations/:id` - Get conversation thread
4. `/api/search` - Full-text search endpoint

### Phase 3: Frontend UI (Priority: MEDIUM)
1. Dashboard with stats cards + charts
2. Message browser table with filters
3. Conversation thread view (special handling for Gemini)
4. Search interface

### Phase 4: Analytics & Export (Priority: MEDIUM)
1. Trend charts (messages over time)
2. Platform comparison views
3. Export functionality (CSV, JSON, PDF)
4. Report generation

---

## 🚨 CRITICAL RULES FOR AI MODELS

### **Gemini Data Handling**:
1. ✅ **DO**: Treat each Gemini record as standalone
2. ✅ **DO**: Show `conversation_id = id` for Gemini
3. ❌ **DON'T**: Group Gemini by time proximity
4. ❌ **DON'T**: Show "View Conversation" for Gemini activities
5. ❌ **DON'T**: Attempt to thread Gemini records together

### **Data Validation**:
1. ✅ **DO**: Validate all enum fields against schema
2. ✅ **DO**: Handle null timestamps gracefully
3. ✅ **DO**: Preserve original platform_specific data
4. ❌ **DON'T**: Modify IDs (they're deterministic SHA-256 hashes)
5. ❌ **DON'T**: Assume conversation threading for all platforms

### **Performance**:
1. ✅ **DO**: Use indexes for all common queries
2. ✅ **DO**: Paginate results (50-100 per page)
3. ✅ **DO**: Stream large JSONL imports (don't load 2.5GB into memory)
4. ✅ **DO**: Use lazy loading for conversation threads
5. ❌ **DON'T**: Load all 251,138 messages at once

---

## 📂 PROJECT STRUCTURE REFERENCE

```
SC KMH - 1. Platform Provider Official Source of Truth - 20251031/
├── canonical_messages_v3.jsonl           # 2.5GB data file (NOT in git)
├── canonical_messages_v3_metadata.json   # Statistics/metadata
├── canonical_schema_v2.json              # JSON Schema definition
├── adapters_v3.py                        # Data processing functions
├── convert_canonical_v3.py               # JSONL generation pipeline
├── tests/test_adapters_v3.py             # Test suite (26 tests)
├── README.md                             # Project overview
├── GEMINI_DATA_STRATEGY.md               # Gemini standalone rationale
├── GEMINI_DATA_LIMITATIONS.md            # Known limitations
└── docs/                                 # Additional documentation
```

**Use These for Reference**:
- `canonical_schema_v2.json` - Definitive schema with validation rules
- `GEMINI_DATA_STRATEGY.md` - Explains why Gemini is standalone
- `canonical_messages_v3_metadata.json` - Pre-computed statistics

---

## 🎨 UI/UX DESIGN PRINCIPLES

### **Visual Design**:
- Clean, modern interface (Material Design or similar)
- Dark mode support
- Responsive (works on desktop/tablet)
- Accessible (WCAG 2.1 AA compliance)

### **Information Hierarchy**:
1. **Dashboard** - High-level overview
2. **Browser** - Detailed list view
3. **Thread** - Deep dive into conversations
4. **Analytics** - Patterns and trends

### **Color Coding by Platform**:
- OpenAI: Green (#10a37f)
- Anthropic: Orange (#d97757)
- Gemini: Blue (#4285f4)
- Cline: Purple (#6366f1)

### **Icons**:
- 👤 User messages
- 🤖 Assistant messages
- ⚡ Gemini standalone activities
- 🔧 Tool/system messages
- 💬 Conversation threads

---

## 📊 EXAMPLE QUERIES YOU'LL NEED

```sql
-- Dashboard stats
SELECT platform, COUNT(*) FROM messages GROUP BY platform;
SELECT role, COUNT(*) FROM messages GROUP BY role;
SELECT DATE(created_at_utc), COUNT(*) FROM messages GROUP BY 1 ORDER BY 1;

-- Message browser with filters
SELECT * FROM messages
WHERE platform = 'openai'
  AND role = 'user'
  AND created_at_utc >= '2025-01-01'
ORDER BY created_at_utc DESC
LIMIT 50 OFFSET 100;

-- Conversation thread
SELECT * FROM messages
WHERE conversation_id = 'conv_123'
ORDER BY created_at_utc ASC;

-- Full-text search
SELECT * FROM messages
WHERE to_tsvector('english', content_text) @@ to_tsquery('Denver AND layover');

-- Gemini activities
SELECT * FROM messages
WHERE platform = 'gemini'
  AND conversation_type = 'activity_log'
ORDER BY created_at_utc DESC;
```

---

## 🔍 TESTING & VALIDATION

### **Data Integrity Checks**:
```python
# After import, verify:
assert total_messages == 251_138
assert messages_by_platform['openai'] == 189_579
assert messages_by_platform['anthropic'] == 44_114
assert messages_by_platform['gemini'] == 17_445

# Verify Gemini standalone model
gemini_msgs = db.query("SELECT * FROM messages WHERE platform='gemini'")
for msg in gemini_msgs:
    assert msg['conversation_id'] == msg['id']
    assert msg['role'] == 'activity'
    assert msg['conversation_type'] == 'activity_log'
```

### **UI Testing Checklist**:
- [ ] Dashboard loads with correct statistics
- [ ] Filters work (platform, role, date)
- [ ] Search returns relevant results
- [ ] Conversation threading works for OpenAI/Anthropic
- [ ] Gemini shows as standalone (no threading)
- [ ] Pagination works correctly
- [ ] Export functions produce valid files
- [ ] Charts render correctly
- [ ] Mobile responsive (if targeting mobile)

---

## 📞 SUPPORT & CONTEXT

### **Project Background**:
This is a legal case file repository containing AI conversation data from multiple platforms. The data has been processed through a rigorous pipeline (Phases 0-2 complete) and is now ready for database import and UI development (Phase 3).

### **Key Sessions/Documentation**:
- **Phase 0**: Repository setup (Nov 2, 2025)
- **Phase 1**: Gemini integrity fix - removed invalid session grouping (Nov 30, 2025)
- **Phase 2**: Output regeneration with content enhancements (Nov 30, 2025)
- **Phase 3**: Database migration & UI (YOU ARE HERE)

### **Technical Specifications**:
- All IDs are deterministic SHA-256 hashes
- Timestamps are ISO-8601 UTC format
- Content is cleaned (mojibake fixed, whitespace normalized)
- Zero validation errors in current dataset
- Output is JSONL (one JSON object per line)

---

## 🎯 YOUR TASK

**Build a web application that**:
1. Imports the 2.5GB JSONL file into a database
2. Provides a clean UI to browse, search, and analyze 251,138 messages
3. Correctly handles Gemini standalone activities (no false threading)
4. Generates analytics and reports
5. Exports data in various formats

**Start with Phase 1** (Database Setup), then move to Phase 2 (API), then Phase 3 (UI).

**Key Success Criteria**:
- ✅ All 251,138 messages imported correctly
- ✅ Gemini records shown as standalone (NOT threaded)
- ✅ Fast queries (indexed properly)
- ✅ Clean, professional UI
- ✅ Export functionality works

---

## 📋 QUICK START PROMPT (Copy-Paste This)

```
I need you to build a web-based database UI for exploring 251,138 AI conversation messages.

DATA:
- Format: JSONL (2.5GB file)
- Platforms: OpenAI, Anthropic, Gemini, Cline
- Schema: See canonical_schema_v2.json

KEY REQUIREMENTS:
1. Database: PostgreSQL with full schema (messages table + indexes)
2. Backend API: Flask/FastAPI with endpoints for stats, messages, search
3. Frontend UI: React/Vue with:
   - Dashboard (statistics cards + charts)
   - Message browser (filterable table)
   - Conversation thread view
   - Search interface
4. CRITICAL: Gemini records are STANDALONE (conversation_id = id)
   - DO NOT thread Gemini activities together
   - Show each as individual "Activity" card

Start with database schema and import script. Use the schema from the context above.

Stack preference: [Python + Flask + React] or [Your choice]

Questions?
```

---

**END OF CONTEXT PROMPT**

**Version**: 1.0
**Created**: 2025-11-30
**For**: Web UI/UX AI Models
**Project**: SC KMH Platform Provider Source of Truth

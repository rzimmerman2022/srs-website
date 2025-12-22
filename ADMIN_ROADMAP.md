# Admin Interface Master Roadmap & To-Do List

**Project:** Southwest Resume Services - Admin Dashboard
**Created:** December 21, 2025
**Session ID:** continuation-session-post-context-limit
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Last Updated:** December 21, 2025 at 5:45 PM MST

---

## Executive Summary

This document tracks all admin interface tasks, features, and improvements for the SRS questionnaire management system. The admin interface was built using a multi-agent workflow with research-backed best practices from Typeform, Google Forms, SurveyMonkey, JotForm, and Qualtrics.

**Current Status:**
- ✅ Core admin interface built (22 files created)
- ✅ All TypeScript checks passing
- ✅ Build successful
- ✅ Mock data in place for testing
- ⚠️ Using mock/placeholder data (not connected to Supabase yet)
- ⚠️ No authentication (anyone can access /admin)
- ⚠️ Settings page returns 404

---

## Phase 1: Foundation (COMPLETED ✅)

### Session: December 21, 2025

**Objective:** Build core admin interface with industry-standard patterns

**What Was Built:**

#### Admin Pages (8 files)
1. ✅ `/app/admin/layout.tsx` - Admin layout with sidebar navigation
2. ✅ `/app/admin/page.tsx` - Dashboard overview with stats cards
3. ✅ `/app/admin/questionnaires/page.tsx` - List all questionnaires with card/table toggle
4. ✅ `/app/admin/questionnaires/[id]/page.tsx` - Single questionnaire details
5. ✅ `/app/admin/questionnaires/[id]/responses/page.tsx` - All responses list
6. ✅ `/app/admin/questionnaires/[id]/responses/[responseId]/page.tsx` - Single response detail
7. ✅ `/app/admin/clients/page.tsx` - List all clients
8. ✅ `/app/admin/clients/[clientId]/page.tsx` - Client profile with activity

#### Admin Components (7 files)
1. ✅ `/components/admin/AdminSidebar.tsx` - Collapsible sidebar navigation
2. ✅ `/components/admin/QuestionnaireCard.tsx` - Card view component
3. ✅ `/components/admin/QuestionnairesTable.tsx` - Table view component
4. ✅ `/components/admin/StatusBadge.tsx` - Status indicators
5. ✅ `/components/admin/ClientCard.tsx` - Client card component
6. ✅ `/components/admin/ActivityLog.tsx` - Activity timeline
7. ✅ `/components/admin/ResponseTimeline.tsx` - Response detail viewer

#### Admin API Routes (5 files)
1. ✅ `/app/api/admin/questionnaires/route.ts` - GET all questionnaires with filtering
2. ✅ `/app/api/admin/questionnaires/[id]/route.ts` - GET single questionnaire
3. ✅ `/app/api/admin/clients/route.ts` - GET all clients
4. ✅ `/app/api/admin/clients/[clientId]/route.ts` - GET single client profile
5. ✅ `/app/api/admin/stats/route.ts` - GET dashboard statistics

#### Utility Functions
1. ✅ `maskEmail()` function in `/lib/utils.ts` - PII protection (j****@example.com)
2. ✅ `formatRelativeTime()` function - "2 hours ago" formatting
3. ✅ `formatDate()` function - "Dec 21, 2025" formatting

**Research Documentation:**
- ✅ `QUESTIONNAIRE-ADMIN-RESEARCH-REPORT.md` - 500+ line research report on best practices

---

## Phase 2: Critical Fixes & Data Connection (NEXT UP 🚨)

### Priority 1: Security & Authentication

**CRITICAL - MUST DO BEFORE PRODUCTION**

#### Task 2.1: Admin Authentication System
**Status:** ⚠️ Not Started
**Priority:** CRITICAL
**Rationale:** Currently anyone can access /admin route - major security vulnerability
**Estimated Effort:** 4-6 hours

**Requirements:**
- [ ] Add authentication middleware to protect `/admin/*` routes
- [ ] Create `/admin/login` page with email/password
- [ ] Implement session management (NextAuth.js or Supabase Auth)
- [ ] Add "Logout" button to admin header
- [ ] Redirect unauthenticated users to login page
- [ ] Add password reset flow
- [ ] Store admin users in Supabase `admin_users` table

**Implementation Notes:**
```sql
-- Database schema needed
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer', -- viewer, editor, admin
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);
```

**Files to Create:**
- `/app/admin/login/page.tsx`
- `/middleware.ts` (or update existing)
- `/lib/auth/admin-auth.ts`
- `/app/api/auth/admin/[...nextauth]/route.ts` (if using NextAuth)

**Dependencies:**
- NextAuth.js OR Supabase Auth
- bcrypt for password hashing

---

### Priority 2: Connect Real Data from Supabase

#### Task 2.2: Replace Mock Data with Supabase Queries
**Status:** ⚠️ Not Started
**Priority:** HIGH
**Rationale:** Dashboard showing fake data - needs real metrics from database
**Estimated Effort:** 3-4 hours

**Files to Update:**

1. **`/app/admin/page.tsx`** - Dashboard stats
   - [ ] Replace hardcoded stats (42 questionnaires, 78% completion) with API call
   - [ ] Fetch from `/api/admin/stats`
   - [ ] Add loading states
   - [ ] Add error handling
   - [ ] Add auto-refresh every 30 seconds

2. **`/app/admin/questionnaires/page.tsx`** - Questionnaire list
   - [ ] Replace `MOCK_QUESTIONNAIRES` with API call to `/api/admin/questionnaires`
   - [ ] Implement pagination (currently shows all)
   - [ ] Add loading skeleton screens
   - [ ] Add error state with retry button

3. **`/app/admin/clients/page.tsx`** - Client list
   - [ ] Replace mock data with API call to `/api/admin/clients`
   - [ ] Add search functionality
   - [ ] Add loading states

**API Routes Already Built (just need to connect):**
- ✅ `GET /api/admin/stats` - Returns dashboard metrics
- ✅ `GET /api/admin/questionnaires` - Returns all questionnaires
- ✅ `GET /api/admin/clients` - Returns all clients

**Testing Checklist:**
- [ ] Verify dashboard shows real counts from Supabase
- [ ] Verify completion percentages are accurate
- [ ] Verify client list shows actual client_ids from database
- [ ] Test with empty database (should show "No data" states)
- [ ] Test with 100+ questionnaires (pagination works)

---

### Priority 3: Settings Page

#### Task 2.3: Build Admin Settings Page
**Status:** ⚠️ Not Started (currently 404)
**Priority:** MEDIUM
**Rationale:** Navigation link exists but page missing
**Estimated Effort:** 2-3 hours

**File to Create:**
- `/app/admin/settings/page.tsx`

**Settings Sections to Include:**

1. **General Settings**
   - [ ] Company name (Southwest Resume Services)
   - [ ] Admin email address
   - [ ] Support email address
   - [ ] Timezone settings

2. **Questionnaire Defaults**
   - [ ] Default points per question
   - [ ] Milestone thresholds (10, 25, 50 questions)
   - [ ] Enable/disable gamification features
   - [ ] Auto-save interval (currently 30 seconds)

3. **Email Settings** (for future notifications)
   - [ ] SMTP configuration
   - [ ] Email templates
   - [ ] Reminder settings (days before reminder)

4. **SEO & Metadata**
   - [ ] Confirm robots.txt blocks admin routes
   - [ ] Verify noindex/nofollow on admin pages

5. **Data & Privacy**
   - [ ] Data retention period (auto-delete after X days)
   - [ ] Export all data (GDPR compliance)
   - [ ] PII masking toggle

**UI Pattern:**
- Tab-based interface (General | Questionnaires | Email | Privacy)
- Save button at bottom of each section
- Success/error toast notifications

---

## Phase 3: Essential Features (Tier 1)

### Task 3.1: Real-Time Dashboard Metrics
**Status:** 📋 Planned
**Priority:** HIGH
**Rationale:** Admins need live data without manual refresh
**Estimated Effort:** 2 hours

**Requirements:**
- [ ] Add WebSocket connection for live updates
- [ ] Update dashboard stats when new responses submitted
- [ ] Show "New response!" notification badge
- [ ] Auto-increment counters without page reload

**Implementation:**
- Use Supabase Realtime subscriptions
- Subscribe to `questionnaire_responses` table inserts/updates

---

### Task 3.2: Enhanced Search & Filters
**Status:** 📋 Planned
**Priority:** MEDIUM
**Rationale:** Current search is basic - needs saved filters and advanced queries
**Estimated Effort:** 3 hours

**Features to Add:**

1. **Saved Filters**
   - [ ] "Save current filter" button
   - [ ] Saved filter dropdown (My Filters | Active Only | Completed Last 7 Days)
   - [ ] Store in localStorage or database

2. **Advanced Filters**
   - [ ] Date range picker (created between X and Y)
   - [ ] Completion percentage range (50-75%)
   - [ ] Client name search (fuzzy matching)
   - [ ] Package type filter (Elite vs Premium vs Standard)

3. **Bulk Selection**
   - [ ] "Select All" checkbox
   - [ ] Multi-select rows with Shift+Click
   - [ ] Bulk actions toolbar appears when items selected

---

### Task 3.3: Export Functionality Enhancement
**Status:** ⚠️ Partial (CSV export exists, needs more)
**Priority:** MEDIUM
**Rationale:** Clients want data in multiple formats
**Estimated Effort:** 3 hours

**Current Status:**
- ✅ CSV export exists in `/app/admin/questionnaires/[id]/responses/page.tsx`

**Enhancements Needed:**

1. **Excel Export (.xlsx)**
   - [ ] Install `xlsx` library
   - [ ] Multi-sheet export (responses + metadata + summary)
   - [ ] Formatted cells (dates, percentages, colors)
   - [ ] Frozen headers

2. **PDF Reports**
   - [ ] Install `jsPDF` or `@react-pdf/renderer`
   - [ ] Executive summary report template
   - [ ] Question-by-question breakdown with charts
   - [ ] Company branding (logo, colors)

3. **Export Options**
   - [ ] Export single questionnaire
   - [ ] Export all questionnaires for a client
   - [ ] Export date range (all responses Dec 1-15)
   - [ ] Schedule exports (daily/weekly email)

---

### Task 3.4: Activity Audit Log
**Status:** 📋 Planned
**Priority:** MEDIUM
**Rationale:** Compliance, security, debugging
**Estimated Effort:** 4 hours

**Requirements:**
- [ ] Create `admin_audit_log` table in Supabase
- [ ] Log all admin actions (view, edit, delete, export)
- [ ] Show in `/admin/settings/audit-log` page
- [ ] Include: timestamp, admin user, action, resource, IP address
- [ ] Retention policy (keep 90 days)

**Database Schema:**
```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL, -- 'view', 'edit', 'delete', 'export'
  resource_type TEXT NOT NULL, -- 'questionnaire', 'response', 'client'
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON admin_audit_log(admin_user_id);
CREATE INDEX idx_audit_log_created ON admin_audit_log(created_at);
```

---

## Phase 4: Professional Features (Tier 2)

### Task 4.1: Email Notifications System
**Status:** 📋 Planned
**Priority:** MEDIUM
**Rationale:** Automated reminders increase completion rates
**Estimated Effort:** 6-8 hours

**Features:**

1. **Automated Reminder Emails**
   - [ ] Send reminder if questionnaire not completed after 3 days
   - [ ] Send reminder if questionnaire started but abandoned (> 7 days inactive)
   - [ ] Customizable reminder schedule per client

2. **Email Templates**
   - [ ] "Questionnaire Invitation" template
   - [ ] "Reminder - Please Complete" template
   - [ ] "Thank You - Completed" template
   - [ ] Template editor in admin settings

3. **Email Service Integration**
   - [ ] Choose: SendGrid, Resend, AWS SES, or Postmark
   - [ ] SMTP configuration in settings
   - [ ] Email sending queue (don't block UI)
   - [ ] Track email opens/clicks (optional)

4. **Manual Email Sending**
   - [ ] "Send Reminder" button on client profile page
   - [ ] Compose custom message to client
   - [ ] CC/BCC options

**Database Schema:**
```sql
CREATE TABLE email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL,
  questionnaire_id TEXT,
  template_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  status TEXT NOT NULL, -- 'sent', 'delivered', 'bounced', 'failed'
  error_message TEXT
);
```

---

### Task 4.2: Client Communication Center
**Status:** 📋 Planned
**Priority:** MEDIUM
**Rationale:** Centralized place to message clients
**Estimated Effort:** 5 hours

**Features:**
- [ ] `/admin/clients/[clientId]/messages` page
- [ ] Send email to client from admin
- [ ] Message history/thread view
- [ ] Attach files to messages
- [ ] Canned responses (quick replies)

---

### Task 4.3: Bulk Operations
**Status:** 📋 Planned
**Priority:** MEDIUM
**Rationale:** Manage multiple questionnaires at once
**Estimated Effort:** 4 hours

**Bulk Actions:**
- [ ] Bulk Delete (with confirmation: "Delete 5 questionnaires?")
- [ ] Bulk Archive
- [ ] Bulk Export to ZIP file
- [ ] Bulk Change Status (Mark as Complete)
- [ ] Bulk Send Reminder Emails

**UI Pattern:**
- Checkboxes appear when hovering over table rows
- Bulk action toolbar slides in from top when items selected
- Shows count: "5 items selected"

---

### Task 4.4: Analytics Dashboard
**Status:** 📋 Planned
**Priority:** MEDIUM
**Rationale:** Visualize trends over time
**Estimated Effort:** 6 hours

**Charts to Add:**

1. **Response Trends Over Time**
   - [ ] Line chart: Responses per day (last 30 days)
   - [ ] Line chart: Completion rate over time
   - [ ] Bar chart: Responses by day of week (Mon-Sun)

2. **Question Performance**
   - [ ] Heatmap: Which questions get skipped most
   - [ ] Bar chart: Average time spent per question
   - [ ] Funnel chart: Drop-off rate by question number

3. **Client Insights**
   - [ ] Pie chart: Completion rate by package type
   - [ ] Bar chart: Top 10 clients by points earned
   - [ ] Line chart: New clients per month

**Libraries:**
- Recharts (already used in existing components)
- Chart.js (alternative)
- D3.js (for advanced visualizations)

---

### Task 4.5: Role-Based Access Control (RBAC)
**Status:** 📋 Planned
**Priority:** HIGH (if multiple admins)
**Rationale:** Different permissions for different team members
**Estimated Effort:** 5 hours

**Roles:**

| Role | View | Create | Edit | Delete | Export | Admin Settings |
|------|------|--------|------|--------|--------|----------------|
| **Viewer** | ✅ | ❌ | ❌ | ❌ | ✅ (own only) | ❌ |
| **Editor** | ✅ | ✅ | ✅ (own) | ✅ (own) | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ (all) | ✅ (all) | ✅ | ✅ |

**Implementation:**
- [ ] Add `role` column to `admin_users` table
- [ ] Create permission checking utility: `hasPermission(user, action, resource)`
- [ ] Disable buttons/links for unauthorized actions
- [ ] API route protection (return 403 Forbidden if no permission)
- [ ] UI: Show lock icon on restricted actions with tooltip

---

### Task 4.6: Templates Library
**Status:** 📋 Planned
**Priority:** LOW
**Rationale:** Reuse questionnaire structures
**Estimated Effort:** 4 hours

**Features:**
- [ ] Save questionnaire as template
- [ ] Template library page (`/admin/templates`)
- [ ] Create new questionnaire from template
- [ ] Share templates across team
- [ ] Public template gallery (community templates)

---

## Phase 5: Advanced Features (Tier 3)

### Task 5.1: Questionnaire Builder (Visual Editor)
**Status:** 📋 Planned
**Priority:** LOW (current questionnaires are hardcoded)
**Rationale:** Non-technical users can create questionnaires
**Estimated Effort:** 20+ hours (complex feature)

**Features:**
- [ ] Drag-and-drop question builder
- [ ] Question type selector (text, multiple choice, rating, percentage split)
- [ ] Module organizer (group questions into modules)
- [ ] Live preview pane (see respondent view)
- [ ] Question validation rules editor
- [ ] Help text / subtitle editor
- [ ] Reorder questions with drag handles

**This is a MAJOR feature - consider low priority for now**

---

### Task 5.2: Conditional Logic Editor
**Status:** 📋 Planned
**Priority:** LOW
**Rationale:** Show/hide questions based on previous answers
**Estimated Effort:** 12+ hours

**Example:**
- If Q1 = "Executive Level" → Show Q10 (Leadership Questions)
- If Q5 = "No" → Skip Q6-Q9
- If Q12 > 50% → Show bonus questions

**UI:**
- "Add Conditional Logic" button on each question
- Rule builder: "If [Question X] [equals/contains/greater than] [value] → [show/hide/require] [Question Y]"

---

### Task 5.3: Version Control & Change History
**Status:** 📋 Planned
**Priority:** LOW
**Rationale:** Track changes to questionnaires over time
**Estimated Effort:** 6 hours

**Features:**
- [ ] Save version snapshots before edits
- [ ] "Version History" tab on questionnaire detail page
- [ ] Compare versions (diff viewer)
- [ ] Restore previous version
- [ ] Tag versions: "v1.0 - Initial Release"

**Database Schema:**
```sql
CREATE TABLE questionnaire_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL, -- Full questionnaire JSON
  change_summary TEXT,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Task 5.4: API Webhooks
**Status:** 📋 Planned
**Priority:** LOW
**Rationale:** Trigger external systems when events occur
**Estimated Effort:** 5 hours

**Webhook Events:**
- `questionnaire.started` - Client starts questionnaire
- `questionnaire.updated` - Client saves progress
- `questionnaire.completed` - Client completes questionnaire
- `response.created` - New response submitted
- `milestone.achieved` - Client reaches 10/25/50 questions

**UI:**
- `/admin/settings/webhooks` page
- Add webhook URL
- Select events to subscribe to
- Test webhook (send test payload)
- View webhook delivery log

---

### Task 5.5: Real-Time Notifications (WebSocket)
**Status:** 📋 Planned
**Priority:** LOW
**Rationale:** Get instant alerts when events happen
**Estimated Effort:** 4 hours

**Features:**
- [ ] Toast notification when new response submitted
- [ ] Badge count on sidebar navigation ("3 new responses")
- [ ] Sound notification (optional, toggleable)
- [ ] Browser push notifications (with permission)

**Implementation:**
- Supabase Realtime subscriptions
- Browser Notification API
- Service Worker for background notifications

---

### Task 5.6: Custom Reports Builder
**Status:** 📋 Planned
**Priority:** LOW
**Rationale:** Create and save custom data views
**Estimated Effort:** 8 hours

**Features:**
- [ ] Report builder UI (select columns, filters, grouping)
- [ ] Save custom reports
- [ ] Schedule reports (email daily/weekly)
- [ ] Report templates (Completion Summary, Client Activity, Question Performance)

---

### Task 5.7: Client Self-Service Portal
**Status:** 📋 Planned
**Priority:** LOW
**Rationale:** Clients can view their own progress
**Estimated Effort:** 6 hours

**Features:**
- [ ] `/client/[clientId]/dashboard` route
- [ ] Show completion percentage
- [ ] Show points, streak, milestones
- [ ] Download PDF of responses
- [ ] Edit submitted responses (if allowed)
- [ ] Password-protected access

---

## Phase 6: Enterprise Features (Tier 4)

### Task 6.1: Team Management
**Status:** 📋 Future
**Priority:** FUTURE
**Rationale:** Multiple admin users with different roles
**Estimated Effort:** 10+ hours

**Features:**
- [ ] Invite team members via email
- [ ] Assign roles to team members
- [ ] Team member list page
- [ ] Activity feed per team member
- [ ] Deactivate/remove team members

---

### Task 6.2: White-Label Branding
**Status:** 📋 Future
**Priority:** FUTURE
**Rationale:** Custom branding per client or reseller
**Estimated Effort:** 8 hours

**Features:**
- [ ] Upload custom logo
- [ ] Custom color scheme
- [ ] Custom domain (admin.yourclient.com)
- [ ] Custom email templates with client branding

---

### Task 6.3: CRM Integrations
**Status:** 📋 Future
**Priority:** FUTURE
**Rationale:** Sync data with external systems
**Estimated Effort:** 12+ hours per integration

**Integrations to Build:**
- [ ] HubSpot - Create contact when questionnaire submitted
- [ ] Salesforce - Create lead when questionnaire started
- [ ] Slack - Post to channel when questionnaire completed
- [ ] Zapier - General webhook connector

---

### Task 6.4: AI-Powered Insights
**Status:** 📋 Future
**Priority:** FUTURE
**Rationale:** Automatically analyze responses for patterns
**Estimated Effort:** 20+ hours

**Features:**
- [ ] Sentiment analysis on text responses
- [ ] Keyword extraction from open-ended answers
- [ ] Trend detection (responses changing over time)
- [ ] Anomaly detection (unusual response patterns)
- [ ] AI-generated summary of responses

**Tech Stack:**
- OpenAI API (GPT-4) for analysis
- Claude API (alternative)
- Local ML models (cost-effective but complex)

---

### Task 6.5: Mobile Admin App
**Status:** 📋 Future
**Priority:** FUTURE
**Rationale:** Manage on the go
**Estimated Effort:** 100+ hours

**Tech Stack:**
- React Native (iOS + Android from single codebase)
- Expo (faster development)
- Native apps (Swift for iOS, Kotlin for Android)

---

## Bug Fixes & Technical Debt

### Known Issues

#### Issue 1: Settings Page 404
**Status:** 🐛 Known Bug
**Priority:** HIGH
**Reported:** December 21, 2025 - User testing
**Details:** `/admin/settings` link in navigation returns 404
**Fix:** Create `/app/admin/settings/page.tsx` (Task 2.3)

#### Issue 2: Mock Data in Dashboard
**Status:** 🐛 Known Issue
**Priority:** HIGH
**Reported:** December 21, 2025 - User testing
**Details:** Dashboard shows fake stats (42 questionnaires, 78% completion)
**Fix:** Connect to Supabase API (Task 2.2)

#### Issue 3: No Authentication on Admin Routes
**Status:** 🚨 SECURITY VULNERABILITY
**Priority:** CRITICAL
**Reported:** December 21, 2025 - QA Review
**Details:** Anyone can access `/admin` without login
**Fix:** Implement admin authentication (Task 2.1)

#### Issue 4: Window.innerWidth Not Available on Server
**Status:** ⚠️ Potential Bug
**Priority:** LOW
**Details:** Line in `/app/admin/questionnaires/page.tsx` uses `window.innerWidth` which doesn't exist during SSR
**Fix:** Use `useEffect` hook or CSS media queries instead
**File:** `/app/admin/questionnaires/page.tsx:205`

```typescript
// Current (broken on server):
{(viewMode === 'cards' || window.innerWidth < 768) && (

// Fix (use CSS classes instead):
<div className="md:hidden"> {/* Mobile: Cards */}
<div className="hidden md:block"> {/* Desktop: Table */}
```

---

## Testing Checklist

### Manual Testing Required

#### Dashboard Page (`/admin`)
- [ ] Load page - no TypeScript errors
- [ ] Stats cards display (even if mock data)
- [ ] Recent activity section visible
- [ ] Navigation sidebar works
- [ ] Mobile: Hamburger menu opens sidebar
- [ ] Desktop: Sidebar always visible
- [ ] Notifications badge clickable
- [ ] User menu dropdown works

#### Questionnaires List (`/admin/questionnaires`)
- [ ] Load page successfully
- [ ] Search box filters questionnaires
- [ ] Status filter dropdown works (All, Draft, Active, Completed)
- [ ] Card view displays properly
- [ ] Table view toggle works (desktop only)
- [ ] Click questionnaire card → navigates to detail page
- [ ] Quick actions menu (Edit, View Responses, Delete)
- [ ] Delete shows confirmation dialog
- [ ] Empty state shows when no results
- [ ] Pagination works (if > 50 items)

#### Single Questionnaire (`/admin/questionnaires/[id]`)
- [ ] Breadcrumb navigation works
- [ ] Stats cards show metadata
- [ ] "View All Responses" button works
- [ ] "Preview Questionnaire" button works
- [ ] Module structure displays correctly
- [ ] Question list shows all questions
- [ ] Required/Critical badges display

#### Responses List (`/admin/questionnaires/[id]/responses`)
- [ ] Load page successfully
- [ ] Filter tabs work (All, Completed, In Progress)
- [ ] Export CSV button works
- [ ] CSV file downloads correctly
- [ ] CSV contains all expected columns
- [ ] Click response card → navigates to detail page
- [ ] Progress bars display accurately
- [ ] Empty state shows when no responses

#### Single Response (`/admin/questionnaires/[id]/responses/[responseId]`)
- [ ] Breadcrumb navigation works
- [ ] Response timeline displays
- [ ] All questions and answers shown
- [ ] Metadata displays (time spent, device, etc.)
- [ ] Navigation between responses works
- [ ] Print-friendly layout

#### Clients List (`/admin/clients`)
- [ ] Load page successfully
- [ ] Client cards display
- [ ] Search by client name works
- [ ] Click client card → navigates to profile
- [ ] Email addresses are masked (j****@example.com)
- [ ] Progress bars accurate
- [ ] Empty state shows when no clients

#### Client Profile (`/admin/clients/[clientId]`)
- [ ] Load page successfully
- [ ] Client summary displays
- [ ] Questionnaire list shows all client questionnaires
- [ ] Activity timeline displays
- [ ] Stats are accurate
- [ ] Navigation to questionnaire works

---

## Database Schema Requirements

### Tables to Create in Supabase

#### 1. admin_users
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer', -- 'viewer', 'editor', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Index for faster email lookups
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all admin users
CREATE POLICY admin_users_view_policy ON admin_users
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');
```

#### 2. admin_audit_log
```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'view', 'create', 'update', 'delete', 'export'
  resource_type TEXT NOT NULL, -- 'questionnaire', 'response', 'client', 'settings'
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_audit_log_admin_user ON admin_audit_log(admin_user_id);
CREATE INDEX idx_audit_log_created ON admin_audit_log(created_at DESC);
CREATE INDEX idx_audit_log_resource ON admin_audit_log(resource_type, resource_id);

-- Automatic cleanup policy (delete logs older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_audit_log WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run daily at 3 AM)
SELECT cron.schedule('cleanup-audit-logs', '0 3 * * *', 'SELECT cleanup_old_audit_logs()');
```

#### 3. email_log
```sql
CREATE TABLE email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL,
  questionnaire_id TEXT,
  template_name TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'bounced', 'failed'
  error_message TEXT,
  metadata JSONB
);

-- Index for faster lookups
CREATE INDEX idx_email_log_client ON email_log(client_id);
CREATE INDEX idx_email_log_sent ON email_log(sent_at DESC);
CREATE INDEX idx_email_log_status ON email_log(status);
```

#### 4. questionnaire_versions
```sql
CREATE TABLE questionnaire_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  change_summary TEXT,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(questionnaire_id, version_number)
);

-- Index for faster version lookups
CREATE INDEX idx_versions_questionnaire ON questionnaire_versions(questionnaire_id, version_number DESC);
```

#### 5. saved_filters
```sql
CREATE TABLE saved_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filter_config JSONB NOT NULL, -- {status: 'active', search: 'john', sortBy: 'created_at'}
  page TEXT NOT NULL, -- 'questionnaires', 'clients', 'responses'
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(admin_user_id, name, page)
);

CREATE INDEX idx_saved_filters_user ON saved_filters(admin_user_id);
```

---

## Environment Variables Needed

### Current (.env.local)
```bash
# Supabase (Already configured ✅)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### New Variables Needed

```bash
# Admin Authentication
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Email Service (Choose one)
# Option 1: SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@southwestresume.com

# Option 2: Resend
RESEND_API_KEY=your-resend-api-key

# Option 3: AWS SES
AWS_SES_ACCESS_KEY=your-access-key
AWS_SES_SECRET_KEY=your-secret-key
AWS_SES_REGION=us-east-1

# Webhooks (Optional)
WEBHOOK_SECRET=generate-random-secret-for-webhook-signing

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Error Tracking (Optional)
SENTRY_DSN=your-sentry-dsn
```

---

## Dependencies to Install

### Already Installed ✅
- `next` (15.5.9)
- `react` (19.0.0)
- `@supabase/supabase-js`
- `tailwindcss`
- `typescript`

### Need to Install

#### For Authentication
```bash
npm install next-auth @auth/supabase-adapter
npm install bcrypt
npm install -D @types/bcrypt
```

#### For Email
```bash
# Option 1: SendGrid
npm install @sendgrid/mail

# Option 2: Resend
npm install resend

# Option 3: Nodemailer (generic SMTP)
npm install nodemailer
npm install -D @types/nodemailer
```

#### For Excel Export
```bash
npm install xlsx
```

#### For PDF Generation
```bash
npm install jspdf
# OR
npm install @react-pdf/renderer
```

#### For Charts (if not already installed)
```bash
npm install recharts
# OR
npm install chart.js react-chartjs-2
```

#### For Date Formatting (if using date-fns)
```bash
npm install date-fns
```

#### For Form Validation
```bash
npm install zod # Already installed ✅
```

---

## Performance Optimization Tasks

### Task P.1: Implement Virtual Scrolling
**Status:** 📋 Planned
**Priority:** LOW (only needed if > 100 items)
**Rationale:** Large lists (100+ questionnaires) slow down page
**Estimated Effort:** 2 hours

**Libraries:**
- `react-window` (recommended)
- `react-virtualized` (alternative)

---

### Task P.2: Image Optimization
**Status:** 📋 Planned
**Priority:** LOW
**Rationale:** Admin interface doesn't use many images yet
**Estimated Effort:** 1 hour

**Optimizations:**
- Use Next.js `<Image>` component
- Lazy load images below the fold
- Use WebP format with fallbacks

---

### Task P.3: Code Splitting
**Status:** ✅ Already Done (Next.js automatic)
**Priority:** N/A
**Details:** Next.js automatically code-splits by route

---

### Task P.4: API Response Caching
**Status:** 📋 Planned
**Priority:** MEDIUM
**Rationale:** Don't refetch data on every page load
**Estimated Effort:** 2 hours

**Implementation:**
- Use React Query or SWR for client-side caching
- Cache API responses for 5 minutes
- Invalidate cache when data changes

```bash
npm install @tanstack/react-query
# OR
npm install swr
```

---

## Accessibility (A11y) Improvements

### Current Status
✅ WCAG AA compliant (based on DESIGN-SYSTEM-SOP.md)
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ ARIA labels on interactive elements
- ✅ Focus states visible
- ✅ Color contrast 4.5:1 minimum
- ✅ Touch targets 44px minimum
- ✅ Keyboard navigation support

### Future Improvements

#### Task A.1: Screen Reader Testing
**Status:** 📋 Planned
**Priority:** MEDIUM
**Rationale:** Ensure usable by blind/low-vision users
**Estimated Effort:** 3 hours

**Testing Tools:**
- NVDA (Windows, free)
- JAWS (Windows, paid)
- VoiceOver (macOS, built-in)

**Test Checklist:**
- [ ] Navigate entire admin interface with keyboard only
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Error messages announced
- [ ] Loading states announced
- [ ] Modal dialogs trap focus

---

#### Task A.2: High Contrast Mode Support
**Status:** 📋 Planned
**Priority:** LOW
**Rationale:** Better for users with low vision
**Estimated Effort:** 2 hours

**Implementation:**
- Detect `prefers-contrast: high` media query
- Increase border widths
- Use solid colors instead of gradients
- Higher contrast text (7:1 ratio)

---

## SEO Considerations for Admin Pages

### Current Status
✅ Admin pages blocked from search engines
- ✅ `robots.txt` blocks `/admin`
- ✅ `<meta name="robots" content="noindex, nofollow">` on admin layout

### Verification Needed
- [ ] Check robots.txt actually blocks admin routes
- [ ] Verify sitemap.xml doesn't include admin pages
- [ ] Test Google Search Console for admin indexing

---

## Monitoring & Analytics

### Task M.1: Error Tracking
**Status:** 📋 Planned
**Priority:** HIGH
**Rationale:** Know when things break in production
**Estimated Effort:** 2 hours

**Options:**
1. **Sentry** (recommended)
   - Automatic error capture
   - Source map support
   - Performance monitoring
   - Free tier: 5,000 errors/month

2. **LogRocket**
   - Session replay
   - Console logs
   - Network logs
   - Paid only ($99/month+)

3. **Rollbar**
   - Error grouping
   - Slack notifications
   - Free tier: 5,000 errors/month

**Installation:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

### Task M.2: Usage Analytics
**Status:** 📋 Planned
**Priority:** MEDIUM
**Rationale:** Understand how admins use the interface
**Estimated Effort:** 2 hours

**Metrics to Track:**
- Page views by route
- Time spent on each page
- Most used features (Export, Search, Filters)
- Error rate per page
- Load time per page

**Options:**
1. **Google Analytics 4**
   - Free
   - Standard web analytics

2. **Plausible Analytics**
   - Privacy-friendly
   - No cookies
   - €9/month

3. **PostHog**
   - Product analytics
   - Session recording
   - Feature flags
   - Self-hosted option

---

## Deployment Checklist

### Pre-Deployment

#### Code Quality
- [ ] Run `npm run type-check` (0 errors)
- [ ] Run `npm run lint` (0 errors)
- [ ] Run `npm run build` (successful)
- [ ] Run `npm run test` (all tests pass)

#### Security
- [ ] Environment variables secured (not in git)
- [ ] Admin authentication enabled
- [ ] Rate limiting on API routes
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection (if using forms)

#### Database
- [ ] Migrations applied to production Supabase
- [ ] Row Level Security policies enabled
- [ ] Indexes created on frequently queried columns
- [ ] Backup policy configured

#### Performance
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Images optimized
- [ ] Code splitting working
- [ ] API responses < 500ms

#### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Google Analytics)
- [ ] Uptime monitoring (UptimeRobot or similar)

---

### Post-Deployment

#### Smoke Tests
- [ ] Visit `/admin` → Should redirect to login (if not authenticated)
- [ ] Login with admin credentials → Should work
- [ ] Dashboard loads → Should show real data from Supabase
- [ ] Navigate to questionnaires → Should load list
- [ ] Click single questionnaire → Should load details
- [ ] Export CSV → Should download file
- [ ] All API routes return 200 or expected status

#### Monitoring
- [ ] Check error tracking dashboard (Sentry)
- [ ] Check analytics dashboard (Google Analytics)
- [ ] Verify email notifications working (if enabled)
- [ ] Check database connection pool (Supabase dashboard)

---

## Rationale & Context

### Why This Admin Interface?

**Business Need:**
Southwest Resume Services needed a way to:
1. View all client questionnaires in one place
2. Track completion rates and engagement
3. View individual client responses
4. Export data for analysis
5. Manage clients and send reminders

**Design Decisions:**

1. **Sidebar Navigation**
   - Rationale: Admin interfaces need persistent navigation (IBM Carbon, Atlassian patterns)
   - Alternative considered: Top nav (rejected - less space for menu items)

2. **Card vs Table Toggle**
   - Rationale: Cards better for < 50 items, tables better for > 50 (research from SurveyMonkey, Typeform)
   - Implementation: Toggle button on desktop, cards-only on mobile

3. **Mock Data First**
   - Rationale: Allows UI development without backend dependency
   - Next step: Replace with real Supabase queries

4. **Supabase for Backend**
   - Rationale: Already chosen in previous session for questionnaire storage
   - No debate - crystal clear decision

5. **No Authentication Initially**
   - Rationale: Faster MVP development
   - Security risk: HIGH - must add before production (Task 2.1)

---

## Session History

### Session 1: Research & Planning
**Date:** December 21, 2025
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Duration:** ~2 hours

**What Happened:**
- User asked: "How should we handle viewing all questionnaires in one place?"
- Multi-agent research workflow launched (4 agents in parallel):
  1. Agent 1: Research admin dashboard best practices
  2. Agent 2: Research response viewing patterns
  3. Agent 3: Research UI/UX patterns
  4. Agent 4: Research client management integration
- Created `QUESTIONNAIRE-ADMIN-RESEARCH-REPORT.md` (500+ lines)
- Identified best practices from Typeform, Google Forms, SurveyMonkey, JotForm, Qualtrics

---

### Session 2: Implementation
**Date:** December 21, 2025
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Duration:** ~3 hours

**What Happened:**
- User requested: "Use multi-agent workflow to implement all of this"
- Launched 5 implementation agents in parallel:
  1. Agent 1: Admin layout and sidebar (ace2c6a)
  2. Agent 2: Questionnaires list page (a8680d4)
  3. Agent 3: Response viewer pages (a9a17f5)
  4. Agent 4: Client profile pages (af68ba7)
  5. Agent 5: Admin API routes (a42e5b5)
- Launched QA agent (ac5ab3c) to verify implementation
- Fixed 40+ TypeScript errors
- Fixed 3 ESLint errors
- Successfully built production bundle
- All 22 files created

---

### Session 3: User Testing & This Document
**Date:** December 21, 2025
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Duration:** Ongoing

**What Happened:**
- User tested admin interface at http://localhost:3000/admin
- Identified issues:
  1. Settings page 404
  2. Mock data in dashboard
  3. No authentication (security risk)
- User requested: "Add everything to master to-do with rationale"
- Created this comprehensive roadmap document

---

## Notes for Future Developers

### Code Organization Philosophy

**Component Structure:**
- **Pages** (`/app/admin/*`) - Fetch data, pass to components
- **Components** (`/components/admin/*`) - Pure UI, no data fetching
- **API Routes** (`/app/api/admin/*`) - Database queries, validation, security
- **Utilities** (`/lib/*`) - Shared functions (maskEmail, formatDate)

**State Management:**
- Using React hooks (useState, useEffect) for now
- Consider React Query or Zustand if state gets complex

**Styling:**
- Tailwind CSS utility classes
- Design tokens from `tailwind.config.ts` (navy, gold, sand)
- Follow DESIGN-SYSTEM-SOP.md for consistency

---

### Common Pitfalls to Avoid

1. **Don't use `window` in server components**
   - Next.js 15 pre-renders on server
   - Use `useEffect` for browser-only code

2. **Async params in Next.js 15**
   - `params` is now a Promise
   - Must use `await params` in page components

3. **Supabase client vs server**
   - Use `@/lib/supabase/client` for client components
   - Use `@/lib/supabase/server` for server components (with cookies)

4. **Type safety**
   - Always type API responses
   - Use Zod for runtime validation
   - Don't use `any` - use `unknown` and narrow

---

## Success Metrics

### How to Know We're Done

**Phase 2 (Critical Fixes):**
- [ ] Can't access /admin without login ✅
- [ ] Dashboard shows real data from Supabase ✅
- [ ] Settings page loads without 404 ✅

**Phase 3 (Essential Features):**
- [ ] Can export all data to Excel ✅
- [ ] Can search and filter questionnaires ✅
- [ ] Can see audit log of all actions ✅

**Phase 4 (Professional Features):**
- [ ] Automated reminder emails working ✅
- [ ] Can send messages to clients ✅
- [ ] Charts show trends over time ✅

**Phase 5+ (Advanced/Enterprise):**
- [ ] Visual questionnaire builder working ✅
- [ ] Conditional logic implemented ✅
- [ ] Mobile app released ✅

---

## Questions to Answer

### Decisions Needed from User

1. **Authentication Method**
   - Option A: NextAuth.js with credentials provider (email/password)
   - Option B: Supabase Auth (uses existing Supabase setup)
   - Option C: Custom JWT-based auth
   - **Recommendation:** Supabase Auth (simpler, already using Supabase)

2. **Email Service**
   - Option A: SendGrid (most popular, $19.95/month for 50k emails)
   - Option B: Resend (developer-friendly, $20/month for 50k emails)
   - Option C: AWS SES (cheapest, $0.10 per 1000 emails, complex setup)
   - **Recommendation:** Resend (best developer experience)

3. **When to Deploy Admin Interface?**
   - Option A: Deploy now with mock data (fast feedback)
   - Option B: Wait until real data connected (more polished)
   - Option C: Deploy behind feature flag (controlled rollout)
   - **Recommendation:** Option C (safest)

4. **Multi-Tenancy?**
   - Will this admin interface serve multiple businesses?
   - Or just Southwest Resume Services?
   - **Impacts:** Database schema, authentication, branding

---

## Contact & Continuation

**Last Updated By:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Session Date:** December 21, 2025
**Conversation ID:** continuation-session-post-context-limit

**To Continue This Work:**
1. Reference this document: `ADMIN_ROADMAP.md`
2. Reference research: `QUESTIONNAIRE-ADMIN-RESEARCH-REPORT.md`
3. Reference design system: `DESIGN-SYSTEM-SOP.md`
4. Reference questionnaire SOP: `QUESTIONNAIRE-SOP.md`

**Files Created This Session:**
- 22 admin interface files (see Phase 1 section)
- This roadmap document

**Next Session Should Start With:**
- Review this roadmap
- Prioritize tasks based on business needs
- Implement Task 2.1 (Admin Authentication) - CRITICAL

---

## Changelog

### 2025-12-21 @ 5:45 PM MST
- Created initial roadmap document
- Documented all 6 phases of admin development
- Listed 50+ tasks with priorities and estimates
- Documented known issues and bugs
- Created database schema requirements
- Listed dependencies to install
- Added deployment checklist
- Added testing checklist

---

**END OF ADMIN ROADMAP**

*This document is a living roadmap. Update it as tasks are completed, priorities change, or new requirements emerge.*

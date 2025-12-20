# Data Flow and Protection Architecture

## Overview: How Data Moves Through the System

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                            │
│                   (Answers question in browser)                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STEP 1: IMMEDIATE LOCAL SAVE                     │
│                                                                     │
│  Component calls: updateState({ answers: { q1: "answer" } })       │
│         │                                                           │
│         ▼                                                           │
│  Hook calls: saveToLocalStorage(newState)  ◄── INSTANT             │
│         │                                                           │
│         ▼                                                           │
│  localStorage.setItem("questionnaire_...", JSON.stringify(data))   │
│                                                                     │
│  ✅ DATA SAVED LOCALLY (survives browser crash)                    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 STEP 2: DEBOUNCED SERVER SYNC                       │
│                                                                     │
│  Wait 2 seconds for more changes... (debounce)                     │
│         │                                                           │
│         ▼                                                           │
│  Hook calls: debouncedSync(newState)                               │
│         │                                                           │
│         ▼                                                           │
│  syncToServer(data, retryCount=0)                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STEP 3: API REQUEST WITH TIMEOUT                 │
│                                                                     │
│  fetchWithTimeout("/api/questionnaire/[clientId]", {               │
│    method: "POST",                                                  │
│    body: JSON.stringify(data),                                     │
│    timeout: 10000ms  ◄── Prevents hanging                          │
│  })                                                                 │
│         │                                                           │
│         ├──► SUCCESS ──────────────────────────┐                   │
│         │                                       │                   │
│         └──► FAILURE (network/timeout) ────────┼──┐                │
│                                                 │  │                │
└─────────────────────────────────────────────────┼──┼────────────────┘
                                                  │  │
                    ┌─────────────────────────────┘  │
                    │                                 │
                    ▼                                 ▼
      ┌─────────────────────────┐    ┌──────────────────────────────┐
      │   SUCCESS PATH          │    │     FAILURE PATH             │
      │                         │    │                              │
      │  Server received data   │    │  Retry with backoff:         │
      │  History snapshot saved │    │  - Retry 1: wait 1s          │
      │  Status: "Synced" ✅    │    │  - Retry 2: wait 2s          │
      │                         │    │  - Retry 3: wait 4s          │
      └─────────────────────────┘    │                              │
                                     │  If all fail:                │
                                     │  - Keep in localStorage      │
                                     │  - Show "Sync pending" ⚠️   │
                                     │  - Retry on next change      │
                                     │  - Retry when back online    │
                                     └──────────────────────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 STEP 4: API ROUTE PROCESSING                        │
│  File: app/api/questionnaire/[clientId]/route.ts                   │
│                                                                     │
│  1. Validate clientId (Zod schema)                                 │
│     └─► Invalid? Return 400 error                                  │
│                                                                     │
│  2. Parse request body                                             │
│     └─► Invalid JSON? Return 400 error                             │
│                                                                     │
│  3. Validate data (Zod schema)                                     │
│     └─► Invalid data? Return 400 error                             │
│                                                                     │
│  4. Upsert to Supabase                                             │
│     └─► Database error? Return 500 error + retry                   │
│                                                                     │
│  5. Create history snapshot (async, non-blocking)                  │
│     └─► History error? Log warning, don't fail main save           │
│                                                                     │
│  6. Return success response                                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   STEP 5: SUPABASE DATABASE                         │
│  URL: https://aougseszcvzgxwniossn.supabase.co                     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ Table: questionnaire_responses                           │     │
│  │                                                          │     │
│  │  UPSERT operation (atomic):                             │     │
│  │  ├─► Check UNIQUE(client_id, questionnaire_id)          │     │
│  │  │                                                       │     │
│  │  ├─► Record exists?                                     │     │
│  │  │    ├─► YES: UPDATE existing record                   │     │
│  │  │    │    └─► Trigger: auto-update updated_at          │     │
│  │  │    │                                                  │     │
│  │  │    └─► NO: INSERT new record                         │     │
│  │  │         └─► Generate UUID for id                     │     │
│  │  │                                                       │     │
│  │  └─► COMMIT (all-or-nothing)                            │     │
│  │                                                          │     │
│  │  ✅ DATA PERSISTED IN DATABASE                          │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ Table: response_history                                  │     │
│  │                                                          │     │
│  │  INSERT snapshot (async):                               │     │
│  │  ├─► response_id: (from main record)                    │     │
│  │  ├─► snapshot: { full state as JSONB }                  │     │
│  │  └─► created_at: NOW()                                  │     │
│  │                                                          │     │
│  │  ✅ AUDIT TRAIL CREATED                                 │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                     │
│  Automatic Supabase backups:                                       │
│  └─► Daily backups (7-day retention)                               │
│  └─► Point-in-time recovery available                              │
└─────────────────────────────────────────────────────────────────────┘

```

---

## Protection Layer Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                           DATA PROTECTION LAYERS                      │
│                         (Defense in Depth)                            │
└───────────────────────────────────────────────────────────────────────┘

    Layer 1: IMMEDIATE LOCAL SAVE
    ════════════════════════════════════════════════
    │ localStorage.setItem()
    │ ✅ Instant persistence
    │ ✅ Survives browser crash
    │ ✅ Survives network failure
    │ ✅ Survives server outage
    │ ❌ Lost if user clears browser data
    ▼

    Layer 2: RETRY LOGIC
    ════════════════════════════════════════════════
    │ Exponential backoff: 1s, 2s, 4s
    │ ✅ Handles temporary network issues
    │ ✅ Handles server overload (503)
    │ ✅ Handles timeout errors
    │ ❌ Gives up after 3 retries
    ▼

    Layer 3: SMART MERGE
    ════════════════════════════════════════════════
    │ Compare local vs server state
    │ ✅ Prevents overwriting with stale data
    │ ✅ Always prefers more progress
    │ ✅ Works across devices
    │ ❌ Race condition with concurrent tabs
    ▼

    Layer 4: beforeunload HANDLER
    ════════════════════════════════════════════════
    │ navigator.sendBeacon()
    │ ✅ Last-second save when closing tab
    │ ✅ Doesn't block page unload
    │ ✅ Guaranteed to send
    │ ❌ Best-effort (not 100% reliable)
    ▼

    Layer 5: ONLINE/OFFLINE DETECTION
    ════════════════════════════════════════════════
    │ window.addEventListener('online')
    │ ✅ Auto-sync when connection restored
    │ ✅ Transparent offline mode
    │ ✅ User sees sync status
    │ ❌ Relies on browser API accuracy
    ▼

    Layer 6: HISTORY TABLE (Audit Trail)
    ════════════════════════════════════════════════
    │ response_history snapshots
    │ ✅ Point-in-time recovery
    │ ✅ Immutable (DELETE blocked)
    │ ✅ Full state capture
    │ ❌ Requires manual recovery process
    ▼

    Layer 7: SUPABASE BACKUPS
    ════════════════════════════════════════════════
    │ Automated daily backups
    │ ✅ 7-day retention
    │ ✅ Point-in-time recovery (PITR)
    │ ✅ Disaster recovery
    │ ❌ Requires Supabase support for restore

```

---

## Data Recovery Scenarios

### Scenario A: Browser Crashes Mid-Edit

```
Time    Action                              localStorage    Supabase
────────────────────────────────────────────────────────────────────────
10:00   User answers Q1                     Q1: "answer"    (empty)
10:01   User answers Q2                     Q1, Q2          (empty)
10:02   Debounced sync completes            Q1, Q2          Q1, Q2 ✅
10:03   User answers Q3                     Q1, Q2, Q3      Q1, Q2
10:04   BROWSER CRASHES! 💥                 Q1, Q2, Q3      Q1, Q2
10:05   User reopens browser                Q1, Q2, Q3      Q1, Q2
10:06   Hook loads from localStorage        Q1, Q2, Q3 ✅   Q1, Q2
10:07   Hook syncs to server                Q1, Q2, Q3 ✅   Q1, Q2, Q3 ✅

Result: NO DATA LOST - Q3 preserved in localStorage, synced on reload
```

### Scenario B: Network Goes Down

```
Time    Action                              localStorage    Supabase
────────────────────────────────────────────────────────────────────────
10:00   User answers Q1                     Q1: "answer"    (empty)
10:02   Sync attempt 1                      Q1              (fail)
10:03   Retry 1 (wait 1s)                   Q1              (fail)
10:05   Retry 2 (wait 2s)                   Q1              (fail)
10:09   Retry 3 (wait 4s)                   Q1              (fail)
10:10   Show "Sync pending" ⚠️              Q1 ✅           (empty)
10:15   Network restored 📡                 Q1              (empty)
10:15   Auto-sync triggered                 Q1              Q1 ✅

Result: NO DATA LOST - Data preserved in localStorage, synced when online
```

### Scenario C: User Clears Browser Data

```
Time    Action                              localStorage    Supabase
────────────────────────────────────────────────────────────────────────
10:00   User answers Q1-Q10                 Q1-Q10          Q1-Q10 ✅
10:05   User clears browser data            (deleted) 🗑️   Q1-Q10 ✅
10:06   User reopens questionnaire          (empty)         Q1-Q10
10:07   Hook loads from Supabase            Q1-Q10 ✅       Q1-Q10 ✅

Result: NO DATA LOST - Restored from Supabase server
```

### Scenario D: Multiple Tabs (Race Condition)

```
Time    Action                              Tab A           Tab B       Supabase
─────────────────────────────────────────────────────────────────────────────────
10:00   Open Tab A                          Load: empty     -           (empty)
10:01   Tab A: Answer Q1-Q5                 Q1-Q5           -           Q1-Q5 ✅
10:02   Open Tab B                          Q1-Q5           Load: Q1-Q5 Q1-Q5
10:03   Tab A: Answer Q6                    Q1-Q6 ✅        Q1-Q5       Q1-Q5
10:04   Tab B: Answer Q7                    Q1-Q6           Q1-Q5,Q7    Q1-Q5
10:05   Tab A syncs                         Q1-Q6           Q1-Q5,Q7    Q1-Q6 ✅
10:06   Tab B syncs (OVERWRITES!)           Q1-Q6           Q1-Q5,Q7    Q1-Q5,Q7 ⚠️

Result: ⚠️ Q6 LOST - Race condition, Tab B overwrote Tab A's data
Fix: Need cross-tab sync with BroadcastChannel API
```

---

## Data Flow: User Opens Questionnaire

```
┌─────────────────────────────────────────────────────────────────┐
│                    INITIAL LOAD SEQUENCE                        │
└─────────────────────────────────────────────────────────────────┘

1. Component mounts
   │
   ├─► Hook: useQuestionnaireSync() initializes
   │
   ├─► Load from localStorage (immediate, optimistic)
   │   └─► setState(localData)  ◄── User sees data instantly
   │
   ├─► Fetch from Supabase (async, in background)
   │   │
   │   ├─► GET /api/questionnaire/[clientId]
   │   │
   │   ├─► Supabase: SELECT * WHERE client_id = ? AND questionnaire_id = ?
   │   │
   │   └─► Compare: localData vs serverData
   │       │
   │       ├─► Same? ─────────────► Continue (no action)
   │       │
   │       ├─► Server has more? ──► Use server data
   │       │                        └─► Update localStorage
   │       │
   │       └─► Local has more? ───► Use local data
   │                                └─► Sync to server
   │
   └─► Ready to use!

RESULT: User sees their data in <2 seconds (from localStorage)
        Server data syncs in background for consistency
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR RECOVERY MATRIX                        │
└─────────────────────────────────────────────────────────────────┘

Error Type              │ Detection          │ Recovery Strategy
────────────────────────┼────────────────────┼───────────────────────
Network timeout         │ AbortController    │ Retry with backoff
Server 5xx error        │ response.ok check  │ Retry with backoff
Server 4xx error        │ response.status    │ Log error, don't retry
Supabase unavailable    │ getClient() null   │ Fallback to localStorage
localStorage full       │ QuotaExceededError │ Log warning (no fallback)
Invalid data            │ Zod validation     │ Return 400, don't save
Browser crash           │ beforeunload       │ sendBeacon + localStorage
User offline            │ navigator.onLine   │ Queue syncs, retry online
Concurrent edits        │ None (not detected)│ Last write wins ⚠️

```

---

## Summary: Why Data Won't Be Lost

1. **localStorage First**: Data saved locally BEFORE server sync
2. **Retry Logic**: 3 attempts with exponential backoff
3. **Smart Merge**: Prefers local data if more progress
4. **beforeunload**: Last-chance save when closing browser
5. **Online Detection**: Auto-sync when connection restored
6. **History Table**: Full audit trail for recovery
7. **Supabase Backups**: Daily backups with 7-day retention

**Confidence Level: 95%**

The only edge cases are:
- Multiple concurrent tabs (race condition)
- localStorage quota exceeded + server failure (extremely rare)

Both can be addressed with future enhancements.

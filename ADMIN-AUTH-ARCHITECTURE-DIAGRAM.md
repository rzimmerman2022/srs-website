# ADMIN AUTHENTICATION ARCHITECTURE

## BEFORE FIX (BROKEN)
```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOGIN FLOW                                               │
└─────────────────────────────────────────────────────────────┘
User → POST /api/admin/auth/login
       ├─ Validate email/password
       ├─ Set cookie: admin_session=authenticated
       └─ Return success ✅

┌─────────────────────────────────────────────────────────────┐
│ 2. MIDDLEWARE PROTECTION                                    │
└─────────────────────────────────────────────────────────────┘
User → GET /admin
       └─ Middleware checks:
          ├─ admin_session cookie? ✅ FOUND
          ├─ OR sb-access-token? ❌ NOT FOUND
          └─ Allow access ✅

┌─────────────────────────────────────────────────────────────┐
│ 3. DASHBOARD API CALL (BROKEN)                              │
└─────────────────────────────────────────────────────────────┘
Browser → GET /api/admin/stats
          └─ API Route calls getAdminUser()
             └─ Check for sb-access-token? ❌ NOT FOUND
             └─ Check for sb-refresh-token? ❌ NOT FOUND
             └─ Return null
          └─ Return 401 Unauthorized ❌

Result: "Failed to fetch stats: Unauthorized"
```

---

## AFTER FIX (WORKING)
```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOGIN FLOW (UNCHANGED)                                   │
└─────────────────────────────────────────────────────────────┘
User → POST /api/admin/auth/login
       ├─ Validate email/password
       ├─ Set cookie: admin_session=authenticated
       └─ Return success ✅

┌─────────────────────────────────────────────────────────────┐
│ 2. MIDDLEWARE PROTECTION (UNCHANGED)                        │
└─────────────────────────────────────────────────────────────┘
User → GET /admin
       └─ Middleware checks:
          ├─ admin_session cookie? ✅ FOUND
          ├─ OR sb-access-token? ❌ NOT FOUND
          └─ Allow access ✅

┌─────────────────────────────────────────────────────────────┐
│ 3. DASHBOARD API CALL (FIXED)                               │
└─────────────────────────────────────────────────────────────┘
Browser → GET /api/admin/stats
          └─ API Route calls getAdminUser()
             ├─ Check for admin_session? ✅ FOUND
             ├─ Return mock AdminUser
             └─ Continue with handler
          └─ Return 200 with stats data ✅

Result: Dashboard shows stats successfully
```

---

## DUAL AUTHENTICATION SYSTEM

### Simple Cookie Auth (Current - Development)
```typescript
// Set by: /api/admin/auth/login
Cookie: admin_session=authenticated

// Checked by:
1. Middleware (allows /admin access)
2. getAdminUser() → Returns mock admin user

// Use case: Development, MVP, simple deployments
```

### Supabase Auth (Future - Production)
```typescript
// Set by: Supabase Auth API
Cookies:
  - sb-access-token=<jwt>
  - sb-refresh-token=<jwt>

// Checked by:
1. Middleware (allows /admin access)
2. getAdminUser() → Validates against admin_users table

// Use case: Production, multiple admins, full RBAC
```

---

## AUTHENTICATION FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                     USER SUBMITS LOGIN                       │
└────────────────────────┬────────────────────────────────────┘
                         ▼
             ┌───────────────────────┐
             │ /api/admin/auth/login │
             └───────────┬───────────┘
                         ▼
            ┌─────────────────────────┐
            │ Validate Email/Password │
            └────────┬────────────────┘
                     ▼
        ┌────────────────────────────┐
        │ Set admin_session=authenticated │
        └────────┬───────────────────┘
                 ▼
    ┌────────────────────────────┐
    │ Redirect to /admin         │
    └────────┬───────────────────┘
             ▼
┌────────────────────────────────────┐
│         MIDDLEWARE CHECK           │
│ ✓ admin_session cookie found      │
│ ✓ Allow access to /admin           │
└────────────┬───────────────────────┘
             ▼
┌────────────────────────────────────┐
│      DASHBOARD PAGE RENDERS        │
│ Makes API call: GET /api/admin/stats│
└────────────┬───────────────────────┘
             ▼
┌────────────────────────────────────┐
│     /api/admin/stats HANDLER       │
│ 1. Calls getAdminUser()            │
│ 2. Checks admin_session cookie     │
│ 3. Returns mock AdminUser          │
│ 4. Fetches stats from database     │
│ 5. Returns 200 with data           │
└────────────┬───────────────────────┘
             ▼
┌────────────────────────────────────┐
│   DASHBOARD SHOWS STATS            │
│   ✅ SUCCESS                        │
└────────────────────────────────────┘
```

---

## SECURITY LAYERS

### Layer 1: Cookie Security
```
admin_session=authenticated;
  Path=/                  → Available to all admin routes
  HttpOnly                → Prevents XSS attacks
  Secure                  → HTTPS only (production)
  SameSite=Strict         → Prevents CSRF attacks
  Max-Age=28800           → 8-hour expiration
```

### Layer 2: Middleware Protection
```typescript
// Runs on EVERY request to /admin/*
if (!adminSession && (!accessToken || !refreshToken)) {
  redirect('/admin/login');
}
```

### Layer 3: API Route Authorization
```typescript
// Runs on EVERY API endpoint
const admin = await getAdminUser();
if (!admin) {
  return 401 Unauthorized;
}
```

### Layer 4: Rate Limiting
```typescript
// Login: 5 attempts per 15 minutes
// API: 100 requests per hour
if (!checkRateLimit(ip)) {
  return 429 Too Many Requests;
}
```

### Layer 5: CSRF Protection
```typescript
// Validates Origin/Referer headers
if (origin !== expectedOrigin) {
  return 403 Forbidden;
}
```

---

## CODE REFERENCE

### getAdminUser() - BEFORE FIX
```typescript
export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;

  // ❌ Only checks Supabase tokens
  // ❌ Ignores admin_session cookie

  if (!accessToken || !refreshToken) {
    return null;  // ❌ Returns null for simple cookie auth
  }
  // ... Supabase validation
}
```

### getAdminUser() - AFTER FIX
```typescript
export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();

  // ✅ FIRST: Check for admin_session cookie
  const adminSession = cookieStore.get('admin_session');
  if (adminSession?.value === 'authenticated') {
    return mockAdminUser;  // ✅ Returns admin user
  }

  // ✅ SECOND: Fall back to Supabase auth
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;
  // ... Supabase validation (unchanged)
}
```

---

## MIGRATION PATH TO PRODUCTION AUTH

### Phase 1: Current (Simple Auth) ✅
- admin_session cookie
- Mock admin user
- Single admin account

### Phase 2: Add Admin Users Table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);
```

### Phase 3: Switch Login to Supabase
```typescript
// Update /api/admin/auth/login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Set Supabase tokens instead of admin_session
cookieStore.set('sb-access-token', data.session.access_token);
cookieStore.set('sb-refresh-token', data.session.refresh_token);
```

### Phase 4: Remove Simple Auth
```typescript
// getAdminUser() only checks Supabase tokens
// Remove admin_session cookie logic
// Remove mock admin user
```

---

## API ROUTE PATTERN (ALL ROUTES FOLLOW THIS)

```typescript
export async function GET(request: NextRequest) {
  // SECURITY: Authentication check - MUST be first
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  // SECURITY: Rate limiting check
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // SECURITY: Input validation
  const validation = schema.safeParse(input);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    );
  }

  try {
    // Handler logic
    return NextResponse.json({ data });
  } catch (error) {
    // Safe error handling
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
```

---

## ROUTES VERIFIED

### Authentication Routes
- ✅ `/api/admin/auth/login` - Sets admin_session cookie
- ✅ `/api/admin/logout` - Clears all cookies

### Dashboard Routes
- ✅ `/api/admin/stats` - Uses getAdminUser()
- ✅ `/api/admin/questionnaires` - Uses getAdminUser()
- ✅ `/api/admin/clients` - Uses getAdminUser()
- ✅ `/api/admin/settings` - Uses getAdminUser()
- ✅ `/api/admin/clients/[clientId]` - Uses getAdminUser()
- ✅ `/api/admin/questionnaires/[id]` - Uses getAdminUser()

### Page Routes
- ✅ `/admin` - Protected by middleware
- ✅ `/admin/login` - Public (login page)
- ✅ `/admin/questionnaires` - Protected by middleware
- ✅ `/admin/clients` - Protected by middleware
- ✅ `/admin/settings` - Protected by middleware

All routes now work with admin_session cookie.

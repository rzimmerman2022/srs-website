# Security Audit Logging System

## Overview

This security audit logging system provides comprehensive logging of all security-related events in the application. It's designed for compliance, incident investigation, and threat monitoring.

## Architecture

### Components

1. **Database Table**: `security_audit_log` - Stores all security events
2. **Logging Library**: `/lib/security/audit-log.ts` - Core logging functions
3. **Dashboard**: `/app/admin/security/page.tsx` - Admin UI for viewing logs
4. **Integrations**: Middleware and API routes automatically log security events

### Features

- **Non-blocking logging**: Failures never interrupt application flow
- **Dual logging**: Events logged to both database and console
- **Comprehensive indexing**: Fast queries on event type, user, time, and IP
- **Flexible metadata**: JSONB field for event-specific data
- **Real-time dashboard**: View and filter security events

## Setup

### 1. Database Migration

Run the migration SQL in your Supabase SQL Editor:

```bash
# File: /lib/supabase/migration-security-audit-log.sql
```

This creates:
- `security_audit_log` table
- Indexes for performance
- Row Level Security policies
- Optional cleanup functions

### 2. Verify TypeScript Types

The Supabase types are already updated in `/lib/supabase/types.ts`:
- `SecurityAuditLog`
- `SecurityAuditLogInsert`
- `SecurityAuditLogUpdate`

### 3. Access the Dashboard

Navigate to `/admin/security` to view the security audit dashboard.

## Usage

### Basic Logging

```typescript
import { logSecurityEvent } from '@/lib/security/audit-log';

// Log any security event
await logSecurityEvent({
  event_type: 'login_success',
  action: 'login',
  success: true,
  user_type: 'admin',
  user_id: 'user@example.com',
  ip_address: '192.168.1.1',
  user_agent: 'Mozilla/5.0...',
  resource_type: 'session',
  metadata: { method: '2fa' },
});
```

### Convenience Functions

```typescript
import {
  logLoginSuccess,
  logLoginFailure,
  logAccessDenied,
  logRateLimitExceeded,
  logDataExport,
  logDataView,
  logCsrfViolation,
  logTokenValidation,
} from '@/lib/security/audit-log';

// Login success
await logLoginSuccess({
  user_id: 'admin@example.com',
  user_type: 'admin',
  ip_address: '192.168.1.1',
  user_agent: req.headers.get('user-agent') || undefined,
});

// Login failure
await logLoginFailure({
  user_type: 'admin',
  ip_address: '192.168.1.1',
  error_message: 'Invalid credentials',
});

// Access denied
await logAccessDenied({
  user_type: 'client',
  ip_address: '192.168.1.1',
  resource_type: 'questionnaire',
  resource_id: 'q123',
  error_message: 'Unauthorized access attempt',
});

// Rate limit exceeded
await logRateLimitExceeded({
  user_type: 'anonymous',
  ip_address: '192.168.1.1',
  resource_type: 'api',
  metadata: { endpoint: '/api/admin/questionnaires' },
});

// Data export
await logDataExport({
  user_id: 'admin@example.com',
  user_type: 'admin',
  ip_address: '192.168.1.1',
  resource_type: 'questionnaire',
  resource_id: 'q123',
  metadata: { format: 'csv' },
});

// CSRF violation
await logCsrfViolation({
  ip_address: '192.168.1.1',
  origin: 'https://evil.com',
  expected_origin: 'https://yoursite.com',
  path: '/api/admin/delete',
  method: 'POST',
});
```

### Getting Client IP in Next.js

```typescript
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}
```

## Event Types

### Authentication Events
- `login_success` - Successful login
- `login_failure` - Failed login attempt
- `logout` - User logout
- `session_timeout` - Session expired
- `session_created` - New session created
- `session_expired` - Session expired naturally

### Authorization Events
- `access_denied` - Access to resource denied
- `unauthorized_access` - Unauthorized access attempt
- `permission_denied` - Insufficient permissions

### Token Events
- `token_valid` - Valid token verification
- `token_invalid` - Invalid token
- `token_expired` - Expired token
- `token_revoked` - Revoked token used

### Rate Limiting Events
- `rate_limit_exceeded` - Rate limit threshold exceeded
- `rate_limit_warning` - Approaching rate limit

### Data Access Events
- `data_view` - Data viewed
- `data_export` - Data exported
- `data_delete` - Data deleted
- `data_modify` - Data modified

### CSRF Protection Events
- `csrf_violation` - CSRF validation failed
- `origin_mismatch` - Origin header mismatch

### Admin Actions
- `admin_login` - Admin login
- `admin_logout` - Admin logout
- `view_questionnaire` - Questionnaire viewed
- `view_response` - Response viewed
- `view_client` - Client data viewed
- `delete_questionnaire` - Questionnaire deleted
- `export_data` - Data exported

## Security Dashboard

The admin security dashboard (`/admin/security`) provides:

### Statistics
- Total events in selected time range
- Failed events count
- Success rate percentage

### Filters
- **Time Range**: Last hour, 24 hours, 7 days, 30 days
- **Event Type**: Filter by specific event types
- **Status**: All, success only, or failed only

### Event Distribution
- Visual chart showing top event types
- Percentage breakdown of event types

### Events Table
Displays:
- Timestamp (relative and absolute)
- Event type
- Success/failure status
- User information
- IP address
- Resource accessed
- Error messages
- Metadata (expandable)

Failed events are highlighted in red for easy identification.

## Current Integrations

### Middleware (`/middleware.ts`)
- Logs all CSRF violations
- Includes origin/referer mismatch details
- Captures IP address and user agent

### Admin API Routes
- `/api/admin/questionnaires` - Rate limit logging
- `/api/admin/clients` - Rate limit logging

## Best Practices

### 1. Non-blocking Logging
Always use `.catch()` when logging to prevent failures from blocking:

```typescript
logSecurityEvent(event).catch((err) =>
  console.error('Failed to log event:', err)
);
```

### 2. Include Context
Provide as much context as possible in metadata:

```typescript
metadata: {
  endpoint: '/api/admin/export',
  method: 'POST',
  resource_count: 42,
  export_format: 'csv',
}
```

### 3. Use Appropriate Event Types
Choose the most specific event type available:

```typescript
// Good
event_type: 'token_expired'

// Less specific
event_type: 'token_invalid'
```

### 4. Log Both Success and Failure
Log successful operations for audit trails, not just failures:

```typescript
// Log successful data export
await logDataExport({
  user_id: 'admin@example.com',
  user_type: 'admin',
  ip_address: clientIp,
  resource_type: 'questionnaire',
  success: true,
});
```

## Performance Considerations

### Indexes
The following indexes are created for optimal query performance:
- `idx_security_audit_log_event_type` - Filter by event type
- `idx_security_audit_log_user_id` - User-specific queries
- `idx_security_audit_log_created_at` - Time-based queries
- `idx_security_audit_log_ip_address` - IP-based analysis
- `idx_security_audit_log_failed_events` - Security incidents
- `idx_security_audit_log_user_activity` - User activity analysis

### Query Optimization
Dashboard queries are optimized:
- Time-based filtering uses indexed `created_at`
- Limits to 500 most recent events
- Efficient filtering on client-side for additional criteria

### Data Retention
Consider implementing automatic cleanup for old logs:

```sql
-- Delete logs older than 1 year
DELETE FROM security_audit_log
WHERE created_at < NOW() - INTERVAL '1 year';
```

## Compliance

This logging system supports:

### SOC 2
- Audit trail of all security events
- Access logging for sensitive data
- Failed access attempt tracking

### GDPR
- User identification in logs
- IP address tracking for accountability
- Ability to delete user-specific logs if required

### HIPAA (if applicable)
- Access logging for protected information
- Audit trail of data modifications
- Failed access attempt monitoring

## Monitoring and Alerting

### Key Metrics to Monitor
1. **Failed Login Attempts**: Spike may indicate attack
2. **CSRF Violations**: Should be rare; investigate if frequent
3. **Rate Limit Exceeded**: Monitor for potential DoS
4. **Access Denied Events**: Unusual patterns may indicate probing

### Recommended Alerts
- More than 10 failed login attempts from same IP in 5 minutes
- Any CSRF violation in production
- Rate limit exceeded more than 5 times from same IP
- Any `unauthorized_access` events

### Integration with External Tools
Export logs to external monitoring:

```typescript
// Example: Send critical events to Slack/email
if (event.event_type === 'csrf_violation' ||
    (event.event_type === 'login_failure' && failureCount > 5)) {
  await notifySecurityTeam(event);
}
```

## Troubleshooting

### Logs Not Appearing in Database
1. Check Supabase connection in `.env.local`
2. Verify migration was run successfully
3. Check console logs for error messages
4. Verify RLS policies allow insert

### Dashboard Not Loading Events
1. Check browser console for errors
2. Verify Supabase credentials are configured
3. Check that table name matches migration
4. Verify RLS policies allow SELECT

### Performance Issues
1. Check if indexes are created: `\d security_audit_log` in psql
2. Consider implementing data archival
3. Limit dashboard time range to recent events
4. Use pagination for large result sets

## Future Enhancements

Potential improvements:
1. Real-time event streaming to dashboard
2. Email/Slack notifications for critical events
3. Automatic threat detection and blocking
4. Machine learning for anomaly detection
5. Integration with SIEM tools
6. Geo-location tracking for IP addresses
7. User behavior analytics
8. Automated incident response workflows

## Support

For issues or questions:
1. Check this documentation
2. Review code comments in `/lib/security/audit-log.ts`
3. Check Supabase dashboard for database errors
4. Review console logs for error messages

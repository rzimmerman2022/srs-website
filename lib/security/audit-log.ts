/**
 * Security Audit Logging System
 *
 * Provides comprehensive logging of all security-related events for:
 * - Compliance and regulatory requirements
 * - Security incident investigation
 * - User activity monitoring
 * - Threat detection and prevention
 *
 * Key Features:
 * - Non-blocking logging (errors don't interrupt main flow)
 * - Dual logging to database and console
 * - Structured event types for easy filtering
 * - IP address and user agent tracking
 * - Flexible metadata support
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// Event Type Definitions
// ============================================================================
export type SecurityEventType =
  // Authentication events
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'session_timeout'
  | 'session_created'
  | 'session_expired'

  // Authorization events
  | 'access_denied'
  | 'unauthorized_access'
  | 'permission_denied'

  // Token events
  | 'token_valid'
  | 'token_invalid'
  | 'token_expired'
  | 'token_revoked'

  // Rate limiting events
  | 'rate_limit_exceeded'
  | 'rate_limit_warning'

  // Data access events
  | 'data_view'
  | 'data_export'
  | 'data_delete'
  | 'data_modify'

  // CSRF protection events
  | 'csrf_violation'
  | 'origin_mismatch'

  // Admin actions
  | 'admin_login'
  | 'admin_logout'
  | 'view_questionnaire'
  | 'view_response'
  | 'view_client'
  | 'delete_questionnaire'
  | 'export_data';

export type UserType = 'admin' | 'client' | 'anonymous';

export type ResourceType =
  | 'questionnaire'
  | 'response'
  | 'client'
  | 'export'
  | 'session'
  | 'api'
  | 'admin_panel';

// ============================================================================
// Security Event Interface
// ============================================================================
export interface SecurityEvent {
  // Event information
  event_type: SecurityEventType;
  action: string;
  success: boolean;
  error_message?: string;

  // User information
  user_id?: string;
  user_type: UserType;

  // Request metadata
  ip_address: string;
  user_agent?: string;

  // Resource information
  resource_type?: ResourceType;
  resource_id?: string;

  // Additional metadata
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Supabase Client Initialization
// ============================================================================
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

// ============================================================================
// Console Logging Helper
// ============================================================================
const logToConsole = (event: SecurityEvent) => {
  const timestamp = new Date().toISOString();
  const logLevel = event.success ? 'info' : 'warn';

  const logData = {
    timestamp,
    event_type: event.event_type,
    action: event.action,
    success: event.success,
    user_type: event.user_type,
    user_id: event.user_id,
    ip_address: event.ip_address,
    resource_type: event.resource_type,
    resource_id: event.resource_id,
    error_message: event.error_message,
    metadata: event.metadata,
  };

  if (logLevel === 'warn') {
    console.warn('[SECURITY AUDIT]', JSON.stringify(logData, null, 2));
  } else {
    // In production, we still want to see security events
    if (process.env.NODE_ENV === 'production') {
      console.log('[SECURITY AUDIT]', JSON.stringify(logData, null, 2));
    } else {
      console.info('[SECURITY AUDIT]', logData);
    }
  }
};

// ============================================================================
// Main Logging Function
// ============================================================================
/**
 * Log a security event to both database and console
 *
 * This function is designed to be non-blocking and will never throw errors
 * that could interrupt the main application flow. All errors are caught
 * and logged to console only.
 *
 * @param event - The security event to log
 * @returns Promise that resolves when logging is complete (but doesn't need to be awaited)
 */
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    // Always log to console first (synchronous and reliable)
    logToConsole(event);

    // Attempt to log to database (async, may fail)
    const supabase = getSupabaseClient();

    if (!supabase) {
      console.warn('[SECURITY AUDIT] Supabase not configured, skipping database logging');
      return;
    }

    // Insert into security_audit_log table
    const { error } = await supabase
      .from('security_audit_log')
      .insert({
        event_type: event.event_type,
        action: event.action,
        success: event.success,
        error_message: event.error_message,
        user_id: event.user_id,
        user_type: event.user_type,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        resource_type: event.resource_type,
        resource_id: event.resource_id,
        metadata: event.metadata || {},
      });

    if (error) {
      // Log the error but don't throw - logging failures shouldn't break the app
      console.error('[SECURITY AUDIT] Failed to log to database:', error);
    }
  } catch (error) {
    // Catch any unexpected errors and log them
    // This ensures that logging failures never crash the application
    console.error('[SECURITY AUDIT] Unexpected error during logging:', error);
  }
}

// ============================================================================
// Convenience Functions for Common Events
// ============================================================================

/**
 * Log a successful login event
 */
export async function logLoginSuccess(params: {
  user_id: string;
  user_type: UserType;
  ip_address: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  return logSecurityEvent({
    event_type: 'login_success',
    action: 'login',
    success: true,
    user_id: params.user_id,
    user_type: params.user_type,
    ip_address: params.ip_address,
    user_agent: params.user_agent,
    resource_type: 'session',
    metadata: params.metadata,
  });
}

/**
 * Log a failed login attempt
 */
export async function logLoginFailure(params: {
  user_id?: string;
  user_type: UserType;
  ip_address: string;
  user_agent?: string;
  error_message: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  return logSecurityEvent({
    event_type: 'login_failure',
    action: 'login',
    success: false,
    error_message: params.error_message,
    user_id: params.user_id,
    user_type: params.user_type,
    ip_address: params.ip_address,
    user_agent: params.user_agent,
    resource_type: 'session',
    metadata: params.metadata,
  });
}

/**
 * Log an access denied event
 */
export async function logAccessDenied(params: {
  user_id?: string;
  user_type: UserType;
  ip_address: string;
  user_agent?: string;
  resource_type?: ResourceType;
  resource_id?: string;
  error_message: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  return logSecurityEvent({
    event_type: 'access_denied',
    action: 'access_attempt',
    success: false,
    error_message: params.error_message,
    user_id: params.user_id,
    user_type: params.user_type,
    ip_address: params.ip_address,
    user_agent: params.user_agent,
    resource_type: params.resource_type,
    resource_id: params.resource_id,
    metadata: params.metadata,
  });
}

/**
 * Log a rate limit exceeded event
 */
export async function logRateLimitExceeded(params: {
  user_id?: string;
  user_type: UserType;
  ip_address: string;
  user_agent?: string;
  resource_type?: ResourceType;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  return logSecurityEvent({
    event_type: 'rate_limit_exceeded',
    action: 'rate_limit_check',
    success: false,
    error_message: 'Rate limit exceeded',
    user_id: params.user_id,
    user_type: params.user_type,
    ip_address: params.ip_address,
    user_agent: params.user_agent,
    resource_type: params.resource_type,
    metadata: params.metadata,
  });
}

/**
 * Log a data export event
 */
export async function logDataExport(params: {
  user_id: string;
  user_type: UserType;
  ip_address: string;
  user_agent?: string;
  resource_type: ResourceType;
  resource_id?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  return logSecurityEvent({
    event_type: 'data_export',
    action: 'export',
    success: true,
    user_id: params.user_id,
    user_type: params.user_type,
    ip_address: params.ip_address,
    user_agent: params.user_agent,
    resource_type: params.resource_type,
    resource_id: params.resource_id,
    metadata: params.metadata,
  });
}

/**
 * Log a data view event
 */
export async function logDataView(params: {
  user_id: string;
  user_type: UserType;
  ip_address: string;
  user_agent?: string;
  resource_type: ResourceType;
  resource_id?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  return logSecurityEvent({
    event_type: 'data_view',
    action: 'view',
    success: true,
    user_id: params.user_id,
    user_type: params.user_type,
    ip_address: params.ip_address,
    user_agent: params.user_agent,
    resource_type: params.resource_type,
    resource_id: params.resource_id,
    metadata: params.metadata,
  });
}

/**
 * Log a CSRF violation
 */
export async function logCsrfViolation(params: {
  ip_address: string;
  user_agent?: string;
  origin?: string;
  expected_origin?: string;
  path: string;
  method: string;
}): Promise<void> {
  return logSecurityEvent({
    event_type: 'csrf_violation',
    action: 'csrf_check',
    success: false,
    error_message: 'CSRF validation failed',
    user_type: 'anonymous',
    ip_address: params.ip_address,
    user_agent: params.user_agent,
    resource_type: 'api',
    metadata: {
      origin: params.origin,
      expected_origin: params.expected_origin,
      path: params.path,
      method: params.method,
    },
  });
}

/**
 * Log a token validation event
 */
export async function logTokenValidation(params: {
  success: boolean;
  event_type: 'token_valid' | 'token_invalid' | 'token_expired' | 'token_revoked';
  user_id?: string;
  ip_address: string;
  user_agent?: string;
  error_message?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  return logSecurityEvent({
    event_type: params.event_type,
    action: 'token_validation',
    success: params.success,
    error_message: params.error_message,
    user_id: params.user_id,
    user_type: 'client',
    ip_address: params.ip_address,
    user_agent: params.user_agent,
    resource_type: 'session',
    metadata: params.metadata,
  });
}

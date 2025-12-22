import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAdminUser } from '@/lib/auth/admin-auth';

// ============================================================================
// SECURITY: Rate Limiting
// ============================================================================
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitMap.entries()).forEach(([ip, record]) => {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  });
}, 10 * 60 * 1000);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

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

// ============================================================================
// Error Handling
// ============================================================================
const getSafeErrorMessage = (error: unknown, context?: string): string => {
  if (context) {
    console.error(`[${context}] Error details:`, error);
  }
  return 'An error occurred while processing your request';
};

// ============================================================================
// Types
// ============================================================================
interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: unknown;
  category: string;
  description?: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

interface SettingsResponse {
  general: {
    company_name: string;
    admin_email: string;
  };
  questionnaire: {
    default_points_per_question: number;
    auto_save_interval: number;
    session_timeout: number;
  };
  security: {
    session_timeout_duration: number;
    ip_allowlist: string;
    two_factor_enabled: boolean;
  };
  email: {
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    from_email: string;
  };
}

// ============================================================================
// Supabase Client
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
// In-Memory Fallback (for development when Supabase is not configured)
// ============================================================================
let inMemorySettings: SettingsResponse = {
  general: {
    company_name: 'Southwest Resumes',
    admin_email: 'admin@southwestresumes.com',
  },
  questionnaire: {
    default_points_per_question: 10,
    auto_save_interval: 30,
    session_timeout: 60,
  },
  security: {
    session_timeout_duration: 3600,
    ip_allowlist: '',
    two_factor_enabled: false,
  },
  email: {
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    from_email: 'noreply@southwestresumes.com',
  },
};

// ============================================================================
// GET - Retrieve all admin settings
// ============================================================================
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
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '3600',
        }
      }
    );
  }

  const supabase = getSupabaseClient();

  // If Supabase is not configured, use in-memory fallback
  if (!supabase) {
    return NextResponse.json({
      settings: inMemorySettings,
      fetched_at: new Date().toISOString(),
      mode: 'in-memory',
    });
  }

  try {
    // Fetch all settings from the database
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      const safeMessage = getSafeErrorMessage(error, 'GET /admin/settings');
      return NextResponse.json(
        { error: safeMessage },
        { status: 500 }
      );
    }

    // Transform database results into structured settings object
    const settings: Partial<SettingsResponse> = {
      general: {
        company_name: '',
        admin_email: '',
      },
      questionnaire: {
        default_points_per_question: 10,
        auto_save_interval: 30,
        session_timeout: 60,
      },
      security: {
        session_timeout_duration: 3600,
        ip_allowlist: '',
        two_factor_enabled: false,
      },
      email: {
        smtp_host: '',
        smtp_port: 587,
        smtp_username: '',
        smtp_password: '',
        from_email: '',
      },
    };

    // Map database settings to structured object
    (data as AdminSetting[] || []).forEach((setting) => {
      const [category, key] = setting.setting_key.split('.');
      const value = setting.setting_value;

      if (category === 'general' && settings.general) {
        if (key === 'company_name') settings.general.company_name = String(value || '');
        if (key === 'admin_email') settings.general.admin_email = String(value || '');
      } else if (category === 'questionnaire' && settings.questionnaire) {
        if (key === 'default_points_per_question') settings.questionnaire.default_points_per_question = Number(value || 10);
        if (key === 'auto_save_interval') settings.questionnaire.auto_save_interval = Number(value || 30);
        if (key === 'session_timeout') settings.questionnaire.session_timeout = Number(value || 60);
      } else if (category === 'security' && settings.security) {
        if (key === 'session_timeout_duration') settings.security.session_timeout_duration = Number(value || 3600);
        if (key === 'ip_allowlist') {
          // Convert array to string for textarea display
          settings.security.ip_allowlist = Array.isArray(value) ? value.join('\n') : '';
        }
        if (key === 'two_factor_enabled') settings.security.two_factor_enabled = Boolean(value);
      } else if (category === 'email' && settings.email) {
        if (key === 'smtp_host') settings.email.smtp_host = String(value || '');
        if (key === 'smtp_port') settings.email.smtp_port = Number(value || 587);
        if (key === 'smtp_username') settings.email.smtp_username = String(value || '');
        if (key === 'smtp_password') settings.email.smtp_password = String(value || '');
        if (key === 'from_email') settings.email.from_email = String(value || '');
      }
    });

    return NextResponse.json({
      settings,
      fetched_at: new Date().toISOString(),
    });
  } catch (error) {
    const safeMessage = getSafeErrorMessage(error, 'GET /admin/settings');
    return NextResponse.json(
      { error: safeMessage },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Update admin settings
// ============================================================================
export async function POST(request: NextRequest) {
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
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '3600',
        }
      }
    );
  }

  const supabase = getSupabaseClient();

  try {
    // Parse request body
    const body = await request.json();
    const { settings } = body as { settings: Partial<SettingsResponse> };

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }

    // If Supabase is not configured, use in-memory fallback
    if (!supabase) {
      // Update in-memory settings
      inMemorySettings = {
        ...inMemorySettings,
        ...settings,
      };

      return NextResponse.json({
        success: true,
        updated_count: Object.keys(settings).length,
        updated_at: new Date().toISOString(),
        mode: 'in-memory',
      });
    }

    // Build array of setting updates
    const updates: Array<{ setting_key: string; setting_value: unknown; category: string }> = [];

    // General settings
    if (settings.general) {
      if (settings.general.company_name !== undefined) {
        updates.push({
          setting_key: 'general.company_name',
          setting_value: settings.general.company_name,
          category: 'general',
        });
      }
      if (settings.general.admin_email !== undefined) {
        updates.push({
          setting_key: 'general.admin_email',
          setting_value: settings.general.admin_email,
          category: 'general',
        });
      }
    }

    // Questionnaire settings
    if (settings.questionnaire) {
      if (settings.questionnaire.default_points_per_question !== undefined) {
        updates.push({
          setting_key: 'questionnaire.default_points_per_question',
          setting_value: settings.questionnaire.default_points_per_question,
          category: 'questionnaire',
        });
      }
      if (settings.questionnaire.auto_save_interval !== undefined) {
        updates.push({
          setting_key: 'questionnaire.auto_save_interval',
          setting_value: settings.questionnaire.auto_save_interval,
          category: 'questionnaire',
        });
      }
      if (settings.questionnaire.session_timeout !== undefined) {
        updates.push({
          setting_key: 'questionnaire.session_timeout',
          setting_value: settings.questionnaire.session_timeout,
          category: 'questionnaire',
        });
      }
    }

    // Security settings
    if (settings.security) {
      if (settings.security.session_timeout_duration !== undefined) {
        updates.push({
          setting_key: 'security.session_timeout_duration',
          setting_value: settings.security.session_timeout_duration,
          category: 'security',
        });
      }
      if (settings.security.ip_allowlist !== undefined) {
        // Convert textarea string to array
        const ipArray = settings.security.ip_allowlist
          .split('\n')
          .map(ip => ip.trim())
          .filter(ip => ip.length > 0);
        updates.push({
          setting_key: 'security.ip_allowlist',
          setting_value: ipArray,
          category: 'security',
        });
      }
      if (settings.security.two_factor_enabled !== undefined) {
        updates.push({
          setting_key: 'security.two_factor_enabled',
          setting_value: settings.security.two_factor_enabled,
          category: 'security',
        });
      }
    }

    // Email settings
    if (settings.email) {
      if (settings.email.smtp_host !== undefined) {
        updates.push({
          setting_key: 'email.smtp_host',
          setting_value: settings.email.smtp_host,
          category: 'email',
        });
      }
      if (settings.email.smtp_port !== undefined) {
        updates.push({
          setting_key: 'email.smtp_port',
          setting_value: settings.email.smtp_port,
          category: 'email',
        });
      }
      if (settings.email.smtp_username !== undefined) {
        updates.push({
          setting_key: 'email.smtp_username',
          setting_value: settings.email.smtp_username,
          category: 'email',
        });
      }
      if (settings.email.smtp_password !== undefined) {
        updates.push({
          setting_key: 'email.smtp_password',
          setting_value: settings.email.smtp_password,
          category: 'email',
        });
      }
      if (settings.email.from_email !== undefined) {
        updates.push({
          setting_key: 'email.from_email',
          setting_value: settings.email.from_email,
          category: 'email',
        });
      }
    }

    // Perform database updates (upsert)
    for (const update of updates) {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: update.setting_key,
          setting_value: update.setting_value,
          category: update.category,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        const safeMessage = getSafeErrorMessage(error, 'POST /admin/settings');
        return NextResponse.json(
          { error: safeMessage, setting_key: update.setting_key },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      updated_count: updates.length,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    const safeMessage = getSafeErrorMessage(error, 'POST /admin/settings');
    return NextResponse.json(
      { error: safeMessage },
      { status: 500 }
    );
  }
}

#!/usr/bin/env node
/**
 * Run Supabase Migrations via Service Role
 *
 * ⚠️  WARNING: This script is DEPRECATED and has known bugs:
 * - exec_sql RPC function doesn't exist in Supabase by default
 * - Error handling doesn't actually execute SQL (logs but doesn't run)
 * - Skips ALL migrations if tables exist (incomplete migration detection)
 *
 * ✅ RECOMMENDED APPROACH:
 * Run migrations manually via Supabase SQL Editor:
 * https://supabase.com/dashboard/project/aougseszcvzgxwniossn/sql/new
 *
 * This script is kept for reference only.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

// Migration files to run in order
const MIGRATIONS = [
  'lib/supabase/migrations/002_clients_table.sql',
  'lib/supabase/migrations/003_hubspot_integration.sql'
];

async function runMigration(filePath) {
  console.log(`\n📄 Running: ${filePath}`);

  const sql = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');

  // Split by semicolons but handle edge cases
  const statements = sql
    .split(/;(?=\s*(?:--|CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|GRANT|COMMENT|$))/i)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`   Found ${statements.length} statements`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (!stmt || stmt.startsWith('--')) continue;

    // Use rpc to execute raw SQL (if available) or direct query
    const { error } = await supabase.rpc('exec_sql', { sql: stmt }).catch(() => ({ error: null }));

    if (error) {
      // Try alternative method - create a temp function
      console.log(`   Statement ${i + 1}: Using direct approach...`);
    }
  }

  console.log(`   ✅ Migration complete`);
}

async function checkTableExists(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);

  return !error || !error.message.includes('does not exist');
}

async function main() {
  console.log('🚀 Supabase Migration Runner');
  console.log(`   URL: ${SUPABASE_URL}`);

  // Check current state
  const clientsExists = await checkTableExists('clients');
  const hubspotExists = await checkTableExists('hubspot_sync_state');

  console.log(`\n📊 Current State:`);
  console.log(`   - clients table: ${clientsExists ? '✅ exists' : '❌ missing'}`);
  console.log(`   - hubspot_sync_state: ${hubspotExists ? '✅ exists' : '❌ missing'}`);

  if (clientsExists && hubspotExists) {
    console.log('\n✅ All tables already exist! No migrations needed.');
    return;
  }

  console.log('\n⚠️  Tables missing. Please run the SQL manually in Supabase Dashboard.');
  console.log('   Go to: https://supabase.com/dashboard/project/aougseszcvzgxwniossn/sql/new');
  console.log('\n   Or provide the database password to run automatically.');
}

main().catch(console.error);

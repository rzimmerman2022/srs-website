-- Create Admin User for Ryan Zimmerman
-- Email: ryan.zimmerman@southwestresumes.com
-- Password: REDACTED_DB_PASSWORD
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/aougseszcvzgxwniossn

-- Step 1: Create user in auth.users table
-- Note: Supabase will auto-hash the password when using auth.signup() API
-- For direct SQL insert, we need to use crypt() function

-- First, ensure pgcrypto extension is enabled (usually is by default)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert admin user into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'ryan.zimmerman@southwestresumes.com',
  crypt('REDACTED_DB_PASSWORD', gen_salt('bf')), -- Bcrypt hash
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"],"role":"admin"}',
  '{"name":"Ryan Zimmerman","role":"admin","company":"Southwest Resume Services"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Step 2: Verify user was created
SELECT
  id,
  email,
  email_confirmed_at,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE email = 'ryan.zimmerman@southwestresumes.com';

-- Expected output:
-- id                                   | email                                    | email_confirmed_at       | role  | created_at
-- -------------------------------------|------------------------------------------|--------------------------|-------|---------------------------
-- [UUID]                               | ryan.zimmerman@southwestresumes.com      | [timestamp]              | admin | [timestamp]

-- If you see the above output, the admin user was created successfully!
-- You can now log in at: http://localhost:3000/admin/login

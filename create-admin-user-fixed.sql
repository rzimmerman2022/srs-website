-- Create Admin User for Ryan Zimmerman - FIXED VERSION
-- Run this in Supabase SQL Editor

-- Step 1: Check if user already exists in auth.users
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Try to find existing user
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'ryan.zimmerman@southwestresumes.com';

  -- If user doesn't exist, create them
  IF v_user_id IS NULL THEN
    -- Create user in auth.users using Supabase's auth schema
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
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
      crypt('Welectric9191!', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Ryan Zimmerman"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO v_user_id;

    RAISE NOTICE 'Created new auth user with ID: %', v_user_id;
  ELSE
    RAISE NOTICE 'Auth user already exists with ID: %', v_user_id;
  END IF;

  -- Now create or update the admin_users record
  INSERT INTO admin_users (
    user_id,
    email,
    full_name,
    role,
    active,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'ryan.zimmerman@southwestresumes.com',
    'Ryan Zimmerman',
    'super_admin',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    active = EXCLUDED.active,
    updated_at = NOW();

  RAISE NOTICE 'Admin user record created/updated successfully!';
END $$;

-- Step 2: Verify the admin user was created
SELECT
  au.id,
  au.email,
  au.full_name,
  au.role,
  au.active,
  au.created_at,
  u.email_confirmed_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.email = 'ryan.zimmerman@southwestresumes.com';

-- Expected output:
-- You should see 1 row with:
-- - email: ryan.zimmerman@southwestresumes.com
-- - full_name: Ryan Zimmerman
-- - role: super_admin
-- - active: true
-- - email_confirmed_at: [timestamp]

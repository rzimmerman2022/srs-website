# Confirm Admin Email - Quick Fix

**Problem:** Admin user created but email not confirmed, so you can't login.

**Solution:** Manually confirm email via Supabase Dashboard

---

## Steps to Confirm Email (2 minutes)

1. **Go to Supabase Dashboard:**
   https://supabase.com/dashboard/project/aougseszcvzgxwniossn

2. **Login with your Supabase account:**
   - Email: rzimmerman2022@... (or whatever you used to create the Supabase project)
   - This is your Supabase platform account

3. **Navigate to Authentication:**
   - Click "Authentication" in left sidebar
   - Click "Users" tab

4. **Find the admin user:**
   - Look for: ryan.zimmerman@southwestresumes.com
   - User ID: 2a0cd90a-74ba-40ca-b0d9-dfcc19231119

5. **Confirm the email:**
   - Click on the user row
   - Look for "Email Confirmed" field
   - Click the toggle or "Confirm Email" button
   - Save

6. **Test login:**
   - Go to: http://localhost:3000/admin/login
   - Email: ryan.zimmerman@southwestresumes.com
   - Password: Welectric9191!
   - Should work now!

---

## Alternative: Disable Email Confirmation (Development)

If you want to skip email confirmation for future users:

1. Go to: https://supabase.com/dashboard/project/aougseszcvzgxwniossn
2. Click "Authentication" → "Providers"
3. Click "Email" provider
4. Toggle "Confirm email" to OFF
5. Save

Then create a new user (or the existing one will work after manual confirmation above)

---

## Why This Happened

- Supabase has email confirmation ENABLED by default (security)
- When we created the admin user via API, Supabase sent a confirmation email
- That email link tried to redirect to localhost:3000 but failed
- Solution: Manually confirm via dashboard OR disable email confirmation for dev

---

**After confirming, you'll be able to login at:**
http://localhost:3000/admin/login

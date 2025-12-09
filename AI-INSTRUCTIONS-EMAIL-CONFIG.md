# AI Instructions: Email Configuration System

## Quick Reference for AI Models

This document provides quick instructions for AI assistants helping with email configuration.

## Files Overview

### Configuration Scripts
- `configure-all-email.ps1` - **START HERE**: Master script for all email setup
- `configure-google-workspace.ps1` - Google Workspace alias management via API
- `configure-spaceship-forwarding.ps1` - Spaceship email forwarding (manual/automated)

### Documentation
- `EMAIL-SETUP-README.md` - **User-facing documentation** (safe to share)
- `CREDENTIALS-GUIDE.md` - **CONFIDENTIAL**: Contains actual credentials and API details

### Credential Files (in .gitignore)
- `google-workspace-credentials.json` - OAuth 2.0 credentials
- `spaceship-token.txt` - Spaceship API token (if configured)

## Quick Start for AI Models

### When User Asks to Configure Email

**Scenario 1**: "Set up info@southwestresumes.com"

```powershell
# Check if credentials exist
if (Test-Path ".\google-workspace-credentials.json") {
    # Credentials ready, run configuration
    .\configure-google-workspace.ps1 -AliasEmail "info@southwestresumes.com"
} else {
    # Guide user through first-time setup
    .\configure-all-email.ps1
}
```

**Scenario 2**: "Set up email forwarding from sparkdatalab.ai"

```powershell
# Spaceship doesn't have API, provide manual instructions
.\configure-spaceship-forwarding.ps1 -ManualMode
```

**Scenario 3**: "Set up everything"

```powershell
# Run master script
.\configure-all-email.ps1
```

## Current Configuration

### Email Addresses Configured

| Email | Type | Purpose |
|-------|------|---------|
| ryan.zimmerman@southwestresumes.com | Primary | Main Google Workspace account |
| info@southwestresumes.com | Alias | General inquiries (alias of primary) |
| ryan.zimmerman@sparkdatalab.ai | Forward | Data services (forwards to primary) |

### What Works

- **Receive emails at all 3 addresses** ✓
- **Send from ryan.zimmerman@southwestresumes.com** ✓
- **Send from info@southwestresumes.com** ✓
- **Send from ryan.zimmerman@sparkdatalab.ai** ✓ (user configured this separately)

## Common User Requests

### "Add a new email alias"

```powershell
.\configure-google-workspace.ps1 -AliasEmail "contact@southwestresumes.com"
```

### "List all current aliases"

The script automatically lists aliases when run. Or use API directly:

```powershell
# See CREDENTIALS-GUIDE.md for token acquisition
$url = "https://admin.googleapis.com/admin/directory/v1/users/ryan.zimmerman@southwestresumes.com/aliases"
Invoke-RestMethod -Uri $url -Headers @{"Authorization"="Bearer $token"}
```

### "Remove an alias"

```powershell
# Use DELETE method (see CREDENTIALS-GUIDE.md for example)
```

### "Test if emails are working"

```
1. Send test email to: info@southwestresumes.com
2. Send test email to: ryan.zimmerman@sparkdatalab.ai
3. Check inbox: ryan.zimmerman@southwestresumes.com
4. Both should arrive
```

## Error Handling

### Common Errors and Solutions

| Error | Solution |
|-------|----------|
| "Access denied" | User needs Google Workspace admin permissions |
| "Alias already exists" | Alias is already configured (verify in admin.google.com) |
| "Credentials not found" | Run `.\configure-all-email.ps1` for first-time setup |
| "Invalid grant" | Re-authenticate (delete cached tokens and re-run) |

## Security Notes for AI Models

### DO ✓
- Use the scripts provided (`configure-*.ps1`)
- Check if credentials exist before prompting user
- Guide user through OAuth flow for first-time setup
- Verify operations completed successfully

### DON'T ✗
- Display OAuth client secret in responses
- Commit credentials to version control
- Share API tokens in chat
- Skip error handling

## API Capabilities

### Google Workspace Admin SDK

**What You Can Do**:
- Add/remove email aliases
- List user information
- Manage user settings
- Configure email delegation
- Set vacation responders

**What You Cannot Do**:
- Read email content (requires Gmail API + different scopes)
- Delete users (requires additional permissions)
- Modify billing settings

**Rate Limits**:
- 2,400 queries per 100 seconds
- 50,000 queries per day

### Spaceship API

**Status**: No public API for email forwarding

**Available Methods**:
1. Manual setup via web interface
2. Browser automation (Selenium) - implemented in scripts

## Workflow for AI Models

### Step 1: Assess User Need

User asks about email → Determine what they need:
- New alias? → `configure-google-workspace.ps1`
- Email forwarding? → `configure-spaceship-forwarding.ps1`
- Complete setup? → `configure-all-email.ps1`
- Just information? → Refer to `EMAIL-SETUP-README.md`

### Step 2: Check Prerequisites

```powershell
# Check if credentials exist
$hasGoogleCreds = Test-Path ".\google-workspace-credentials.json"
$hasScripts = Test-Path ".\configure-all-email.ps1"

if (-not $hasScripts) {
    # Scripts missing - need to recreate or user needs to download
}

if (-not $hasGoogleCreds) {
    # First-time setup needed
    Write-Host "Running first-time setup..."
    .\configure-all-email.ps1
}
```

### Step 3: Execute Operation

```powershell
# Run appropriate script with parameters
.\configure-google-workspace.ps1 -AliasEmail $newAlias
```

### Step 4: Verify Success

```powershell
# Check output for success messages
# Verify alias appears in list
# Guide user to test with actual email
```

### Step 5: Provide Testing Instructions

Always tell user:
```
✓ Configuration complete!

Test by:
1. Sending email to: [configured address]
2. Checking inbox: ryan.zimmerman@southwestresumes.com
3. Replying from: [configured address] (select in Gmail compose)
```

## Troubleshooting Guide for AI Models

### Issue: Scripts Not Working

**Check**:
1. PowerShell execution policy: `Get-ExecutionPolicy`
2. File exists: `Test-Path .\configure-all-email.ps1`
3. Credentials exist: `Test-Path .\google-workspace-credentials.json`

**Fix**:
```powershell
# Set execution policy if needed
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: OAuth Authentication Fails

**Check**:
1. Admin SDK API enabled in Google Cloud Console
2. OAuth consent screen configured
3. User has admin permissions

**Fix**:
- Guide user back to https://console.cloud.google.com
- Verify API is enabled
- Regenerate credentials if needed

### Issue: Alias Already Exists

**Check**:
```
Visit: https://admin.google.com
Navigate to: Users → Ryan Zimmerman → User information → Email aliases
```

**Fix**:
- Verify alias is actually there (might be success!)
- If wrong user, delete and recreate
- If needed, use API to remove first

## Advanced Operations

### Bulk Alias Management

```powershell
# Add multiple aliases
$aliases = @(
    "contact@southwestresumes.com",
    "hello@southwestresumes.com",
    "support@southwestresumes.com"
)

foreach ($alias in $aliases) {
    .\configure-google-workspace.ps1 -AliasEmail $alias
    Start-Sleep -Seconds 2  # Rate limiting
}
```

### Scripted Verification

```powershell
# Verify all aliases exist
$expectedAliases = @("info@southwestresumes.com")
# Use API to get actual aliases
# Compare and report differences
```

## Integration Points

### With Other Systems

**Gmail API**: For reading/sending emails (different scope required)
**Google Groups**: For mailing lists (different API)
**Google Calendar**: For meeting scheduling (different API)

### With CI/CD

For production systems, consider:
- Service accounts instead of OAuth
- Secrets management (Azure Key Vault, etc.)
- Automated testing of email delivery

## Quick Commands Reference

```powershell
# Complete setup
.\configure-all-email.ps1

# Google Workspace alias
.\configure-google-workspace.ps1 -AliasEmail "new@domain.com"

# Spaceship forwarding (manual)
.\configure-spaceship-forwarding.ps1 -ManualMode

# Check if credentials exist
Test-Path .\google-workspace-credentials.json

# View current git status (to see what's ignored)
git status
```

## When to Update This System

### Trigger Updates When:

1. **User adds new domain**: Update configurations
2. **API changes**: Update scripts with new endpoints
3. **Security best practices change**: Update auth flow
4. **New features needed**: Add capabilities to scripts

### How to Update:

1. Update relevant script files
2. Test thoroughly
3. Update this documentation
4. Update `EMAIL-SETUP-README.md` if user-facing changes

## Resources for AI Models

### Official Documentation
- Google Workspace Admin SDK: https://developers.google.com/admin-sdk
- Google OAuth 2.0: https://developers.google.com/identity/protocols/oauth2
- Spaceship Knowledge Base: https://www.spaceship.com/knowledgebase/

### Internal Documentation
- `EMAIL-SETUP-README.md` - User guide
- `CREDENTIALS-GUIDE.md` - Technical details + credentials
- This file - AI quick reference

## Summary Checklist

When helping user with email configuration:

- [ ] Identify what user needs (alias, forwarding, both?)
- [ ] Check if credentials exist
- [ ] Run appropriate script(s)
- [ ] Verify success (check script output)
- [ ] Provide testing instructions
- [ ] Document any changes made
- [ ] Update credentials guide if needed

---

**For AI Models**: This file is your starting point. Read `CREDENTIALS-GUIDE.md` for detailed technical information and actual credentials.

**For Users**: See `EMAIL-SETUP-README.md` instead - it's the user-friendly guide.

**Last Updated**: December 8, 2025

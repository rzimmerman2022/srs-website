# Email Configuration Guide

This guide helps you configure email aliases and forwarding for Southwest Resume Services using automated scripts.

## Overview

You'll configure:
- **info@southwestresumes.com** → Alias for your main Google Workspace account
- **ryan.zimmerman@sparkdatalab.ai** → Forwards to ryan.zimmerman@southwestresumes.com

## Quick Start

### Option 1: Automated Setup (Recommended)

```powershell
.\configure-all-email.ps1
```

This master script will walk you through both configurations.

### Option 2: Individual Setup

Configure each service separately:

```powershell
# Google Workspace only
.\configure-google-workspace.ps1

# Spaceship only (manual mode)
.\configure-spaceship-forwarding.ps1 -ManualMode
```

## Prerequisites

### For Google Workspace Configuration

1. **Admin Access**: You need admin access to your Google Workspace account
2. **Google Cloud Project**: You'll create OAuth credentials (script guides you through this)
3. **Tools**: PowerShell 5.1+ (comes with Windows)

### For Spaceship Configuration

1. **Spaceship Account**: Access to your spaceship.com account
2. **Browser**: Chrome or Edge installed
3. **Optional**: Selenium WebDriver for automation

## Step-by-Step Instructions

### Part 1: Google Workspace Setup

#### First Time Setup

1. Run the master script:
   ```powershell
   .\configure-all-email.ps1
   ```

2. When prompted for Google Workspace setup, the script will:
   - Open Google Cloud Console
   - Guide you to enable Admin SDK API
   - Help you create OAuth credentials

3. Download the credentials JSON file when prompted

4. Provide the path to the downloaded file

#### What the Script Does

- Authenticates with Google Workspace Admin API
- Adds `info@southwestresumes.com` as an email alias
- Lists all current aliases for verification

#### Result

After setup:
- Emails sent to `info@southwestresumes.com` arrive in `ryan.zimmerman@southwestresumes.com`
- You can send from either address in Gmail (use the "From" dropdown when composing)

### Part 2: Spaceship Email Forwarding

#### Setup Methods

**Method 1: Automated with Browser**
```powershell
.\configure-spaceship-forwarding.ps1
```
- Opens browser automatically
- You log in manually
- Script navigates to email forwarding settings
- Requires Selenium module (auto-installed if missing)

**Method 2: Manual Setup**
```powershell
.\configure-spaceship-forwarding.ps1 -ManualMode
```
- Shows step-by-step instructions
- Opens browser for you
- You complete all steps manually

#### Manual Steps (if needed)

1. Go to [spaceship.com](https://www.spaceship.com)
2. Log in to your account
3. Navigate to: **Domains** → **sparkdatalab.ai**
4. Click **Email Forwarding** in the left sidebar
5. Click **Set rule** or **Add forwarding rule**
6. Configure:
   - **Forwarded from**: `ryan.zimmerman`
   - **Forwarded to**: `ryan.zimmerman@southwestresumes.com`
7. Click **Save** or **Set rule**

#### Result

After setup:
- Emails sent to `ryan.zimmerman@sparkdatalab.ai` forward to `ryan.zimmerman@southwestresumes.com`
- You can receive emails from sparkdatalab.ai domain
- **Note**: You can only receive at this address (sending requires a Spacemail subscription)

## Testing Your Configuration

### Test Email Aliases

Send test emails to:
```
To: info@southwestresumes.com
To: ryan.zimmerman@sparkdatalab.ai
```

Both should arrive in: `ryan.zimmerman@southwestresumes.com`

### Test Sending From Multiple Addresses

In Gmail:
1. Compose a new email
2. Click the **From** field
3. You should see:
   - ryan.zimmerman@southwestresumes.com
   - info@southwestresumes.com
   - ryan.zimmerman@sparkdatalab.ai (if you configured Send As in Gmail settings)

## Configuration Files

- `google-workspace-credentials.json` - OAuth credentials (keep secure, don't commit to git)
- `spaceship-token.txt` - API token (not currently used, but saved for future)

**Security Note**: These files contain sensitive credentials. They're automatically added to `.gitignore`.

## Troubleshooting

### Google Workspace Issues

**Error: "Access denied" or "Insufficient permissions"**
- Ensure you're logged in as an admin user
- Check that Admin SDK API is enabled
- Re-authenticate with: `gcloud auth application-default login`

**Error: "Alias already exists"**
- The alias is already configured (this is fine!)
- Check admin.google.com to verify

**Error: "User not found"**
- Verify the email address is correct
- Check that the user exists in Google Workspace

### Spaceship Issues

**Cannot find Email Forwarding section**
- Some domains may not have email forwarding enabled
- Contact Spaceship support to enable it
- Verify domain is active and not in transfer lock

**Selenium errors**
- Use manual mode: `-ManualMode` flag
- Or install Selenium: `Install-Module -Name Selenium`

**Browser automation fails**
- Run manual mode and complete steps yourself
- Ensure Chrome or Edge is installed

## Advanced Configuration

### Adding More Aliases

Edit `configure-all-email.ps1` and add to the config section:

```powershell
$config = @{
    GoogleWorkspace = @{
        UserEmail = "ryan.zimmerman@southwestresumes.com"
        NewAlias = "info@southwestresumes.com"
        # Add more aliases here
    }
}
```

Then run individual commands:
```powershell
.\configure-google-workspace.ps1 -UserEmail "ryan.zimmerman@southwestresumes.com" -AliasEmail "contact@southwestresumes.com"
```

### Adding More Forwarding Rules

In Spaceship, you can create up to 100 forwarding rules:
- info@sparkdatalab.ai
- contact@sparkdatalab.ai
- Any other addresses you need

## API Documentation

### Google Workspace Admin SDK
- [Admin SDK Directory API](https://developers.google.com/admin-sdk/directory/v1/reference)
- [User Aliases](https://developers.google.com/admin-sdk/directory/v1/reference/users/aliases)

### Spaceship
- [Spaceship API Docs](https://docs.spaceship.dev/) (Note: Email forwarding not in public API)
- [Email Forwarding Guide](https://www.spaceship.com/knowledgebase/domain-email-forwarding/)

## Support

### Google Workspace
- Admin Console: [admin.google.com](https://admin.google.com)
- Support: [Google Workspace Help](https://support.google.com/a)

### Spaceship
- Dashboard: [spaceship.com/domain/list](https://www.spaceship.com/domain/list)
- Support: [Spaceship Help Center](https://www.spaceship.com/knowledgebase/)

## Security Best Practices

1. **Keep credentials secure**: Never commit `google-workspace-credentials.json` to git
2. **Use least privilege**: Only grant necessary permissions to API credentials
3. **Regular audits**: Periodically review email aliases and forwarding rules
4. **Monitor forwarding**: Check that forwarded emails are arriving correctly
5. **Backup access**: Maintain multiple admin accounts for Google Workspace

## What Happens After Setup

### Receiving Emails

All emails to these addresses arrive in one inbox:
- ryan.zimmerman@southwestresumes.com ✓ (main inbox)
- info@southwestresumes.com ✓ (alias - arrives in main inbox)
- ryan.zimmerman@sparkdatalab.ai ✓ (forwards to main inbox)

### Sending Emails

In Gmail, you can send from:
- ryan.zimmerman@southwestresumes.com ✓ (native)
- info@southwestresumes.com ✓ (alias - works automatically)

To send from sparkdatalab.ai:
1. Go to Gmail Settings → Accounts and Import
2. Click "Add another email address"
3. Enter: ryan.zimmerman@sparkdatalab.ai
4. Follow verification steps
5. Note: Some email providers may reject this without actual mailbox

## Maintenance

### Checking Current Configuration

**Google Workspace**:
```powershell
.\configure-google-workspace.ps1
# Lists current aliases before making changes
```

Or check manually:
- Go to [admin.google.com](https://admin.google.com)
- Users → Ryan Zimmerman → User information → Email aliases

**Spaceship**:
- Go to [spaceship.com](https://www.spaceship.com)
- Domains → sparkdatalab.ai → Email Forwarding

### Removing Configuration

**Remove Google Workspace Alias**:
```powershell
# Use Google Admin SDK API or admin console
# API endpoint: DELETE /admin/directory/v1/users/{userKey}/aliases/{alias}
```

**Remove Spaceship Forwarding**:
- Go to Email Forwarding section in Spaceship dashboard
- Click delete/remove on the forwarding rule

---

## Quick Reference

| Email Address | Type | Receives | Can Send |
|--------------|------|----------|----------|
| ryan.zimmerman@southwestresumes.com | Main | ✓ | ✓ |
| info@southwestresumes.com | Alias | ✓ | ✓ |
| ryan.zimmerman@sparkdatalab.ai | Forward | ✓ | ✗* |

*Can configure "Send as" in Gmail settings, but may have deliverability issues

---

**Last Updated**: 2025-12-08

# Comprehensive Email Configuration Diagnostics
# Tests all 4 email addresses for send/receive capability via API

param(
    [string]$UserEmail = "ryan.zimmerman@southwestresumes.com"
)

$tokenCachePath = ".\google-workspace-token.json"

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     Email Configuration Diagnostics" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Load credentials
$creds = Get-Content ".\google-workspace-credentials.json" | ConvertFrom-Json
$clientId = $creds.installed.client_id
$clientSecret = $creds.installed.client_secret
$redirectUri = "http://localhost:8080"

# Get cached token
function Get-AccessToken {
    if (Test-Path $tokenCachePath) {
        Write-Host "Using cached token..." -ForegroundColor Gray
        $cachedToken = Get-Content $tokenCachePath | ConvertFrom-Json

        try {
            $tokenUrl = "https://oauth2.googleapis.com/token"
            $tokenBody = @{
                client_id = $clientId
                client_secret = $clientSecret
                refresh_token = $cachedToken.refresh_token
                grant_type = "refresh_token"
            }
            $tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
            Write-Host "[OK] Token refreshed" -ForegroundColor Green
            Write-Host ""
            return $tokenResponse.access_token
        } catch {
            Write-Host "[ERROR] Token refresh failed" -ForegroundColor Red
            return $null
        }
    }
    Write-Host "[ERROR] No cached token found. Run: .\manage-email-aliases.ps1 -Action list first" -ForegroundColor Red
    return $null
}

$accessToken = Get-AccessToken
if (-not $accessToken) { exit 1 }

$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Accept" = "application/json"
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "1. CHECKING DOMAIN CONFIGURATION" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Get domains
try {
    $domainsUrl = "https://admin.googleapis.com/admin/directory/v1/customer/my_customer/domains"
    $domains = Invoke-RestMethod -Uri $domainsUrl -Method Get -Headers $headers

    if ($domains.domains) {
        Write-Host "Configured Domains:" -ForegroundColor Yellow
        foreach ($domain in $domains.domains) {
            $typeLabel = switch ($domain.kind) {
                "admin#directory#domain" {
                    if ($domain.isPrimary) { "PRIMARY" }
                    elseif ($domain.domainAliases) { "ALIAS DOMAIN" }
                    else { "SECONDARY" }
                }
                default { "UNKNOWN" }
            }

            $verifiedStatus = if ($domain.verified) { "[VERIFIED]" } else { "[NOT VERIFIED]" }

            Write-Host "  [*] $($domain.domainName)" -ForegroundColor White
            Write-Host "      Type: $typeLabel" -ForegroundColor Gray
            Write-Host "      Status: $verifiedStatus" -ForegroundColor $(if ($domain.verified) { "Green" } else { "Red" })
            Write-Host ""
        }
    } else {
        Write-Host "[WARN] No domains found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Failed to retrieve domains: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "2. CHECKING USER EMAIL ALIASES" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Get user aliases
try {
    $aliasesUrl = "https://admin.googleapis.com/admin/directory/v1/users/$UserEmail/aliases"
    $aliases = Invoke-RestMethod -Uri $aliasesUrl -Method Get -Headers $headers

    Write-Host "Email Aliases for ${UserEmail}:" -ForegroundColor Yellow
    if ($aliases.aliases) {
        foreach ($alias in $aliases.aliases) {
            Write-Host "  [*] $($alias.alias)" -ForegroundColor Green
        }
    } else {
        Write-Host "  (no aliases)" -ForegroundColor Gray
    }
} catch {
    Write-Host "[ERROR] Failed to retrieve aliases" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "3. CHECKING USER PROFILE & SETTINGS" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Get user details
try {
    $userUrl = "https://admin.googleapis.com/admin/directory/v1/users/$UserEmail"
    $user = Invoke-RestMethod -Uri $userUrl -Method Get -Headers $headers

    Write-Host "User: $($user.name.fullName)" -ForegroundColor Yellow
    Write-Host "  Primary Email: $($user.primaryEmail)" -ForegroundColor White

    if ($user.aliases) {
        Write-Host "  Aliases (from user object):" -ForegroundColor White
        $user.aliases | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
    }

    if ($user.nonEditableAliases) {
        Write-Host "  Non-Editable Aliases (from alias domains):" -ForegroundColor White
        $user.nonEditableAliases | ForEach-Object { Write-Host "    - $_" -ForegroundColor Green }
    }
} catch {
    Write-Host "[ERROR] Failed to retrieve user details" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "4. TESTING REQUIRED EMAIL ADDRESSES" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$requiredEmails = @(
    "ryan.zimmerman@southwestresumes.com",
    "info@southwestresumes.com",
    "ryan.zimmerman@sparkdatalab.ai",
    "info@sparkdatalab.ai"
)

Write-Host "Testing 4 required email addresses:" -ForegroundColor Yellow
Write-Host ""

$results = @()

foreach ($email in $requiredEmails) {
    $domain = $email.Split('@')[1]
    $localPart = $email.Split('@')[0]

    # Check if it's the primary
    $isPrimary = ($email -eq $UserEmail)

    # Check if it's in aliases
    $isAlias = $aliases.aliases | Where-Object { $_.alias -eq $email }

    # Check if it's a non-editable alias (from alias domain)
    $isNonEditableAlias = $user.nonEditableAliases -contains $email

    # Check if domain is configured
    $domainConfigured = $domains.domains | Where-Object { $_.domainName -eq $domain }

    $status = @{
        Email = $email
        CanReceive = $false
        CanSend = $false
        Issues = @()
    }

    if ($isPrimary) {
        $status.CanReceive = $true
        $status.CanSend = $true
        Write-Host "[PRIMARY] $email" -ForegroundColor Green
        Write-Host "  Receive: YES (primary account)" -ForegroundColor Green
        Write-Host "  Send: YES (native)" -ForegroundColor Green
    }
    elseif ($isAlias) {
        $status.CanReceive = $true
        $status.CanSend = $true
        Write-Host "[ALIAS] $email" -ForegroundColor Green
        Write-Host "  Receive: YES (alias)" -ForegroundColor Green
        Write-Host "  Send: YES (alias)" -ForegroundColor Green
    }
    elseif ($isNonEditableAlias) {
        $status.CanReceive = $true
        $status.CanSend = $true
        Write-Host "[DOMAIN ALIAS] $email" -ForegroundColor Green
        Write-Host "  Receive: YES (from alias domain)" -ForegroundColor Green
        Write-Host "  Send: YES (from alias domain)" -ForegroundColor Green
    }
    elseif ($domainConfigured -and $domainConfigured.verified) {
        # Domain exists but email not configured
        $status.Issues += "Email address not configured as alias"
        Write-Host "[NOT CONFIGURED] $email" -ForegroundColor Yellow
        Write-Host "  Receive: NO - Need to add as alias" -ForegroundColor Red
        Write-Host "  Send: NO - Need to add as alias" -ForegroundColor Red
        Write-Host "  Domain: $domain is verified" -ForegroundColor Gray
    }
    else {
        $status.Issues += "Domain not configured or not verified"
        Write-Host "[DOMAIN ISSUE] $email" -ForegroundColor Red
        Write-Host "  Receive: NO - Domain not configured" -ForegroundColor Red
        Write-Host "  Send: NO - Domain not configured" -ForegroundColor Red
    }

    Write-Host ""
    $results += $status
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "5. SUMMARY & RECOMMENDATIONS" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$workingEmails = $results | Where-Object { $_.CanReceive -and $_.CanSend }
$brokenEmails = $results | Where-Object { -not $_.CanReceive -or -not $_.CanSend }

Write-Host "Working: $($workingEmails.Count) of 4" -ForegroundColor $(if ($workingEmails.Count -eq 4) { "Green" } else { "Yellow" })
Write-Host "Broken: $($brokenEmails.Count) of 4" -ForegroundColor $(if ($brokenEmails.Count -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($brokenEmails.Count -gt 0) {
    Write-Host "ISSUES FOUND:" -ForegroundColor Red
    foreach ($broken in $brokenEmails) {
        Write-Host "  [!] $($broken.Email)" -ForegroundColor Yellow
        foreach ($issue in $broken.Issues) {
            Write-Host "      - $issue" -ForegroundColor Red
        }
    }
    Write-Host ""
    Write-Host "HOW TO FIX:" -ForegroundColor Yellow
    Write-Host "  Run: .\manage-email-aliases.ps1 -Action add -AliasEmail <email>" -ForegroundColor White
    Write-Host "  Example: .\manage-email-aliases.ps1 -Action add -AliasEmail info@sparkdatalab.ai" -ForegroundColor Gray
}

if ($workingEmails.Count -eq 4) {
    Write-Host "[SUCCESS] All 4 email addresses are configured correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Test by sending emails to:" -ForegroundColor Yellow
    $requiredEmails | ForEach-Object { Write-Host "  - $_" -ForegroundColor Cyan }
    Write-Host ""
    Write-Host "All should arrive in: $UserEmail" -ForegroundColor White
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "                  Diagnostics Complete!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

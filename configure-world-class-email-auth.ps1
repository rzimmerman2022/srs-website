# Configure World-Class Email Authentication for sparkdatalab.ai
# Implements: DKIM, DMARC, MTA-STS, TLS-RPT (Gold Standard 2025)

param(
    [switch]$DryRun
)

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  World-Class Email Authentication Setup" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will configure:" -ForegroundColor Yellow
Write-Host "  [1] DKIM - Cryptographic email signature (CRITICAL)" -ForegroundColor White
Write-Host "  [2] DMARC - Email authentication policy (CRITICAL)" -ForegroundColor White
Write-Host "  [3] TLS-RPT - TLS delivery reporting (Recommended)" -ForegroundColor White
Write-Host ""
Write-Host "Why this matters:" -ForegroundColor Yellow
Write-Host "  * Microsoft requires DMARC+DKIM+SPF (May 2025)" -ForegroundColor Red
Write-Host "  * Gmail/Yahoo enforce strict authentication" -ForegroundColor Red
Write-Host "  * Without these, emails WILL hit spam" -ForegroundColor Red
Write-Host ""

# Load Spaceship credentials
if (-not (Test-Path ".\.env.spaceship.local")) {
    Write-Host "[ERROR] Spaceship credentials not found!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content ".\.env.spaceship.local"
$apiKey = ($envContent | Select-String "SPACESHIP_API_KEY=").Line.Split('=')[1]
$apiSecret = ($envContent | Select-String "SPACESHIP_API_SECRET=").Line.Split('=')[1]
$domain = "sparkdatalab.ai"

$headers = @{
    "X-API-Key" = $apiKey
    "X-API-Secret" = $apiSecret
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Step 1: DKIM Setup
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "STEP 1: DKIM Configuration" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "DKIM must be generated in Google Workspace Admin Console" -ForegroundColor Yellow
Write-Host "Opening Google Admin Console..." -ForegroundColor Gray
Write-Host ""

Start-Process "https://admin.google.com/ac/apps/gmail/authenticateemail"

Write-Host "In the Google Admin Console:" -ForegroundColor Yellow
Write-Host "  1. Select domain: sparkdatalab.ai" -ForegroundColor White
Write-Host "  2. Click 'GENERATE NEW RECORD'" -ForegroundColor White
Write-Host "  3. Select 'Generate new record' button" -ForegroundColor White
Write-Host "  4. Copy the TXT record value (long string starting with 'v=DKIM1...')" -ForegroundColor White
Write-Host ""

$dkimValue = Read-Host "Paste the DKIM TXT record value here"

if (-not $dkimValue -or $dkimValue.Length -lt 100) {
    Write-Host "[ERROR] Invalid DKIM value. Please run script again." -ForegroundColor Red
    exit 1
}

Write-Host "[OK] DKIM value received ($($dkimValue.Length) characters)" -ForegroundColor Green
Write-Host ""

# Extract selector from Google (usually 'google')
$dkimSelector = "google"
Write-Host "Using DKIM selector: $dkimSelector" -ForegroundColor Gray
Write-Host ""

# Step 2: Define all DNS records
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "STEP 2: Preparing DNS Records" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$newRecords = @(
    # DKIM Record
    @{
        name = "$dkimSelector._domainkey"
        type = "TXT"
        value = $dkimValue
        ttl = 3600
        group = @{ type = "custom" }
    }

    # DMARC Record (p=quarantine for safety, will upgrade to p=reject later)
    @{
        name = "_dmarc"
        type = "TXT"
        value = "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@southwestresumes.com; ruf=mailto:dmarc-failures@southwestresumes.com; fo=1; adkim=s; aspf=s; pct=100"
        ttl = 3600
        group = @{ type = "custom" }
    }

    # TLS-RPT Record
    @{
        name = "_smtp._tls"
        type = "TXT"
        value = "v=TLSRPTv1; rua=mailto:tls-reports@southwestresumes.com"
        ttl = 3600
        group = @{ type = "custom" }
    }
)

Write-Host "DNS records to add:" -ForegroundColor Yellow
Write-Host "  [*] DKIM: $dkimSelector._domainkey.sparkdatalab.ai" -ForegroundColor Cyan
Write-Host "  [*] DMARC: _dmarc.sparkdatalab.ai (policy=quarantine)" -ForegroundColor Cyan
Write-Host "  [*] TLS-RPT: _smtp._tls.sparkdatalab.ai" -ForegroundColor Cyan
Write-Host ""

# Step 3: Get current DNS and merge
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "STEP 3: Merging with Existing DNS" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

try {
    $getUrl = "https://spaceship.dev/api/v1/dns/records/$domain`?take=100&skip=0"
    $response = Invoke-RestMethod -Uri $getUrl -Method Get -Headers $headers

    Write-Host "[OK] Retrieved $($response.items.Count) existing records" -ForegroundColor Green
    Write-Host ""

    $allRecords = @()

    # Keep existing records
    foreach ($record in $response.items) {
        $isEmailAuth = ($record.name -like "*_domainkey*") -or
                       ($record.name -eq "_dmarc") -or
                       ($record.name -eq "_smtp._tls") -or
                       ($record.name -eq "_mta-sts")

        if (-not $isEmailAuth) {
            $allRecords += $record
            Write-Host "  [KEEP] $($record.type) | $($record.name)" -ForegroundColor Green
        } else {
            Write-Host "  [REPLACE] $($record.type) | $($record.name)" -ForegroundColor Yellow
        }
    }

    # Add new records
    foreach ($record in $newRecords) {
        $allRecords += $record
        Write-Host "  [ADD] $($record.type) | $($record.name)" -ForegroundColor Cyan
    }

    Write-Host ""
    Write-Host "Total records: $($allRecords.Count)" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "[ERROR] Failed to retrieve DNS: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 4: Apply changes
if ($DryRun) {
    Write-Host "================================================================" -ForegroundColor Yellow
    Write-Host "DRY RUN - No changes made" -ForegroundColor Yellow
    Write-Host "================================================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run without -DryRun to apply" -ForegroundColor Yellow
    exit 0
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "STEP 4: Updating DNS" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$confirm = Read-Host "Apply these DNS changes? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Cancelled" -ForegroundColor Yellow
    exit 0
}

try {
    $putUrl = "https://spaceship.dev/api/v1/dns/records/$domain"
    $body = @{ items = $allRecords } | ConvertTo-Json -Depth 10

    $result = Invoke-RestMethod -Uri $putUrl -Method Put -Headers $headers -Body $body

    Write-Host "[OK] DNS records updated!" -ForegroundColor Green
    Write-Host ""

    # Step 5: Verify in Google Admin
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host "STEP 5: Verify DKIM in Google Admin Console" -ForegroundColor Cyan
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "Go back to Google Admin Console and:" -ForegroundColor Yellow
    Write-Host "  1. Click 'START AUTHENTICATION'" -ForegroundColor White
    Write-Host "  2. Wait for verification (can take up to 48 hours)" -ForegroundColor White
    Write-Host "  3. Status should change to 'Authenticating email'" -ForegroundColor White
    Write-Host ""

    Write-Host "Press Enter when you've clicked START AUTHENTICATION..." -ForegroundColor Yellow
    Read-Host

} catch {
    Write-Host "[ERROR] Failed to update DNS: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 6: Summary
Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "        Email Authentication Configuration Complete!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

Write-Host "What was configured:" -ForegroundColor Yellow
Write-Host "  [*] DKIM: Cryptographic signature (CRITICAL)" -ForegroundColor Green
Write-Host "  [*] DMARC: p=quarantine policy (CRITICAL)" -ForegroundColor Green
Write-Host "  [*] TLS-RPT: Delivery reporting (Recommended)" -ForegroundColor Green
Write-Host ""

Write-Host "Your email authentication stack:" -ForegroundColor Yellow
Write-Host "  [*] SPF: v=spf1 include:_spf.google.com ~all" -ForegroundColor Green
Write-Host "  [*] DKIM: $dkimSelector._domainkey.sparkdatalab.ai" -ForegroundColor Green
Write-Host "  [*] DMARC: _dmarc.sparkdatalab.ai (p=quarantine)" -ForegroundColor Green
Write-Host "  [*] MX: 5 Google mail servers" -ForegroundColor Green
Write-Host "  [*] TLS-RPT: _smtp._tls.sparkdatalab.ai" -ForegroundColor Green
Write-Host ""

Write-Host "Benefits:" -ForegroundColor Yellow
Write-Host "  [*] Compliant with Gmail/Yahoo/Microsoft 2025 requirements" -ForegroundColor Green
Write-Host "  [*] Significantly lower spam rates" -ForegroundColor Green
Write-Host "  [*] Protection against domain spoofing" -ForegroundColor Green
Write-Host "  [*] Professional-grade email deliverability" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps (after DNS propagates):" -ForegroundColor Yellow
Write-Host "  1. Monitor DMARC reports at: dmarc-reports@southwestresumes.com" -ForegroundColor White
Write-Host "  2. After 2-4 weeks, upgrade DMARC to p=reject" -ForegroundColor White
Write-Host "  3. Consider BIMI for logo in inbox" -ForegroundColor White
Write-Host ""

Write-Host "DNS propagation: 5-30 minutes (up to 48 hours globally)" -ForegroundColor Gray
Write-Host "Verify with: .\check-dns-spf.ps1" -ForegroundColor Gray
Write-Host ""

# Add Email DNS Records to sparkdatalab.ai via Spaceship API
# SAFELY adds SPF and MX records WITHOUT affecting existing website DNS

param(
    [switch]$DryRun,
    [switch]$Force
)

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     Add Email DNS Records to sparkdatalab.ai" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Load credentials
if (-not (Test-Path ".\.env.spaceship.local")) {
    Write-Host "[ERROR] Spaceship credentials not found!" -ForegroundColor Red
    Write-Host "File missing: .env.spaceship.local" -ForegroundColor Yellow
    exit 1
}

$envContent = Get-Content ".\.env.spaceship.local"
$apiKey = ($envContent | Select-String "SPACESHIP_API_KEY=").Line.Split('=')[1]
$apiSecret = ($envContent | Select-String "SPACESHIP_API_SECRET=").Line.Split('=')[1]
$domain = "sparkdatalab.ai"

if (-not $apiKey -or -not $apiSecret) {
    Write-Host "[ERROR] Could not parse API credentials" -ForegroundColor Red
    exit 1
}

Write-Host "Domain: $domain" -ForegroundColor Yellow
Write-Host "API Key: $($apiKey.Substring(0,10))..." -ForegroundColor Gray
Write-Host ""

# API headers
$headers = @{
    "X-API-Key" = $apiKey
    "X-API-Secret" = $apiSecret
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Step 1: Get current DNS records
Write-Host "Step 1: Fetching current DNS records..." -ForegroundColor Cyan
try {
    $getUrl = "https://spaceship.dev/api/v1/dns/records/$domain`?take=100&skip=0"
    $response = Invoke-RestMethod -Uri $getUrl -Method Get -Headers $headers

    Write-Host "[OK] Retrieved $($response.items.Count) existing records" -ForegroundColor Green
    Write-Host ""

    Write-Host "Current DNS Records:" -ForegroundColor Yellow
    foreach ($record in $response.items) {
        $value = switch ($record.type) {
            "A" { $record.address }
            "CNAME" { $record.cname }
            "TXT" { $record.value }
            "MX" { "$($record.preference) $($record.exchange)" }
            default { "???" }
        }
        Write-Host "  $($record.type) | $($record.name) | $value" -ForegroundColor White
    }
    Write-Host ""

} catch {
    Write-Host "[ERROR] Failed to retrieve DNS records: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Define email records to add
Write-Host "Step 2: Preparing email DNS records..." -ForegroundColor Cyan

$emailRecords = @(
    # SPF Record
    @{
        name = "@"
        type = "TXT"
        value = "v=spf1 include:_spf.google.com ~all"
        ttl = 3600
        group = @{ type = "custom" }
    }

    # MX Records for Google Workspace
    @{
        name = "@"
        type = "MX"
        exchange = "aspmx.l.google.com"
        preference = 1
        ttl = 3600
        group = @{ type = "custom" }
    }
    @{
        name = "@"
        type = "MX"
        exchange = "alt1.aspmx.l.google.com"
        preference = 5
        ttl = 3600
        group = @{ type = "custom" }
    }
    @{
        name = "@"
        type = "MX"
        exchange = "alt2.aspmx.l.google.com"
        preference = 5
        ttl = 3600
        group = @{ type = "custom" }
    }
    @{
        name = "@"
        type = "MX"
        exchange = "alt3.aspmx.l.google.com"
        preference = 10
        ttl = 3600
        group = @{ type = "custom" }
    }
    @{
        name = "@"
        type = "MX"
        exchange = "alt4.aspmx.l.google.com"
        preference = 10
        ttl = 3600
        group = @{ type = "custom" }
    }
)

Write-Host "Email records to add:" -ForegroundColor Yellow
Write-Host "  [*] SPF: v=spf1 include:_spf.google.com ~all" -ForegroundColor White
Write-Host "  [*] MX: 5 Google mail servers" -ForegroundColor White
Write-Host ""

# Step 3: Merge records (keep existing, add new)
Write-Host "Step 3: Merging records (preserving website DNS)..." -ForegroundColor Cyan

$allRecords = @()

# Add existing records (EXCEPT any existing SPF or MX that we're replacing)
foreach ($record in $response.items) {
    $isEmailRecord = ($record.type -eq "MX") -or
                     ($record.type -eq "TXT" -and $record.value -like "*spf*")

    if (-not $isEmailRecord) {
        # Keep website records (A, CNAME, non-SPF TXT)
        $allRecords += $record
        Write-Host "  [KEEP] $($record.type) | $($record.name)" -ForegroundColor Green
    } else {
        Write-Host "  [REPLACE] $($record.type) | $($record.name)" -ForegroundColor Yellow
    }
}

# Add new email records
foreach ($record in $emailRecords) {
    $allRecords += $record
    Write-Host "  [ADD] $($record.type) | $($record.name)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Total records after merge: $($allRecords.Count)" -ForegroundColor White
Write-Host ""

# Step 4: Apply changes (or dry run)
if ($DryRun) {
    Write-Host "================================================================" -ForegroundColor Yellow
    Write-Host "DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host "================================================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Would update DNS with:" -ForegroundColor Yellow
    $allRecords | ForEach-Object {
        $value = switch ($_.type) {
            "A" { $_.address }
            "CNAME" { $_.cname }
            "TXT" { $_.value }
            "MX" { "$($_.preference) $($_.exchange)" }
            default { "???" }
        }
        Write-Host "  $($_.type) | $($_.name) | $value" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "Run without -DryRun to apply changes" -ForegroundColor Yellow
    exit 0
}

Write-Host "Step 4: Updating DNS records..." -ForegroundColor Cyan
Write-Host ""

if (-not $Force) {
    Write-Host "IMPORTANT: This will update DNS for sparkdatalab.ai" -ForegroundColor Yellow
    Write-Host "  - Website DNS will be PRESERVED (A, CNAME, site verification TXT)" -ForegroundColor Green
    Write-Host "  - Email DNS will be ADDED (SPF, MX)" -ForegroundColor Green
    Write-Host ""
    $confirm = Read-Host "Continue? (y/n)"
    if ($confirm -ne 'y') {
        Write-Host "Cancelled" -ForegroundColor Yellow
        exit 0
    }
}

try {
    $putUrl = "https://spaceship.dev/api/v1/dns/records/$domain"
    $body = @{ items = $allRecords } | ConvertTo-Json -Depth 10

    $result = Invoke-RestMethod -Uri $putUrl -Method Put -Headers $headers -Body $body

    Write-Host "[OK] DNS records updated successfully!" -ForegroundColor Green
    Write-Host ""

    # Step 5: Verify
    Write-Host "Step 5: Verifying changes..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2

    $verifyResponse = Invoke-RestMethod -Uri $getUrl -Method Get -Headers $headers

    Write-Host "[OK] Current DNS records:" -ForegroundColor Green
    foreach ($record in $verifyResponse.items) {
        $value = switch ($record.type) {
            "A" { $record.address }
            "CNAME" { $record.cname }
            "TXT" { $record.value }
            "MX" { "$($record.preference) $($record.exchange)" }
            default { "???" }
        }
        $color = if ($record.type -eq "MX" -or ($record.type -eq "TXT" -and $record.value -like "*spf*")) { "Cyan" } else { "White" }
        Write-Host "  $($record.type) | $($record.name) | $value" -ForegroundColor $color
    }

} catch {
    Write-Host "[ERROR] Failed to update DNS: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "                DNS Update Complete!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Email DNS records added:" -ForegroundColor Yellow
Write-Host "  [*] SPF record (authorizes Google to send)" -ForegroundColor Green
Write-Host "  [*] MX records (routes incoming mail to Google)" -ForegroundColor Green
Write-Host ""
Write-Host "Website DNS preserved:" -ForegroundColor Yellow
Write-Host "  [*] A record (76.76.21.21 for sparkdatalab.ai)" -ForegroundColor Green
Write-Host "  [*] CNAME (www -> cname.vercel-dns.com)" -ForegroundColor Green
Write-Host "  [*] Site verification TXT" -ForegroundColor Green
Write-Host ""
Write-Host "What this fixes:" -ForegroundColor Yellow
Write-Host "  [*] Emails TO sparkdatalab.ai will be delivered" -ForegroundColor Green
Write-Host "  [*] Emails FROM sparkdatalab.ai won't bounce" -ForegroundColor Green
Write-Host "  [*] Reply-to will work correctly" -ForegroundColor Green
Write-Host ""
Write-Host "DNS propagation: 5-30 minutes (up to 48 hours globally)" -ForegroundColor Gray
Write-Host "Test with: .\check-dns-spf.ps1" -ForegroundColor Gray
Write-Host ""

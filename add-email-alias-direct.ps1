# Direct Google Workspace API call using OAuth credentials
param(
    [string]$UserEmail = "ryan.zimmerman@southwestresumes.com",
    [string]$AliasEmail = "info@southwestresumes.com"
)

Write-Host "=== Adding Email Alias via Direct API Call ===" -ForegroundColor Cyan
Write-Host ""

# Read OAuth credentials
$creds = Get-Content ".\google-workspace-credentials.json" | ConvertFrom-Json
$clientId = $creds.installed.client_id
$clientSecret = $creds.installed.client_secret
$projectId = $creds.installed.project_id

Write-Host "Project: $projectId" -ForegroundColor Gray
Write-Host "Client ID: $clientId" -ForegroundColor Gray
Write-Host ""

# Build authorization URL
$scope = "https://www.googleapis.com/auth/admin.directory.user"
$redirectUri = "http://localhost:8080"

$authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
           "client_id=$clientId&" +
           "redirect_uri=$([uri]::EscapeDataString($redirectUri))&" +
           "response_type=code&" +
           "scope=$([uri]::EscapeDataString($scope))&" +
           "access_type=offline&" +
           "prompt=consent"

Write-Host "Step 1: Authenticate with Google" -ForegroundColor Yellow
Write-Host "Opening browser for authorization..." -ForegroundColor Gray
Write-Host ""
Start-Process $authUrl

Write-Host "After authorizing in your browser:" -ForegroundColor Yellow
Write-Host "1. You'll be redirected to a URL like:" -ForegroundColor White
Write-Host "   http://localhost:8080/?code=XXXXXXX" -ForegroundColor Gray
Write-Host "2. Copy everything after 'code=' (before any '&' symbol)" -ForegroundColor White
Write-Host ""

$authCode = Read-Host "Paste the authorization code here"

if (-not $authCode) {
    Write-Host "No authorization code provided. Exiting." -ForegroundColor Red
    exit
}

# Clean up the code (remove any URL parameters after it)
$authCode = ($authCode -split '&')[0]
$authCode = $authCode.Trim()

Write-Host ""
Write-Host "Step 2: Exchange code for access token" -ForegroundColor Yellow

try {
    $tokenUrl = "https://oauth2.googleapis.com/token"
    $tokenBody = @{
        code = $authCode
        client_id = $clientId
        client_secret = $clientSecret
        redirect_uri = $redirectUri
        grant_type = "authorization_code"
    }

    $tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
    $accessToken = $tokenResponse.access_token

    Write-Host "[OK] Access token obtained!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to get access token:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

Write-Host "Step 3: Check current aliases" -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "Accept" = "application/json"
    }

    $listUrl = "https://admin.googleapis.com/admin/directory/v1/users/$UserEmail/aliases"

    try {
        $currentAliases = Invoke-RestMethod -Uri $listUrl -Method Get -Headers $headers
        Write-Host "Current aliases:" -ForegroundColor Gray
        if ($currentAliases.aliases) {
            $currentAliases.aliases | ForEach-Object { Write-Host "  - $($_.alias)" -ForegroundColor White }
        } else {
            Write-Host "  (none)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  Could not retrieve current aliases" -ForegroundColor Gray
    }

    Write-Host ""
} catch {
    # Continue even if we can't list aliases
}

Write-Host "Step 4: Add new alias: $AliasEmail" -ForegroundColor Yellow

try {
    $addUrl = "https://admin.googleapis.com/admin/directory/v1/users/$UserEmail/aliases"
    $body = @{
        alias = $AliasEmail
    } | ConvertTo-Json

    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }

    $result = Invoke-RestMethod -Uri $addUrl -Method Post -Headers $headers -Body $body

    Write-Host "[OK] Alias added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Alias details:" -ForegroundColor Gray
    Write-Host "  Email: $($result.alias)" -ForegroundColor White
    Write-Host "  ID: $($result.id)" -ForegroundColor Gray
    Write-Host ""

} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue

    if ($errorDetails.error.message -like "*already exists*" -or $_.Exception.Response.StatusCode -eq 409) {
        Write-Host "[OK] Alias already exists!" -ForegroundColor Yellow
        Write-Host "The alias $AliasEmail is already configured for $UserEmail" -ForegroundColor Gray
    } else {
        Write-Host "[ERROR] Failed to add alias:" -ForegroundColor Red
        if ($errorDetails) {
            Write-Host "  Error: $($errorDetails.error.message)" -ForegroundColor Red
            Write-Host "  Code: $($errorDetails.error.code)" -ForegroundColor Gray
        } else {
            Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
        }
        exit
    }
    Write-Host ""
}

Write-Host "Step 5: Verify configuration" -ForegroundColor Yellow

try {
    $updatedAliases = Invoke-RestMethod -Uri $listUrl -Method Get -Headers $headers
    Write-Host "All aliases for ${UserEmail}:" -ForegroundColor Gray
    if ($updatedAliases.aliases) {
        $updatedAliases.aliases | ForEach-Object { Write-Host "  [*] $($_.alias)" -ForegroundColor Green }
    }
    Write-Host ""
} catch {
    Write-Host "  Could not verify aliases" -ForegroundColor Gray
}

Write-Host "================================================================" -ForegroundColor Green
Write-Host "                   Configuration Complete!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Emails sent to $AliasEmail will now arrive in $UserEmail" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Send a test email to: $AliasEmail" -ForegroundColor White
Write-Host "  2. Check your inbox at: $UserEmail" -ForegroundColor White
Write-Host "  3. In Gmail, you can send from either address" -ForegroundColor White
Write-Host ""

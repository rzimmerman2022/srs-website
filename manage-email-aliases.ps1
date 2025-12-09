# Email Alias Management Tool - List, Add, Remove, Test
# Complete CLI management for Google Workspace email aliases
# WITH TOKEN CACHING - No need to authenticate every time!

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('list', 'add', 'remove', 'test')]
    [string]$Action = 'list',

    [string]$UserEmail = "ryan.zimmerman@southwestresumes.com",
    [string]$AliasEmail = ""
)

$tokenCachePath = ".\google-workspace-token.json"

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     Google Workspace Email Alias Management Tool" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Check if credentials exist
if (-not (Test-Path ".\google-workspace-credentials.json")) {
    Write-Host "[ERROR] Credentials file not found!" -ForegroundColor Red
    Write-Host "Please run: .\configure-all-email.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Read OAuth credentials
$creds = Get-Content ".\google-workspace-credentials.json" | ConvertFrom-Json
$clientId = $creds.installed.client_id
$clientSecret = $creds.installed.client_secret
$redirectUri = "http://localhost:8080"

# Function to refresh access token using refresh token
function Get-RefreshedAccessToken {
    param([string]$RefreshToken)

    try {
        $tokenUrl = "https://oauth2.googleapis.com/token"
        $tokenBody = @{
            client_id = $clientId
            client_secret = $clientSecret
            refresh_token = $RefreshToken
            grant_type = "refresh_token"
        }

        $tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
        return $tokenResponse.access_token
    } catch {
        return $null
    }
}

# Function to get OAuth access token with local server
function Get-AccessToken {
    Write-Host "Authenticating with Google..." -ForegroundColor Yellow

    # Check if we have a cached refresh token
    if (Test-Path $tokenCachePath) {
        Write-Host "Found cached token, attempting to refresh..." -ForegroundColor Gray
        $cachedToken = Get-Content $tokenCachePath | ConvertFrom-Json

        $accessToken = Get-RefreshedAccessToken -RefreshToken $cachedToken.refresh_token

        if ($accessToken) {
            Write-Host "[OK] Token refreshed successfully (no browser needed!)" -ForegroundColor Green
            Write-Host ""
            return $accessToken
        } else {
            Write-Host "[WARN] Cached token expired, need to re-authenticate" -ForegroundColor Yellow
        }
    }

    # Build authorization URL
    $scope = "https://www.googleapis.com/auth/admin.directory.user"
    $authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
               "client_id=$clientId&" +
               "redirect_uri=$([uri]::EscapeDataString($redirectUri))&" +
               "response_type=code&" +
               "scope=$([uri]::EscapeDataString($scope))&" +
               "access_type=offline&" +
               "prompt=consent"

    # Start HTTP listener
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("$redirectUri/")

    try {
        $listener.Start()
        Write-Host "Opening browser for authorization..." -ForegroundColor Gray
        Start-Process $authUrl

        # Wait for callback
        $context = $listener.GetContext()
        $code = $context.Request.QueryString["code"]

        # Send response to browser
        $html = "<html><body><h1 style='color:green'>[OK] Success!</h1><p>You can close this window.</p></body></html>"
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
        $context.Response.ContentLength64 = $buffer.Length
        $context.Response.OutputStream.Write($buffer, 0, $buffer.Length)
        $context.Response.OutputStream.Close()

        if (-not $code) {
            throw "No authorization code received"
        }

        Write-Host "[OK] Authorization code received" -ForegroundColor Green

        # Exchange code for token (with refresh token)
        $tokenUrl = "https://oauth2.googleapis.com/token"
        $tokenBody = @{
            code = $code
            client_id = $clientId
            client_secret = $clientSecret
            redirect_uri = $redirectUri
            grant_type = "authorization_code"
        }

        $tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $tokenBody -ContentType "application/x-www-form-urlencoded"

        # Cache the refresh token
        if ($tokenResponse.refresh_token) {
            $tokenResponse | ConvertTo-Json | Out-File $tokenCachePath
            Write-Host "[OK] Token cached for future use" -ForegroundColor Green
        }

        Write-Host "[OK] Access token obtained" -ForegroundColor Green
        Write-Host ""

        return $tokenResponse.access_token

    } catch {
        Write-Host "[ERROR] Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    } finally {
        $listener.Stop()
        $listener.Close()
    }
}

# Function to list all aliases
function Get-Aliases {
    param([string]$Token, [string]$User)

    $headers = @{
        "Authorization" = "Bearer $Token"
        "Accept" = "application/json"
    }

    $url = "https://admin.googleapis.com/admin/directory/v1/users/$User/aliases"

    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        return $response.aliases
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            return @()
        }
        throw
    }
}

# Function to add alias
function Add-Alias {
    param([string]$Token, [string]$User, [string]$Alias)

    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }

    $url = "https://admin.googleapis.com/admin/directory/v1/users/$User/aliases"
    $body = @{ alias = $Alias } | ConvertTo-Json

    try {
        $result = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
        return $result
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            return "EXISTS"
        }
        throw
    }
}

# Function to remove alias
function Remove-Alias {
    param([string]$Token, [string]$User, [string]$Alias)

    $headers = @{
        "Authorization" = "Bearer $Token"
    }

    $url = "https://admin.googleapis.com/admin/directory/v1/users/$User/aliases/$Alias"

    try {
        Invoke-RestMethod -Uri $url -Method Delete -Headers $headers
        return $true
    } catch {
        return $false
    }
}

# Main execution
try {
    # Get access token (uses cache if available)
    $accessToken = Get-AccessToken

    if (-not $accessToken) {
        Write-Host "Failed to authenticate. Exiting." -ForegroundColor Red
        exit 1
    }

    # Execute action
    switch ($Action) {
        'list' {
            Write-Host "Email Aliases for: $UserEmail" -ForegroundColor Cyan
            Write-Host "================================================================" -ForegroundColor Gray
            Write-Host ""

            $aliases = Get-Aliases -Token $accessToken -User $UserEmail

            if ($aliases) {
                Write-Host "Found $($aliases.Count) alias(es):" -ForegroundColor Green
                Write-Host ""
                $aliases | ForEach-Object {
                    Write-Host "  [*] $($_.alias)" -ForegroundColor White
                    Write-Host "      ID: $($_.id)" -ForegroundColor Gray
                    Write-Host ""
                }
            } else {
                Write-Host "No aliases found" -ForegroundColor Yellow
            }

            Write-Host "NOTE: sparkdatalab.ai aliases may be configured as:" -ForegroundColor Yellow
            Write-Host "  - Alias domain (check Google Admin Console)" -ForegroundColor Gray
            Write-Host "  - Gmail 'Send As' settings (check Gmail settings)" -ForegroundColor Gray
        }

        'add' {
            if (-not $AliasEmail) {
                Write-Host "[ERROR] Please provide -AliasEmail parameter" -ForegroundColor Red
                Write-Host "Example: .\manage-email-aliases.ps1 -Action add -AliasEmail contact@southwestresumes.com" -ForegroundColor Yellow
                exit 1
            }

            Write-Host "Adding alias: $AliasEmail" -ForegroundColor Cyan
            Write-Host ""

            $result = Add-Alias -Token $accessToken -User $UserEmail -Alias $AliasEmail

            if ($result -eq "EXISTS") {
                Write-Host "[OK] Alias already exists: $AliasEmail" -ForegroundColor Yellow
            } else {
                Write-Host "[OK] Alias added successfully!" -ForegroundColor Green
                Write-Host "  Email: $($result.alias)" -ForegroundColor White
                Write-Host "  ID: $($result.id)" -ForegroundColor Gray
            }

            Write-Host ""
            Write-Host "Current aliases:" -ForegroundColor Cyan
            $aliases = Get-Aliases -Token $accessToken -User $UserEmail
            $aliases | ForEach-Object { Write-Host "  [*] $($_.alias)" -ForegroundColor White }
        }

        'remove' {
            if (-not $AliasEmail) {
                Write-Host "[ERROR] Please provide -AliasEmail parameter" -ForegroundColor Red
                Write-Host "Example: .\manage-email-aliases.ps1 -Action remove -AliasEmail old@southwestresumes.com" -ForegroundColor Yellow
                exit 1
            }

            Write-Host "Removing alias: $AliasEmail" -ForegroundColor Cyan
            Write-Host ""

            $confirm = Read-Host "Are you sure you want to remove this alias? (y/n)"
            if ($confirm -ne 'y') {
                Write-Host "Cancelled" -ForegroundColor Yellow
                exit 0
            }

            $result = Remove-Alias -Token $accessToken -User $UserEmail -Alias $AliasEmail

            if ($result) {
                Write-Host "[OK] Alias removed: $AliasEmail" -ForegroundColor Green
            } else {
                Write-Host "[ERROR] Failed to remove alias (may not exist)" -ForegroundColor Red
            }

            Write-Host ""
            Write-Host "Remaining aliases:" -ForegroundColor Cyan
            $aliases = Get-Aliases -Token $accessToken -User $UserEmail
            if ($aliases) {
                $aliases | ForEach-Object { Write-Host "  [*] $($_.alias)" -ForegroundColor White }
            } else {
                Write-Host "  (none)" -ForegroundColor Gray
            }
        }

        'test' {
            Write-Host "Testing Email Configuration" -ForegroundColor Cyan
            Write-Host "================================================================" -ForegroundColor Gray
            Write-Host ""

            Write-Host "Primary Account:" -ForegroundColor Yellow
            Write-Host "  $UserEmail" -ForegroundColor White
            Write-Host ""

            Write-Host "Configured Aliases (via Google Workspace):" -ForegroundColor Yellow
            $aliases = Get-Aliases -Token $accessToken -User $UserEmail

            if ($aliases) {
                $aliases | ForEach-Object {
                    Write-Host "  [*] $($_.alias)" -ForegroundColor Green
                }
            } else {
                Write-Host "  (none)" -ForegroundColor Gray
            }

            Write-Host ""
            Write-Host "IMPORTANT: Check for sparkdatalab.ai addresses" -ForegroundColor Yellow
            Write-Host "If sparkdatalab.ai addresses don't appear above:" -ForegroundColor Gray
            Write-Host "  1. They may be configured as an alias domain" -ForegroundColor White
            Write-Host "  2. Or in Gmail Settings -> Accounts -> Send mail as" -ForegroundColor White
            Write-Host ""
            Write-Host "To verify receiving at sparkdatalab.ai:" -ForegroundColor Yellow
            Write-Host "  - Send test email to: ryan.zimmerman@sparkdatalab.ai" -ForegroundColor White
            Write-Host "  - Check if it arrives in: $UserEmail" -ForegroundColor White
            Write-Host ""
            Write-Host "To verify sending from sparkdatalab.ai:" -ForegroundColor Yellow
            Write-Host "  - Gmail -> Compose -> Click 'From' dropdown" -ForegroundColor White
            Write-Host "  - Check if sparkdatalab.ai addresses appear" -ForegroundColor White
            Write-Host ""
            Write-Host "If replies to sparkdatalab.ai bounce:" -ForegroundColor Yellow
            Write-Host "  - Check SPF/DKIM records for sparkdatalab.ai domain" -ForegroundColor White
            Write-Host "  - Verify alias domain setup in Google Admin Console" -ForegroundColor White
        }
    }

    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "                       Complete!" -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "[ERROR] An error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    exit 1
}

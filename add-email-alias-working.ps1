# Working Google Workspace API Email Alias Configuration
# Uses a temporary local HTTP server to catch OAuth callback

param(
    [string]$UserEmail = "ryan.zimmerman@southwestresumes.com",
    [string]$AliasEmail = "info@southwestresumes.com"
)

Write-Host "=== Google Workspace Email Alias API Setup ===" -ForegroundColor Cyan
Write-Host ""

# Read OAuth credentials
$creds = Get-Content ".\google-workspace-credentials.json" | ConvertFrom-Json
$clientId = $creds.installed.client_id
$clientSecret = $creds.installed.client_secret
$redirectUri = "http://localhost:8080"

Write-Host "Project: $($creds.installed.project_id)" -ForegroundColor Gray
Write-Host ""

# Function to start HTTP listener and get OAuth code
function Get-OAuthCode {
    param(
        [string]$AuthUrl
    )

    Write-Host "Starting local HTTP server on port 8080..." -ForegroundColor Yellow

    # Create HTTP listener
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("$redirectUri/")

    try {
        $listener.Start()
        Write-Host "[OK] Server started!" -ForegroundColor Green
        Write-Host ""

        # Open browser
        Write-Host "Opening browser for authentication..." -ForegroundColor Yellow
        Start-Process $AuthUrl

        Write-Host "Waiting for authorization..." -ForegroundColor Gray
        Write-Host "(This will happen automatically when you approve in the browser)" -ForegroundColor Gray
        Write-Host ""

        # Wait for incoming request (with timeout)
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Extract code from query string
        $code = $request.QueryString["code"]

        if ($code) {
            Write-Host "[OK] Authorization code received!" -ForegroundColor Green

            # Send success page back to browser
            $html = @"
<!DOCTYPE html>
<html>
<head>
    <title>Authorization Complete</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f0f0; }
        .success { background: #4CAF50; color: white; padding: 20px; border-radius: 10px; display: inline-block; }
        h1 { margin: 0 0 10px 0; }
    </style>
</head>
<body>
    <div class="success">
        <h1>✓ Authorization Successful!</h1>
        <p>You can close this window and return to the terminal.</p>
    </div>
</body>
</html>
"@
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
            $response.ContentLength64 = $buffer.Length
            $response.ContentType = "text/html"
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()

            return $code
        } else {
            Write-Host "[ERROR] No authorization code received" -ForegroundColor Red

            # Send error page
            $html = "<html><body><h1>Error: No authorization code</h1></body></html>"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()

            return $null
        }

    } catch {
        Write-Host "[ERROR] Failed to start HTTP server: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common causes:" -ForegroundColor Yellow
        Write-Host "  - Port 8080 already in use (close other applications)" -ForegroundColor White
        Write-Host "  - Firewall blocking the connection" -ForegroundColor White
        Write-Host "  - Antivirus software blocking PowerShell HTTP server" -ForegroundColor White
        return $null
    } finally {
        $listener.Stop()
        $listener.Close()
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

Write-Host "Step 1: Get Authorization" -ForegroundColor Cyan
Write-Host ""

$authCode = Get-OAuthCode -AuthUrl $authUrl

if (-not $authCode) {
    Write-Host ""
    Write-Host "Authorization failed. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Exchange Code for Access Token" -ForegroundColor Cyan

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
    exit 1
}

Write-Host "Step 3: List Current Aliases" -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Accept" = "application/json"
}

$listUrl = "https://admin.googleapis.com/admin/directory/v1/users/$UserEmail/aliases"

try {
    $currentAliases = Invoke-RestMethod -Uri $listUrl -Method Get -Headers $headers
    if ($currentAliases.aliases) {
        Write-Host "Current aliases:" -ForegroundColor Gray
        $currentAliases.aliases | ForEach-Object { Write-Host "  - $($_.alias)" -ForegroundColor White }
    } else {
        Write-Host "  (no aliases currently)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  Could not retrieve current aliases" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 4: Add Alias - $AliasEmail" -ForegroundColor Cyan

try {
    $addUrl = "https://admin.googleapis.com/admin/directory/v1/users/$UserEmail/aliases"
    $body = @{ alias = $AliasEmail } | ConvertTo-Json

    $headers["Content-Type"] = "application/json"

    $result = Invoke-RestMethod -Uri $addUrl -Method Post -Headers $headers -Body $body

    Write-Host "[OK] Alias added successfully!" -ForegroundColor Green
    Write-Host "  Email: $($result.alias)" -ForegroundColor White
    Write-Host "  ID: $($result.id)" -ForegroundColor Gray
    Write-Host ""

} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "[OK] Alias already exists!" -ForegroundColor Yellow
        Write-Host "  $AliasEmail is already configured" -ForegroundColor Gray
    } else {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        Write-Host "[ERROR] Failed to add alias:" -ForegroundColor Red
        if ($errorDetails) {
            Write-Host "  Error: $($errorDetails.error.message)" -ForegroundColor Red
        } else {
            Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
        }
        exit 1
    }
    Write-Host ""
}

Write-Host "Step 5: Verify Final Configuration" -ForegroundColor Cyan

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
Write-Host "                 Configuration Complete!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Emails to $AliasEmail will now arrive in $UserEmail" -ForegroundColor White
Write-Host ""

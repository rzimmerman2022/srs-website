# Google Workspace Email Alias Configuration
# Adds info@southwestresumes.com as an alias for ryan.zimmerman@southwestresumes.com

param(
    [string]$CredentialsFile = ".\google-workspace-credentials.json",
    [string]$UserEmail = "ryan.zimmerman@southwestresumes.com",
    [string]$AliasEmail = "info@southwestresumes.com"
)

Write-Host "=== Google Workspace Email Alias Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if credentials file exists
if (-not (Test-Path $CredentialsFile)) {
    Write-Host "Credentials file not found. Please run setup-email-config.ps1 first." -ForegroundColor Red
    exit
}

# Function to get OAuth2 token
function Get-GoogleOAuthToken {
    param([string]$CredPath)

    Write-Host "Authenticating with Google..." -ForegroundColor Yellow

    # Use gcloud if available
    $gcloud = Get-Command gcloud -ErrorAction SilentlyContinue
    if ($gcloud) {
        Write-Host "Using gcloud for authentication..." -ForegroundColor Green
        gcloud auth application-default login --scopes=https://www.googleapis.com/auth/admin.directory.user
        $token = gcloud auth application-default print-access-token
        return $token
    } else {
        Write-Host "gcloud not found. Using manual OAuth flow..." -ForegroundColor Yellow

        # Read credentials
        $creds = Get-Content $CredPath | ConvertFrom-Json
        $clientId = $creds.installed.client_id
        $clientSecret = $creds.installed.client_secret

        # OAuth2 flow
        $scope = "https://www.googleapis.com/auth/admin.directory.user"
        $redirectUri = "http://localhost:8080"

        $authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
                   "client_id=$clientId&" +
                   "redirect_uri=$redirectUri&" +
                   "response_type=code&" +
                   "scope=$scope&" +
                   "access_type=offline"

        Write-Host ""
        Write-Host "Opening browser for authentication..." -ForegroundColor Green
        Start-Process $authUrl
        Write-Host ""
        $authCode = Read-Host "After authorizing, paste the 'code' parameter from the redirect URL"

        # Exchange code for token
        $tokenUrl = "https://oauth2.googleapis.com/token"
        $body = @{
            code = $authCode
            client_id = $clientId
            client_secret = $clientSecret
            redirect_uri = $redirectUri
            grant_type = "authorization_code"
        }

        $response = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $body
        return $response.access_token
    }
}

# Function to add email alias
function Add-EmailAlias {
    param(
        [string]$Token,
        [string]$User,
        [string]$Alias
    )

    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }

    $body = @{
        alias = $Alias
    } | ConvertTo-Json

    $url = "https://admin.googleapis.com/admin/directory/v1/users/$User/aliases"

    try {
        Write-Host "Adding alias $Alias to $User..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
        Write-Host "Success! $Alias has been added as an alias." -ForegroundColor Green
        return $response
    } catch {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        if ($errorDetails.error.message -like "*already exists*") {
            Write-Host "Alias already exists!" -ForegroundColor Yellow
        } else {
            Write-Host "Error: $($errorDetails.error.message)" -ForegroundColor Red
        }
        return $null
    }
}

# Function to list existing aliases
function Get-EmailAliases {
    param(
        [string]$Token,
        [string]$User
    )

    $headers = @{
        "Authorization" = "Bearer $Token"
    }

    $url = "https://admin.googleapis.com/admin/directory/v1/users/$User/aliases"

    try {
        $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        return $response.aliases
    } catch {
        Write-Host "Could not retrieve aliases. User may not have any yet." -ForegroundColor Yellow
        return @()
    }
}

# Main execution
try {
    # Get OAuth token
    $token = Get-GoogleOAuthToken -CredPath $CredentialsFile

    if (-not $token) {
        Write-Host "Failed to get authentication token." -ForegroundColor Red
        exit
    }

    Write-Host ""
    Write-Host "=== Current Email Aliases ===" -ForegroundColor Cyan
    $existingAliases = Get-EmailAliases -Token $token -User $UserEmail
    if ($existingAliases) {
        $existingAliases | ForEach-Object { Write-Host "  - $($_.alias)" -ForegroundColor White }
    } else {
        Write-Host "  No aliases found" -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host "=== Adding New Alias ===" -ForegroundColor Cyan
    $result = Add-EmailAlias -Token $token -User $UserEmail -Alias $AliasEmail

    Write-Host ""
    Write-Host "=== Updated Email Aliases ===" -ForegroundColor Cyan
    $updatedAliases = Get-EmailAliases -Token $token -User $UserEmail
    if ($updatedAliases) {
        $updatedAliases | ForEach-Object { Write-Host "  - $($_.alias)" -ForegroundColor Green }
    }

    Write-Host ""
    Write-Host "Configuration complete! Emails to $AliasEmail will now arrive in your inbox." -ForegroundColor Green

} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
}

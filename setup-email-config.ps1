# Email Configuration Setup Script
# This script helps configure Google Workspace and Spaceship email settings

Write-Host "=== Email Configuration Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check for required tools
Write-Host "Checking for required tools..." -ForegroundColor Yellow

# Check if gcloud is installed
$gcloudInstalled = Get-Command gcloud -ErrorAction SilentlyContinue
if (-not $gcloudInstalled) {
    Write-Host "Google Cloud CLI not found. Installing..." -ForegroundColor Yellow
    Write-Host "Please download from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    Write-Host "Or run: choco install gcloudsdk (if you have Chocolatey)" -ForegroundColor Yellow
    $install = Read-Host "Would you like to continue without gcloud? (y/n)"
    if ($install -ne "y") {
        exit
    }
}

# Check if curl is available
$curlInstalled = Get-Command curl -ErrorAction SilentlyContinue
if (-not $curlInstalled) {
    Write-Host "curl not found. Please install curl first." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "=== Step 1: Google Workspace Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To manage Google Workspace via API, we need to:" -ForegroundColor Yellow
Write-Host "1. Enable the Admin SDK API in Google Cloud Console" -ForegroundColor White
Write-Host "2. Create OAuth 2.0 credentials" -ForegroundColor White
Write-Host "3. Authenticate and get access tokens" -ForegroundColor White
Write-Host ""

$setupGoogle = Read-Host "Ready to set up Google Workspace API? (y/n)"

if ($setupGoogle -eq "y") {
    Write-Host ""
    Write-Host "Opening Google Cloud Console..." -ForegroundColor Green
    Start-Process "https://console.cloud.google.com/apis/library/admin.googleapis.com"
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Enable the Admin SDK API" -ForegroundColor White
    Write-Host "2. Go to 'Credentials' -> 'Create Credentials' -> 'OAuth client ID'" -ForegroundColor White
    Write-Host "3. Choose 'Desktop app' as application type" -ForegroundColor White
    Write-Host "4. Download the JSON file" -ForegroundColor White
    Write-Host ""

    $credPath = Read-Host "Enter the path to your downloaded credentials JSON file"

    if (Test-Path $credPath) {
        Copy-Item $credPath -Destination ".\google-workspace-credentials.json"
        Write-Host "Credentials saved!" -ForegroundColor Green
    } else {
        Write-Host "File not found. Please run this script again with the correct path." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Step 2: Spaceship API Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "For Spaceship, we need your API credentials:" -ForegroundColor Yellow
Write-Host "1. Log into https://www.spaceship.com/" -ForegroundColor White
Write-Host "2. Go to Account Settings -> API Access" -ForegroundColor White
Write-Host "3. Generate an API token" -ForegroundColor White
Write-Host ""

$spaceshipToken = Read-Host "Enter your Spaceship API token (or press Enter to skip)"

if ($spaceshipToken) {
    # Save token securely
    $spaceshipToken | ConvertTo-SecureString -AsPlainText -Force | ConvertFrom-SecureString | Out-File ".\spaceship-token.txt"
    Write-Host "Spaceship token saved securely!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run .\configure-google-workspace.ps1 to add email aliases" -ForegroundColor White
Write-Host "2. Run .\configure-spaceship-forwarding.ps1 to set up email forwarding" -ForegroundColor White

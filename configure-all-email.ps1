# Master Email Configuration Script
# Configures both Google Workspace aliases and Spaceship forwarding

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   Southwest Resume Services - Email Configuration    " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will configure:" -ForegroundColor Yellow
Write-Host "  [*] info@southwestresumes.com -> ryan.zimmerman@southwestresumes.com (Google Workspace alias)" -ForegroundColor White
Write-Host "  [*] ryan.zimmerman@sparkdatalab.ai -> ryan.zimmerman@southwestresumes.com (Email forwarding)" -ForegroundColor White
Write-Host ""

# Configuration
$config = @{
    GoogleWorkspace = @{
        UserEmail = "ryan.zimmerman@southwestresumes.com"
        NewAlias = "info@southwestresumes.com"
    }
    Spaceship = @{
        Domain = "sparkdatalab.ai"
        FromEmail = "ryan.zimmerman"
        ToEmail = "ryan.zimmerman@southwestresumes.com"
    }
}

# Step 1: Google Workspace Setup
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "STEP 1: Google Workspace Email Alias Configuration" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$setupGoogle = Read-Host "Configure Google Workspace email alias? (y/n)"

if ($setupGoogle -eq "y") {
    # Check if credentials exist
    if (-not (Test-Path ".\google-workspace-credentials.json")) {
        Write-Host ""
        Write-Host "First-time setup required!" -ForegroundColor Yellow
        Write-Host "Opening Google Cloud Console..." -ForegroundColor Yellow
        Write-Host ""

        # Open Google Cloud Console
        Start-Process "https://console.cloud.google.com/apis/library/admin.googleapis.com"

        Write-Host "Please complete these steps in the browser:" -ForegroundColor Yellow
        Write-Host "  1. Enable 'Admin SDK API'" -ForegroundColor White
        Write-Host "  2. Click 'Credentials' in the left sidebar" -ForegroundColor White
        Write-Host "  3. Click 'Create Credentials' -> 'OAuth client ID'" -ForegroundColor White
        Write-Host "  4. Select 'Desktop app' as application type" -ForegroundColor White
        Write-Host "  5. Click 'Create' and then 'Download JSON'" -ForegroundColor White
        Write-Host ""

        $credPath = Read-Host "Enter the full path to your downloaded credentials JSON file"

        if (Test-Path $credPath) {
            Copy-Item $credPath -Destination ".\google-workspace-credentials.json"
            Write-Host "[OK] Credentials saved!" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] File not found. Please run this script again." -ForegroundColor Red
            exit
        }
    }

    Write-Host ""
    Write-Host "Running Google Workspace configuration..." -ForegroundColor Yellow
    & ".\configure-google-workspace.ps1" -UserEmail $config.GoogleWorkspace.UserEmail -AliasEmail $config.GoogleWorkspace.NewAlias

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Google Workspace configuration complete!" -ForegroundColor Green
    }
} else {
    Write-Host "Skipping Google Workspace setup" -ForegroundColor Gray
}

Write-Host ""
Write-Host ""

# Step 2: Spaceship Email Forwarding
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "STEP 2: Spaceship Email Forwarding Configuration" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Spaceship doesn't have an API for email forwarding" -ForegroundColor Yellow
Write-Host "We'll use browser automation or provide manual instructions" -ForegroundColor Yellow
Write-Host ""

$setupSpaceship = Read-Host "Configure Spaceship email forwarding? (y/n)"

if ($setupSpaceship -eq "y") {
    Write-Host ""
    Write-Host "Choose setup method:" -ForegroundColor Yellow
    Write-Host "  1. Automated (uses Selenium WebDriver - requires Chrome/Edge)" -ForegroundColor White
    Write-Host "  2. Manual (opens browser with step-by-step instructions)" -ForegroundColor White
    Write-Host ""

    $method = Read-Host "Enter choice 1 or 2"

    if ($method -eq "2") {
        & ".\configure-spaceship-forwarding.ps1" -Domain $config.Spaceship.Domain -FromEmail $config.Spaceship.FromEmail -ToEmail $config.Spaceship.ToEmail -ManualMode
    } else {
        & ".\configure-spaceship-forwarding.ps1" -Domain $config.Spaceship.Domain -FromEmail $config.Spaceship.FromEmail -ToEmail $config.Spaceship.ToEmail
    }

    Write-Host "[OK] Spaceship configuration complete!" -ForegroundColor Green
} else {
    Write-Host "Skipping Spaceship setup" -ForegroundColor Gray
}

# Summary
Write-Host ""
Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "            Configuration Summary                      " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

if ($setupGoogle -eq "y") {
    Write-Host "[OK] Google Workspace:" -ForegroundColor Green
    Write-Host "  * $($config.GoogleWorkspace.NewAlias) is now an alias" -ForegroundColor White
    Write-Host "  * Emails to info@southwestresumes.com will appear in your inbox" -ForegroundColor White
    Write-Host ""
}

if ($setupSpaceship -eq "y") {
    Write-Host "[OK] Spaceship Email Forwarding:" -ForegroundColor Green
    Write-Host "  * $($config.Spaceship.FromEmail)@$($config.Spaceship.Domain) -> $($config.Spaceship.ToEmail)" -ForegroundColor White
    Write-Host "  * Emails to sparkdatalab.ai will forward to southwestresumes.com" -ForegroundColor White
    Write-Host ""
}

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Test email delivery by sending to:" -ForegroundColor White
Write-Host "     * info@southwestresumes.com" -ForegroundColor Cyan
Write-Host "     * ryan.zimmerman@sparkdatalab.ai" -ForegroundColor Cyan
Write-Host "  2. Check your ryan.zimmerman@southwestresumes.com inbox" -ForegroundColor White
Write-Host "  3. When composing in Gmail, you can select which address to send from" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  * Google Workspace Admin: https://admin.google.com" -ForegroundColor White
Write-Host "  * Spaceship Dashboard: https://www.spaceship.com/domain/list" -ForegroundColor White
Write-Host ""

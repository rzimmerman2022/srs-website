# Spaceship Email Forwarding Configuration
# Since Spaceship doesn't have a public API for email forwarding,
# this script provides automated browser setup using Selenium

param(
    [string]$Domain = "sparkdatalab.ai",
    [string]$FromEmail = "ryan.zimmerman",
    [string]$ToEmail = "ryan.zimmerman@southwestresumes.com",
    [switch]$ManualMode
)

Write-Host "=== Spaceship Email Forwarding Setup ===" -ForegroundColor Cyan
Write-Host ""

if ($ManualMode) {
    Write-Host "Manual Setup Instructions:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Go to https://www.spaceship.com/ and log in" -ForegroundColor White
    Write-Host "2. Navigate to: Domains -> $Domain" -ForegroundColor White
    Write-Host "3. Click on 'Email Forwarding' in the left sidebar" -ForegroundColor White
    Write-Host "4. Click 'Set rule' or 'Add forwarding rule'" -ForegroundColor White
    Write-Host "5. In 'Forwarded from' field, enter: $FromEmail" -ForegroundColor White
    Write-Host "6. In 'Forwarded to' field, enter: $ToEmail" -ForegroundColor White
    Write-Host "7. Click 'Set rule' or 'Save' to confirm" -ForegroundColor White
    Write-Host "8. Repeat for any additional email addresses (info@, etc.)" -ForegroundColor White
    Write-Host ""
    Write-Host "Opening Spaceship in your browser..." -ForegroundColor Green
    Start-Process "https://www.spaceship.com/domain/list"
    Write-Host ""
    Write-Host "Note: You can create up to 100 email forwarding rules" -ForegroundColor Yellow
    exit
}

# Check if Selenium is available
Write-Host "Checking for Selenium WebDriver..." -ForegroundColor Yellow

try {
    Import-Module Selenium -ErrorAction Stop
    Write-Host "Selenium module found!" -ForegroundColor Green
} catch {
    Write-Host "Selenium module not found. Installing..." -ForegroundColor Yellow

    # Try to install Selenium
    try {
        Install-Module -Name Selenium -Scope CurrentUser -Force -AllowClobber
        Import-Module Selenium
        Write-Host "Selenium installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host ""
        Write-Host "Could not install Selenium automatically." -ForegroundColor Red
        Write-Host "Please run this script with -ManualMode flag for manual instructions." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Or install Selenium manually:" -ForegroundColor Yellow
        Write-Host "  Install-Module -Name Selenium -Scope CurrentUser" -ForegroundColor White
        exit
    }
}

# Check for Chrome/Edge driver
Write-Host "Checking for Chrome driver..." -ForegroundColor Yellow
$chromeDriver = Get-Command chromedriver -ErrorAction SilentlyContinue

if (-not $chromeDriver) {
    Write-Host "Chrome driver not found. Attempting to download..." -ForegroundColor Yellow
    try {
        # Download ChromeDriver
        $driverPath = "$env:USERPROFILE\.selenium\chromedriver"
        if (-not (Test-Path $driverPath)) {
            New-Item -Path $driverPath -ItemType Directory -Force | Out-Null
        }

        Write-Host "Please download ChromeDriver from: https://chromedriver.chromium.org/downloads" -ForegroundColor Yellow
        Write-Host "Or use Edge driver which comes with Windows" -ForegroundColor Yellow
    } catch {
        Write-Host "Please run with -ManualMode flag" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "=== Automated Email Forwarding Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will:" -ForegroundColor Yellow
Write-Host "1. Open Spaceship.com in an automated browser" -ForegroundColor White
Write-Host "2. Wait for you to log in manually" -ForegroundColor White
Write-Host "3. Navigate to email forwarding settings" -ForegroundColor White
Write-Host "4. Set up the forwarding rule" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Ready to continue? (y/n)"
if ($continue -ne "y") {
    exit
}

try {
    # Start browser
    Write-Host "Starting browser..." -ForegroundColor Yellow

    # Try Edge first (comes with Windows)
    $driver = $null
    try {
        $driver = Start-SeEdge
    } catch {
        # Fall back to Chrome
        try {
            $driver = Start-SeChrome
        } catch {
            Write-Host "Could not start browser. Switching to manual mode..." -ForegroundColor Red
            & $PSCommandPath -Domain $Domain -FromEmail $FromEmail -ToEmail $ToEmail -ManualMode
            exit
        }
    }

    # Navigate to Spaceship
    Write-Host "Navigating to Spaceship..." -ForegroundColor Green
    Enter-SeUrl -Driver $driver -Url "https://www.spaceship.com/domain/list"

    Write-Host ""
    Write-Host "=== ACTION REQUIRED ===" -ForegroundColor Red
    Write-Host "Please log in to your Spaceship account in the browser window" -ForegroundColor Yellow
    Write-Host "Press Enter when you're logged in and can see your domain list..." -ForegroundColor Yellow
    Read-Host

    # Try to find and click the domain
    Write-Host "Looking for domain $Domain..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2

    # Look for the domain in the list
    $domainElements = Find-SeElement -Driver $driver -XPath "//*[contains(text(), '$Domain')]" -ErrorAction SilentlyContinue

    if ($domainElements) {
        Write-Host "Found domain! Clicking..." -ForegroundColor Green
        $domainElements[0].Click()
        Start-Sleep -Seconds 2

        # Look for Email Forwarding link
        $emailForwardingLink = Find-SeElement -Driver $driver -XPath "//*[contains(text(), 'Email Forwarding')]" -ErrorAction SilentlyContinue

        if ($emailForwardingLink) {
            Write-Host "Navigating to Email Forwarding..." -ForegroundColor Green
            $emailForwardingLink.Click()
            Start-Sleep -Seconds 2

            Write-Host ""
            Write-Host "=== ACTION REQUIRED ===" -ForegroundColor Red
            Write-Host "Please complete the email forwarding setup:" -ForegroundColor Yellow
            Write-Host "1. Click 'Set rule' or 'Add rule'" -ForegroundColor White
            Write-Host "2. Forwarded from: $FromEmail" -ForegroundColor White
            Write-Host "3. Forwarded to: $ToEmail" -ForegroundColor White
            Write-Host "4. Click Save" -ForegroundColor White
            Write-Host ""
            Write-Host "Press Enter when done..." -ForegroundColor Yellow
            Read-Host

            Write-Host "Email forwarding setup complete!" -ForegroundColor Green
        } else {
            Write-Host "Could not find Email Forwarding section automatically." -ForegroundColor Yellow
            Write-Host "Please navigate manually in the browser window" -ForegroundColor Yellow
            Write-Host "Press Enter when done..." -ForegroundColor Yellow
            Read-Host
        }
    } else {
        Write-Host "Could not find domain automatically." -ForegroundColor Yellow
        Write-Host "Please navigate manually in the browser window to:" -ForegroundColor Yellow
        Write-Host "  Domains -> $Domain -> Email Forwarding" -ForegroundColor White
        Write-Host ""
        Write-Host "Then set up forwarding:" -ForegroundColor Yellow
        Write-Host "  From: $FromEmail@$Domain" -ForegroundColor White
        Write-Host "  To: $ToEmail" -ForegroundColor White
        Write-Host ""
        Write-Host "Press Enter when done..." -ForegroundColor Yellow
        Read-Host
    }

    Write-Host ""
    Write-Host "Closing browser..." -ForegroundColor Yellow
    Stop-SeDriver -Driver $driver

    Write-Host ""
    Write-Host "Setup complete!" -ForegroundColor Green

} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Falling back to manual mode..." -ForegroundColor Yellow
    & $PSCommandPath -Domain $Domain -FromEmail $FromEmail -ToEmail $ToEmail -ManualMode
}

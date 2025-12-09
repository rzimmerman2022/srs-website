# Check DNS SPF/DKIM records for email domains

$domains = @("southwestresumes.com", "sparkdatalab.ai")

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     DNS Record Check for Email Deliverability" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

foreach ($domain in $domains) {
    Write-Host "Checking: $domain" -ForegroundColor Yellow
    Write-Host "================================================================" -ForegroundColor Gray
    Write-Host ""

    # Check SPF
    Write-Host "SPF Records:" -ForegroundColor Cyan
    try {
        $spfRecords = Resolve-DnsName -Name $domain -Type TXT -ErrorAction Stop |
            Where-Object { $_.Strings -like '*v=spf1*' }

        if ($spfRecords) {
            foreach ($record in $spfRecords) {
                $spfString = $record.Strings -join ""
                Write-Host "  $spfString" -ForegroundColor White

                if ($spfString -like '*include:_spf.google.com*') {
                    Write-Host "  [OK] Google SPF included" -ForegroundColor Green
                } else {
                    Write-Host "  [WARN] Google SPF NOT included!" -ForegroundColor Red
                    Write-Host "  Should include: include:_spf.google.com" -ForegroundColor Yellow
                }
            }
        } else {
            Write-Host "  [ERROR] No SPF record found!" -ForegroundColor Red
            Write-Host "  Recommended: v=spf1 include:_spf.google.com ~all" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  [ERROR] Could not resolve DNS: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""

    # Check MX
    Write-Host "MX Records:" -ForegroundColor Cyan
    try {
        $mxRecords = Resolve-DnsName -Name $domain -Type MX -ErrorAction Stop

        if ($mxRecords) {
            $hasGoogle = $false
            foreach ($mx in $mxRecords) {
                Write-Host "  Priority $($mx.Preference): $($mx.NameExchange)" -ForegroundColor White
                if ($mx.NameExchange -like '*google.com*' -or $mx.NameExchange -like '*googlemail.com*') {
                    $hasGoogle = $true
                }
            }

            if ($hasGoogle) {
                Write-Host "  [OK] Google MX records configured" -ForegroundColor Green
            } else {
                Write-Host "  [WARN] Not using Google MX records" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  [ERROR] No MX records found!" -ForegroundColor Red
        }
    } catch {
        Write-Host "  [ERROR] Could not resolve MX: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""

    # Check DKIM (common selector)
    Write-Host "DKIM Records (checking common selector 'google'):" -ForegroundColor Cyan
    try {
        $dkimSelector = "google._domainkey.$domain"
        $dkimRecord = Resolve-DnsName -Name $dkimSelector -Type TXT -ErrorAction Stop

        if ($dkimRecord) {
            Write-Host "  [OK] DKIM record found at $dkimSelector" -ForegroundColor Green
            $dkimString = $dkimRecord.Strings -join ""
            if ($dkimString.Length -gt 100) {
                Write-Host "  $($dkimString.Substring(0,100))..." -ForegroundColor Gray
            } else {
                Write-Host "  $dkimString" -ForegroundColor Gray
            }
        }
    } catch {
        Write-Host "  [WARN] No DKIM record found at google._domainkey" -ForegroundColor Yellow
        Write-Host "  Check Google Admin Console for correct DKIM selector" -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host ""
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "For sparkdatalab.ai to work properly with Google Workspace:" -ForegroundColor Yellow
Write-Host "  1. SPF must include: include:_spf.google.com" -ForegroundColor White
Write-Host "  2. MX records should point to Google" -ForegroundColor White
Write-Host "  3. DKIM record should be configured (generate in Google Admin)" -ForegroundColor White
Write-Host ""
Write-Host "If replies bounce, it's usually due to missing/incorrect SPF" -ForegroundColor Yellow
Write-Host ""

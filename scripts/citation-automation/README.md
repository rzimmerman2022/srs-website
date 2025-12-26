# Citation Automation Scripts

## Overview

This folder contains automation scripts for managing business citations across platforms that offer APIs.

## Platforms with API Access

| Platform | Script | Status | API Required |
|----------|--------|--------|--------------|
| Bing Places | `bing-places.sh` | Ready | Microsoft account |
| Facebook Business | `facebook-business.sh` | Ready | Meta Business account |
| Google Business Profile | `google-gbp.sh` | Ready | Google Cloud project |

## Platforms WITHOUT API Access (Manual Only)

These require manual submission - no automation possible:
- Data Axle, Localeze, Acxiom (data aggregators)
- Apple Maps Connect
- Yelp (read-only API)
- BBB, Chambers of Commerce
- Yellow Pages, Manta, Hotfrog
- Industry directories (PARW, NRWA, CDI)

## Setup

### 1. Bing Places API

```bash
# Required: Microsoft Advertising account
# Get API credentials at: https://ads.microsoft.com/

export BING_CLIENT_ID="your-client-id"
export BING_CLIENT_SECRET="your-client-secret"
```

### 2. Facebook/Meta Graph API

```bash
# Required: Meta Business account + App
# Get credentials at: https://developers.facebook.com/

export FB_APP_ID="your-app-id"
export FB_APP_SECRET="your-app-secret"
export FB_ACCESS_TOKEN="your-access-token"
```

### 3. Google Business Profile API

```bash
# Required: Google Cloud project with GBP API enabled
# Setup at: https://console.cloud.google.com/

export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
```

## Usage

```bash
# List all scripts
ls -la scripts/citation-automation/

# Run Bing Places submission
./scripts/citation-automation/bing-places.sh create

# Check Facebook page status
./scripts/citation-automation/facebook-business.sh status
```

## Business Information (Canonical NAP)

All scripts use these exact values:

```
Business Name: Southwest Resume Services
Address: 1111 N Mission Park Blvd #2016
City: Chandler
State: AZ
ZIP: 85224
Country: US
Phone: +1-480-374-3418
Email: info@southwestresumes.com
Website: https://southwestresumes.com
Category: Resume Service
```

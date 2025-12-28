#!/bin/bash
# Spaceship DNS Management Script for macOS
# Manages DNS records for southwestresumes.com via Spaceship API
#
# Usage:
#   ./scripts/spaceship-dns.sh list                    # List all DNS records
#   ./scripts/spaceship-dns.sh add-txt "value"         # Add TXT record at @
#   ./scripts/spaceship-dns.sh add-google-verification # Add GSC verification TXT
#   ./scripts/spaceship-dns.sh verify                  # Check if verification TXT exists
#
# Requirements: curl, jq (brew install jq)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env.spaceship.local"
DOMAIN="southwestresumes.com"
API_BASE="https://spaceship.dev/api/v1"

# Google Search Console verification code
GSC_VERIFICATION="google-site-verification=d_45b3Xpuzx9WA0lKmS56bsCOyVsw5PYBa__E1qYaF0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Load credentials
load_credentials() {
    if [[ ! -f "$ENV_FILE" ]]; then
        echo -e "${RED}[ERROR] Credentials file not found: $ENV_FILE${NC}"
        echo "Please create .env.spaceship.local with SPACESHIP_API_KEY and SPACESHIP_API_SECRET"
        exit 1
    fi

    # Source the env file (handles = in values)
    export $(grep -v '^#' "$ENV_FILE" | grep -E '^SPACESHIP_API_KEY=|^SPACESHIP_API_SECRET=' | xargs)

    if [[ -z "$SPACESHIP_API_KEY" || -z "$SPACESHIP_API_SECRET" ]]; then
        echo -e "${RED}[ERROR] Could not load API credentials${NC}"
        exit 1
    fi

    echo -e "${GREEN}[OK] Loaded credentials (key: ${SPACESHIP_API_KEY:0:10}...)${NC}"
}

# Make API request
api_request() {
    local method="$1"
    local endpoint="$2"
    local data="$3"

    local url="${API_BASE}${endpoint}"

    if [[ -n "$data" ]]; then
        curl -s -X "$method" "$url" \
            -H "X-API-Key: $SPACESHIP_API_KEY" \
            -H "X-API-Secret: $SPACESHIP_API_SECRET" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "$data"
    else
        curl -s -X "$method" "$url" \
            -H "X-API-Key: $SPACESHIP_API_KEY" \
            -H "X-API-Secret: $SPACESHIP_API_SECRET" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json"
    fi
}

# List all DNS records
list_records() {
    echo -e "${CYAN}Fetching DNS records for $DOMAIN...${NC}"
    echo ""

    local response
    response=$(api_request "GET" "/dns/records/$DOMAIN?take=100&skip=0")

    if echo "$response" | jq -e '.items' > /dev/null 2>&1; then
        local count
        count=$(echo "$response" | jq '.items | length')
        echo -e "${GREEN}[OK] Found $count DNS records:${NC}"
        echo ""
        echo "TYPE     | NAME                          | VALUE"
        echo "---------|-------------------------------|------------------------------------------"

        echo "$response" | jq -r '.items[] |
            if .type == "A" then "\(.type)       | \(.name // "@")\t\t\t| \(.address)"
            elif .type == "CNAME" then "\(.type)   | \(.name // "@")\t\t\t| \(.cname)"
            elif .type == "TXT" then "\(.type)     | \(.name // "@")\t\t\t| \(.value[0:50])..."
            elif .type == "MX" then "\(.type)      | \(.name // "@")\t\t\t| \(.preference) \(.exchange)"
            else "\(.type)\t| \(.name // "@")\t\t\t| (complex)"
            end'
    else
        echo -e "${RED}[ERROR] Failed to fetch records${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        exit 1
    fi
}

# Get current records as JSON
get_current_records() {
    api_request "GET" "/dns/records/$DOMAIN?take=100&skip=0" | jq '.items'
}

# Add a TXT record
add_txt_record() {
    local txt_value="$1"
    local txt_name="${2:-@}"

    echo -e "${CYAN}Adding TXT record to $DOMAIN...${NC}"
    echo "  Name:  $txt_name"
    echo "  Value: ${txt_value:0:50}..."
    echo ""

    # Get current records
    echo -e "${YELLOW}Step 1: Fetching current DNS records...${NC}"
    local current_records
    current_records=$(get_current_records)

    local count
    count=$(echo "$current_records" | jq 'length')
    echo -e "${GREEN}[OK] Retrieved $count existing records${NC}"

    # Check if this TXT record already exists
    local exists
    exists=$(echo "$current_records" | jq --arg val "$txt_value" '[.[] | select(.type == "TXT" and .value == $val)] | length')

    if [[ "$exists" -gt 0 ]]; then
        echo -e "${YELLOW}[SKIP] TXT record already exists!${NC}"
        return 0
    fi

    # Create new TXT record object
    local new_txt_record
    new_txt_record=$(jq -n \
        --arg name "$txt_name" \
        --arg value "$txt_value" \
        '{
            name: (if $name == "@" then "" else $name end),
            type: "TXT",
            value: $value,
            ttl: 3600,
            group: { type: "custom" }
        }')

    # Merge with existing records
    echo -e "${YELLOW}Step 2: Merging with existing records...${NC}"
    local all_records
    all_records=$(echo "$current_records" | jq --argjson new "$new_txt_record" '. + [$new]')

    # Update DNS
    echo -e "${YELLOW}Step 3: Updating DNS records...${NC}"
    local update_payload
    update_payload=$(echo "$all_records" | jq '{items: .}')

    local result
    result=$(api_request "PUT" "/dns/records/$DOMAIN" "$update_payload")

    if echo "$result" | jq -e '.error' > /dev/null 2>&1; then
        echo -e "${RED}[ERROR] Failed to update DNS${NC}"
        echo "$result" | jq '.'
        exit 1
    fi

    echo -e "${GREEN}[OK] TXT record added successfully!${NC}"
    echo ""
    echo -e "${YELLOW}DNS propagation may take 5-30 minutes${NC}"
}

# Add Google Search Console verification
add_google_verification() {
    echo -e "${CYAN}================================================================${NC}"
    echo -e "${CYAN}  Adding Google Search Console Verification TXT Record${NC}"
    echo -e "${CYAN}================================================================${NC}"
    echo ""

    add_txt_record "$GSC_VERIFICATION" "@"

    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo -e "${GREEN}  Next Steps:${NC}"
    echo -e "${GREEN}================================================================${NC}"
    echo ""
    echo "1. Wait 5-15 minutes for DNS propagation"
    echo "2. Go to Google Search Console: https://search.google.com/search-console"
    echo "3. Click 'Verify' to confirm domain ownership"
    echo "4. Submit sitemap: https://southwestresumes.com/sitemap.xml"
    echo ""
}

# Verify if Google verification record exists
verify_google() {
    echo -e "${CYAN}Checking for Google verification TXT record...${NC}"
    echo ""

    # Check via DNS lookup
    echo "DNS Lookup (dig):"
    dig +short TXT "$DOMAIN" 2>/dev/null | grep -i "google-site-verification" || echo "  (not found via dig yet - may still be propagating)"

    echo ""
    echo "Spaceship API Check:"

    local response
    response=$(api_request "GET" "/dns/records/$DOMAIN?take=100&skip=0")

    local found
    found=$(echo "$response" | jq --arg gsc "$GSC_VERIFICATION" '[.items[] | select(.type == "TXT" and .value == $gsc)] | length')

    if [[ "$found" -gt 0 ]]; then
        echo -e "${GREEN}[OK] Google verification TXT record found in Spaceship!${NC}"
        echo ""
        echo "Record value: $GSC_VERIFICATION"
    else
        echo -e "${YELLOW}[NOT FOUND] Google verification TXT record not in Spaceship${NC}"
        echo ""
        echo "Run: ./scripts/spaceship-dns.sh add-google-verification"
    fi
}

# Main
main() {
    local command="${1:-help}"

    case "$command" in
        list)
            load_credentials
            list_records
            ;;
        add-txt)
            if [[ -z "$2" ]]; then
                echo -e "${RED}[ERROR] Missing TXT value${NC}"
                echo "Usage: $0 add-txt \"value\" [name]"
                exit 1
            fi
            load_credentials
            add_txt_record "$2" "${3:-@}"
            ;;
        add-google-verification)
            load_credentials
            add_google_verification
            ;;
        verify)
            load_credentials
            verify_google
            ;;
        help|--help|-h)
            echo "Spaceship DNS Management for $DOMAIN"
            echo ""
            echo "Usage: $0 <command>"
            echo ""
            echo "Commands:"
            echo "  list                     List all DNS records"
            echo "  add-txt \"value\" [name]   Add TXT record (default name: @)"
            echo "  add-google-verification  Add Google Search Console verification TXT"
            echo "  verify                   Check if Google verification exists"
            echo "  help                     Show this help"
            echo ""
            echo "Examples:"
            echo "  $0 list"
            echo "  $0 add-google-verification"
            echo "  $0 add-txt \"v=spf1 include:_spf.google.com ~all\""
            ;;
        *)
            echo -e "${RED}Unknown command: $command${NC}"
            echo "Run '$0 help' for usage"
            exit 1
            ;;
    esac
}

main "$@"

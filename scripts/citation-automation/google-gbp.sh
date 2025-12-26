#!/bin/bash
# Google Business Profile API Management
# https://developers.google.com/my-business/

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Canonical NAP
BUSINESS_NAME="Southwest Resume Services"
ADDRESS_LINE="1111 N Mission Park Blvd #2016"
CITY="Chandler"
STATE="AZ"
ZIP="85224"
COUNTRY="US"
PHONE="+1-480-374-3418"
WEBSITE="https://southwestresumes.com"
EMAIL="info@southwestresumes.com"

# Coordinates
LAT="33.3062"
LNG="-111.8413"

# GBP API base
GBP_API="https://mybusinessbusinessinformation.googleapis.com/v1"

# Check for gcloud auth
check_auth() {
    if ! command -v gcloud &> /dev/null; then
        echo -e "${RED}Error: gcloud CLI not installed${NC}"
        echo "Install at: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi

    # Check if authenticated
    if ! gcloud auth print-access-token &> /dev/null; then
        echo -e "${YELLOW}Not authenticated. Running gcloud auth login...${NC}"
        gcloud auth login
    fi
}

# Get access token
get_token() {
    ACCESS_TOKEN=$(gcloud auth print-access-token)
    echo "$ACCESS_TOKEN"
}

# List accounts
list_accounts() {
    check_auth
    echo -e "${YELLOW}Fetching GBP accounts...${NC}"

    TOKEN=$(get_token)

    RESPONSE=$(curl -s -H "Authorization: Bearer ${TOKEN}" \
        "https://mybusinessaccountmanagement.googleapis.com/v1/accounts")

    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
        echo -e "${RED}Error:${NC}"
        echo "$RESPONSE" | jq '.error'
        echo ""
        echo -e "${YELLOW}Note: You may need to enable the My Business API:${NC}"
        echo "https://console.cloud.google.com/apis/library/mybusinessbusinessinformation.googleapis.com"
        exit 1
    fi

    echo -e "${GREEN}Your GBP Accounts:${NC}"
    echo "$RESPONSE" | jq '.accounts[] | {name, accountName, type}'
}

# List locations for an account
list_locations() {
    check_auth
    ACCOUNT_ID="${1:-}"

    if [[ -z "$ACCOUNT_ID" ]]; then
        echo -e "${RED}Error: Account ID required${NC}"
        echo "Usage: $0 locations <account_id>"
        echo ""
        echo "Get account ID by running: $0 accounts"
        exit 1
    fi

    echo -e "${YELLOW}Fetching locations for account...${NC}"

    TOKEN=$(get_token)

    RESPONSE=$(curl -s -H "Authorization: Bearer ${TOKEN}" \
        "${GBP_API}/accounts/${ACCOUNT_ID}/locations")

    echo -e "${GREEN}Locations:${NC}"
    echo "$RESPONSE" | jq '.locations[] | {name, title, storefrontAddress}'
}

# Get location details
get_location() {
    check_auth
    LOCATION_NAME="${1:-}"

    if [[ -z "$LOCATION_NAME" ]]; then
        echo -e "${RED}Error: Location name required${NC}"
        echo "Usage: $0 details <location_name>"
        exit 1
    fi

    echo -e "${YELLOW}Fetching location details...${NC}"

    TOKEN=$(get_token)

    RESPONSE=$(curl -s -H "Authorization: Bearer ${TOKEN}" \
        "${GBP_API}/${LOCATION_NAME}")

    echo -e "${GREEN}Location Details:${NC}"
    echo "$RESPONSE" | jq .
}

# Create a post (Local Post)
create_post() {
    check_auth
    LOCATION_NAME="${1:-}"
    POST_TEXT="${2:-}"

    if [[ -z "$LOCATION_NAME" ]] || [[ -z "$POST_TEXT" ]]; then
        echo -e "${RED}Error: Location name and post text required${NC}"
        echo "Usage: $0 post <location_name> 'Your post text'"
        exit 1
    fi

    echo -e "${YELLOW}Creating Google post...${NC}"

    TOKEN=$(get_token)

    POST_JSON=$(cat <<EOF
{
    "languageCode": "en",
    "summary": "${POST_TEXT}",
    "topicType": "STANDARD"
}
EOF
)

    RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        -d "${POST_JSON}" \
        "https://mybusiness.googleapis.com/v4/${LOCATION_NAME}/localPosts")

    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
        echo -e "${RED}Error:${NC}"
        echo "$RESPONSE" | jq '.error'
        exit 1
    fi

    echo -e "${GREEN}Post created!${NC}"
    echo "$RESPONSE" | jq .
}

# Generate location JSON
generate_location_json() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}Google Business Profile Data${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""

    cat <<EOF
{
    "title": "${BUSINESS_NAME}",
    "storefrontAddress": {
        "addressLines": ["${ADDRESS_LINE}"],
        "locality": "${CITY}",
        "administrativeArea": "${STATE}",
        "postalCode": "${ZIP}",
        "regionCode": "${COUNTRY}"
    },
    "phoneNumbers": {
        "primaryPhone": "${PHONE}"
    },
    "websiteUri": "${WEBSITE}",
    "latlng": {
        "latitude": ${LAT},
        "longitude": ${LNG}
    },
    "categories": {
        "primaryCategory": {
            "displayName": "Resume Service"
        },
        "additionalCategories": [
            {"displayName": "Career Counselor"},
            {"displayName": "Business Consultant"}
        ]
    },
    "regularHours": {
        "periods": [
            {"openDay": "MONDAY", "openTime": "09:00", "closeDay": "MONDAY", "closeTime": "17:00"},
            {"openDay": "TUESDAY", "openTime": "09:00", "closeDay": "TUESDAY", "closeTime": "17:00"},
            {"openDay": "WEDNESDAY", "openTime": "09:00", "closeDay": "WEDNESDAY", "closeTime": "17:00"},
            {"openDay": "THURSDAY", "openTime": "09:00", "closeDay": "THURSDAY", "closeTime": "17:00"},
            {"openDay": "FRIDAY", "openTime": "09:00", "closeDay": "FRIDAY", "closeTime": "17:00"}
        ]
    },
    "serviceArea": {
        "businessType": "CUSTOMER_AND_BUSINESS_LOCATION",
        "places": {
            "placeInfos": [
                {"placeName": "Phoenix, AZ"},
                {"placeName": "Scottsdale, AZ"},
                {"placeName": "Mesa, AZ"},
                {"placeName": "Tempe, AZ"},
                {"placeName": "Chandler, AZ"},
                {"placeName": "Gilbert, AZ"}
            ]
        }
    }
}
EOF
}

# Show manual guide
show_manual_guide() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}Google Business Profile Setup${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo -e "${YELLOW}Note: GBP must be claimed/verified manually first.${NC}"
    echo ""
    echo "Steps:"
    echo "1. Go to: https://business.google.com/"
    echo "2. Sign in with business Google account"
    echo "3. Search for your business or click 'Add your business'"
    echo "4. Enter these details:"
    echo ""
    echo -e "   ${GREEN}Business Name:${NC} ${BUSINESS_NAME}"
    echo -e "   ${GREEN}Category:${NC} Resume Service"
    echo -e "   ${GREEN}Address:${NC} ${ADDRESS_LINE}, ${CITY}, ${STATE} ${ZIP}"
    echo -e "   ${GREEN}Phone:${NC} ${PHONE}"
    echo -e "   ${GREEN}Website:${NC} ${WEBSITE}"
    echo ""
    echo "5. Verify ownership (phone, postcard, or email)"
    echo "6. Complete profile:"
    echo "   - Add business hours"
    echo "   - Add services"
    echo "   - Upload photos"
    echo "   - Write business description"
    echo ""
    echo "After verification, you can manage via API using this script."
}

# Show help
show_help() {
    echo "Google Business Profile Management"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  accounts          List GBP accounts"
    echo "  locations <id>    List locations for account"
    echo "  details <name>    Get location details"
    echo "  post <name> 'msg' Create a Google post"
    echo "  json              Generate location JSON"
    echo "  guide             Show manual setup guide"
    echo "  manual            Open GBP in browser"
    echo "  help              Show this help"
    echo ""
    echo "Prerequisites:"
    echo "  - gcloud CLI installed"
    echo "  - Authenticated: gcloud auth login"
    echo "  - GBP API enabled in Google Cloud project"
    echo ""
    echo "Setup guide:"
    echo "  1. Create project: https://console.cloud.google.com/"
    echo "  2. Enable API: My Business Business Information API"
    echo "  3. Run: gcloud auth login"
}

# Open manual portal
open_manual() {
    echo -e "${GREEN}Opening Google Business Profile...${NC}"
    if command -v open &> /dev/null; then
        open "https://business.google.com/"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://business.google.com/"
    else
        echo "Visit: https://business.google.com/"
    fi
}

# Main
case "${1:-help}" in
    accounts)
        list_accounts
        ;;
    locations)
        list_locations "$2"
        ;;
    details)
        get_location "$2"
        ;;
    post)
        create_post "$2" "$3"
        ;;
    json)
        generate_location_json
        ;;
    guide)
        show_manual_guide
        ;;
    manual)
        open_manual
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac

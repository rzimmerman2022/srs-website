#!/bin/bash
# Bing Places for Business API Management
# https://learn.microsoft.com/en-us/advertising/guides/

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Canonical NAP
BUSINESS_NAME="Southwest Resume Services"
ADDRESS_LINE="1111 N Mission Park Blvd #2016"
CITY="Chandler"
STATE="AZ"
ZIP="85224"
COUNTRY="US"
PHONE="+14803743418"
WEBSITE="https://southwestresumes.com"
EMAIL="info@southwestresumes.com"
CATEGORY="Resume Service"

# Coordinates (Chandler, AZ)
LAT="33.3062"
LNG="-111.8413"

# Check for required env vars
check_credentials() {
    if [[ -z "$BING_CLIENT_ID" ]] || [[ -z "$BING_CLIENT_SECRET" ]]; then
        echo -e "${RED}Error: Missing Bing API credentials${NC}"
        echo ""
        echo "Set the following environment variables:"
        echo "  export BING_CLIENT_ID='your-client-id'"
        echo "  export BING_CLIENT_SECRET='your-client-secret'"
        echo ""
        echo "Get credentials at: https://ads.microsoft.com/"
        exit 1
    fi
}

# Get OAuth token
get_token() {
    echo -e "${YELLOW}Getting Bing OAuth token...${NC}"

    TOKEN_RESPONSE=$(curl -s -X POST "https://login.microsoftonline.com/common/oauth2/v2.0/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "client_id=${BING_CLIENT_ID}" \
        -d "client_secret=${BING_CLIENT_SECRET}" \
        -d "grant_type=client_credentials" \
        -d "scope=https://ads.microsoft.com/.default")

    ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')

    if [[ "$ACCESS_TOKEN" == "null" ]] || [[ -z "$ACCESS_TOKEN" ]]; then
        echo -e "${RED}Failed to get access token${NC}"
        echo "$TOKEN_RESPONSE" | jq .
        exit 1
    fi

    echo -e "${GREEN}Token acquired successfully${NC}"
}

# Create business listing
create_listing() {
    echo -e "${YELLOW}Creating Bing Places listing...${NC}"

    # Business listing JSON
    LISTING_JSON=$(cat <<EOF
{
    "businessName": "${BUSINESS_NAME}",
    "address": {
        "addressLine1": "${ADDRESS_LINE}",
        "city": "${CITY}",
        "stateOrProvince": "${STATE}",
        "postalCode": "${ZIP}",
        "countryOrRegion": "${COUNTRY}"
    },
    "phone": "${PHONE}",
    "website": "${WEBSITE}",
    "email": "${EMAIL}",
    "categories": ["${CATEGORY}"],
    "geoCoordinates": {
        "latitude": ${LAT},
        "longitude": ${LNG}
    },
    "businessHours": {
        "monday": {"open": "09:00", "close": "17:00"},
        "tuesday": {"open": "09:00", "close": "17:00"},
        "wednesday": {"open": "09:00", "close": "17:00"},
        "thursday": {"open": "09:00", "close": "17:00"},
        "friday": {"open": "09:00", "close": "17:00"},
        "saturday": {"closed": true},
        "sunday": {"closed": true}
    }
}
EOF
)

    echo "$LISTING_JSON" | jq .
    echo ""
    echo -e "${YELLOW}Note: Bing Places API requires Microsoft Advertising account.${NC}"
    echo -e "${YELLOW}Manual submission may be faster: https://www.bingplaces.com/${NC}"
}

# Search for existing listing
search_listing() {
    echo -e "${YELLOW}Searching for existing listing...${NC}"

    # Use Bing Maps API to search
    if [[ -n "$BING_MAPS_KEY" ]]; then
        SEARCH_URL="https://dev.virtualearth.net/REST/v1/LocalSearch/"
        QUERY="Southwest%20Resume%20Services%20Chandler%20AZ"

        RESULT=$(curl -s "${SEARCH_URL}?query=${QUERY}&key=${BING_MAPS_KEY}")
        echo "$RESULT" | jq '.resourceSets[0].resources'
    else
        echo -e "${YELLOW}Set BING_MAPS_KEY to search for existing listings${NC}"
        echo "Get a key at: https://www.bingmapsportal.com/"
    fi
}

# Show help
show_help() {
    echo "Bing Places for Business Management"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  create    Generate listing JSON for Bing Places"
    echo "  search    Search for existing listing"
    echo "  manual    Open Bing Places portal in browser"
    echo "  help      Show this help"
    echo ""
    echo "Environment Variables:"
    echo "  BING_CLIENT_ID      Microsoft Advertising client ID"
    echo "  BING_CLIENT_SECRET  Microsoft Advertising client secret"
    echo "  BING_MAPS_KEY       Bing Maps API key (for search)"
}

# Open manual portal
open_manual() {
    echo -e "${GREEN}Opening Bing Places portal...${NC}"
    if command -v open &> /dev/null; then
        open "https://www.bingplaces.com/"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://www.bingplaces.com/"
    else
        echo "Visit: https://www.bingplaces.com/"
    fi
}

# Main
case "${1:-help}" in
    create)
        create_listing
        ;;
    search)
        search_listing
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

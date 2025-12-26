#!/bin/bash
# Facebook/Meta Business Page Management via Graph API
# https://developers.facebook.com/docs/graph-api/

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
PHONE="+1 (480) 374-3418"
WEBSITE="https://southwestresumes.com"
EMAIL="info@southwestresumes.com"

# Description
ABOUT="Southwest Resume Services is Phoenix's premier resume writing and career coaching firm. Founded on the Client Truth Principle, we create research-backed career documents that authentically showcase your value. Serving professionals throughout Arizona with personalized resume writing, LinkedIn optimization, and career coaching."

# Graph API base URL
GRAPH_API="https://graph.facebook.com/v18.0"

# Check credentials
check_credentials() {
    if [[ -z "$FB_ACCESS_TOKEN" ]]; then
        echo -e "${RED}Error: Missing Facebook access token${NC}"
        echo ""
        echo "Set the following environment variable:"
        echo "  export FB_ACCESS_TOKEN='your-access-token'"
        echo ""
        echo "Get a token at: https://developers.facebook.com/tools/explorer/"
        echo ""
        echo "Required permissions:"
        echo "  - pages_manage_metadata"
        echo "  - pages_read_engagement"
        echo "  - pages_show_list"
        exit 1
    fi
}

# Get user's pages
list_pages() {
    check_credentials
    echo -e "${YELLOW}Fetching your Facebook Pages...${NC}"

    RESPONSE=$(curl -s "${GRAPH_API}/me/accounts?access_token=${FB_ACCESS_TOKEN}")

    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
        echo -e "${RED}Error fetching pages:${NC}"
        echo "$RESPONSE" | jq '.error'
        exit 1
    fi

    echo -e "${GREEN}Your Pages:${NC}"
    echo "$RESPONSE" | jq '.data[] | {name, id, category}'
}

# Get page details
get_page_details() {
    check_credentials
    PAGE_ID="${1:-}"

    if [[ -z "$PAGE_ID" ]]; then
        echo -e "${RED}Error: Page ID required${NC}"
        echo "Usage: $0 details <page_id>"
        exit 1
    fi

    echo -e "${YELLOW}Fetching page details...${NC}"

    FIELDS="name,about,description,phone,website,single_line_address,location,hours,category,fan_count,link"

    RESPONSE=$(curl -s "${GRAPH_API}/${PAGE_ID}?fields=${FIELDS}&access_token=${FB_ACCESS_TOKEN}")

    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
        echo -e "${RED}Error:${NC}"
        echo "$RESPONSE" | jq '.error'
        exit 1
    fi

    echo -e "${GREEN}Page Details:${NC}"
    echo "$RESPONSE" | jq .
}

# Update page info
update_page() {
    check_credentials
    PAGE_ID="${1:-}"

    if [[ -z "$PAGE_ID" ]]; then
        echo -e "${RED}Error: Page ID required${NC}"
        echo "Usage: $0 update <page_id>"
        exit 1
    fi

    echo -e "${YELLOW}Updating page information...${NC}"

    # Update about
    curl -s -X POST "${GRAPH_API}/${PAGE_ID}" \
        -d "about=${ABOUT}" \
        -d "phone=${PHONE}" \
        -d "website=${WEBSITE}" \
        -d "access_token=${FB_ACCESS_TOKEN}" | jq .

    echo -e "${GREEN}Page updated!${NC}"
}

# Create a post
create_post() {
    check_credentials
    PAGE_ID="${1:-}"
    MESSAGE="${2:-}"

    if [[ -z "$PAGE_ID" ]] || [[ -z "$MESSAGE" ]]; then
        echo -e "${RED}Error: Page ID and message required${NC}"
        echo "Usage: $0 post <page_id> 'Your message here'"
        exit 1
    fi

    echo -e "${YELLOW}Creating post...${NC}"

    RESPONSE=$(curl -s -X POST "${GRAPH_API}/${PAGE_ID}/feed" \
        -d "message=${MESSAGE}" \
        -d "access_token=${FB_ACCESS_TOKEN}")

    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
        echo -e "${RED}Error:${NC}"
        echo "$RESPONSE" | jq '.error'
        exit 1
    fi

    echo -e "${GREEN}Post created!${NC}"
    echo "$RESPONSE" | jq .
}

# Generate page creation instructions
create_page_guide() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}Facebook Business Page Setup${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo -e "${YELLOW}Note: Facebook Pages cannot be created via API.${NC}"
    echo -e "${YELLOW}You must create the page manually, then use this script to manage it.${NC}"
    echo ""
    echo "Manual Creation Steps:"
    echo "1. Go to: https://www.facebook.com/pages/create"
    echo "2. Select: Business or Brand"
    echo "3. Enter these details:"
    echo ""
    echo -e "   ${GREEN}Page Name:${NC} ${BUSINESS_NAME}"
    echo -e "   ${GREEN}Category:${NC} Career Counselor"
    echo -e "   ${GREEN}Address:${NC} ${ADDRESS_LINE}, ${CITY}, ${STATE} ${ZIP}"
    echo -e "   ${GREEN}Phone:${NC} ${PHONE}"
    echo -e "   ${GREEN}Website:${NC} ${WEBSITE}"
    echo ""
    echo "4. Add profile picture (logo, square, min 180x180px)"
    echo "5. Add cover photo (820x312px)"
    echo "6. Complete 'About' section with:"
    echo ""
    echo -e "${GREEN}${ABOUT}${NC}"
    echo ""
    echo "7. Enable Reviews"
    echo "8. Add Services"
    echo "9. Set username: facebook.com/southwestresumes"
    echo ""
    echo "After creation, run: $0 list"
    echo "Then use the Page ID to manage via API"
}

# Show help
show_help() {
    echo "Facebook Business Page Management"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  list              List your Facebook Pages"
    echo "  details <id>      Get page details"
    echo "  update <id>       Update page info with canonical NAP"
    echo "  post <id> 'msg'   Create a post on the page"
    echo "  create            Show manual page creation guide"
    echo "  manual            Open Facebook Pages in browser"
    echo "  help              Show this help"
    echo ""
    echo "Environment Variables:"
    echo "  FB_ACCESS_TOKEN   Facebook Graph API access token"
    echo ""
    echo "Get token at: https://developers.facebook.com/tools/explorer/"
}

# Open manual portal
open_manual() {
    echo -e "${GREEN}Opening Facebook Pages...${NC}"
    if command -v open &> /dev/null; then
        open "https://www.facebook.com/pages/create"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://www.facebook.com/pages/create"
    else
        echo "Visit: https://www.facebook.com/pages/create"
    fi
}

# Main
case "${1:-help}" in
    list)
        list_pages
        ;;
    details)
        get_page_details "$2"
        ;;
    update)
        update_page "$2"
        ;;
    post)
        create_post "$2" "$3"
        ;;
    create)
        create_page_guide
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

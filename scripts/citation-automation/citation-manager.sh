#!/bin/bash
# Citation Manager - Master script for all citation platforms
# Shows status, opens portals, and tracks progress

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Canonical NAP
NAP_BUSINESS="Southwest Resume Services"
NAP_ADDRESS="1111 N Mission Park Blvd #2016"
NAP_CITY="Chandler"
NAP_STATE="AZ"
NAP_ZIP="85224"
NAP_PHONE="(480) 374-3418"
NAP_EMAIL="info@southwestresumes.com"
NAP_WEBSITE="https://southwestresumes.com"

# Status file
STATUS_FILE="${HOME}/.srs-citation-status.json"

# Initialize status file
init_status() {
    if [[ ! -f "$STATUS_FILE" ]]; then
        cat > "$STATUS_FILE" <<EOF
{
    "lastUpdated": "$(date -Iseconds)",
    "platforms": {
        "google_gbp": {"status": "pending", "url": "https://business.google.com/", "method": "manual+api"},
        "bing_places": {"status": "pending", "url": "https://www.bingplaces.com/", "method": "manual+api"},
        "apple_maps": {"status": "pending", "url": "https://mapsconnect.apple.com/", "method": "manual"},
        "yelp": {"status": "pending", "url": "https://biz.yelp.com/", "method": "manual"},
        "facebook": {"status": "pending", "url": "https://www.facebook.com/pages/create", "method": "manual+api"},
        "data_axle": {"status": "pending", "url": "https://www.data-axle.com/our-data/list-your-business/", "method": "manual"},
        "localeze": {"status": "pending", "url": "https://www.localeze.com/", "method": "manual"},
        "foursquare": {"status": "pending", "url": "https://places.foursquare.com/", "method": "manual"},
        "bbb": {"status": "pending", "url": "https://www.bbb.org/phoenix", "method": "manual"},
        "yellowpages": {"status": "pending", "url": "https://www.yp.com/", "method": "manual"},
        "manta": {"status": "pending", "url": "https://www.manta.com/claim", "method": "manual"},
        "chandler_chamber": {"status": "pending", "url": "https://chandlerchamber.com/", "method": "manual"},
        "phoenix_chamber": {"status": "pending", "url": "https://phoenixchamber.com/", "method": "manual"}
    }
}
EOF
        echo -e "${GREEN}Initialized status file at ${STATUS_FILE}${NC}"
    fi
}

# Show NAP
show_nap() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}CANONICAL NAP - COPY EXACTLY${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo -e "${GREEN}Business Name:${NC} ${NAP_BUSINESS}"
    echo -e "${GREEN}Address:${NC}       ${NAP_ADDRESS}"
    echo -e "${GREEN}City:${NC}          ${NAP_CITY}"
    echo -e "${GREEN}State:${NC}         ${NAP_STATE}"
    echo -e "${GREEN}ZIP:${NC}           ${NAP_ZIP}"
    echo -e "${GREEN}Phone:${NC}         ${NAP_PHONE}"
    echo -e "${GREEN}Email:${NC}         ${NAP_EMAIL}"
    echo -e "${GREEN}Website:${NC}       ${NAP_WEBSITE}"
    echo ""
    echo -e "${YELLOW}Full Address:${NC} ${NAP_ADDRESS}, ${NAP_CITY}, ${NAP_STATE} ${NAP_ZIP}"
    echo ""
}

# Show automation summary
show_summary() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}CITATION AUTOMATION SUMMARY${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo -e "${GREEN}CAN BE AUTOMATED (API Available):${NC}"
    echo "  - Google Business Profile (after manual verification)"
    echo "  - Bing Places for Business"
    echo "  - Facebook Business Page (after manual creation)"
    echo ""
    echo -e "${YELLOW}PARTIALLY AUTOMATABLE:${NC}"
    echo "  - Foursquare/Factual (API is read-heavy)"
    echo "  - Yelp (read-only API, no create)"
    echo ""
    echo -e "${RED}MANUAL ONLY (No API):${NC}"
    echo "  - Data Axle, Localeze, Acxiom (data aggregators)"
    echo "  - Apple Maps Connect"
    echo "  - BBB, Chambers of Commerce"
    echo "  - Yellow Pages, Manta, Hotfrog"
    echo "  - Industry directories (PARW, NRWA, CDI)"
    echo "  - All local Arizona directories"
    echo ""
    echo -e "${CYAN}Recommendation: Focus manual effort on Tier 1 aggregators first.${NC}"
    echo -e "${CYAN}They feed 100+ downstream directories automatically.${NC}"
    echo ""
}

# Open platform
open_platform() {
    PLATFORM="${1:-}"

    case "$PLATFORM" in
        google|gbp)
            URL="https://business.google.com/"
            ;;
        bing)
            URL="https://www.bingplaces.com/"
            ;;
        apple)
            URL="https://mapsconnect.apple.com/"
            ;;
        yelp)
            URL="https://biz.yelp.com/"
            ;;
        facebook|fb)
            URL="https://www.facebook.com/pages/create"
            ;;
        dataaxle)
            URL="https://www.data-axle.com/our-data/list-your-business/"
            ;;
        localeze)
            URL="https://www.localeze.com/"
            ;;
        foursquare)
            URL="https://places.foursquare.com/"
            ;;
        bbb)
            URL="https://www.bbb.org/phoenix"
            ;;
        yellowpages|yp)
            URL="https://www.yp.com/"
            ;;
        manta)
            URL="https://www.manta.com/claim"
            ;;
        chandler)
            URL="https://chandlerchamber.com/"
            ;;
        phoenix)
            URL="https://phoenixchamber.com/"
            ;;
        *)
            echo -e "${RED}Unknown platform: $PLATFORM${NC}"
            echo ""
            echo "Available platforms:"
            echo "  google, bing, apple, yelp, facebook, dataaxle,"
            echo "  localeze, foursquare, bbb, yellowpages, manta,"
            echo "  chandler, phoenix"
            exit 1
            ;;
    esac

    echo -e "${GREEN}Opening ${PLATFORM}...${NC}"
    if command -v open &> /dev/null; then
        open "$URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$URL"
    else
        echo "Visit: $URL"
    fi
}

# Open all Tier 1
open_tier1() {
    echo -e "${YELLOW}Opening all Tier 1 (Data Aggregators)...${NC}"
    echo ""
    sleep 1

    # Data Axle
    if command -v open &> /dev/null; then
        open "https://www.data-axle.com/our-data/list-your-business/"
        sleep 2
        open "https://www.localeze.com/"
        sleep 2
        open "https://places.foursquare.com/"
    else
        echo "Visit these URLs:"
        echo "  1. https://www.data-axle.com/our-data/list-your-business/"
        echo "  2. https://www.localeze.com/"
        echo "  3. https://places.foursquare.com/"
    fi

    echo ""
    echo -e "${GREEN}Tier 1 platforms opened. Complete submissions with canonical NAP.${NC}"
}

# Open all Tier 2
open_tier2() {
    echo -e "${YELLOW}Opening all Tier 2 (Major Platforms)...${NC}"
    echo ""

    if command -v open &> /dev/null; then
        open "https://www.bingplaces.com/"
        sleep 2
        open "https://mapsconnect.apple.com/"
        sleep 2
        open "https://biz.yelp.com/"
        sleep 2
        open "https://www.facebook.com/pages/create"
    else
        echo "Visit these URLs:"
        echo "  1. https://www.bingplaces.com/"
        echo "  2. https://mapsconnect.apple.com/"
        echo "  3. https://biz.yelp.com/"
        echo "  4. https://www.facebook.com/pages/create"
    fi

    echo ""
    echo -e "${GREEN}Tier 2 platforms opened.${NC}"
}

# Show priority checklist
show_checklist() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}CITATION PRIORITY CHECKLIST${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo -e "${RED}TIER 1 - Data Aggregators (Week 1) - DO FIRST${NC}"
    echo "  [ ] Data Axle - feeds 100+ directories"
    echo "  [ ] Localeze (Neustar) - feeds Apple Maps, Bing, 60+ dirs"
    echo "  [ ] Foursquare/Factual - feeds Uber, Facebook, 100+ apps"
    echo ""
    echo -e "${YELLOW}TIER 2 - Major Platforms (Week 1-2)${NC}"
    echo "  [ ] Google Business Profile (you have this!)"
    echo "  [ ] Bing Places for Business"
    echo "  [ ] Apple Maps Connect"
    echo "  [ ] Yelp for Business"
    echo "  [ ] Facebook Business Page"
    echo ""
    echo -e "${GREEN}TIER 3 - Business Directories (Week 2-3)${NC}"
    echo "  [ ] BBB (paid, \$300-500/year)"
    echo "  [ ] Yellow Pages"
    echo "  [ ] Manta"
    echo "  [ ] Hotfrog"
    echo "  [ ] Angi"
    echo "  [ ] Thumbtack"
    echo ""
    echo -e "${CYAN}TIER 4 - Industry (Week 3-4)${NC}"
    echo "  [ ] PARW/CC directory (membership required)"
    echo "  [ ] NRWA directory (membership required)"
    echo "  [ ] CDI directory (membership required)"
    echo "  [ ] Indeed Company Page"
    echo ""
    echo -e "${BLUE}TIER 5 - Arizona Local (Week 4+)${NC}"
    echo "  [ ] Chandler Chamber (\$300-500/year)"
    echo "  [ ] Phoenix Chamber (\$400-600/year)"
    echo "  [ ] Scottsdale Chamber (\$400-700/year)"
    echo "  [ ] AZ Central business directory"
    echo ""
}

# Show help
show_help() {
    echo "Citation Manager for Southwest Resume Services"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  nap              Show canonical NAP (copy-paste ready)"
    echo "  summary          Show automation capabilities summary"
    echo "  checklist        Show priority checklist"
    echo "  open <platform>  Open specific platform in browser"
    echo "  tier1            Open all Tier 1 platforms"
    echo "  tier2            Open all Tier 2 platforms"
    echo "  help             Show this help"
    echo ""
    echo "Platforms for 'open' command:"
    echo "  google, bing, apple, yelp, facebook, dataaxle,"
    echo "  localeze, foursquare, bbb, yellowpages, manta,"
    echo "  chandler, phoenix"
    echo ""
    echo "API Scripts (in same directory):"
    echo "  ./google-gbp.sh       Google Business Profile API"
    echo "  ./bing-places.sh      Bing Places API"
    echo "  ./facebook-business.sh Meta Graph API"
}

# Main
case "${1:-help}" in
    nap)
        show_nap
        ;;
    summary)
        show_summary
        ;;
    checklist)
        show_checklist
        ;;
    open)
        open_platform "$2"
        ;;
    tier1)
        open_tier1
        ;;
    tier2)
        open_tier2
        ;;
    init)
        init_status
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

#!/bin/bash
# Add Google Search Console Verification TXT Record
# One-time script to add GSC verification

set -e

cd "$(dirname "$0")/.."

# Load credentials
export $(grep -E '^SPACESHIP_API_KEY=|^SPACESHIP_API_SECRET=' .env.spaceship.local | xargs)

echo "Spaceship API Key: ${SPACESHIP_API_KEY:0:10}..."
echo ""

# Get current records
echo "Step 1: Getting current DNS records..."
CURRENT=$(curl -s "https://spaceship.dev/api/v1/dns/records/southwestresumes.com?take=100&skip=0" \
  -H "X-API-Key: $SPACESHIP_API_KEY" \
  -H "X-API-Secret: $SPACESHIP_API_SECRET" \
  -H "Content-Type: application/json")

echo "Found $(echo "$CURRENT" | jq '.items | length') records"

# Check if already exists
EXISTS=$(echo "$CURRENT" | jq '[.items[] | select(.value == "google-site-verification=d_45b3Xpuzx9WA0lKmS56bsCOyVsw5PYBa__E1qYaF0")] | length')
if [ "$EXISTS" -gt 0 ]; then
  echo "Google verification TXT already exists!"
  exit 0
fi

# Build new payload with the verification record added
echo ""
echo "Step 2: Adding Google verification TXT record..."

# Create temp file for payload
cat > /tmp/dns-payload.json << 'JSONEOF'
JSONEOF

# Add the new record to existing items
echo "$CURRENT" | jq '.items += [{
  "value": "google-site-verification=d_45b3Xpuzx9WA0lKmS56bsCOyVsw5PYBa__E1qYaF0",
  "name": "@",
  "type": "TXT",
  "ttl": 3600,
  "group": {"type": "custom"}
}]' > /tmp/dns-payload.json

echo "New payload has $(cat /tmp/dns-payload.json | jq '.items | length') records"

# Update DNS
echo ""
echo "Step 3: Updating DNS via API..."

RESULT=$(curl -s -X PUT "https://spaceship.dev/api/v1/dns/records/southwestresumes.com" \
  -H "X-API-Key: $SPACESHIP_API_KEY" \
  -H "X-API-Secret: $SPACESHIP_API_SECRET" \
  -H "Content-Type: application/json" \
  -d @/tmp/dns-payload.json)

echo "API Response: $RESULT"

# Verify
echo ""
echo "Step 4: Verifying..."
sleep 2

VERIFY=$(curl -s "https://spaceship.dev/api/v1/dns/records/southwestresumes.com?take=100&skip=0" \
  -H "X-API-Key: $SPACESHIP_API_KEY" \
  -H "X-API-Secret: $SPACESHIP_API_SECRET" \
  -H "Content-Type: application/json")

EXISTS=$(echo "$VERIFY" | jq '[.items[] | select(.value == "google-site-verification=d_45b3Xpuzx9WA0lKmS56bsCOyVsw5PYBa__E1qYaF0")] | length')

if [ "$EXISTS" -gt 0 ]; then
  echo ""
  echo "SUCCESS! Google verification TXT record added."
  echo ""
  echo "Next steps:"
  echo "1. Wait 5-15 minutes for DNS propagation"
  echo "2. Go to: https://search.google.com/search-console"
  echo "3. Click 'Verify' to confirm ownership"
else
  echo ""
  echo "WARNING: Record may not have been added. Current TXT records:"
  echo "$VERIFY" | jq '.items[] | select(.type == "TXT")'
fi

rm -f /tmp/dns-payload.json

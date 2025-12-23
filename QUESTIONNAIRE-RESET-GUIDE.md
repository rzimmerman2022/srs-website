# Questionnaire Reset Guide

## Quick Reset Methods

### Method 1: Browser Console (Fastest - 10 seconds)

1. Open the questionnaire page: http://localhost:3000/discovery/jdeleon
2. Press **F12** (or Cmd+Option+I on Mac) to open DevTools
3. Click the **Console** tab
4. Copy and paste this code:

```javascript
// Clear localStorage for this questionnaire
const clientId = 'jdeleon';
const storageKey = `srs_q_${clientId}`;
localStorage.removeItem(storageKey);

// Clear any other related storage
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('srs_q_')) {
    localStorage.removeItem(key);
  }
});

console.log('✅ Questionnaire data cleared!');
console.log('Refresh the page to start fresh.');

// Auto-refresh
location.reload();
```

5. Press **Enter**
6. Page will auto-refresh with fresh questionnaire

---

### Method 2: DevTools Application Tab (15 seconds)

1. Open questionnaire page
2. Press **F12** to open DevTools
3. Click **Application** tab (top menu)
4. In left sidebar, expand **Local Storage**
5. Click on `http://localhost:3000`
6. Find key starting with `srs_q_jdeleon`
7. Right-click → **Delete**
8. Refresh page (Cmd+R or F5)

---

### Method 3: Clear All Site Data (20 seconds)

1. Open questionnaire page
2. Press **F12**
3. Click **Application** tab
4. Click **Clear storage** (left sidebar)
5. Check **Local storage** box
6. Click **Clear site data** button
7. Refresh page

---

### Method 4: Incognito/Private Window (Always Fresh)

1. Open new **Incognito/Private window** (Cmd+Shift+N)
2. Navigate to: http://localhost:3000/discovery/jdeleon
3. Completely fresh state every time
4. Close window when done = automatic reset

---

## Verify Fresh Start

After reset, you should see:
- ✅ Progress: **0%** (0 of 35 answered)
- ✅ Points: **0 POINTS**
- ✅ No "Synced" timestamp
- ✅ Question 1 is active
- ✅ All answers are empty

---

## Testing the Token-Based System

The current system uses **client ID** (`jdeleon`) not tokens. To test the **token-based system** mentioned in the security docs:

### Current URL (Client ID):
```
http://localhost:3000/discovery/jdeleon
```

### Future Token URL (More Secure):
```
http://localhost:3000/q/a8f3c2d9e4b5f6a7c8d9e0f1a2b3c4d5
```

**Note:** The token-based system (`/q/[token]`) is documented but not yet implemented for the jdeleon test. The current system works with direct client IDs.

---

## Quick Reference Commands

### Clear localStorage (Console):
```javascript
localStorage.removeItem('srs_q_jdeleon');
location.reload();
```

### Check current progress (Console):
```javascript
const data = localStorage.getItem('srs_q_jdeleon');
console.log(JSON.parse(atob(data)));
```

### Simulate fresh client (Console):
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## Admin Panel Testing

After resetting the questionnaire, verify admin panel sync:

1. **Reset questionnaire** (Method 1 above)
2. **Open admin panel** in separate window: http://localhost:3000/admin/clients/jdeleon
3. **Answer 3-5 questions** in questionnaire
4. **Wait 2-3 seconds**
5. **Check admin panel** - Should show new answers
6. **Verify real-time sync** is working

---

## Troubleshooting

### "Data still shows up after reset"
- Supabase database still has old data
- Clear browser cache: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
- Use Incognito window for truly fresh test

### "Questionnaire won't load"
- Check dev server is running: `npm run dev`
- Check URL is correct: `http://localhost:3000/discovery/jdeleon`
- Check browser console for errors

### "Changes aren't saving"
- Check "Synced" timestamp updates (top right)
- Check browser console for errors
- Verify Supabase credentials in `.env.local`

---

**Last Updated:** December 22, 2025

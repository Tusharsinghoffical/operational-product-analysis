# OpSense Dark Theme Migration Guide

## ✅ What's Already Updated

The following files have been successfully migrated to the new dark theme:

1. ✅ `tailwind.config.js` - New color tokens configured
2. ✅ `app/globals.css` - Complete design system with CSS custom properties
3. ✅ `components/Sidebar.tsx` - Dark theme with teal accents
4. ✅ `components/TopNav.tsx` - Dark theme with blur effects + mobile menu
5. ✅ `app/login/page.tsx` (partial) - Dark theme styling started

---

## 🎨 Design System Quick Reference

### Color Variables (Use in `style={{}}`)
```css
var(--bg-primary)     /* #040d14 - Main background */
var(--bg-secondary)   /* #071520 - Secondary background */
var(--bg-surface)     /* #0c1f30 - Card/surface background */
var(--accent-teal)    /* #00c9b1 - Primary accent */
var(--accent-orange)  /* #ff6b2b - Warning/secondary accent */
var(--text-primary)   /* #e8f0f7 - Main text */
var(--text-secondary) /* #7a9bb5 - Muted text */
var(--text-heading)   /* #ffffff - Headings */
var(--border-subtle)  /* rgba(0, 201, 177, 0.12) - Borders */
var(--glow-teal)      /* rgba(0, 201, 177, 0.15) - Glow effects */
```

### Tailwind Classes Available
```jsx
bg-bg-primary          // Background primary
bg-bg-secondary        // Background secondary
bg-bg-surface          // Card surfaces
text-accent-teal       // Teal text
text-accent-orange     // Orange text
text-text-primary      // Primary text
text-text-secondary    // Secondary text
text-text-heading      // White headings
font-heading           // Playfair Display font
shadow-glow-teal       // Teal glow shadow
```

---

## 📝 Files That Need Updates

### 1. Signup Page (`app/signup/page.tsx`)

**Replace these patterns:**

```tsx
// OLD (Light theme)
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
<div className="bg-white rounded-2xl shadow-card border border-gray-100">
<p className="text-gray-500">
<h1 className="text-gray-900">

// NEW (Dark theme)
<div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))' }}>
<div className="rounded-2xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
<p style={{ color: 'var(--text-secondary)' }}>
<h1 style={{ color: 'var(--text-heading)' }}>
```

**Form Inputs Update:**
```tsx
// OLD
<input className="border border-gray-300 focus:ring-2 focus:ring-primary" />

// NEW
<input 
  className="border focus:ring-2 focus:ring-accent-teal rounded-xl"
  style={{ 
    backgroundColor: 'var(--bg-primary)',
    borderColor: 'var(--border-subtle)',
    color: 'var(--text-primary)'
  }}
/>
```

---

### 2. Dashboard Page (`app/page.tsx`)

**Update the main container:**
```tsx
// OLD
<main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">

// NEW  
<main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
```

---

### 3. All Page Files

Apply this pattern to all pages in `app/`:
- `insights/page.tsx`
- `upload-data/page.tsx`
- `risk-monitoring/page.tsx`
- `reports/page.tsx`
- `settings/page.tsx`

**Change:**
```tsx
// Remove these classes:
bg-gradient-to-br from-gray-50 to-gray-100
bg-gray-50
text-gray-900
text-gray-500
text-gray-600
border-gray-200
border-gray-100

// Replace with:
style={{ backgroundColor: 'var(--bg-primary)' }}
style={{ color: 'var(--text-heading)' }}
style={{ color: 'var(--text-secondary)' }}
style={{ borderColor: 'var(--border-subtle)' }}
```

---

### 4. Component Files

Update all components in `components/` folder:

#### BusinessHealthScore.tsx
```tsx
// Card backgrounds
className="bg-white" → style={{ backgroundColor: 'var(--bg-surface)' }}

// Borders
className="border-gray-100" → style={{ borderColor: 'var(--border-subtle)' }}

// Text
className="text-gray-900" → style={{ color: 'var(--text-heading)' }}
className="text-gray-500" → style={{ color: 'var(--text-secondary)' }}
```

#### MetricsGrid.tsx
```tsx
// Same pattern as above
// Plus update any progress bars or indicators:
className="bg-primary" → style={{ backgroundColor: 'var(--accent-teal)' }}
className="bg-gray-200" → style={{ backgroundColor: 'var(--bg-primary)' }}
```

#### SalesChart.tsx, AIInsightsPanel.tsx, RiskMonitoringTable.tsx
```tsx
// Apply the same color replacement pattern
// Update chart colors if hardcoded:
'#1800ad' → '#00c9b1' (teal)
```

#### FileUploader.tsx
```tsx
// Dropzone area
className="border-gray-300 hover:bg-gray-50"
→ style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}

// Progress bar
className="bg-gray-200" → style={{ backgroundColor: 'var(--bg-primary)' }}
className="bg-primary" → style={{ backgroundColor: 'var(--accent-teal)' }}
```

---

## 🔧 Quick Find & Replace Patterns

### In VS Code, use these regex replacements:

**Find:** `bg-gradient-to-br from-gray-50 to-gray-100`
**Replace:** (remove class) and add `style={{ backgroundColor: 'var(--bg-primary)' }}`

**Find:** `text-gray-900`
**Replace:** `text-text-heading` or `style={{ color: 'var(--text-heading)' }}`

**Find:** `text-gray-500`
**Replace:** `text-text-secondary` or `style={{ color: 'var(--text-secondary)' }}`

**Find:** `text-gray-600`
**Replace:** `text-text-secondary`

**Find:** `border-gray-100|border-gray-200|border-gray-300`
**Replace:** `style={{ borderColor: 'var(--border-subtle)' }}`

**Find:** `bg-white`
**Replace:** `bg-bg-surface` or `style={{ backgroundColor: 'var(--bg-surface)' }}`

**Find:** `bg-gray-50|bg-gray-100`
**Replace:** `bg-bg-secondary` or `style={{ backgroundColor: 'var(--bg-secondary)' }}`

---

## 🎯 Icon Stroke Width Update

All Lucide icons should use `strokeWidth={1.5}`:

```tsx
// OLD
<Icon size={20} />

// NEW
<Icon size={20} strokeWidth={1.5} />
```

---

## 📱 Responsive Breakpoints

The design system uses these breakpoints:

```tsx
Mobile:    < 768px    (tailwind: <md)
Tablet:    768-1023px (tailwind: md-lg)  
Desktop:   1024px+    (tailwind: lg+)
Wide:      1440px+    (content stays max-width: 1200px)
```

**Touch targets:** Minimum 44x44px on mobile
```tsx
className="min-w-[44px] min-h-[44px]"
```

---

## ✨ Animation Guidelines

**Allowed animations only:**
- Scroll reveal: fade-in + translateY(12px → 0), 400ms
- Button hover: bg shift + glow, 200ms
- Card hover (desktop only): translateY(-2px) + border glow, 220ms
- Navbar blur: opacity/bg transition on scroll, 250ms

**Disable hovers on touch devices:**
```css
@media (hover: none) {
  /* No card hover transforms */
  /* No button glows */
}
```

---

## 🧪 Testing Checklist

After updating each file:

- [ ] No light theme colors remain (no gray-*, white, primary)
- [ ] All text is readable on dark backgrounds
- [ ] Borders use `var(--border-subtle)`
- [ ] Cards use `var(--bg-surface)`
- [ ] Icons have `strokeWidth={1.5}`
- [ ] Touch targets are 44px minimum on mobile
- [ ] Hover effects disabled on mobile
- [ ] Fonts use Inter or Playfair Display only
- [ ] Font sizes use clamp() for headings

---

## 🚀 Quick Start Commands

```bash
# Navigate to frontend
cd d:\PROJECTS\opSense\frontend

# Run dev server
npm run dev

# Check for build errors
npm run build
```

---

## 📚 Priority Order for Updates

1. **High Priority** (User-facing):
   - ✅ Login page (done)
   - ⬜ Signup page
   - ⬜ Dashboard (main page)
   
2. **Medium Priority** (Core features):
   - ⬜ FileUploader component
   - ⬜ BusinessHealthScore
   - ⬜ MetricsGrid
   - ⬜ AIInsightsPanel

3. **Lower Priority** (Secondary pages):
   - ⬜ Insights page
   - ⬜ Upload Data page
   - ⬜ Risk Monitoring page
   - ⬜ Reports page
   - ⬜ Settings page

---

## 💡 Pro Tips

1. **Use inline styles for CSS variables**: Tailwind doesn't support custom CSS vars in classes yet
   ```tsx
   style={{ color: 'var(--text-primary)' }}
   ```

2. **Keep className for layout**: Use Tailwind for spacing, flexbox, grid
   ```tsx
   className="flex items-center gap-4 p-6"
   style={{ color: 'var(--text-primary)' }}
   ```

3. **Test on multiple screens**: Use browser dev tools to test responsive breakpoints

4. **Commit after each file**: Make small, incremental commits for easy rollback

---

## 🐛 Common Issues

**Issue**: Text not visible
**Fix**: Check if using old gray colors - replace with `var(--text-primary)`

**Issue**: Cards blending with background
**Fix**: Use `var(--bg-surface)` for cards, not `var(--bg-primary)`

**Issue**: Borders too bold
**Fix**: Use `var(--border-subtle)` - it's intentionally light (0.12 opacity)

**Issue**: Hover effects on mobile
**Fix**: Wrap hover styles in `@media (hover: hover)`

---

## 📞 Need Help?

Reference files that are already updated:
- `components/Sidebar.tsx` - Perfect example of dark theme implementation
- `components/TopNav.tsx` - Shows blur effects and mobile menu
- `tailwind.config.js` - See all available color tokens

---

## ✅ When You're Done

The entire app should have:
- ✨ Cohesive dark blue/teal color scheme
- 🎯 Consistent spacing and typography
- 🌊 Smooth, intentional animations
- 📱 Fully responsive across all devices
- 🖱️ Desktop hover effects, touch-friendly on mobile

**The result**: A premium, production-ready data analysis platform!

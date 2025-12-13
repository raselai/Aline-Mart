# Text Wrapping & Layout Issues - Prevention Guide

**Created:** December 8, 2025
**Last Updated:** December 8, 2025
**Severity:** CRITICAL - This issue makes pages completely unusable

---

## ⚠️ CRITICAL ISSUE ENCOUNTERED

### The Problem

When creating the **Admin Login Page** (`app/admin/login/page.tsx`), text was breaking **character-by-character** instead of word-by-word, making the page completely unreadable and unprofessional.

**Example of the Issue:**
```
Instead of:
"Development Mode"

It displayed as:
D
e
v
e
l
o
p
m
e
n
t

M
o
d
e
```

### Visual Impact

- Headings broke into vertical columns of single characters
- Paragraphs became unreadable vertical lists
- Form labels split character by character
- The entire layout appeared broken and amateur
- User experience was completely destroyed

---

## 🔍 Root Causes Identified

### 1. **Container Width Too Narrow**
```typescript
// ❌ BAD - Causes character wrapping
<div className="w-full max-w-md">  // max-w-md = 448px (TOO NARROW!)

// ✅ GOOD - Provides adequate space
<div className="w-full" style={{ maxWidth: '600px', minWidth: '320px' }}>
```

**Why This Happens:**
- Tailwind's `max-w-md` (448px) is too narrow for modern layouts
- When combined with padding/margins, actual content width becomes ~350-400px
- This forces text to wrap prematurely
- With narrow widths, even normal words can't fit, causing character breaks

### 2. **Missing Text Wrapping CSS Properties**
```typescript
// ❌ BAD - No wrapping control, browser guesses
<p className="text-sm">Some text</p>

// ✅ GOOD - Explicit wrapping behavior
<p
  className="text-sm"
  style={{
    whiteSpace: 'normal',      // Allow normal text wrapping
    wordBreak: 'normal',        // Break at word boundaries
    overflowWrap: 'normal',     // Wrap long words only if needed
    display: 'block',           // Ensure block-level display
    minWidth: '100%'            // Prevent container shrinking
  }}
>
  Some text
</p>
```

### 3. **Conflicting CSS Classes**
```typescript
// ❌ BAD - Tailwind classes may conflict with custom CSS
<div className="bg-light-gray text-charcoal">

// ✅ GOOD - Use inline styles for critical properties
<div style={{ backgroundColor: '#F5F5F5', color: '#2C2C2C' }}>
```

**Why This Happens:**
- Tailwind CSS v4 custom color classes may not be properly configured
- Custom theme tokens might not resolve correctly
- CSS specificity issues can cause unexpected behavior

### 4. **Improper Use of `whiteSpace` Property**
```typescript
// ❌ BAD - Forces text onto single line, can cause horizontal overflow
<h1 style={{ whiteSpace: 'nowrap' }}>Very Long Heading Text Here</h1>

// ✅ GOOD - Use nowrap only for short, single-line text
<h1 style={{ whiteSpace: 'nowrap' }}>Sign In</h1>  // OK - short text

<p style={{ whiteSpace: 'normal' }}>
  This is a longer paragraph that needs to wrap properly...
</p>
```

### 5. **Font Display Issues**
```typescript
// ❌ BAD - Font might not load, fallback causes layout issues
<p className="font-mono">admin@example.com</p>

// ✅ GOOD - Ensure proper font loading and fallbacks
<p
  className="font-mono"
  style={{
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '13px',
    lineHeight: '1.5'
  }}
>
  admin@example.com
</p>
```

---

## ✅ Complete Solution Applied

### Step 1: Increase Container Width
```typescript
// Admin Login Page Fix
<div className="min-h-screen flex items-center justify-center px-4 py-8"
     style={{ backgroundColor: '#F5F5F5' }}>
  <div className="w-full" style={{ maxWidth: '600px', minWidth: '320px' }}>
    {/* Content */}
  </div>
</div>
```

**Why This Works:**
- `maxWidth: '600px'` - Provides comfortable reading width
- `minWidth: '320px'` - Ensures mobile compatibility
- `px-4` - Adds horizontal padding to prevent edge touching
- Width range: 320px - 600px adapts to all screen sizes

### Step 2: Fix All Text Elements
```typescript
// Headings
<h1 style={{
  color: '#2C2C2C',
  whiteSpace: 'nowrap'  // OK for short headings
}}>
  Aline Mart
</h1>

// Labels
<label
  htmlFor="email"
  style={{
    color: '#2C2C2C',
    whiteSpace: 'nowrap'  // OK for short labels
  }}
>
  Email Address
</label>

// Paragraphs & Longer Text
<p style={{
  display: 'block',
  whiteSpace: 'normal',
  wordBreak: 'normal',
  overflowWrap: 'normal',
  minWidth: '100%'
}}>
  Your session has expired. Please sign in again.
</p>

// Email or URLs (need special handling)
<div style={{
  display: 'block',
  whiteSpace: 'normal',
  wordBreak: 'normal',
  overflowWrap: 'anywhere',  // Break anywhere if absolutely needed
  wordSpacing: 'normal',
  fontSize: '13px',
  lineHeight: '1.5',
  minWidth: '100%'
}}>
  admin@alinemart.com / Admin123!@#
</div>
```

### Step 3: Fix Container Boxes
```typescript
// Development Mode Box
<div
  className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800"
  style={{
    minWidth: '280px',   // Prevents box from being too narrow
    width: '100%',       // Uses all available parent width
    overflow: 'hidden'   // Contains content properly
  }}
>
  {/* Content with proper text wrapping */}
</div>
```

### Step 4: Remove Conflicting Components
```typescript
// ❌ REMOVED - Button component had styling conflicts
import { Button } from '@/components/ui/button'
<Button className="gradient-primary">Sign In</Button>

// ✅ REPLACED - Native button with inline styles
<button
  type="submit"
  disabled={loading}
  className="w-full text-white py-3 rounded-md font-medium transition-all"
  style={{
    background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1
  }}
>
  {loading ? 'Signing in...' : 'Sign In'}
</button>
```

---

## 📋 Prevention Checklist for ALL New Pages

### Before Writing ANY New Page Component:

- [ ] **1. Set Proper Container Width**
  ```typescript
  // Always use these dimensions for forms/content:
  style={{ maxWidth: '600px', minWidth: '320px' }}

  // For full-width sections:
  style={{ maxWidth: '1280px', minWidth: '320px' }}
  ```

- [ ] **2. Add Text Wrapping Properties to ALL Text Elements**
  ```typescript
  // For headings (short text):
  style={{ whiteSpace: 'nowrap' }}

  // For paragraphs, labels, descriptions:
  style={{
    whiteSpace: 'normal',
    wordBreak: 'normal',
    overflowWrap: 'normal',
    display: 'block',
    minWidth: '100%'
  }}
  ```

- [ ] **3. Use Inline Styles for Critical Properties**
  ```typescript
  // Colors:
  style={{ backgroundColor: '#F5F5F5', color: '#2C2C2C' }}

  // NOT:
  className="bg-light-gray text-charcoal"  // May not work!
  ```

- [ ] **4. Test on Narrow Screens**
  - Open DevTools and test at 320px width
  - Check at 375px (iPhone SE)
  - Check at 768px (iPad)
  - Ensure text wraps properly at all widths

- [ ] **5. Avoid These Common Mistakes**
  - ❌ Don't use `max-w-sm` or `max-w-md` for main content
  - ❌ Don't rely solely on Tailwind color classes
  - ❌ Don't use `whiteSpace: 'nowrap'` on long text
  - ❌ Don't use `word-break: 'break-all'` (causes character breaks!)
  - ❌ Don't nest too many containers without width constraints

---

## 🎯 Standard Layout Templates

### Template 1: Centered Form/Card Layout
```typescript
export default function PageName() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: '#F5F5F5' }}
    >
      <div
        className="w-full"
        style={{ maxWidth: '600px', minWidth: '320px' }}
      >
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Heading */}
          <h2
            className="text-2xl font-serif font-bold mb-6"
            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
          >
            Page Title
          </h2>

          {/* Paragraph */}
          <p style={{
            display: 'block',
            whiteSpace: 'normal',
            wordBreak: 'normal',
            overflowWrap: 'normal',
            color: '#6B7280',
            minWidth: '100%'
          }}>
            Description text here...
          </p>

          {/* Form fields, buttons, etc. */}
        </div>
      </div>
    </div>
  )
}
```

### Template 2: Full-Width Content Layout
```typescript
export default function PageName() {
  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ backgroundColor: '#F5F5F5' }}
    >
      <div
        className="w-full mx-auto"
        style={{ maxWidth: '1280px', minWidth: '320px' }}
      >
        {/* Main Content */}
        <h1
          className="text-4xl font-serif font-bold mb-8"
          style={{ color: '#2C2C2C' }}
        >
          Page Title
        </h1>

        {/* Content sections */}
      </div>
    </div>
  )
}
```

### Template 3: Admin Dashboard Layout
```typescript
export default function AdminPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="w-64 bg-white border-r"
        style={{ minWidth: '256px' }}
      >
        {/* Sidebar content */}
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 p-8"
        style={{
          backgroundColor: '#F5F5F5',
          minWidth: '320px'
        }}
      >
        <div
          className="w-full mx-auto"
          style={{ maxWidth: '1400px' }}
        >
          {/* Page content */}
        </div>
      </main>
    </div>
  )
}
```

---

## 🚨 Quick Fix Reference

### If You See Character-by-Character Wrapping:

**1. First, check container width:**
```typescript
// Add this to parent container:
style={{ maxWidth: '600px', minWidth: '320px' }}
```

**2. Then, add text properties:**
```typescript
// Add to text elements:
style={{
  display: 'block',
  whiteSpace: 'normal',
  wordBreak: 'normal',
  overflowWrap: 'normal',
  minWidth: '100%'
}}
```

**3. Finally, check for conflicts:**
```typescript
// Replace Tailwind color classes with inline styles:
style={{ color: '#2C2C2C', backgroundColor: '#F5F5F5' }}
```

---

## 📊 CSS Properties Explained

### `whiteSpace` Property
| Value | Behavior | Use Case |
|-------|----------|----------|
| `normal` | Text wraps at word boundaries | **Default for all text** |
| `nowrap` | Text stays on one line | Short headings, labels |
| `pre-wrap` | Preserves whitespace, wraps text | Code blocks, formatted text |
| `pre` | Preserves whitespace, no wrap | Code snippets |

### `wordBreak` Property
| Value | Behavior | Use Case |
|-------|----------|----------|
| `normal` | Break at word boundaries | **Default for all text** |
| `break-all` | Break anywhere (including mid-word) | ⚠️ **AVOID - causes issues!** |
| `keep-all` | Don't break words | Prevents breaking |
| `break-word` | Break long words if needed | URLs, emails |

### `overflowWrap` Property
| Value | Behavior | Use Case |
|-------|----------|----------|
| `normal` | Break only at normal break points | **Default for all text** |
| `break-word` | Break long words if needed | URLs, emails |
| `anywhere` | Break anywhere if absolutely needed | Last resort for very long strings |

---

## 🔧 Testing Checklist

Before pushing any new page to production:

### Visual Testing:
- [ ] Test at 320px width (smallest mobile)
- [ ] Test at 375px width (iPhone SE)
- [ ] Test at 768px width (iPad)
- [ ] Test at 1024px width (laptop)
- [ ] Test at 1920px width (desktop)

### Text Testing:
- [ ] All headings display on appropriate number of lines
- [ ] All paragraphs wrap naturally at word boundaries
- [ ] No text is breaking character-by-character
- [ ] Long emails/URLs break appropriately (not mid-word)
- [ ] Form labels are readable and not truncated

### Layout Testing:
- [ ] Containers don't overflow viewport
- [ ] Content has appropriate padding on all sides
- [ ] Text doesn't touch container edges
- [ ] Scrolling works smoothly (no horizontal scroll)
- [ ] All interactive elements are properly sized

---

## 📝 Code Review Checklist

When reviewing code for new pages:

### ❌ Red Flags (Fix Immediately):
```typescript
// 1. Too narrow container
className="max-w-sm"  // 384px - TOO NARROW!
className="max-w-md"  // 448px - TOO NARROW!

// 2. Missing text wrapping
<p>Long text without style prop</p>

// 3. Relying on Tailwind custom colors
className="text-charcoal bg-light-gray"  // May not work!

// 4. Dangerous word-break
style={{ wordBreak: 'break-all' }}  // CAUSES CHARACTER BREAKS!

// 5. No width constraints
<div className="w-full">  // Missing maxWidth/minWidth!
```

### ✅ Good Patterns (Approve):
```typescript
// 1. Proper container sizing
style={{ maxWidth: '600px', minWidth: '320px' }}

// 2. Explicit text wrapping
style={{
  whiteSpace: 'normal',
  wordBreak: 'normal',
  overflowWrap: 'normal'
}}

// 3. Inline color styles
style={{ color: '#2C2C2C', backgroundColor: '#F5F5F5' }}

// 4. Block display with min-width
style={{ display: 'block', minWidth: '100%' }}
```

---

## 🎓 Lessons Learned

### Key Takeaways:
1. **Never trust default text wrapping** - Always be explicit
2. **Container width is critical** - Too narrow causes all issues
3. **Inline styles are safer** - Custom Tailwind classes can fail
4. **Test on mobile first** - Issues show up fastest on small screens
5. **Use templates** - Copy working patterns instead of starting from scratch

### Why This Happened:
- Tailwind v4 has different defaults than v3
- Custom theme tokens need explicit CSS variable definitions
- Next.js 16 has new CSS handling
- Modern browsers handle text wrapping differently

### How to Prevent:
- Use the templates provided in this guide
- Follow the prevention checklist for every new page
- Test on multiple screen sizes before committing
- Do visual code reviews focusing on text rendering

---

## 📚 Related Documentation

**Reference These Files:**
- `app/admin/login/page.tsx` - **Correct implementation** (after fixes)
- `app/globals.css` - Brand colors and typography
- `CLAUDE.md` - Overall project guidelines
- `PHASE-A1-COMPLETE.md` - Admin auth implementation

**Don't Copy From:**
- ❌ Any page created before this fix
- ❌ External templates without reviewing text handling
- ❌ Old Tailwind v3 examples

---

## 🚀 Quick Start for New Pages

**Copy this boilerplate:**

```typescript
'use client'

import { useState } from 'react'

export default function NewPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: '#F5F5F5' }}
    >
      <div
        className="w-full"
        style={{ maxWidth: '600px', minWidth: '320px' }}
      >
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Page Heading */}
          <h1
            className="text-3xl font-serif font-bold mb-6"
            style={{ color: '#2C2C2C' }}
          >
            Page Title
          </h1>

          {/* Description */}
          <p
            className="mb-6"
            style={{
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              color: '#6B7280',
              minWidth: '100%'
            }}
          >
            Page description goes here...
          </p>

          {/* Add your content here */}
        </div>
      </div>
    </div>
  )
}
```

---

## ✅ Summary

**The Issue:** Text was breaking character-by-character due to narrow containers and missing CSS properties.

**The Solution:**
1. Increase container widths (600px max, 320px min)
2. Add explicit text wrapping properties to all text elements
3. Use inline styles instead of Tailwind custom classes
4. Test on multiple screen sizes

**Prevention:**
- Follow the templates in this guide
- Use the prevention checklist
- Always test on mobile widths (320px+)
- Review code for red flags before committing

---

**REMEMBER: This issue makes pages completely unusable. Always prioritize text readability!**

**Last Updated:** December 8, 2025
**Next Review:** Before starting Phase A2 (Admin Layout)

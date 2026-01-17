# Vendor/Supplier Management System - Implementation Plan

## Overview

This document outlines the complete implementation plan for adding Vendor/Supplier Management to the Aline Mart admin dashboard. The system will allow administrators to manage vendors who supply products to the marketplace.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Database Schema](#2-database-schema)
3. [API Routes](#3-api-routes)
4. [Admin Pages](#4-admin-pages)
5. [Types & Utilities](#5-types--utilities)
6. [Implementation Steps](#6-implementation-steps)
7. [File Structure](#7-file-structure)
8. [UI/UX Design](#8-uiux-design)
9. [Future Enhancements](#9-future-enhancements)

---

## 1. System Overview

### What is a Vendor?

A **Vendor** (or Supplier) is a business entity that supplies products to Aline Mart. Each product in the catalog can be linked to a vendor, enabling:

- Tracking which vendor supplies which products
- Managing vendor contact information
- Monitoring vendor performance
- Filtering products by vendor in admin

### Core Features (Simple Implementation)

| Feature | Description |
|---------|-------------|
| Vendor CRUD | Create, Read, Update, Delete vendors |
| Product Linking | Associate products with vendors |
| Vendor Status | Active/Inactive/Pending status management |
| Contact Management | Store vendor contact details |
| Product Count | Track how many products each vendor supplies |
| Admin Dashboard | Manage all vendors from admin panel |

### User Roles

| Role | Capabilities |
|------|--------------|
| Admin | Full vendor management (CRUD), view all vendor data |
| Vendor (Future) | Manage own products, view own orders (Phase 2) |

---

## 2. Database Schema

### 2.1 New Table: Vendor

```
Table: Vendor
├── id (TEXT, PRIMARY KEY)
├── name (TEXT, NOT NULL) - Company/Business name
├── slug (TEXT, UNIQUE, NOT NULL) - URL-friendly identifier
├── email (TEXT, UNIQUE, NOT NULL) - Primary contact email
├── phone (TEXT) - Contact phone number
├── description (TEXT) - About the vendor
├── logo (TEXT) - Logo image URL
├── address (TEXT) - Business address
├── city (TEXT) - City
├── country (TEXT) - Country
├── status (TEXT, DEFAULT 'PENDING') - ACTIVE, INACTIVE, PENDING
├── commissionRate (DOUBLE, DEFAULT 0) - Platform commission percentage
├── bankName (TEXT) - For payouts
├── bankAccount (TEXT) - Bank account number
├── createdAt (TIMESTAMP)
├── updatedAt (TIMESTAMP)
```

### 2.2 Modified Table: Product

Add a new column to link products to vendors:

```
Table: Product (existing)
├── ... existing columns ...
├── vendorId (TEXT, NULLABLE, FOREIGN KEY → Vendor.id)
```

### 2.3 Relationships

```
Vendor (1) ────────< (Many) Product
   │
   └── One vendor can have many products
       A product can optionally belong to one vendor
```

### 2.4 SQL Migration Script

Create file: `scripts/migrate-vendor-system.sql`

**Migration will include:**
1. CREATE TABLE Vendor with all columns
2. ADD COLUMN vendorId to Product table
3. ADD FOREIGN KEY constraint
4. CREATE INDEX for vendorId on Product
5. CREATE INDEX for status on Vendor

---

## 3. API Routes

### 3.1 Vendor List API

**Route:** `GET /api/admin/vendors`

**Purpose:** List all vendors with filtering and pagination

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search by name or email |
| status | string | Filter by status (ACTIVE, INACTIVE, PENDING) |
| sort | string | Sort field (name, createdAt, productCount) |
| order | string | Sort order (asc, desc) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |

**Response:**
```json
{
  "vendors": [
    {
      "id": "vendor_123",
      "name": "Luxury Imports Ltd",
      "slug": "luxury-imports",
      "email": "contact@luxuryimports.com",
      "phone": "+880123456789",
      "status": "ACTIVE",
      "logo": "/vendors/luxury-imports.png",
      "productCount": 15,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### 3.2 Single Vendor API

**Route:** `GET /api/admin/vendors/[id]`

**Purpose:** Get full vendor details including their products

**Response:**
```json
{
  "vendor": {
    "id": "vendor_123",
    "name": "Luxury Imports Ltd",
    "slug": "luxury-imports",
    "email": "contact@luxuryimports.com",
    "phone": "+880123456789",
    "description": "Premium luxury goods importer...",
    "logo": "/vendors/luxury-imports.png",
    "address": "123 Business Street",
    "city": "Dhaka",
    "country": "Bangladesh",
    "status": "ACTIVE",
    "commissionRate": 15,
    "bankName": "Dutch Bangla Bank",
    "bankAccount": "****5678",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z",
    "products": [
      { "id": "prod_1", "name": "Product 1", "price": 500 }
    ],
    "productCount": 15
  }
}
```

### 3.3 Create Vendor API

**Route:** `POST /api/admin/vendors`

**Purpose:** Create a new vendor

**Request Body:**
```json
{
  "name": "New Vendor Co",
  "email": "vendor@example.com",
  "phone": "+880123456789",
  "description": "About the vendor...",
  "logo": "/vendors/new-vendor.png",
  "address": "456 Market Road",
  "city": "Chittagong",
  "country": "Bangladesh",
  "status": "PENDING",
  "commissionRate": 10,
  "bankName": "City Bank",
  "bankAccount": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "vendor": { ... },
  "message": "Vendor created successfully"
}
```

### 3.4 Update Vendor API

**Route:** `PATCH /api/admin/vendors/[id]`

**Purpose:** Update vendor details or status

**Request Body:** (partial update)
```json
{
  "status": "ACTIVE",
  "commissionRate": 12
}
```

**Response:**
```json
{
  "success": true,
  "vendor": { ... },
  "message": "Vendor updated successfully"
}
```

### 3.5 Delete Vendor API

**Route:** `DELETE /api/admin/vendors/[id]`

**Purpose:** Delete a vendor (only if no products linked)

**Response:**
```json
{
  "success": true,
  "message": "Vendor deleted successfully"
}
```

**Error (if products exist):**
```json
{
  "error": "Cannot delete vendor with linked products. Reassign or remove products first.",
  "productCount": 15
}
```

---

## 4. Admin Pages

### 4.1 Vendors List Page

**Route:** `/admin/vendors`

**Features:**
- Table displaying all vendors
- Search bar (search by name/email)
- Status filter dropdown (All, Active, Inactive, Pending)
- Sort options (Name A-Z, Newest, Most Products)
- Pagination
- "Add Vendor" button
- Row actions: View, Edit, Delete

**Table Columns:**
| Column | Description |
|--------|-------------|
| Logo | Vendor logo thumbnail |
| Name | Vendor business name |
| Email | Contact email |
| Products | Number of linked products |
| Status | Badge (Active/Inactive/Pending) |
| Commission | Commission rate percentage |
| Created | Date added |
| Actions | View, Edit, Delete buttons |

### 4.2 Add/Edit Vendor Page

**Route:** `/admin/vendors/new` and `/admin/vendors/[id]/edit`

**Form Sections:**

**Section 1: Basic Information**
- Name (required)
- Email (required, validated)
- Phone
- Logo upload/URL

**Section 2: Business Details**
- Description (textarea)
- Address
- City
- Country (dropdown)

**Section 3: Platform Settings**
- Status (dropdown: Pending, Active, Inactive)
- Commission Rate (percentage input)

**Section 4: Payment Information**
- Bank Name
- Bank Account Number

**Form Actions:**
- Save / Create Vendor
- Cancel

### 4.3 Vendor Details Page

**Route:** `/admin/vendors/[id]`

**Sections:**

**Header:**
- Vendor logo and name
- Status badge
- Edit button
- Back to list link

**Overview Cards:**
- Total Products
- Commission Rate
- Status
- Member Since

**Tabs:**
1. **Details Tab** - All vendor information
2. **Products Tab** - List of vendor's products with link to product edit
3. **Activity Tab** (Future) - Recent orders, payments

**Actions:**
- Edit Vendor
- Change Status
- Delete Vendor (with confirmation)

### 4.4 Product Page Updates

**Modify:** `/admin/products/new` and `/admin/products/[id]/edit`

**Add:**
- Vendor dropdown selector in product form
- Show current vendor on product details
- Filter products by vendor on products list

---

## 5. Types & Utilities

### 5.1 TypeScript Types

**File:** `types/vendor.ts`

```
Types to define:
- VendorStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING'
- Vendor (full vendor interface)
- VendorListItem (for list views, includes productCount)
- VendorFilters (for API query params)
- CreateVendorInput (for form submission)
- UpdateVendorInput (for partial updates)
```

### 5.2 Utility Functions

**File:** `lib/vendor-utils.ts`

```
Functions to create:
- generateVendorSlug(name) - Create URL-friendly slug
- generateVendorId(slug) - Create unique vendor ID
- getVendorStatusColor(status) - Return Tailwind classes for badges
- getVendorStatusLabel(status) - Return display name
- validateVendorEmail(email) - Email validation
- formatCommissionRate(rate) - Format as percentage
```

### 5.3 Zod Validation Schemas

**File:** `types/vendor.ts` (or separate validation file)

```
Schemas to define:
- createVendorSchema - Validate new vendor form
- updateVendorSchema - Validate edit vendor form
- vendorFilterSchema - Validate API query params
```

---

## 6. Implementation Steps

### Phase 1: Database Setup (Step 1-2)

#### Step 1: Create Migration Script
- [ ] Create `scripts/migrate-vendor-system.sql`
- [ ] Define Vendor table with all columns
- [ ] Add vendorId column to Product table
- [ ] Add foreign key constraint
- [ ] Add necessary indexes

#### Step 2: Run Migration
- [ ] Execute SQL in Supabase SQL Editor
- [ ] Verify tables and columns created
- [ ] Test foreign key relationship

---

### Phase 2: Types & Utilities (Step 3-4)

#### Step 3: Create TypeScript Types
- [ ] Create `types/vendor.ts`
- [ ] Define all vendor-related types
- [ ] Define Zod validation schemas
- [ ] Export types for use across app

#### Step 4: Create Utility Functions
- [ ] Create `lib/vendor-utils.ts`
- [ ] Implement slug generation
- [ ] Implement status helpers
- [ ] Implement validation helpers

---

### Phase 3: API Routes (Step 5-9)

#### Step 5: Create Vendors List API
- [ ] Create `app/api/admin/vendors/route.ts`
- [ ] Implement GET with filters, sorting, pagination
- [ ] Add admin authentication check
- [ ] Return vendor list with product counts

#### Step 6: Create Single Vendor API
- [ ] Create `app/api/admin/vendors/[id]/route.ts`
- [ ] Implement GET for vendor details
- [ ] Include vendor's products in response

#### Step 7: Implement Create Vendor
- [ ] Add POST handler to vendors route
- [ ] Validate input with Zod schema
- [ ] Generate slug and ID
- [ ] Insert into database
- [ ] Return created vendor

#### Step 8: Implement Update Vendor
- [ ] Add PATCH handler to [id] route
- [ ] Validate partial input
- [ ] Update vendor in database
- [ ] Return updated vendor

#### Step 9: Implement Delete Vendor
- [ ] Add DELETE handler to [id] route
- [ ] Check for linked products
- [ ] Prevent deletion if products exist
- [ ] Delete vendor if safe

---

### Phase 4: Admin Pages (Step 10-14)

#### Step 10: Create Vendors List Page
- [ ] Create `app/admin/vendors/page.tsx`
- [ ] Implement filters and search
- [ ] Create vendors table component
- [ ] Add pagination
- [ ] Add row actions

#### Step 11: Create Add Vendor Page
- [ ] Create `app/admin/vendors/new/page.tsx`
- [ ] Build multi-section form
- [ ] Implement form validation
- [ ] Handle form submission
- [ ] Redirect on success

#### Step 12: Create Edit Vendor Page
- [ ] Create `app/admin/vendors/[id]/edit/page.tsx`
- [ ] Load existing vendor data
- [ ] Populate form fields
- [ ] Handle update submission

#### Step 13: Create Vendor Details Page
- [ ] Create `app/admin/vendors/[id]/page.tsx`
- [ ] Display vendor information
- [ ] Show products tab
- [ ] Add action buttons

#### Step 14: Update Sidebar Navigation
- [ ] Add Vendors link to `components/admin/Sidebar.tsx`
- [ ] Use appropriate icon (Building2 or Store)
- [ ] Position after Orders in nav

---

### Phase 5: Product Integration (Step 15-17)

#### Step 15: Update Product Form
- [ ] Modify `app/admin/products/new/page.tsx`
- [ ] Add vendor dropdown selector
- [ ] Fetch vendors for dropdown
- [ ] Save vendorId with product

#### Step 16: Update Product Edit
- [ ] Modify `app/admin/products/[id]/edit/page.tsx`
- [ ] Show current vendor
- [ ] Allow vendor change

#### Step 17: Update Products List
- [ ] Add vendor filter to products page
- [ ] Show vendor name in products table
- [ ] Link to vendor details

---

### Phase 6: Dashboard Integration (Step 18-19)

#### Step 18: Add Vendor Metrics
- [ ] Update `app/admin/page.tsx`
- [ ] Add Total Vendors metric card
- [ ] Add Pending Vendors metric card
- [ ] Add "Manage Vendors" quick action

#### Step 19: Testing & Verification
- [ ] Test all API endpoints
- [ ] Test form validations
- [ ] Test vendor-product linking
- [ ] Test deletion restrictions
- [ ] Verify TypeScript compilation
- [ ] Run production build

---

## 7. File Structure

### New Files to Create

```
app/
├── admin/
│   └── vendors/
│       ├── page.tsx                    # Vendors list
│       ├── new/
│       │   └── page.tsx                # Add vendor form
│       └── [id]/
│           ├── page.tsx                # Vendor details
│           └── edit/
│               └── page.tsx            # Edit vendor form
│
├── api/
│   └── admin/
│       └── vendors/
│           ├── route.ts                # GET (list), POST (create)
│           └── [id]/
│               └── route.ts            # GET, PATCH, DELETE

lib/
└── vendor-utils.ts                     # Utility functions

types/
└── vendor.ts                           # TypeScript types & Zod schemas

scripts/
└── migrate-vendor-system.sql           # Database migration
```

### Files to Modify

```
components/admin/
└── Sidebar.tsx                         # Add Vendors nav item

app/admin/
├── page.tsx                            # Add vendor metrics
└── products/
    ├── page.tsx                        # Add vendor filter
    ├── new/
    │   └── page.tsx                    # Add vendor selector
    └── [id]/
        └── edit/
            └── page.tsx                # Add vendor selector
```

---

## 8. UI/UX Design

### 8.1 Status Badge Colors

| Status | Background | Text | Tailwind Classes |
|--------|------------|------|------------------|
| ACTIVE | Green | Dark Green | `bg-green-100 text-green-800` |
| INACTIVE | Gray | Dark Gray | `bg-gray-100 text-gray-800` |
| PENDING | Yellow | Dark Yellow | `bg-yellow-100 text-yellow-800` |

### 8.2 Vendor Card Design (List View)

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]  Vendor Name                    [Active Badge]   │
│         vendor@email.com                                │
│         15 Products  •  12% Commission                  │
│                                    [View] [Edit] [Del]  │
└─────────────────────────────────────────────────────────┘
```

### 8.3 Form Layout

```
┌─────────────────────────────────────────────────────────┐
│ Add New Vendor                              [Cancel]    │
├─────────────────────────────────────────────────────────┤
│ BASIC INFORMATION                                       │
│ ┌─────────────────┐  ┌─────────────────┐               │
│ │ Name *          │  │ Email *         │               │
│ └─────────────────┘  └─────────────────┘               │
│ ┌─────────────────┐  ┌─────────────────┐               │
│ │ Phone           │  │ Logo URL        │               │
│ └─────────────────┘  └─────────────────┘               │
├─────────────────────────────────────────────────────────┤
│ BUSINESS DETAILS                                        │
│ ┌───────────────────────────────────────────────────┐  │
│ │ Description                                        │  │
│ │                                                    │  │
│ └───────────────────────────────────────────────────┘  │
│ ┌─────────────────┐  ┌─────────────────┐               │
│ │ City            │  │ Country         │               │
│ └─────────────────┘  └─────────────────┘               │
├─────────────────────────────────────────────────────────┤
│ PLATFORM SETTINGS                                       │
│ ┌─────────────────┐  ┌─────────────────┐               │
│ │ Status          │  │ Commission %    │               │
│ └─────────────────┘  └─────────────────┘               │
├─────────────────────────────────────────────────────────┤
│                                    [Create Vendor]      │
└─────────────────────────────────────────────────────────┘
```

### 8.4 Vendor Details Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Vendors                                       │
├─────────────────────────────────────────────────────────┤
│ [Logo]  VENDOR NAME                      [Edit Button]  │
│         vendor@email.com  •  +880123456789              │
│         [Active Badge]                                  │
├─────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │ Products │ │Commission│ │  Status  │ │ Member   │    │
│ │    15    │ │   12%    │ │  Active  │ │ Jan 2024 │    │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
├─────────────────────────────────────────────────────────┤
│ [Details] [Products]                                    │
├─────────────────────────────────────────────────────────┤
│ Tab Content Area                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Future Enhancements

### Phase 2: Vendor Portal (Advanced)

| Feature | Description |
|---------|-------------|
| Vendor Login | Separate authentication for vendors |
| Vendor Dashboard | Vendors manage their own products |
| Order Notifications | Vendors see orders for their products |
| Payout Management | Track earnings and request payouts |
| Performance Analytics | Sales charts and metrics |

### Phase 3: Advanced Features

| Feature | Description |
|---------|-------------|
| Vendor Applications | Public vendor signup form |
| Document Verification | Upload business documents |
| Rating System | Customer ratings for vendors |
| Commission Tiers | Different rates based on performance |
| Automatic Payouts | Scheduled payment processing |
| Inventory Sync | Vendors update stock levels |

### Database Additions (Future)

```
VendorPayout Table (Future)
├── id
├── vendorId
├── amount
├── status (PENDING, PROCESSING, COMPLETED)
├── paymentMethod
├── transactionId
├── periodStart
├── periodEnd
├── createdAt

VendorDocument Table (Future)
├── id
├── vendorId
├── type (LICENSE, TAX_ID, BANK_STATEMENT)
├── url
├── status (PENDING, APPROVED, REJECTED)
├── createdAt
```

---

## Checklist Summary

### Database
- [ ] Create Vendor table
- [ ] Add vendorId to Product table
- [ ] Run migration in Supabase

### Backend
- [ ] Create vendor types
- [ ] Create vendor utilities
- [ ] Implement vendors list API
- [ ] Implement vendor CRUD APIs

### Frontend
- [ ] Create vendors list page
- [ ] Create add vendor page
- [ ] Create edit vendor page
- [ ] Create vendor details page
- [ ] Update sidebar navigation
- [ ] Update dashboard metrics

### Integration
- [ ] Add vendor selector to product forms
- [ ] Add vendor filter to products list
- [ ] Test all functionality
- [ ] Verify build succeeds

---

## Estimated Effort

| Phase | Tasks | Complexity |
|-------|-------|------------|
| Database Setup | 2 | Low |
| Types & Utilities | 2 | Low |
| API Routes | 5 | Medium |
| Admin Pages | 5 | Medium |
| Product Integration | 3 | Low |
| Dashboard & Testing | 2 | Low |
| **Total** | **19 tasks** | **Medium** |

---

## Notes

- This implementation follows existing patterns from Order Management and Product Management
- All admin routes require authentication via `getAdminSession()`
- Vendor deletion is soft-blocked when products are linked
- Commission rate is stored but not calculated (future enhancement)
- Logo upload uses URL input (same pattern as brand logos)

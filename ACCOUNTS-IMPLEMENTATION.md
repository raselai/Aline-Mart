# Accounts/Finance Management Implementation Tracker

## Overview
Comprehensive financial management system for Aline Mart admin dashboard - tracking revenue, COD collections, customer refunds, and vendor commission payouts.

**Start Date:** January 24, 2026
**Status:** ⬜ Not Started

---

## What is Accounts/Finance Management? (Plain English)

### The Problem We're Solving

Right now, there's no way to track the financial side of the business:

1. **No record of money flow** - When orders come in, there's no central place to see all the money moving in and out of the business.

2. **COD orders have no collection tracking** - When a customer chooses Cash on Delivery, we don't know if the delivery person actually collected the money or not.

3. **No refund system** - If a customer wants their money back, there's no proper way to process and track refunds.

4. **Vendors aren't getting paid properly** - Vendors sell products through the marketplace, but there's no system to calculate how much commission they're owed or track when they've been paid.

5. **No financial reports** - The business owner can't see reports like "How much did we make this month?" or "Which vendor sold the most?"

### What This System Will Do

**1. Financial Dashboard (The Big Picture)**
- See total revenue at a glance
- View pending COD collections (money waiting to be collected)
- Track refunds issued
- See which vendors are owed money
- Charts showing revenue trends

**2. Transaction Ledger (The Money Diary)**
Every time money moves, it gets recorded:
- Customer pays online → "Payment Received: ৳2,500"
- COD cash collected → "COD Collection: ৳1,200"
- Customer gets refund → "Refund Issued: -৳500"
- Vendor gets paid → "Vendor Payout: -৳3,000"

Think of it like a bank statement for the business.

**3. COD Collection Tracking**
For Cash on Delivery orders:
- See all COD orders waiting for collection
- When admin collects cash, mark it as "Collected"
- Track partial collections if customer paid less
- Know exactly how much COD money is outstanding

**4. Refund Management**
When customers want money back:
- Process full refund (return everything)
- Process partial refund (return some items)
- Record why the refund was given
- Option to put items back in stock
- Keep history of all refunds

**5. Vendor Commission & Payouts**
Vendors sell products, marketplace takes commission:
- Set commission rate (e.g., 10% of sales)
- Calculate how much each vendor earned
- Track how much each vendor is owed
- Mark when vendors have been paid
- Keep payout history

**6. Reports & Export**
- Sales report showing each order
- Revenue summary by day/week/month
- Refund report
- Vendor earnings report
- Export to CSV for accountants

### How Admins Will Use It

**Daily Tasks:**
1. Check Dashboard for overview
2. Collect COD payments and mark as collected
3. Process any refund requests

**Weekly Tasks:**
1. Review revenue trends
2. Check vendor earnings
3. Process vendor payouts

**Monthly Tasks:**
1. Export reports for accounting
2. Review overall financial health
3. Check refund patterns

### Before vs After

| Before | After |
|--------|-------|
| No idea how much money is coming in | Real-time revenue dashboard |
| COD cash goes missing sometimes | Every COD collection tracked |
| Refunds handled informally | Proper refund records with reasons |
| Vendors paid randomly | Calculated commissions, tracked payouts |
| No financial reports | Export reports anytime |

---

## Current State Analysis

### What Exists:
- ✅ Vendor table with bank details, mobile banking info
- ✅ Vendor management page at `/admin/vendors`
- ✅ Orders with payment method (COD/PayStation)
- ✅ Products with `vendor` text field
- ✅ Basic sales report at `/admin/reports/sales`

### What's Missing:
- ❌ Commission rate field in Vendor table
- ❌ Link between Product and Vendor (by ID)
- ❌ Transaction/Ledger table
- ❌ Refund table and management
- ❌ COD Collection tracking
- ❌ Vendor Payout tracking
- ❌ Financial dashboard
- ❌ Export functionality

---

## Implementation Phases

### Phase 1: Database Schema & Types ⬜

**Database Migration:**
- [ ] Create `scripts/accounts-migration.sql`
- [ ] Add `commissionRate` to Vendor table
- [ ] Add `vendorId` to Product table (link to Vendor)
- [ ] Add `codCollectionStatus` to Order table
- [ ] Add `refundStatus` to Order table
- [ ] Create `Transaction` table
- [ ] Create `Refund` table
- [ ] Create `CODCollection` table
- [ ] Create `VendorPayout` table
- [ ] Create indexes for performance

**TypeScript Types:**
- [ ] Create `types/accounts.ts` with:
  - [ ] `TransactionType` enum
  - [ ] `Transaction` interface
  - [ ] `RefundStatus` and `RefundType` enums
  - [ ] `Refund` interface
  - [ ] `CODCollectionStatus` enum
  - [ ] `CODCollection` interface
  - [ ] `PayoutStatus` enum
  - [ ] `VendorPayout` interface
  - [ ] Filter interfaces for each entity
  - [ ] Response interfaces for APIs

**Files to create:**
- `scripts/accounts-migration.sql`
- `types/accounts.ts`

**Files to modify:**
- `types/vendor.ts` (add commissionRate)

---

### Phase 2: Transaction Ledger ⬜

**API Routes:**
- [ ] Create `app/api/admin/accounts/transactions/route.ts`:
  - [ ] GET - List transactions with filters (type, date range, pagination)
  - [ ] POST - Create manual adjustment transaction

**Helper Functions:**
- [ ] Create `lib/accounts.ts` with:
  - [ ] `createTransaction()` - Insert transaction record
  - [ ] `getTransactionStats()` - Get totals by type

**Admin Page:**
- [ ] Create `app/admin/accounts/transactions/page.tsx`:
  - [ ] Transaction table with filters
  - [ ] Type filter (Sale, Refund, COD Collection, Payout)
  - [ ] Date range filter
  - [ ] Search by order number
  - [ ] Pagination

**Components:**
- [ ] Create `components/admin/accounts/TransactionTable.tsx`
- [ ] Create `components/admin/accounts/TransactionTypeBadge.tsx`

**Files to create:**
- `lib/accounts.ts`
- `app/api/admin/accounts/transactions/route.ts`
- `app/admin/accounts/transactions/page.tsx`
- `components/admin/accounts/TransactionTable.tsx`
- `components/admin/accounts/TransactionTypeBadge.tsx`

---

### Phase 3: COD Collection Management ⬜

**API Routes:**
- [ ] Create `app/api/admin/accounts/cod-collections/route.ts`:
  - [ ] GET - List pending/all COD orders
- [ ] Create `app/api/admin/accounts/cod-collections/[orderId]/route.ts`:
  - [ ] GET - Get COD collection details
  - [ ] POST - Mark as collected (creates Transaction)
  - [ ] PATCH - Update collection (partial, notes)

**Admin Page:**
- [ ] Create `app/admin/accounts/cod-collections/page.tsx`:
  - [ ] Pending COD orders list
  - [ ] Filter by status (Pending, Collected, Partial)
  - [ ] Collection modal
  - [ ] Total pending amount display

**Components:**
- [ ] Create `components/admin/accounts/CODCollectionModal.tsx`:
  - [ ] Show order details
  - [ ] Expected amount display
  - [ ] Collected amount input
  - [ ] Notes field
  - [ ] Mark as Collected button

**Files to create:**
- `app/api/admin/accounts/cod-collections/route.ts`
- `app/api/admin/accounts/cod-collections/[orderId]/route.ts`
- `app/admin/accounts/cod-collections/page.tsx`
- `components/admin/accounts/CODCollectionModal.tsx`

---

### Phase 4: Refund Management ⬜

**API Routes:**
- [ ] Create `app/api/admin/accounts/refunds/route.ts`:
  - [ ] GET - List all refunds with filters
  - [ ] POST - Create new refund (from order)
- [ ] Create `app/api/admin/accounts/refunds/[id]/route.ts`:
  - [ ] GET - Get refund details
  - [ ] PATCH - Update refund status (Process/Reject)

**Integration:**
- [ ] Update `lib/accounts.ts`:
  - [ ] `createRefund()` - Create refund + transaction
  - [ ] `processRefund()` - Mark processed + restore stock if needed

**Admin Page:**
- [ ] Create `app/admin/accounts/refunds/page.tsx`:
  - [ ] Refunds list with status badges
  - [ ] Filter by status (Pending, Processed, Rejected)
  - [ ] Filter by date range
  - [ ] Search by order number

**Components:**
- [ ] Create `components/admin/accounts/RefundModal.tsx`:
  - [ ] Order details display
  - [ ] Full/Partial refund toggle
  - [ ] Item selection for partial
  - [ ] Refund amount calculation
  - [ ] Reason dropdown + custom input
  - [ ] Restore stock checkbox
  - [ ] Process button
- [ ] Create `components/admin/accounts/RefundStatusBadge.tsx`

**Files to create:**
- `app/api/admin/accounts/refunds/route.ts`
- `app/api/admin/accounts/refunds/[id]/route.ts`
- `app/admin/accounts/refunds/page.tsx`
- `components/admin/accounts/RefundModal.tsx`
- `components/admin/accounts/RefundStatusBadge.tsx`

---

### Phase 5: Vendor Payout System ⬜

**API Routes:**
- [ ] Create `app/api/admin/accounts/vendor-payouts/route.ts`:
  - [ ] GET - List all payouts with filters
  - [ ] POST - Create new payout batch
- [ ] Create `app/api/admin/accounts/vendor-payouts/[id]/route.ts`:
  - [ ] GET - Get payout details
  - [ ] PATCH - Mark as paid
- [ ] Create `app/api/admin/accounts/vendor-payouts/calculate/route.ts`:
  - [ ] POST - Calculate vendor earnings for period

**Integration:**
- [ ] Update `lib/accounts.ts`:
  - [ ] `calculateVendorEarnings()` - Sum sales by vendor for period
  - [ ] `createVendorPayout()` - Create payout record
  - [ ] `markPayoutPaid()` - Update status + create transaction

**Admin Page:**
- [ ] Create `app/admin/accounts/vendor-payouts/page.tsx`:
  - [ ] Payouts list with status
  - [ ] Filter by vendor, status, date
  - [ ] "Calculate Payouts" button
  - [ ] Pending payouts total

**Components:**
- [ ] Create `components/admin/accounts/VendorPayoutModal.tsx`:
  - [ ] Vendor details
  - [ ] Period selection
  - [ ] Sales breakdown
  - [ ] Commission calculation display
  - [ ] Mark as Paid with reference input
- [ ] Create `components/admin/accounts/PayoutStatusBadge.tsx`

**Files to create:**
- `app/api/admin/accounts/vendor-payouts/route.ts`
- `app/api/admin/accounts/vendor-payouts/[id]/route.ts`
- `app/api/admin/accounts/vendor-payouts/calculate/route.ts`
- `app/admin/accounts/vendor-payouts/page.tsx`
- `components/admin/accounts/VendorPayoutModal.tsx`
- `components/admin/accounts/PayoutStatusBadge.tsx`

---

### Phase 6: Financial Dashboard ⬜

**API Routes:**
- [ ] Create `app/api/admin/accounts/dashboard/route.ts`:
  - [ ] GET - Dashboard stats (revenue, pending COD, refunds, etc.)
  - [ ] Revenue by period (daily/weekly/monthly)
  - [ ] Revenue by payment method
  - [ ] Pending items counts

**Admin Page:**
- [ ] Create `app/admin/accounts/page.tsx` (Dashboard):
  - [ ] Stats cards (Total Revenue, Net Revenue, Pending COD, Refunds)
  - [ ] Revenue trend chart (line chart)
  - [ ] Payment method breakdown (pie chart)
  - [ ] Pending items cards (COD to collect, Refunds pending, Payouts due)
  - [ ] Recent transactions list

**Components:**
- [ ] Create `components/admin/accounts/FinancialStatCards.tsx`
- [ ] Create `components/admin/accounts/RevenueChart.tsx`
- [ ] Create `components/admin/accounts/PaymentMethodChart.tsx`
- [ ] Create `components/admin/accounts/PendingItemsCards.tsx`

**Files to create:**
- `app/api/admin/accounts/dashboard/route.ts`
- `app/admin/accounts/page.tsx`
- `components/admin/accounts/FinancialStatCards.tsx`
- `components/admin/accounts/RevenueChart.tsx`
- `components/admin/accounts/PaymentMethodChart.tsx`
- `components/admin/accounts/PendingItemsCards.tsx`

---

### Phase 7: Reports & CSV Export ⬜

**API Routes:**
- [ ] Create `app/api/admin/accounts/reports/revenue/route.ts`:
  - [ ] GET - Revenue report data with filters
- [ ] Create `app/api/admin/accounts/reports/export/route.ts`:
  - [ ] GET - Export data as CSV
  - [ ] Support types: sales, revenue, refunds, payouts

**Admin Page:**
- [ ] Create `app/admin/accounts/reports/page.tsx`:
  - [ ] Report type selector
  - [ ] Date range picker
  - [ ] Filter options
  - [ ] Preview table
  - [ ] Export CSV button

**Components:**
- [ ] Create `components/admin/accounts/ReportFilters.tsx`
- [ ] Create `components/admin/accounts/ReportTable.tsx`

**Files to create:**
- `app/api/admin/accounts/reports/revenue/route.ts`
- `app/api/admin/accounts/reports/export/route.ts`
- `app/admin/accounts/reports/page.tsx`
- `components/admin/accounts/ReportFilters.tsx`
- `components/admin/accounts/ReportTable.tsx`

---

### Phase 8: Settings & Integration ⬜

**API Routes:**
- [ ] Create `app/api/admin/accounts/settings/route.ts`:
  - [ ] GET - Get commission rate setting
  - [ ] PATCH - Update commission rate

**Admin Page:**
- [ ] Create `app/admin/accounts/settings/page.tsx`:
  - [ ] Commission rate input
  - [ ] Save button

**Sidebar Integration:**
- [ ] Update `components/admin/Sidebar.tsx`:
  - [ ] Add "Accounts" as top-level item with DollarSign icon
  - [ ] Add submenu items if using expandable menu

**Auto-Transaction Creation:**
- [ ] Update `app/api/checkout/create-order/route.ts`:
  - [ ] Create SALE transaction when order is placed
- [ ] Update `app/api/checkout/paystation/callback/route.ts`:
  - [ ] Create SALE transaction on payment success

**Files to create:**
- `app/api/admin/accounts/settings/route.ts`
- `app/admin/accounts/settings/page.tsx`

**Files to modify:**
- `components/admin/Sidebar.tsx`
- `app/api/checkout/create-order/route.ts`
- `app/api/checkout/paystation/callback/route.ts`

---

### Phase 9: Testing & Verification ⬜

**Database Migration:**
- [ ] Run migration in Supabase dashboard
- [ ] Verify all tables created
- [ ] Verify columns added to existing tables

**Manual Testing:**
- [ ] Dashboard loads with correct stats
- [ ] Transaction ledger displays and filters work
- [ ] COD collection workflow:
  - [ ] Create COD order
  - [ ] View in pending list
  - [ ] Mark as collected
  - [ ] Verify transaction created
  - [ ] Verify order status updated
- [ ] Refund workflow:
  - [ ] Select order for refund
  - [ ] Process full refund
  - [ ] Process partial refund
  - [ ] Verify stock restored (if selected)
  - [ ] Verify transaction created
- [ ] Vendor payout workflow:
  - [ ] Calculate vendor earnings
  - [ ] Create payout
  - [ ] Mark as paid
  - [ ] Verify transaction created
- [ ] Reports:
  - [ ] Generate each report type
  - [ ] Export to CSV
  - [ ] Verify data accuracy

**Build Verification:**
- [ ] Run `npx tsc --noEmit --skipLibCheck`
- [ ] Run `npm run build`
- [ ] Fix any errors

---

## Database Schema Details

### Transaction Table
```sql
CREATE TABLE "Transaction" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "type" VARCHAR(20) NOT NULL CHECK ("type" IN (
    'SALE', 'REFUND', 'COD_COLLECTION', 'VENDOR_PAYOUT', 'ADJUSTMENT'
  )),
  "amount" DECIMAL(12,2) NOT NULL,
  "orderId" UUID REFERENCES "Order"(id),
  "refundId" UUID REFERENCES "Refund"(id),
  "vendorPayoutId" UUID REFERENCES "VendorPayout"(id),
  "description" TEXT,
  "reference" VARCHAR(255),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "createdBy" UUID REFERENCES "User"(id)
);
```

### Refund Table
```sql
CREATE TABLE "Refund" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderId" UUID NOT NULL REFERENCES "Order"(id),
  "orderItemId" UUID REFERENCES "OrderItem"(id),
  "amount" DECIMAL(12,2) NOT NULL,
  "reason" TEXT NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK ("status" IN (
    'PENDING', 'PROCESSED', 'REJECTED'
  )),
  "type" VARCHAR(20) NOT NULL CHECK ("type" IN ('FULL', 'PARTIAL')),
  "restoreStock" BOOLEAN DEFAULT false,
  "processedAt" TIMESTAMP,
  "processedBy" UUID REFERENCES "User"(id),
  "notes" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

### CODCollection Table
```sql
CREATE TABLE "CODCollection" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderId" UUID NOT NULL UNIQUE REFERENCES "Order"(id),
  "expectedAmount" DECIMAL(12,2) NOT NULL,
  "collectedAmount" DECIMAL(12,2),
  "collectedAt" TIMESTAMP,
  "collectedBy" UUID REFERENCES "User"(id),
  "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK ("status" IN (
    'PENDING', 'COLLECTED', 'PARTIAL', 'FAILED'
  )),
  "notes" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

### VendorPayout Table
```sql
CREATE TABLE "VendorPayout" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "vendorId" UUID NOT NULL REFERENCES "Vendor"(id),
  "periodStart" DATE NOT NULL,
  "periodEnd" DATE NOT NULL,
  "totalSales" DECIMAL(12,2) NOT NULL,
  "commissionRate" DECIMAL(5,2) NOT NULL,
  "commissionAmount" DECIMAL(12,2) NOT NULL,
  "payoutAmount" DECIMAL(12,2) NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK ("status" IN (
    'PENDING', 'PAID'
  )),
  "paidAt" TIMESTAMP,
  "paidBy" UUID REFERENCES "User"(id),
  "reference" VARCHAR(255),
  "notes" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

---

## File Summary

### New Files (31 total)

| # | File | Phase | Status |
|---|------|-------|--------|
| 1 | `scripts/accounts-migration.sql` | 1 | ⬜ |
| 2 | `types/accounts.ts` | 1 | ⬜ |
| 3 | `lib/accounts.ts` | 2 | ⬜ |
| 4 | `app/api/admin/accounts/transactions/route.ts` | 2 | ⬜ |
| 5 | `app/admin/accounts/transactions/page.tsx` | 2 | ⬜ |
| 6 | `components/admin/accounts/TransactionTable.tsx` | 2 | ⬜ |
| 7 | `components/admin/accounts/TransactionTypeBadge.tsx` | 2 | ⬜ |
| 8 | `app/api/admin/accounts/cod-collections/route.ts` | 3 | ⬜ |
| 9 | `app/api/admin/accounts/cod-collections/[orderId]/route.ts` | 3 | ⬜ |
| 10 | `app/admin/accounts/cod-collections/page.tsx` | 3 | ⬜ |
| 11 | `components/admin/accounts/CODCollectionModal.tsx` | 3 | ⬜ |
| 12 | `app/api/admin/accounts/refunds/route.ts` | 4 | ⬜ |
| 13 | `app/api/admin/accounts/refunds/[id]/route.ts` | 4 | ⬜ |
| 14 | `app/admin/accounts/refunds/page.tsx` | 4 | ⬜ |
| 15 | `components/admin/accounts/RefundModal.tsx` | 4 | ⬜ |
| 16 | `components/admin/accounts/RefundStatusBadge.tsx` | 4 | ⬜ |
| 17 | `app/api/admin/accounts/vendor-payouts/route.ts` | 5 | ⬜ |
| 18 | `app/api/admin/accounts/vendor-payouts/[id]/route.ts` | 5 | ⬜ |
| 19 | `app/api/admin/accounts/vendor-payouts/calculate/route.ts` | 5 | ⬜ |
| 20 | `app/admin/accounts/vendor-payouts/page.tsx` | 5 | ⬜ |
| 21 | `components/admin/accounts/VendorPayoutModal.tsx` | 5 | ⬜ |
| 22 | `components/admin/accounts/PayoutStatusBadge.tsx` | 5 | ⬜ |
| 23 | `app/api/admin/accounts/dashboard/route.ts` | 6 | ⬜ |
| 24 | `app/admin/accounts/page.tsx` | 6 | ⬜ |
| 25 | `components/admin/accounts/FinancialStatCards.tsx` | 6 | ⬜ |
| 26 | `components/admin/accounts/RevenueChart.tsx` | 6 | ⬜ |
| 27 | `components/admin/accounts/PaymentMethodChart.tsx` | 6 | ⬜ |
| 28 | `components/admin/accounts/PendingItemsCards.tsx` | 6 | ⬜ |
| 29 | `app/api/admin/accounts/reports/revenue/route.ts` | 7 | ⬜ |
| 30 | `app/api/admin/accounts/reports/export/route.ts` | 7 | ⬜ |
| 31 | `app/admin/accounts/reports/page.tsx` | 7 | ⬜ |
| 32 | `components/admin/accounts/ReportFilters.tsx` | 7 | ⬜ |
| 33 | `components/admin/accounts/ReportTable.tsx` | 7 | ⬜ |
| 34 | `app/api/admin/accounts/settings/route.ts` | 8 | ⬜ |
| 35 | `app/admin/accounts/settings/page.tsx` | 8 | ⬜ |

### Files to Modify (4 total)

| # | File | Phase | Status |
|---|------|-------|--------|
| 1 | `types/vendor.ts` | 1 | ⬜ |
| 2 | `components/admin/Sidebar.tsx` | 8 | ⬜ |
| 3 | `app/api/checkout/create-order/route.ts` | 8 | ⬜ |
| 4 | `app/api/checkout/paystation/callback/route.ts` | 8 | ⬜ |

---

## Progress Log

### January 24, 2026
- [ ] Phase 1: Database Schema & Types
- [ ] Phase 2: Transaction Ledger
- [ ] Phase 3: COD Collection Management
- [ ] Phase 4: Refund Management
- [ ] Phase 5: Vendor Payout System
- [ ] Phase 6: Financial Dashboard
- [ ] Phase 7: Reports & CSV Export
- [ ] Phase 8: Settings & Integration
- [ ] Phase 9: Testing & Verification

---

## Configuration

### Default Settings
- **Commission Rate:** 10% (configurable in settings)
- **Currency:** BDT (৳)
- **Date Format:** DD MMM YYYY

### Refund Reasons (Dropdown Options)
- Customer requested cancellation
- Item out of stock
- Item damaged during shipping
- Wrong item delivered
- Item not as described
- Quality issue
- Other (custom input)

### Transaction Types
| Type | Direction | Description |
|------|-----------|-------------|
| SALE | Income (+) | Payment received for order |
| REFUND | Expense (-) | Money returned to customer |
| COD_COLLECTION | Income (+) | Cash collected for COD order |
| VENDOR_PAYOUT | Expense (-) | Commission paid to vendor |
| ADJUSTMENT | Either | Manual adjustment by admin |

---

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/accounts/dashboard` | GET | Dashboard statistics |
| `/api/admin/accounts/transactions` | GET | List transactions |
| `/api/admin/accounts/transactions` | POST | Create manual transaction |
| `/api/admin/accounts/cod-collections` | GET | List COD orders |
| `/api/admin/accounts/cod-collections/[orderId]` | GET | COD collection details |
| `/api/admin/accounts/cod-collections/[orderId]` | POST | Mark as collected |
| `/api/admin/accounts/refunds` | GET | List refunds |
| `/api/admin/accounts/refunds` | POST | Create refund |
| `/api/admin/accounts/refunds/[id]` | GET | Refund details |
| `/api/admin/accounts/refunds/[id]` | PATCH | Update refund status |
| `/api/admin/accounts/vendor-payouts` | GET | List payouts |
| `/api/admin/accounts/vendor-payouts` | POST | Create payout |
| `/api/admin/accounts/vendor-payouts/[id]` | PATCH | Mark as paid |
| `/api/admin/accounts/vendor-payouts/calculate` | POST | Calculate earnings |
| `/api/admin/accounts/reports/revenue` | GET | Revenue report |
| `/api/admin/accounts/reports/export` | GET | Export CSV |
| `/api/admin/accounts/settings` | GET/PATCH | Commission settings |

---

## Sidebar Navigation

```
Dashboard
Orders
Products
Inventory
Accounts                    ← NEW (with DollarSign icon)
├── Dashboard              ← /admin/accounts
├── Transactions           ← /admin/accounts/transactions
├── COD Collections        ← /admin/accounts/cod-collections
├── Refunds                ← /admin/accounts/refunds
├── Vendor Payouts         ← /admin/accounts/vendor-payouts
├── Reports                ← /admin/accounts/reports
└── Settings               ← /admin/accounts/settings
Vendors
Brands
Categories
Sales Report
Settings
```

---

## Legend
- ⬜ Not Started
- 🔄 In Progress
- ✅ Completed
- ❌ Blocked/Issue

---

## Notes

### Dependencies
- Charts: Consider using `recharts` library (already common in Next.js projects)
- CSV Export: Use native JavaScript or `papaparse` library

### Security Considerations
- All endpoints require admin authentication via `getAdminSession()`
- Transaction amounts should be validated server-side
- Refund amounts cannot exceed order total

### Future Enhancements (Not in scope)
- PayStation API refund integration
- Automated vendor payout scheduling
- Email notifications for payouts
- Multi-currency support
- Tax calculations

# Virtual Card System — Implementation Guide

**Status:** COMPLETE
**Last Updated:** February 23, 2026

---

## Overview

Aline Mart Virtual Card is a store credit system. Users load money via PayStation, earn tier-based discounts on lifetime spend, and use their card balance as a payment method at checkout.

---

## How It Works

### For Users

1. **Get a Card** — Go to Account → Virtual Card → "Create Virtual Card"
2. **Top Up** — Pick an amount (min ৳1,000) → Pay via PayStation (bKash / Nagad / Cards)
3. **Earn Tiers** — Lifetime total loaded determines your discount tier (permanent progression)
4. **Pay at Checkout** — Select "Aline Mart Virtual Card" as payment method → Discount applied automatically → Balance deducted instantly

### Tier System

| Tier | Lifetime Loaded | Discount |
|------|----------------|----------|
| STANDARD | ৳0+ | 0% |
| SILVER | ৳5,000+ | 3% |
| GOLD | ৳15,000+ | 5% |
| PLATINUM | ৳50,000+ | 8% |

- Tiers are **permanent** — once reached, they never downgrade
- Discount applies to **product subtotal only** (not shipping)
- Tiers are **configurable** via the `settings` table (`key = 'virtual_card_tiers'`)

### Rules

- Auth required (logged-in users only)
- One card per user
- No expiry, no minimum balance to use
- Minimum top-up: ৳1,000
- Discount is always calculated **server-side** (never trusts client)

---

## Architecture

### Database Tables

**`VirtualCard`** — One per user
- `id`, `userId` (unique), `cardNumber` (XXXX-XXXX-XXXX-XXXX format)
- `balance`, `lifetimeLoaded`, `tierLevel`, `discountPercent`

**`VirtualCardTransaction`** — Ledger of all card activity
- `type`: `TOPUP` | `SPEND` | `REFUND_CREDIT`
- `amount`, `balanceAfter`, `orderId`, `paystationTrxId`, `description`

**`settings` table** — Tier configuration
- `key = 'virtual_card_tiers'` → JSONB array of tier definitions

**`deduct_virtual_card_balance()`** — Postgres function for atomic balance deduction with `FOR UPDATE` row lock to prevent race conditions.

### File Structure

```
types/virtual-card.ts              — TypeScript interfaces
lib/virtual-card.ts                — Server helpers (generate card, tier calc, add/deduct balance)
store/virtualCardStore.ts          — Zustand store (no localStorage — server-authoritative)
hooks/useVirtualCard.ts            — Hook wrapper

app/api/virtual-card/
  route.ts                         — GET: fetch user's card + tiers
  create/route.ts                  — POST: create card for user
  transactions/route.ts            — GET: paginated transaction history
  topup/initiate/route.ts          — POST: start PayStation top-up
  topup/callback/route.ts          — GET: PayStation callback → credit balance

app/account/virtual-card/
  page.tsx                         — Main virtual card page
  components/
    VirtualCardDisplay.tsx          — Credit card visual (burgundy gradient)
    TopUpForm.tsx                   — Preset + custom amount top-up
    TransactionHistory.tsx          — Color-coded transaction list

scripts/migrations/
  create-virtual-card-tables.sql   — Migration SQL
```

### Modified Files

```
types/paystation.ts                — Added callbackUrl to InitiatePaymentParams
lib/paystation.ts                  — Uses custom callbackUrl when provided
app/paystation/payment/page.tsx    — Reads callback_url query param for custom callbacks
types/checkout.ts                  — Added VIRTUAL_CARD to payment method enum
app/checkout/components/PaymentStep.tsx   — Virtual Card payment option
app/checkout/components/OrderSummary.tsx  — Discount line item display
app/checkout/CheckoutClient.tsx           — Fetches card, passes to payment/summary
app/api/checkout/create-order/route.ts    — VIRTUAL_CARD payment processing
app/account/page.tsx                      — Virtual Card card on dashboard
```

---

## Top-Up Flow (Technical)

```
User clicks "Top Up ৳X,000 via PayStation"
  → POST /api/virtual-card/topup/initiate
    → Validates amount >= 1,000
    → Auto-creates card if none exists
    → Creates invoice: VCTOP-{shortCardId}-{amount}-{timestamp}
    → Sandbox: redirects to /paystation/payment with callback_url param
    → Production: calls real PayStation API with custom callbackUrl

PayStation payment completes
  → GET /api/virtual-card/topup/callback?status=Success&invoice_number=...&trx_id=...
    → Parses cardId + amount from invoice number
    → Production: verifies transaction server-side via PayStation API
    → Idempotency check (won't double-credit same trx_id)
    → Credits balance via addBalance()
    → Recalculates tier based on new lifetimeLoaded
    → Logs VirtualCardTransaction (type: TOPUP)
    → Redirects to /account/virtual-card?topup=success
```

## Checkout Flow (Technical)

```
User selects "Aline Mart Virtual Card" at checkout
  → Client shows balance + discount % (display only)
  → POST /api/checkout/create-order with paymentMethod: VIRTUAL_CARD
    → Server fetches card, recalculates tier discount (never trusts client)
    → Applies discount to subtotal (not shipping)
    → Verifies sufficient balance for (subtotal - discount + shipping)
    → Creates order
    → Atomically deducts balance via Postgres deduct_virtual_card_balance()
    → Logs VirtualCardTransaction (type: SPEND)
    → Marks order as PAID + CONFIRM immediately
    → Decrements product stock
    → If deduction fails: rolls back order
  → Client redirects to /orders/{orderNumber}/confirmation
```

---

## Deployment Checklist

1. **Run migration SQL** — Execute `scripts/migrations/create-virtual-card-tables.sql` against Supabase (SQL Editor)
2. **Set environment variables** on Railway:
   ```
   PAYSTATION_SANDBOX_MODE=false
   PAYSTATION_CALLBACK_URL=https://yourdomain.com/api/checkout/paystation/callback
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. **Verify PayStation credentials** — `PAYSTATION_MERCHANT_ID` and `PAYSTATION_PASSWORD` must be real production values
4. **Reset test data** — Delete any fake balances/transactions created during sandbox testing

---

## Future Enhancements (Not Implemented)

- **Refund to card** — When orders paid by virtual card are cancelled/refunded, credit balance back (type: `REFUND_CREDIT`)
- **Admin tier management** — UI in admin panel to edit tier thresholds and percentages
- **Card transfer** — Transfer balance between users
- **Auto top-up** — Set a threshold to auto-top-up when balance drops below a certain amount

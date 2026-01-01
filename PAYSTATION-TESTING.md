# PayStation Mock Payment Gateway - Testing Guide

This guide explains how to test the PayStation payment integration using the mock payment gateway interface.

## Overview

Since you don't have a PayStation merchant account yet, we've created a **mock PayStation payment gateway** that simulates the real payment flow. This allows you to:

- Test the complete checkout process end-to-end
- Experience the payment UI your customers will see
- Simulate successful, failed, and cancelled payments
- Verify order creation, stock updates, and email notifications
- Test without spending real money or needing production credentials

## How It Works

### 1. Sandbox Mode Detection

The system automatically detects sandbox mode using the `PAYSTATION_SANDBOX_MODE` environment variable:

```env
PAYSTATION_SANDBOX_MODE=true  # Uses mock payment gateway
PAYSTATION_SANDBOX_MODE=false # Uses real PayStation API
```

### 2. Payment Flow

**Checkout Process:**

1. **Customer fills checkout form**
   - Contact info (email, phone)
   - Shipping address
   - Payment method selection (PayStation or COD)

2. **System creates pending order**
   - Validates stock availability
   - Creates order in database with PENDING status
   - Generates unique order number (e.g., AM-ABC123-XYZ789)

3. **Customer clicks "Pay Now"**
   - System initiates PayStation payment
   - In sandbox mode: Redirects to mock payment page at `/paystation/payment`
   - In production: Redirects to real PayStation gateway

4. **Mock Payment Gateway** (`/paystation/payment`)
   - Shows order details (order number, amount)
   - Displays payment method options:
     - **bKash** (pink/magenta wallet)
     - **Nagad** (orange wallet)
     - **Debit/Credit Card** (Visa, Mastercard, Amex)
   - Provides test actions:
     - **Success** - Simulates successful payment
     - **Fail** - Simulates payment failure
     - **Cancel** - Simulates user cancellation

5. **Payment Callback**
   - Mock gateway sends payment status to `/api/checkout/paystation/callback`
   - System verifies payment (skips real PayStation verification in sandbox)
   - Updates order status to PROCESSING
   - Decrements stock atomically
   - Sends confirmation email

6. **Order Confirmation**
   - Customer redirected to confirmation page
   - Cart automatically cleared
   - Order details displayed

## Testing the Mock Gateway

### Step 1: Verify Environment Setup

Make sure your `.env` file has:

```env
# PayStation Configuration
PAYSTATION_SANDBOX_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000

# These can be placeholders in sandbox mode
PAYSTATION_MERCHANT_ID=your-merchant-id-here
PAYSTATION_PASSWORD=your-api-password-here
PAYSTATION_API_URL=https://api.paystation.com.bd
```

### Step 2: Start Development Server

```bash
npm run dev
# Server runs on http://localhost:3000
```

### Step 3: Complete Test Checkout

1. **Add products to cart**
   - Browse products at `/products`
   - Click "Add to Cart" on any product
   - Verify cart icon updates

2. **Go to checkout**
   - Click cart icon in header
   - Click "Proceed to Checkout" button
   - Or navigate directly to `/checkout`

3. **Fill checkout form**

   **Contact Information:**
   ```
   Email: test@example.com
   Phone: 01712345678  (Valid Bangladesh format)
   ```

   **Shipping Address:**
   ```
   Full Name: John Doe
   Address Line 1: 123 Main Street
   City: Dhaka
   Division/State: Dhaka
   Zip Code: 1234  (4-digit format)
   Country: Bangladesh (auto-selected)
   ```

   **Payment Method:**
   - Select "PayStation (Online Payment)" or "Cash on Delivery"
   - Note: PayStation = FREE shipping, COD = ৳50 shipping

4. **Submit order**
   - Click "Place Order" button
   - Order created with PENDING status
   - System redirects to PayStation mock gateway

### Step 4: Test Payment Scenarios

#### Scenario A: Successful Payment

1. On mock gateway page, **select a payment method** (bKash, Nagad, or Card)
2. Click the green **"Success"** button
3. Watch the 2-second processing animation
4. **Expected outcome:**
   - Redirected to order confirmation page
   - Order status updated to PROCESSING
   - Stock decremented for purchased items
   - Confirmation email sent (if Resend configured)
   - Cart automatically cleared
   - Order details displayed with order number

#### Scenario B: Failed Payment

1. On mock gateway page, click the red **"Fail"** button (no need to select method)
2. **Expected outcome:**
   - Redirected to checkout page with error: `?payment=failed`
   - Order remains PENDING in database
   - Stock NOT decremented
   - Customer can retry payment

#### Scenario C: Cancelled Payment

1. On mock gateway page, click the gray **"Cancel"** button
2. **Expected outcome:**
   - Redirected to checkout page with cancellation: `?payment=cancelled`
   - Order remains PENDING
   - Customer can modify order or retry

### Step 5: Verify Order in Database

After successful payment, check your Supabase dashboard:

**Order Table:**
```sql
SELECT * FROM "Order" WHERE "orderNumber" = 'AM-XXX-XXX';
-- Should show status = 'PROCESSING'
-- paystationTransactionId = 'MOCK-<timestamp>'
```

**ProductVariant Table:**
```sql
SELECT * FROM "ProductVariant" WHERE id = '<variant-id>';
-- Stock should be decremented by quantity purchased
```

## Mock Payment Gateway Features

### Visual Design

The mock gateway mimics a real payment processor:

- **Professional layout** - Clean, trustworthy interface
- **Payment method cards** - Visual representation of bKash, Nagad, and Card options
- **Order summary** - Shows order number, merchant ID, and amount
- **Development badge** - Yellow "DEV MODE" indicator for clarity
- **Security badge** - "Secured by PayStation (Mock)" footer

### Payment Method Selection

Each payment method has:
- **Icon** - Visual identifier (smartphone, wallet, credit card)
- **Color coding** - bKash (pink), Nagad (orange), Card (blue)
- **Hover effect** - Interactive feedback
- **Selection state** - Highlighted border and checkmark when selected

### Test Actions

Three colored buttons for different test scenarios:

1. **Green "Success" button**
   - Requires payment method selection
   - Simulates successful payment
   - Shows loading spinner during processing

2. **Red "Fail" button**
   - No payment method required
   - Simulates payment decline/failure
   - Useful for testing error handling

3. **Gray "Cancel" button**
   - No payment method required
   - Simulates user cancellation
   - Useful for testing abandoned checkout

## Troubleshooting

### Issue: "Invalid payment session"

**Cause:** Missing URL parameters (invoice_number, amount)

**Fix:** Don't navigate directly to `/paystation/payment`. Always start from checkout flow.

### Issue: Redirect loop or errors

**Cause:** Missing `NEXT_PUBLIC_APP_URL` environment variable

**Fix:** Add to `.env`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Restart dev server after changes.

### Issue: Order stays PENDING after success

**Cause:** Callback endpoint might have errors

**Fix:** Check browser console and terminal logs for errors. Common issues:
- Database connection problems
- Missing order data
- Stock validation failures

### Issue: Cart not clearing after payment

**Cause:** `clearCart` flag not passed or localStorage issue

**Fix:** Confirmation page should have `?clearCart=true` in URL. Check browser localStorage manually:
```javascript
// In browser console
localStorage.removeItem('cart-storage')
window.dispatchEvent(new Event('storage'))
```

### Issue: Email not sending

**Cause:** Resend API key not configured

**Fix:** This is expected if you haven't set up Resend. Email sending fails gracefully without breaking the order flow. To enable:

1. Sign up at https://resend.com (free tier: 3,000 emails/month)
2. Add API key to `.env`:
   ```env
   RESEND_API_KEY=re_your_actual_api_key
   FROM_EMAIL=orders@yourdomain.com
   FROM_NAME=Aline Mart
   ```
3. Restart dev server

## Testing Checklist

Use this checklist to verify the complete payment flow:

- [ ] **Setup**
  - [ ] Environment variables configured
  - [ ] `PAYSTATION_SANDBOX_MODE=true`
  - [ ] `NEXT_PUBLIC_APP_URL` set
  - [ ] Dev server running

- [ ] **Checkout Flow**
  - [ ] Can add products to cart
  - [ ] Cart count updates correctly
  - [ ] Checkout page loads
  - [ ] Contact form validates Bangladesh phone (01X-XXXX-XXXX)
  - [ ] Shipping form validates 4-digit zip code
  - [ ] Payment method selection works
  - [ ] Shipping cost updates based on payment method (COD = ৳50)
  - [ ] Order summary shows correct totals

- [ ] **Order Creation**
  - [ ] "Place Order" creates order in database
  - [ ] Order status is PENDING
  - [ ] Redirects to mock PayStation page
  - [ ] Order details displayed correctly

- [ ] **Mock Payment Gateway**
  - [ ] Page loads with order details
  - [ ] All three payment methods visible (bKash, Nagad, Card)
  - [ ] Can select payment method (highlights on select)
  - [ ] "Success" button disabled until method selected
  - [ ] DEV MODE badge visible

- [ ] **Successful Payment**
  - [ ] Select payment method
  - [ ] Click "Success" button
  - [ ] Shows processing animation (2 seconds)
  - [ ] Redirects to order confirmation
  - [ ] Order status updated to PROCESSING in database
  - [ ] Transaction ID saved (format: MOCK-<timestamp>)
  - [ ] Stock decremented for all items
  - [ ] Cart cleared automatically
  - [ ] Order confirmation displays all details

- [ ] **Failed Payment**
  - [ ] Click "Fail" button
  - [ ] Redirects to checkout with `?payment=failed` error
  - [ ] Order remains PENDING
  - [ ] Stock unchanged
  - [ ] Error message displayed

- [ ] **Cancelled Payment**
  - [ ] Click "Cancel" button
  - [ ] Redirects to checkout with `?payment=cancelled`
  - [ ] Order remains PENDING
  - [ ] Can retry checkout

- [ ] **Email Notifications** (if Resend configured)
  - [ ] Order confirmation email sent
  - [ ] Payment received email sent
  - [ ] Emails contain correct order details

## Next Steps: Production Setup

When you create your real PayStation merchant account:

1. **Get credentials from PayStation**
   - Sign up at https://www.paystation.com.bd/
   - Get Merchant ID and API Password
   - Note the production API URL

2. **Update environment variables**
   ```env
   # Switch to production mode
   PAYSTATION_SANDBOX_MODE=false

   # Add real credentials
   PAYSTATION_MERCHANT_ID=your-real-merchant-id
   PAYSTATION_PASSWORD=your-real-api-password
   PAYSTATION_API_URL=https://api.paystation.com.bd

   # Update URLs to your production domain
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   PAYSTATION_SUCCESS_URL=https://yourdomain.com/api/checkout/paystation/callback
   PAYSTATION_FAIL_URL=https://yourdomain.com/checkout?payment=failed
   PAYSTATION_CANCEL_URL=https://yourdomain.com/checkout?payment=cancelled
   ```

3. **Test in PayStation's sandbox first**
   - Most payment gateways provide a test environment
   - Verify HMAC signature verification works
   - Test with real payment method credentials (if provided)
   - Confirm callback handling works correctly

4. **Deploy to production**
   - Update `.env` in your hosting platform (Vercel/Railway/etc.)
   - Test complete flow in staging environment
   - Monitor logs for any issues
   - Go live!

## Security Notes

### Why Sandbox Mode Is Safe for Development

The mock gateway:
- ✅ Only works when `PAYSTATION_SANDBOX_MODE=true`
- ✅ Uses a recognizable mock signature (`mock_signature_for_dev`)
- ✅ Clearly labeled with "DEV MODE" badges
- ✅ Never touches real money or payment networks
- ✅ Cannot be used in production (signature verification fails)

### Production Security Features

When you switch to production mode (`PAYSTATION_SANDBOX_MODE=false`):
- ✅ **HMAC signature verification** - Prevents callback URL tampering
- ✅ **Server-side transaction verification** - Never trusts client-side params
- ✅ **Idempotency checks** - Prevents duplicate payment processing
- ✅ **Atomic stock operations** - Prevents overselling race conditions
- ✅ **Order status validation** - Prevents invalid state transitions

## Support

If you encounter issues:

1. **Check browser console** - Look for JavaScript errors
2. **Check terminal logs** - Server-side errors appear here
3. **Verify database** - Use Supabase dashboard to inspect Order table
4. **Review this guide** - Follow testing checklist step-by-step
5. **Check environment variables** - Ensure all required vars are set

## Summary

The mock PayStation gateway provides a **complete, realistic payment testing experience** without requiring:
- Real merchant account
- Production credentials
- Actual money transactions
- External API dependencies

This lets you:
- ✅ Test the entire checkout flow
- ✅ Verify order processing logic
- ✅ Validate stock management
- ✅ Check email notifications
- ✅ Debug issues early
- ✅ Demo the system to stakeholders

When you're ready for production, simply update your `.env` file with real credentials and set `PAYSTATION_SANDBOX_MODE=false`. The entire system will seamlessly switch to using the real PayStation API!

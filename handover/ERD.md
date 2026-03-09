# Aline Mart — Entity Relationship Diagram

> 23 active tables across 6 domains. Rendered with Mermaid `erDiagram`.

```mermaid
erDiagram

    %% ════════════════════════════════════════════
    %% CORE E-COMMERCE
    %% ════════════════════════════════════════════

    User {
        TEXT id PK
        TEXT email UK
        TEXT name
        TEXT password
        BOOLEAN isGuest
        VARCHAR role "CUSTOMER | ADMIN | SUPER_ADMIN"
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    Brand {
        TEXT id PK
        TEXT name UK
        TEXT slug UK
        TEXT logo
        TEXT description
        TIMESTAMP createdAt
    }

    Category {
        TEXT id PK
        TEXT name
        TEXT slug UK
        TEXT parentId FK "self-ref"
        BOOLEAN featured
    }

    Product {
        TEXT id PK
        TEXT name
        TEXT slug UK
        TEXT description
        DOUBLE price
        DOUBLE salePrice
        DECIMAL costPrice
        TEXT sku
        TEXT brandId FK
        TEXT categoryId FK
        UUID vendorId FK
        BOOLEAN featured
        BOOLEAN isNew
        BOOLEAN inStock
        NUMERIC shippingFeeInsideDhaka
        NUMERIC shippingFeeOutsideDhaka
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    ProductImage {
        TEXT id PK
        TEXT url
        TEXT alt
        INTEGER order
        TEXT productId FK
    }

    ProductVariant {
        TEXT id PK
        TEXT productId FK
        TEXT color
        TEXT size
        TEXT sku UK
        INTEGER stock
        DOUBLE priceModifier
        INTEGER lowStockThreshold
    }

    Address {
        TEXT id PK
        TEXT userId FK
        TEXT fullName
        TEXT phone
        TEXT addressLine1
        TEXT addressLine2
        TEXT city
        TEXT state
        TEXT zipCode
        TEXT country
        BOOLEAN isDefault
        INTEGER pathaoCityId
        INTEGER pathaoZoneId
        INTEGER pathaoAreaId
    }

    Order {
        TEXT id PK
        TEXT orderNumber UK
        TEXT userId FK
        DOUBLE total
        TEXT status "NEW | PENDING | CONFIRM | CANCEL | ..."
        TEXT shippingAddressId FK
        TEXT paymentMethod "PAYSTATION | COD"
        DOUBLE shippingCost
        TEXT paystationTransactionId
        TEXT shippingStatus "PROCESSING | READY_TO_DISPATCH | ..."
        TEXT codCollectionStatus
        TEXT refundStatus
        TEXT cancellationReason
        TEXT pathaoConsignmentId
        DOUBLE pathaoDeliveryFee
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    OrderItem {
        TEXT id PK
        TEXT orderId FK
        TEXT productId
        TEXT productName
        TEXT brandName
        TEXT variantId
        TEXT variantName
        INTEGER quantity
        DOUBLE price
        DOUBLE total
        DOUBLE costPrice
        TEXT subOrderNumber
        TEXT status "ACTIVE | CANCELLED | RETURNED | REFUNDED"
        TEXT itemCancellationReason
        TEXT vendor
    }

    WishlistItem {
        TEXT id PK
        TEXT userId FK
        TEXT productId
        TIMESTAMP createdAt
    }

    %% ════════════════════════════════════════════
    %% FINANCIAL
    %% ════════════════════════════════════════════

    Transaction {
        TEXT id PK
        VARCHAR type "SALE | REFUND | COD_COLLECTION | ..."
        DECIMAL amount
        TEXT orderId FK
        TEXT refundId FK
        TEXT vendorPayoutId FK
        TEXT description
        VARCHAR reference
        TIMESTAMP createdAt
        TEXT createdBy FK
    }

    Refund {
        TEXT id PK
        TEXT orderId FK
        TEXT orderItemId FK
        DECIMAL amount
        TEXT reason
        VARCHAR status "PENDING | PROCESSED | REJECTED"
        VARCHAR type "FULL | PARTIAL"
        BOOLEAN restoreStock
        TIMESTAMP processedAt
        TEXT processedBy FK
        TEXT notes
        TIMESTAMP createdAt
    }

    CODCollection {
        TEXT id PK
        TEXT orderId FK_UK
        DECIMAL expectedAmount
        DECIMAL collectedAmount
        TIMESTAMP collectedAt
        TEXT collectedBy FK
        VARCHAR status "PENDING | COLLECTED | PARTIAL | FAILED"
        TEXT notes
        TIMESTAMP createdAt
    }

    Vendor {
        UUID id PK
        VARCHAR shopName
        VARCHAR ownerName
        VARCHAR mobile
        VARCHAR email UK
        VARCHAR businessType "INDIVIDUAL | COMPANY"
        VARCHAR nationalId
        VARCHAR tinNumber
        TEXT pickupAddress
        TEXT returnAddress
        VARCHAR status "ACTIVE | INACTIVE"
        TIMESTAMP onboardingDate
        VARCHAR bankName
        VARCHAR bankBranch
        VARCHAR accountHolderName
        VARCHAR accountNumber
        VARCHAR routingNumber
        JSONB mobileBanking
        DECIMAL commissionRate
        TEXT notes
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    VendorPayout {
        TEXT id PK
        UUID vendorId FK
        DATE periodStart
        DATE periodEnd
        DECIMAL totalSales
        DECIMAL commissionRate
        DECIMAL commissionAmount
        DECIMAL payoutAmount
        VARCHAR status "PENDING | PAID"
        TIMESTAMP paidAt
        TEXT paidBy FK
        VARCHAR reference
        TEXT notes
        TIMESTAMP createdAt
    }

    %% ════════════════════════════════════════════
    %% INVENTORY
    %% ════════════════════════════════════════════

    InventoryLog {
        TEXT id PK
        TEXT variantId FK
        TEXT productId
        INTEGER previousStock
        INTEGER newStock
        INTEGER changeAmount
        TEXT changeType "SALE | RESTOCK | RETURN | ..."
        TEXT reason
        TEXT orderId
        TEXT adminId
        TIMESTAMP createdAt
    }

    %% ════════════════════════════════════════════
    %% SIGNATURE CARDS
    %% ════════════════════════════════════════════

    SignatureCard {
        UUID id PK
        TEXT userId FK
        TEXT category "CROWN | PRIVILEGE | CAMPUS"
        TEXT cardNumber UK
        TEXT cardholderName
        NUMERIC balance
        NUMERIC purchasePrice
        TIMESTAMPTZ validFrom
        TIMESTAMPTZ validUntil
        BOOLEAN isActive
        TEXT paystationTrxId
        TEXT mailingAddress
        TEXT physicalCardStatus "PENDING | SHIPPED | DELIVERED"
        TEXT email
        TEXT phone
        DATE dateOfBirth
        DATE weddingAnniversary
        JSONB perCardOffers
        TIMESTAMPTZ createdAt
        TIMESTAMPTZ updatedAt
    }

    CardTransaction {
        UUID id PK
        UUID cardId FK
        TEXT type "PURCHASE | SPEND | DISCOUNT_USED | REFUND_CREDIT"
        NUMERIC amount
        NUMERIC balanceAfter
        UUID orderId
        TEXT paystationTrxId
        TEXT description
        TIMESTAMPTZ createdAt
    }

    CardOTP {
        UUID id PK
        UUID cardId FK
        TEXT otpCode
        TIMESTAMPTZ expiresAt
        TIMESTAMPTZ usedAt
        INT attempts
        UUID usedForOrderId
        TIMESTAMPTZ createdAt
    }

    %% ════════════════════════════════════════════
    %% ADMIN
    %% ════════════════════════════════════════════

    admin_permissions {
        TEXT id PK
        TEXT user_id FK_UK
        JSONB modules
        BOOLEAN is_active
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TEXT created_by FK
    }

    admin_activity_log {
        TEXT id PK
        TEXT admin_id FK
        VARCHAR action
        VARCHAR entity_type
        TEXT entity_id
        JSONB details
        TIMESTAMP created_at
    }

    settings {
        TEXT id PK
        VARCHAR key UK
        JSONB value
        TIMESTAMP updated_at
    }

    %% ════════════════════════════════════════════
    %% PROMOTIONAL
    %% ════════════════════════════════════════════

    CategoryBanner {
        TEXT id PK
        TEXT categoryId FK_UK
        TEXT imageUrl
        TEXT title
        TEXT subtitle
        TEXT linkUrl
        BOOLEAN isActive
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    %% ════════════════════════════════════════════
    %% RELATIONSHIPS
    %% ════════════════════════════════════════════

    %% Core E-Commerce
    Category ||--o{ Category : "parentId (self-ref)"
    Brand ||--o{ Product : "brandId"
    Category ||--o{ Product : "categoryId"
    Vendor ||--o{ Product : "vendorId"
    Product ||--o{ ProductImage : "productId (CASCADE)"
    Product ||--o{ ProductVariant : "productId (CASCADE)"
    User ||--o{ Address : "userId (CASCADE)"
    User ||--o{ Order : "userId"
    Address ||--o{ Order : "shippingAddressId"
    Order ||--o{ OrderItem : "orderId (CASCADE)"
    User ||--o{ WishlistItem : "userId (CASCADE)"

    %% Financial
    Order ||--o{ Transaction : "orderId"
    Refund ||--o{ Transaction : "refundId"
    VendorPayout ||--o{ Transaction : "vendorPayoutId"
    User ||--o{ Transaction : "createdBy"
    Order ||--o{ Refund : "orderId (CASCADE)"
    OrderItem ||--o| Refund : "orderItemId"
    Order ||--|| CODCollection : "orderId (CASCADE)"
    Vendor ||--o{ VendorPayout : "vendorId (CASCADE)"
    User ||--o{ VendorPayout : "paidBy"
    User ||--o{ Refund : "processedBy"
    User ||--o{ CODCollection : "collectedBy"

    %% Inventory
    ProductVariant ||--o{ InventoryLog : "variantId (CASCADE)"

    %% Signature Cards
    User ||--o{ SignatureCard : "userId (CASCADE)"
    SignatureCard ||--o{ CardTransaction : "cardId (CASCADE)"
    SignatureCard ||--o{ CardOTP : "cardId (CASCADE)"

    %% Admin
    User ||--o| admin_permissions : "user_id (CASCADE)"
    User ||--o{ admin_activity_log : "admin_id (CASCADE)"
    User ||--o{ admin_permissions : "created_by"

    %% Promotional
    Category ||--o| CategoryBanner : "categoryId (CASCADE)"
```

## Table Count by Domain

| Domain | Count | Tables |
|--------|-------|--------|
| Core E-Commerce | 10 | User, Brand, Category, Product, ProductImage, ProductVariant, Address, Order, OrderItem, WishlistItem |
| Financial | 5 | Transaction, Refund, CODCollection, Vendor, VendorPayout |
| Inventory | 1 | InventoryLog |
| Signature Cards | 3 | SignatureCard, CardTransaction, CardOTP |
| Admin | 3 | admin_permissions, admin_activity_log, settings |
| Promotional | 1 | CategoryBanner |
| **Total** | **23** | |

## Notes

- **Deprecated tables** (excluded): `VirtualCard_deprecated`, `VirtualCardTransaction_deprecated`
- **ID types**: Most tables use `TEXT` PKs (generated via `gen_random_uuid()::TEXT`). Exceptions: `Vendor` uses native `UUID`, `SignatureCard`/`CardTransaction`/`CardOTP` use native `UUID`.
- **Naming convention**: Core tables use PascalCase; admin tables use snake_case.
- **Stored function**: `deduct_signature_card_balance(card_id UUID, deduct_amount NUMERIC)` — atomic balance deduction with row-level locking.

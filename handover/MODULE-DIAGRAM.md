# Aline Mart — Module Relationship Diagram

> Architecture overview showing how all layers connect. Rendered with Mermaid `graph TD`.

```mermaid
graph TD
    %% ════════════════════════════════════════════
    %% LAYER 1 — PAGES (Next.js App Router)
    %% ════════════════════════════════════════════

    subgraph Pages["Layer 1 — Pages"]
        direction TB

        subgraph Public["Public Storefront"]
            P_Home["/ Home"]
            P_Products["Products Listing"]
            P_ProductDetail["Product Detail"]
            P_Categories["Categories"]
            P_Brands["Brands"]
            P_Search["Search"]
            P_Cart["Cart"]
            P_Checkout["Checkout"]
            P_Wishlist["Wishlist"]
        end

        subgraph Auth["Authentication"]
            A_Login["Login"]
            A_Signup["Signup"]
            A_OAuth["OAuth Callback"]
        end

        subgraph Account["Customer Account"]
            AC_Dashboard["Dashboard"]
            AC_Profile["Profile"]
            AC_Orders["Orders"]
            AC_Addresses["Addresses"]
            AC_Card["Signature Card"]
        end

        subgraph Admin["Admin Panel"]
            AD_Dash["Dashboard"]
            AD_Orders["Orders"]
            AD_Products["Products"]
            AD_Inventory["Inventory"]
            AD_Brands["Brands"]
            AD_Categories["Categories"]
            AD_Vendors["Vendors"]
            AD_Accounts["Accounts"]
            AD_Banners["Banners"]
            AD_Settings["Settings"]
            AD_Admins["Admin Users"]
            AD_Reports["Reports"]
        end
    end

    %% ════════════════════════════════════════════
    %% LAYER 2 — COMPONENTS
    %% ════════════════════════════════════════════

    subgraph Components["Layer 2 — Components"]
        direction TB

        subgraph Layout["Layout"]
            C_Header["Header"]
            C_Footer["Footer"]
            C_LayoutWrapper["LayoutWrapper"]
        end

        subgraph ProductComponents["Product Components"]
            C_ProductCard["ProductCard"]
            C_ProductGrid["ProductGrid"]
            C_Filters["ProductFilters"]
            C_Sorter["ProductSorter"]
        end

        subgraph AdminComponents["Admin Components"]
            C_Sidebar["Sidebar"]
            C_AdminHeader["AdminHeader"]
            C_MetricCard["MetricCard"]
            C_InvModals["Inventory Modals"]
            C_AcctComps["Accounts Components"]
        end

        subgraph UI["UI Primitives (Radix/Shadcn)"]
            C_Button["Button"]
            C_Input["Input"]
            C_Dialog["Dialog"]
            C_Sheet["Sheet"]
            C_Dropdown["DropdownMenu"]
        end
    end

    %% ════════════════════════════════════════════
    %% LAYER 3 — STATE MANAGEMENT
    %% ════════════════════════════════════════════

    subgraph State["Layer 3 — State (Zustand)"]
        direction LR
        S_Cart["cartStore → useCart"]
        S_Wishlist["wishlistStore → useWishlist"]
        S_Auth["authStore → useAuth"]
        S_SigCard["signatureCardStore → useSignatureCard"]
    end

    %% ════════════════════════════════════════════
    %% LAYER 4 — API ROUTES
    %% ════════════════════════════════════════════

    subgraph API["Layer 4 — API Routes (~67 endpoints)"]
        direction TB

        subgraph PublicAPI["Public"]
            API_Products["/api/products"]
            API_Brands["/api/brands"]
            API_Categories["/api/categories"]
            API_Search["/api/search"]
            API_Orders["/api/orders"]
        end

        subgraph CheckoutAPI["Checkout & Shipping"]
            API_Checkout["/api/checkout/*"]
            API_Shipping["/api/shipping/*"]
        end

        subgraph AuthAPI["Auth"]
            API_NextAuth["/api/auth/[...nextauth]"]
            API_AdminLogin["/api/admin/login"]
        end

        subgraph AdminAPI["Admin"]
            API_AOrders["/api/admin/orders/*"]
            API_AProducts["/api/admin/products/*"]
            API_AInventory["/api/admin/inventory/*"]
            API_ABrands["/api/admin/brands/*"]
            API_ACategories["/api/admin/categories/*"]
            API_AVendors["/api/admin/vendors/*"]
            API_AAccounts["/api/admin/accounts/*"]
            API_ACards["/api/admin/signature-cards/*"]
            API_AAdmins["/api/admin/admins/*"]
            API_ASettings["/api/admin/settings"]
            API_ABanners["/api/admin/banners/*"]
            API_AReports["/api/admin/reports/*"]
        end
    end

    %% ════════════════════════════════════════════
    %% LAYER 5 — SERVICES (lib/)
    %% ════════════════════════════════════════════

    subgraph Services["Layer 5 — Services (lib/)"]
        direction TB

        subgraph Database["Database"]
            SV_Supabase["supabase.ts"]
            SV_SupaServer["supabase/server.ts"]
        end

        subgraph AuthServices["Auth"]
            SV_SupaAuth["supabase-auth.ts (customer)"]
            SV_AdminAuth["admin-auth.ts (admin)"]
            SV_NextAuth["auth.ts (NextAuth)"]
        end

        subgraph BusinessLogic["Business Logic"]
            SV_Inventory["inventory.ts"]
            SV_OrderUtils["order-utils.ts"]
            SV_Accounts["accounts.ts"]
            SV_Shipping["shipping.ts"]
            SV_SigCard["signature-card.ts"]
        end

        subgraph Integrations["External Integrations"]
            SV_Paystation["paystation.ts (payments)"]
            SV_Pathao["pathao.ts (courier)"]
            SV_Email["email.ts (Brevo/Resend)"]
        end

        subgraph Utilities["Utilities"]
            SV_Utils["utils.ts"]
            SV_VariantUtils["variant-utils.ts"]
            SV_AdminModules["admin-modules.ts"]
            SV_ApiUrl["api-url.ts"]
        end
    end

    %% ════════════════════════════════════════════
    %% LAYER 6 — DATABASE
    %% ════════════════════════════════════════════

    subgraph DB["Layer 6 — Database (Supabase PostgreSQL)"]
        DB_Tables["23 Tables · See ERD.md"]
        DB_RLS["Row Level Security"]
        DB_Functions["Stored Functions"]
    end

    %% ════════════════════════════════════════════
    %% DEPENDENCY ARROWS
    %% ════════════════════════════════════════════

    %% Pages → Components
    Public --> Layout
    Public --> ProductComponents
    Public --> UI
    Auth --> Layout
    Auth --> UI
    Account --> Layout
    Account --> UI
    Admin --> AdminComponents
    Admin --> UI

    %% Pages → State (via hooks)
    Public --> State
    Auth --> State
    Account --> State
    Admin --> State

    %% Pages → API (client-side fetches)
    Public -.->|fetch| PublicAPI
    Public -.->|fetch| CheckoutAPI
    Auth -.->|fetch| AuthAPI
    Account -.->|fetch| PublicAPI
    Admin -.->|fetch| AdminAPI

    %% API → Services
    PublicAPI --> Database
    PublicAPI --> BusinessLogic
    CheckoutAPI --> BusinessLogic
    CheckoutAPI --> Integrations
    AuthAPI --> AuthServices
    AdminAPI --> Database
    AdminAPI --> BusinessLogic
    AdminAPI --> AuthServices

    %% Services → Database
    Database --> DB
    BusinessLogic --> Database
    AuthServices --> Database
    Integrations -.->|external| SV_Paystation
    Integrations -.->|external| SV_Pathao
    Integrations -.->|external| SV_Email
```

## Layer Summary

| Layer | Description | Key Technologies |
|-------|-------------|-----------------|
| **Pages** | Next.js 16 App Router (RSC + Client) | React 19, TypeScript |
| **Components** | Reusable UI building blocks | Tailwind CSS 4, Radix UI, Shadcn |
| **State** | Client-side state with persistence | Zustand + localStorage |
| **API Routes** | ~67 REST endpoints | Next.js Route Handlers |
| **Services** | Business logic + integrations | Supabase JS, NextAuth, PayStation, Pathao, Brevo |
| **Database** | PostgreSQL with RLS | Supabase (hosted) |

## Data Flow

```
Browser → Pages (RSC/Client) → API Routes → Services → Supabase PostgreSQL
                ↕                                ↕
          Zustand Stores              External APIs (PayStation, Pathao, Brevo)
```

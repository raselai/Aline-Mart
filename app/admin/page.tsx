import { supabase } from '@/lib/supabase'
import MetricCard from '@/components/admin/MetricCard'
import Link from 'next/link'
import { Package, Tag, Layers, TrendingUp, Plus, ShoppingBag, Clock } from 'lucide-react'

async function getDashboardMetrics() {
  try {
    // Get total products
    const { count: totalProducts } = await supabase
      .from('Product')
      .select('*', { count: 'exact', head: true })

    // Get in-stock products
    const { count: inStockProducts } = await supabase
      .from('Product')
      .select('*', { count: 'exact', head: true })
      .eq('inStock', true)

    // Get total brands
    const { count: totalBrands } = await supabase
      .from('Brand')
      .select('*', { count: 'exact', head: true })

    // Get total categories
    const { count: totalCategories } = await supabase
      .from('Category')
      .select('*', { count: 'exact', head: true })

    // Get total orders
    const { count: totalOrders } = await supabase
      .from('Order')
      .select('*', { count: 'exact', head: true })

    // Get pending orders
    const { count: pendingOrders } = await supabase
      .from('Order')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING')

    // Get today's orders
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: todaysOrders } = await supabase
      .from('Order')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', today.toISOString())

    return {
      totalProducts: totalProducts || 0,
      inStockProducts: inStockProducts || 0,
      outOfStockProducts: (totalProducts || 0) - (inStockProducts || 0),
      totalBrands: totalBrands || 0,
      totalCategories: totalCategories || 0,
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      todaysOrders: todaysOrders || 0,
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return {
      totalProducts: 0,
      inStockProducts: 0,
      outOfStockProducts: 0,
      totalBrands: 0,
      totalCategories: 0,
      totalOrders: 0,
      pendingOrders: 0,
      todaysOrders: 0,
    }
  }
}

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics()

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-serif font-bold mb-2"
          style={{
            color: '#2C2C2C',
            whiteSpace: 'normal'
          }}
        >
          Welcome to Admin Dashboard
        </h1>
        <p
          className="text-lg"
          style={{
            color: '#6B7280',
            whiteSpace: 'normal',
            wordBreak: 'normal',
            display: 'block'
          }}
        >
          Manage your products, brands, categories, and site settings.
        </p>
      </div>

      {/* Order Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders}
          subtitle={`${metrics.todaysOrders} today`}
          icon={ShoppingBag}
          iconColor="#8e2157"
          iconBgColor="#fdf2f8"
        />
        <MetricCard
          title="Pending Orders"
          value={metrics.pendingOrders}
          subtitle="Awaiting processing"
          icon={Clock}
          iconColor="#f59e0b"
          iconBgColor="#fef3c7"
        />
        <MetricCard
          title="Today's Orders"
          value={metrics.todaysOrders}
          subtitle="Orders placed today"
          icon={TrendingUp}
          iconColor="#16a34a"
          iconBgColor="#f0fdf4"
        />
      </div>

      {/* Product Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Products"
          value={metrics.totalProducts}
          subtitle={`${metrics.inStockProducts} in stock, ${metrics.outOfStockProducts} out of stock`}
          icon={Package}
          iconColor="#8e2157"
          iconBgColor="#fdf2f8"
        />
        <MetricCard
          title="Total Brands"
          value={metrics.totalBrands}
          subtitle="Active brands"
          icon={Tag}
          iconColor="#2563eb"
          iconBgColor="#eff6ff"
        />
        <MetricCard
          title="Total Categories"
          value={metrics.totalCategories}
          subtitle="Product categories"
          icon={Layers}
          iconColor="#16a34a"
          iconBgColor="#f0fdf4"
        />
        <MetricCard
          title="In Stock Products"
          value={metrics.inStockProducts}
          subtitle="Available for sale"
          icon={TrendingUp}
          iconColor="#ea580c"
          iconBgColor="#fff7ed"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2
          className="text-2xl font-serif font-bold mb-4"
          style={{
            color: '#2C2C2C',
            whiteSpace: 'nowrap'
          }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center justify-center px-6 py-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all"
            style={{
              borderColor: '#e5e7eb',
              minHeight: '80px'
            }}
          >
            <ShoppingBag className="w-5 h-5 mr-2" style={{ color: '#8e2157' }} />
            <span
              className="font-medium"
              style={{
                color: '#2C2C2C',
                whiteSpace: 'nowrap'
              }}
            >
              View Orders
            </span>
          </Link>

          <Link
            href="/admin/products/new"
            className="flex items-center justify-center px-6 py-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all"
            style={{
              borderColor: '#e5e7eb',
              minHeight: '80px'
            }}
          >
            <Plus className="w-5 h-5 mr-2" style={{ color: '#16a34a' }} />
            <span
              className="font-medium"
              style={{
                color: '#2C2C2C',
                whiteSpace: 'nowrap'
              }}
            >
              Add New Product
            </span>
          </Link>

          <Link
            href="/admin/brands"
            className="flex items-center justify-center px-6 py-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all"
            style={{
              borderColor: '#e5e7eb',
              minHeight: '80px'
            }}
          >
            <Tag className="w-5 h-5 mr-2" style={{ color: '#2563eb' }} />
            <span
              className="font-medium"
              style={{
                color: '#2C2C2C',
                whiteSpace: 'nowrap'
              }}
            >
              Manage Brands
            </span>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center justify-center px-6 py-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all"
            style={{
              borderColor: '#e5e7eb',
              minHeight: '80px'
            }}
          >
            <Package className="w-5 h-5 mr-2" style={{ color: '#ea580c' }} />
            <span
              className="font-medium"
              style={{
                color: '#2C2C2C',
                whiteSpace: 'nowrap'
              }}
            >
              Site Settings
            </span>
          </Link>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div
        className="bg-white rounded-lg shadow-sm border p-6"
        style={{
          borderColor: '#e5e7eb',
          minWidth: '280px'
        }}
      >
        <h2
          className="text-xl font-serif font-bold mb-4"
          style={{
            color: '#2C2C2C',
            whiteSpace: 'normal'
          }}
        >
          Getting Started
        </h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5"
              style={{
                backgroundColor: '#fdf2f8',
                color: '#8e2157',
                fontSize: '14px',
                fontWeight: 'bold',
                flexShrink: 0
              }}
            >
              1
            </div>
            <div>
              <p
                className="font-medium mb-1"
                style={{
                  color: '#2C2C2C',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  display: 'block'
                }}
              >
                Add your products
              </p>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  display: 'block',
                  overflowWrap: 'normal'
                }}
              >
                Start by adding products to your catalog with images, prices, and variants.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5"
              style={{
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontSize: '14px',
                fontWeight: 'bold',
                flexShrink: 0
              }}
            >
              2
            </div>
            <div>
              <p
                className="font-medium mb-1"
                style={{
                  color: '#2C2C2C',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  display: 'block'
                }}
              >
                Organize with brands and categories
              </p>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  display: 'block',
                  overflowWrap: 'normal'
                }}
              >
                Create brands and categories to help customers find products easily.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5"
              style={{
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                fontSize: '14px',
                fontWeight: 'bold',
                flexShrink: 0
              }}
            >
              3
            </div>
            <div>
              <p
                className="font-medium mb-1"
                style={{
                  color: '#2C2C2C',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  display: 'block'
                }}
              >
                Configure your settings
              </p>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  display: 'block',
                  overflowWrap: 'normal'
                }}
              >
                Set up shipping rates, tax configuration, and other site settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

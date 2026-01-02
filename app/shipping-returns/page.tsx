'use client'

import { Package, Truck, Globe, Clock, RefreshCw, CheckCircle, XCircle, AlertCircle, MapPin, Phone, Mail } from 'lucide-react'

export default function ShippingReturnsPage() {
  return (
    <div className="w-full overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <section
        className="relative py-16 md:py-24 lg:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
        }}
      >
        {/* Decorative overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div
          className="relative z-10 mx-auto px-6 lg:px-12 text-center"
          style={{ maxWidth: '1600px', minWidth: '320px' }}
        >
          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className="h-[1px] w-16"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 100%)'
              }}
            />
            <span
              className="text-xs uppercase font-light"
              style={{
                letterSpacing: '0.3em',
                color: 'rgba(255, 255, 255, 0.8)',
                whiteSpace: 'nowrap'
              }}
            >
              Delivery Information
            </span>
            <div
              className="h-[1px] w-16"
              style={{
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)'
              }}
            />
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight"
            style={{ color: '#FFFFFF' }}
          >
            Shipping & Returns
          </h1>
          <p
            className="text-lg md:text-xl mx-auto"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '800px',
              minWidth: '280px',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal'
            }}
          >
            We are committed to delivering your luxury purchases safely and efficiently. Learn about our shipping options and hassle-free return policy.
          </p>
        </div>
      </section>

      {/* Quick Overview Cards */}
      <section
        className="py-12 md:py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)' }}
      >
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">

            {/* Free Shipping */}
            <div
              className="text-center p-8"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
              >
                <Truck className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Free Shipping
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Complimentary standard shipping on all orders over $200
              </p>
            </div>

            {/* 30-Day Returns */}
            <div
              className="text-center p-8"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
              >
                <RefreshCw className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                30-Day Returns
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Return unworn items within 30 days for a full refund or exchange
              </p>
            </div>

            {/* Global Delivery */}
            <div
              className="text-center p-8"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
              >
                <Globe className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Global Delivery
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                We ship to over 150 countries worldwide with secure tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Information */}
      <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="mb-12">
            <div className="inline-block mb-4">
              <div
                className="h-1 w-12"
                style={{ background: 'linear-gradient(90deg, #8e2157 0%, #5c0931 100%)' }}
              />
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#2C2C2C' }}
            >
              Shipping Information
            </h2>
            <p
              className="text-lg"
              style={{
                color: '#6B7280',
                maxWidth: '800px',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal'
              }}
            >
              We offer multiple shipping options to ensure your order arrives when you need it.
            </p>
          </div>

          {/* Shipping Methods Table */}
          <div
            className="overflow-x-auto mb-12"
            style={{
              border: '2px solid #E5E7EB',
              minWidth: '280px'
            }}
          >
            <table className="w-full" style={{ minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F5F5F5' }}>
                  <th
                    className="text-left p-4 font-semibold"
                    style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}
                  >
                    Shipping Method
                  </th>
                  <th
                    className="text-left p-4 font-semibold"
                    style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}
                  >
                    Delivery Time
                  </th>
                  <th
                    className="text-left p-4 font-semibold"
                    style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}
                  >
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <span style={{ color: '#2C2C2C', fontWeight: '600' }}>Standard Shipping</span>
                    <p
                      className="text-sm mt-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Domestic delivery via standard courier
                    </p>
                  </td>
                  <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>
                    3-5 business days
                  </td>
                  <td className="p-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <span style={{ color: '#2C2C2C', fontWeight: '600' }}>Free over $200</span>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>$15 under $200</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <span style={{ color: '#2C2C2C', fontWeight: '600' }}>Express Shipping</span>
                    <p
                      className="text-sm mt-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Priority delivery with signature required
                    </p>
                  </td>
                  <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>
                    1-2 business days
                  </td>
                  <td className="p-4" style={{ color: '#2C2C2C', fontWeight: '600', borderBottom: '1px solid #E5E7EB' }}>
                    $35
                  </td>
                </tr>
                <tr>
                  <td className="p-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <span style={{ color: '#2C2C2C', fontWeight: '600' }}>International Shipping</span>
                    <p
                      className="text-sm mt-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Global delivery with customs clearance
                    </p>
                  </td>
                  <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>
                    7-14 business days
                  </td>
                  <td className="p-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <span style={{ color: '#2C2C2C', fontWeight: '600' }}>$45-$95</span>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Varies by destination</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <span style={{ color: '#2C2C2C', fontWeight: '600' }}>Same-Day Delivery</span>
                    <p
                      className="text-sm mt-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Available in Dhaka city only
                    </p>
                  </td>
                  <td className="p-4" style={{ color: '#6B7280' }}>
                    Same day
                  </td>
                  <td className="p-4" style={{ color: '#2C2C2C', fontWeight: '600' }}>
                    $25
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Shipping Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Order Processing */}
            <div
              className="p-6"
              style={{
                backgroundColor: '#F5F5F5',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <Clock className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} />
                <div>
                  <h3
                    className="text-xl font-serif font-bold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Order Processing
                  </h3>
                  <p
                    className="text-base"
                    style={{
                      color: '#6B7280',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%'
                    }}
                  >
                    All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day. You will receive an email confirmation once your order has been shipped with tracking information.
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Your Order */}
            <div
              className="p-6"
              style={{
                backgroundColor: '#F5F5F5',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <Package className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} />
                <div>
                  <h3
                    className="text-xl font-serif font-bold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Tracking Your Order
                  </h3>
                  <p
                    className="text-base"
                    style={{
                      color: '#6B7280',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%'
                    }}
                  >
                    Once shipped, you can track your package in real-time using the tracking number provided. Log into your account to view detailed tracking updates, estimated delivery dates, and delivery confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* International Shipping */}
            <div
              className="p-6"
              style={{
                backgroundColor: '#F5F5F5',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <Globe className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} />
                <div>
                  <h3
                    className="text-xl font-serif font-bold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    International Shipping
                  </h3>
                  <p
                    className="text-base"
                    style={{
                      color: '#6B7280',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%'
                    }}
                  >
                    We ship globally with full insurance and customs documentation included. Please note that international customers are responsible for any customs duties, taxes, or import fees charged by their country.
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Required */}
            <div
              className="p-6"
              style={{
                backgroundColor: '#F5F5F5',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} />
                <div>
                  <h3
                    className="text-xl font-serif font-bold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Signature Required
                  </h3>
                  <p
                    className="text-base"
                    style={{
                      color: '#6B7280',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%'
                    }}
                  >
                    For your security, all orders over $500 require a signature upon delivery. If no one is available to sign, the carrier will leave a notice with instructions for rescheduling delivery or pickup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Returns Policy */}
      <section
        className="py-12 md:py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)' }}
      >
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="mb-12">
            <div className="inline-block mb-4">
              <div
                className="h-1 w-12"
                style={{ background: 'linear-gradient(90deg, #8e2157 0%, #5c0931 100%)' }}
              />
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#2C2C2C' }}
            >
              Returns & Exchanges
            </h2>
            <p
              className="text-lg"
              style={{
                color: '#6B7280',
                maxWidth: '800px',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal'
              }}
            >
              Your satisfaction is our priority. We offer a hassle-free 30-day return policy on all eligible items.
            </p>
          </div>

          {/* Return Process Steps */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">

            {/* Step 1 */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: '#8e2157',
                  color: '#FFFFFF',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                1
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ color: '#2C2C2C' }}
              >
                Initiate Return
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal'
                }}
              >
                Log into your account and select items to return
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: '#8e2157',
                  color: '#FFFFFF',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                2
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ color: '#2C2C2C' }}
              >
                Print Label
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal'
                }}
              >
                Download and print your prepaid return shipping label
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: '#8e2157',
                  color: '#FFFFFF',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                3
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ color: '#2C2C2C' }}
              >
                Ship Back
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal'
                }}
              >
                Pack items securely and drop off at any courier location
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: '#8e2157',
                  color: '#FFFFFF',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                4
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ color: '#2C2C2C' }}
              >
                Get Refund
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal'
                }}
              >
                Receive refund within 5-7 days after we receive your return
              </p>
            </div>
          </div>

          {/* Return Conditions */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Eligible for Return */}
            <div
              className="p-6"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #22C55E',
                minWidth: '280px'
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#22C55E' }} />
                <div>
                  <h3
                    className="text-xl font-serif font-bold mb-4"
                    style={{ color: '#2C2C2C' }}
                  >
                    Eligible for Return
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span style={{ color: '#22C55E', marginTop: '4px' }}>•</span>
                      <span
                        style={{
                          color: '#6B7280',
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'normal',
                          flex: '1'
                        }}
                      >
                        Unworn and unwashed items with original tags attached
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: '#22C55E', marginTop: '4px' }}>•</span>
                      <span
                        style={{
                          color: '#6B7280',
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'normal',
                          flex: '1'
                        }}
                      >
                        Returned within 30 days of delivery
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: '#22C55E', marginTop: '4px' }}>•</span>
                      <span
                        style={{
                          color: '#6B7280',
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'normal',
                          flex: '1'
                        }}
                      >
                        Items in original packaging and condition
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: '#22C55E', marginTop: '4px' }}>•</span>
                      <span
                        style={{
                          color: '#6B7280',
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'normal',
                          flex: '1'
                        }}
                      >
                        Proof of purchase or order number provided
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: '#22C55E', marginTop: '4px' }}>•</span>
                      <span
                        style={{
                          color: '#6B7280',
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'normal',
                          flex: '1'
                        }}
                      >
                        Free exchanges for size or color
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Not Eligible for Return */}
            <div
              className="p-6"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #EF4444',
                minWidth: '280px'
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <XCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#EF4444' }} />
                <div>
                  <h3
                    className="text-xl font-serif font-bold mb-4"
                    style={{ color: '#2C2C2C' }}
                  >
                    Not Eligible for Return
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span style={{ color: '#EF4444', marginTop: '4px' }}>•</span>
                      <span
                        style={{
                          color: '#6B7280',
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'normal',
                          flex: '1'
                        }}
                      >
                        Intimate apparel and swimwear for hygiene reasons
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: '#EF4444', marginTop: '4px' }}>•</span>
                      <span
                        style={{
                          color: '#6B7280',
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'normal',
                          flex: '1'
                        }}
                      >
                        Items marked as final sale or clearance
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: '#EF4444', marginTop: '4px' }}>•</span>
                      <span
                        style={{
                          color: '#6B7280',
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'normal',
                          flex: '1'
                        }}
                      >
                        Personalized or customized items
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: '#EF4444', marginTop: '4px' }}>•</span>
                      <span
                        style={{
                          color: '#6B7280',
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'normal',
                          flex: '1'
                        }}
                      >
                        Beauty products and fragrances once opened
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: '#EF4444', marginTop: '4px' }}>•</span>
                      <span
                        style={{
                          color: '#6B7280',
                          display: 'block',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'normal',
                          flex: '1'
                        }}
                      >
                        Items without original tags or packaging
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div
            className="mt-8 p-6"
            style={{
              backgroundColor: '#FEF3C7',
              border: '2px solid #F59E0B',
              minWidth: '280px'
            }}
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#F59E0B' }} />
              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: '#92400E' }}
                >
                  Important Notice
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: '#92400E',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%'
                  }}
                >
                  Please inspect your items upon delivery. If you receive a damaged or defective product, contact us within 48 hours with photos. We will arrange for immediate replacement or full refund. For luxury items over $1000, please record a video while unboxing for insurance purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div
            className="p-8 md:p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF',
              minWidth: '280px'
            }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Need Help With Your Order?
            </h2>
            <p
              className="text-lg mb-8"
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%',
                maxWidth: '800px',
                margin: '0 auto 2rem'
              }}
            >
              Our customer service team is ready to assist you with shipping inquiries, returns, or any questions about your purchase.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Email */}
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-1">Email Us</h3>
                <a
                  href="mailto:info@alineglobalbd.com"
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textDecoration: 'underline'
                  }}
                >
                  info@alineglobalbd.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-1">Call Us</h3>
                <a
                  href="tel:+8801345719410"
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textDecoration: 'underline'
                  }}
                >
                  +880 1345-719410
                </a>
              </div>

              {/* Address */}
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-1">Visit Us</h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.875rem',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal'
                  }}
                >
                  Banani, Dhaka-1213
                </p>
              </div>
            </div>

            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 font-semibold transition-all duration-300"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#8e2157'
              }}
            >
              Contact Customer Service
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

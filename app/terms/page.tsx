'use client'

import { Scale, FileText, AlertCircle, CheckCircle, Shield } from 'lucide-react'

export default function TermsPage() {
  const lastUpdated = "January 2, 2026"

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
              Legal Information
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
            Terms of Service
          </h1>
          <p
            className="text-lg md:text-xl mx-auto mb-4"
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
            Please read these terms carefully before using our services.
          </p>
          <p
            className="text-sm"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal'
            }}
          >
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section
        className="py-8"
        style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}
      >
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#92400E' }} />
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
                By accessing and using Aline Mart&apos;s website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="space-y-12">

            {/* 1. Acceptance of Terms */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Scale className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  1. Acceptance of Terms
                </h2>
              </div>
              <div
                className="pl-0 md:pl-13"
                style={{
                  borderLeft: '3px solid #E5E7EB',
                  paddingLeft: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  These Terms of Service constitute a legally binding agreement between you and Aline Mart. By accessing our website, making a purchase, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
                </p>
                <p
                  className="text-base"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  We reserve the right to update or modify these terms at any time without prior notice. Your continued use of our services following any changes constitutes acceptance of those changes.
                </p>
              </div>
            </div>

            {/* 2. Eligibility */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <CheckCircle className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  2. Eligibility
                </h2>
              </div>
              <div
                className="pl-0 md:pl-13"
                style={{
                  borderLeft: '3px solid #E5E7EB',
                  paddingLeft: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  You must be at least 18 years of age to use our services and make purchases. By using Aline Mart, you represent and warrant that you are of legal age to form a binding contract.
                </p>
                <p
                  className="text-base"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  If you are using our services on behalf of a company or organization, you represent that you have the authority to bind that entity to these terms.
                </p>
              </div>
            </div>

            {/* 3. Account Registration */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <FileText className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  3. Account Registration
                </h2>
              </div>
              <div
                className="pl-0 md:pl-13"
                style={{
                  borderLeft: '3px solid #E5E7EB',
                  paddingLeft: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  When creating an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  You must immediately notify us of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to comply with these security obligations.
                </p>
                <p
                  className="text-base"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  We reserve the right to suspend or terminate your account if we suspect any fraudulent, abusive, or illegal activity.
                </p>
              </div>
            </div>

            {/* 4. Product Information and Pricing */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Shield className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  4. Product Information and Pricing
                </h2>
              </div>
              <div
                className="pl-0 md:pl-13"
                style={{
                  borderLeft: '3px solid #E5E7EB',
                  paddingLeft: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  We strive to provide accurate product descriptions, images, and pricing information. However, we do not warrant that product descriptions, colors, images, or other content are accurate, complete, reliable, current, or error-free.
                </p>
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  All prices are listed in US Dollars and are subject to change without notice. We reserve the right to correct any pricing errors on our website and to cancel any orders placed for products with incorrect prices.
                </p>
                <p
                  className="text-base"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  Product availability is subject to change. We reserve the right to limit quantities or discontinue any product at any time.
                </p>
              </div>
            </div>

            {/* 5. Orders and Payment */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <CheckCircle className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  5. Orders and Payment
                </h2>
              </div>
              <div
                className="pl-0 md:pl-13"
                style={{
                  borderLeft: '3px solid #E5E7EB',
                  paddingLeft: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  By placing an order, you are making an offer to purchase products. We reserve the right to accept or decline your order for any reason, including product availability, errors in pricing or product information, or suspected fraudulent activity.
                </p>
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  Payment must be received before your order is processed. We accept major credit cards, PayPal, and other payment methods as displayed on our website. You agree to pay all charges incurred by you or any users of your account at the prices in effect when such charges are incurred.
                </p>
                <p
                  className="text-base"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  All payments are processed securely through encrypted connections. We do not store your complete credit card information on our servers.
                </p>
              </div>
            </div>

            {/* 6. Shipping and Delivery */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <FileText className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  6. Shipping and Delivery
                </h2>
              </div>
              <div
                className="pl-0 md:pl-13"
                style={{
                  borderLeft: '3px solid #E5E7EB',
                  paddingLeft: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  We will make every effort to deliver your order within the estimated timeframe. However, delivery times are estimates only and we are not responsible for delays caused by shipping carriers, customs, or other factors beyond our control.
                </p>
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  Risk of loss and title for products pass to you upon delivery to the shipping carrier. You are responsible for filing any claims with the carrier for damaged or lost shipments.
                </p>
                <p
                  className="text-base"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  For international orders, you are responsible for all customs duties, import taxes, and other fees imposed by your country.
                </p>
              </div>
            </div>

            {/* 7. Returns and Refunds */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Scale className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  7. Returns and Refunds
                </h2>
              </div>
              <div
                className="pl-0 md:pl-13"
                style={{
                  borderLeft: '3px solid #E5E7EB',
                  paddingLeft: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  Our return policy allows returns within 30 days of delivery for eligible items. Products must be unworn, unwashed, and in original condition with all tags attached. Please refer to our Shipping and Returns page for complete details.
                </p>
                <p
                  className="text-base"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  Refunds will be processed to the original payment method within 5-7 business days after we receive and inspect the returned items.
                </p>
              </div>
            </div>

            {/* 8. Intellectual Property */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Shield className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  8. Intellectual Property
                </h2>
              </div>
              <div
                className="pl-0 md:pl-13"
                style={{
                  borderLeft: '3px solid #E5E7EB',
                  paddingLeft: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  All content on this website, including text, graphics, logos, images, and software, is the property of Aline Mart or its content suppliers and is protected by international copyright and trademark laws.
                </p>
                <p
                  className="text-base"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  You may not reproduce, distribute, modify, or create derivative works from any content on our website without our express written permission.
                </p>
              </div>
            </div>

            {/* 9. Limitation of Liability */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <AlertCircle className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  9. Limitation of Liability
                </h2>
              </div>
              <div
                className="pl-0 md:pl-13"
                style={{
                  borderLeft: '3px solid #E5E7EB',
                  paddingLeft: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  To the maximum extent permitted by law, Aline Mart shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.
                </p>
                <p
                  className="text-base"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  Our total liability for any claims arising from your use of our services shall not exceed the amount you paid for the products or services in question.
                </p>
              </div>
            </div>

            {/* 10. Contact Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <FileText className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  10. Contact Information
                </h2>
              </div>
              <div
                className="pl-0 md:pl-13"
                style={{
                  borderLeft: '3px solid #E5E7EB',
                  paddingLeft: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <p
                  className="text-base mb-4"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.8'
                  }}
                >
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div
                  className="p-6"
                  style={{
                    backgroundColor: '#F5F5F5',
                    border: '2px solid #E5E7EB',
                    minWidth: '280px'
                  }}
                >
                  <p
                    className="mb-2"
                    style={{
                      color: '#2C2C2C',
                      fontWeight: '600',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal'
                    }}
                  >
                    Aline Mart
                  </p>
                  <p
                    className="text-sm mb-1"
                    style={{
                      color: '#6B7280',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal'
                    }}
                  >
                    Borak Mehnur, 51/B, Kemal Ataturk Avenue
                  </p>
                  <p
                    className="text-sm mb-1"
                    style={{
                      color: '#6B7280',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal'
                    }}
                  >
                    Banani, Dhaka-1213, Bangladesh
                  </p>
                  <p
                    className="text-sm mb-1"
                    style={{
                      color: '#6B7280',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal'
                    }}
                  >
                    Email: info@alineglobalbd.com
                  </p>
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
                    Phone: +880 1345-719410
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 md:py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)' }}
      >
        <div
          className="mx-auto px-6 lg:px-12 text-center"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <h2
            className="text-3xl md:text-4xl font-serif font-bold mb-4"
            style={{ color: '#2C2C2C' }}
          >
            Questions About Our Terms?
          </h2>
          <p
            className="text-lg mb-8"
            style={{
              color: '#6B7280',
              maxWidth: '800px',
              minWidth: '280px',
              margin: '0 auto 2rem',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal'
            }}
          >
            Our customer service team is here to help clarify any questions you may have about these terms.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 font-semibold transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF'
            }}
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}

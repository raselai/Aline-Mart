'use client'

import { Lock, Eye, Shield, Database, UserCheck, Mail, AlertCircle, FileText } from 'lucide-react'

export default function PrivacyPage() {
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
              Your Privacy Matters
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
            Privacy Policy
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
            Learn how we collect, use, and protect your personal information.
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
        style={{ background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)' }}
      >
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="flex items-start gap-4">
            <Lock className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#1E3A8A' }} />
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: '#1E3A8A' }}
              >
                Your Privacy is Protected
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#1E3A8A',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                At Aline Mart, we are committed to protecting your privacy and personal information. This policy explains our practices regarding data collection, use, and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="space-y-12">

            {/* 1. Information We Collect */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Database className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  1. Information We Collect
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
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: '#2C2C2C' }}
                >
                  Personal Information
                </h3>
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
                  When you create an account or make a purchase, we collect information such as your name, email address, phone number, shipping address, billing address, and payment information.
                </p>

                <h3
                  className="text-lg font-semibold mb-3 mt-6"
                  style={{ color: '#2C2C2C' }}
                >
                  Automatically Collected Information
                </h3>
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
                  We automatically collect certain information when you visit our website, including your IP address, browser type, device information, pages visited, and time spent on our site. We use cookies and similar tracking technologies to enhance your experience.
                </p>

                <h3
                  className="text-lg font-semibold mb-3 mt-6"
                  style={{ color: '#2C2C2C' }}
                >
                  Communication Data
                </h3>
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
                  When you contact our customer service team, we collect information from your communications, including emails, chat messages, and phone calls.
                </p>
              </div>
            </div>

            {/* 2. How We Use Your Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <UserCheck className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  2. How We Use Your Information
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
                  We use the information we collect to:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Process and fulfill your orders, including payment processing and shipping
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Communicate with you about your orders, account, and customer service inquiries
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Send you promotional emails and marketing communications (with your consent)
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Improve our website, products, and services
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Detect and prevent fraud and security threats
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Comply with legal obligations and enforce our terms
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Information Sharing */}
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
                  3. Information Sharing
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
                  We do not sell, rent, or share your personal information with third parties except in the following circumstances:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      <strong style={{ color: '#2C2C2C' }}>Service Providers:</strong> We share information with trusted third-party service providers who assist us with payment processing, shipping, email delivery, and website hosting.
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      <strong style={{ color: '#2C2C2C' }}>Legal Requirements:</strong> We may disclose information when required by law, court order, or government request.
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      <strong style={{ color: '#2C2C2C' }}>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* 4. Cookies and Tracking */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Eye className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  4. Cookies and Tracking Technologies
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
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. Cookies are small text files stored on your device.
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
                  You can control cookie settings through your browser preferences. However, disabling cookies may limit your ability to use certain features of our website.
                </p>
              </div>
            </div>

            {/* 5. Data Security */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Lock className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  5. Data Security
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
                  We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      SSL encryption for all data transmission
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Secure payment processing through trusted third-party providers
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Regular security audits and updates
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      Restricted access to personal data on a need-to-know basis
                    </p>
                  </li>
                </ul>
                <p
                  className="text-base mt-4"
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
                  While we take reasonable precautions, no method of transmission over the internet is completely secure. We cannot guarantee absolute security of your data.
                </p>
              </div>
            </div>

            {/* 6. Your Rights */}
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
                  6. Your Privacy Rights
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
                  You have the following rights regarding your personal information:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      <strong style={{ color: '#2C2C2C' }}>Access:</strong> Request a copy of the personal information we hold about you
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      <strong style={{ color: '#2C2C2C' }}>Correction:</strong> Update or correct inaccurate information
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      <strong style={{ color: '#2C2C2C' }}>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      <strong style={{ color: '#2C2C2C' }}>Opt-Out:</strong> Unsubscribe from marketing communications at any time
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#8e2157', marginTop: '6px' }}>•</span>
                    <p
                      className="text-base flex-1"
                      style={{
                        color: '#6B7280',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal'
                      }}
                    >
                      <strong style={{ color: '#2C2C2C' }}>Data Portability:</strong> Request a copy of your data in a portable format
                    </p>
                  </li>
                </ul>
                <p
                  className="text-base mt-4"
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
                  To exercise any of these rights, please contact us using the information provided below.
                </p>
              </div>
            </div>

            {/* 7. Children's Privacy */}
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
                  7. Children&apos;s Privacy
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
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.
                </p>
              </div>
            </div>

            {/* 8. International Data Transfers */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Database className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  8. International Data Transfers
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
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our services, you consent to the transfer of your information to these countries. We ensure appropriate safeguards are in place to protect your data.
                </p>
              </div>
            </div>

            {/* 9. Contact Us */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Mail className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  9. Contact Information
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
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
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
                    Aline Mart - Privacy Department
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
            Questions About Your Privacy?
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
            Our team is committed to protecting your privacy and answering any questions you may have.
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

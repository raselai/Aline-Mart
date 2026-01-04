'use client'

import { Metadata } from 'next'
import { Shield, Store, AlertTriangle, Lock, Users, CheckCircle2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function PrivacyPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.fade-in-section')
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Raleway:wght@300;400;500;600;700&display=swap');

        .privacy-page {
          font-family: 'Raleway', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .deco-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fade-in-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .art-deco-border {
          position: relative;
        }

        .art-deco-border::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg,
            transparent 0%,
            #D4AF37 10%,
            #8e2157 50%,
            #D4AF37 90%,
            transparent 100%
          );
        }

        .gold-accent {
          color: #D4AF37;
        }

        .diagonal-section {
          position: relative;
          overflow: hidden;
        }

        .diagonal-section::before {
          content: '';
          position: absolute;
          top: -5%;
          left: -10%;
          right: -10%;
          bottom: -5%;
          background: linear-gradient(165deg, #8e2157 0%, #5c0931 100%);
          transform: skewY(-2deg);
          z-index: 0;
        }

        .policy-card {
          background: #ffffff;
          border: 1px solid rgba(142, 33, 87, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .policy-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(212, 175, 55, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }

        .policy-card:hover::before {
          left: 100%;
        }

        .policy-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(142, 33, 87, 0.15);
          border-color: rgba(142, 33, 87, 0.3);
        }

        .geometric-pattern {
          background-image:
            repeating-linear-gradient(45deg,
              transparent,
              transparent 20px,
              rgba(212, 175, 55, 0.03) 20px,
              rgba(212, 175, 55, 0.03) 40px
            ),
            repeating-linear-gradient(-45deg,
              transparent,
              transparent 20px,
              rgba(142, 33, 87, 0.03) 20px,
              rgba(142, 33, 87, 0.03) 40px
            );
        }

        .icon-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .icon-wrapper::before {
          content: '';
          position: absolute;
          inset: -8px;
          background: linear-gradient(135deg, #8e2157, #5c0931);
          border-radius: 50%;
          opacity: 0.15;
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.05;
          }
        }

        .section-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 6rem;
          font-weight: 300;
          line-height: 1;
          background: linear-gradient(135deg, #D4AF37 0%, #8e2157 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0.2;
          position: absolute;
          top: -20px;
          left: -10px;
          z-index: 0;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .section-number {
            font-size: 3.5rem;
            top: -10px;
            left: -5px;
          }
        }

        .promise-quote {
          position: relative;
          padding-left: 40px;
        }

        .promise-quote::before {
          content: '"';
          position: absolute;
          left: 0;
          top: -20px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 120px;
          line-height: 1;
          color: rgba(212, 175, 55, 0.3);
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .promise-quote {
            padding-left: 24px;
          }

          .promise-quote::before {
            font-size: 60px;
            top: -10px;
          }
        }
      `}</style>

      <main className="privacy-page" style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        {/* Hero Section */}
        <section
          className="diagonal-section"
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 'clamp(40px, 10vh, 80px) clamp(16px, 5vw, 24px)',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  height: '2px',
                  width: '80px',
                  background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                  margin: '0 auto 24px',
                }}
              />
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                }}
              >
                Trust & Transparency
              </p>
            </div>

            <h1
              className="deco-heading"
              style={{
                color: '#ffffff',
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                marginBottom: '32px',
                lineHeight: 1.1,
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%',
              }}
            >
              Our Promise to You
            </h1>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                lineHeight: 1.6,
                maxWidth: '700px',
                margin: '0 auto',
                fontWeight: 300,
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%',
              }}
            >
              At Aline Mart, we are committed to building the most trusted, transparent, and customer-focused e-commerce platform in South Asia.
            </p>
          </div>

          {/* Decorative elements - Hidden on mobile */}
          <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              top: '50px',
              right: '50px',
              width: '150px',
              height: '150px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '50%',
              zIndex: 0,
            }}
          />
          <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              bottom: '80px',
              left: '80px',
              width: '100px',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              transform: 'rotate(45deg)',
              zIndex: 0,
            }}
          />
        </section>

        {/* Introduction */}
        <section className="art-deco-border" style={{ padding: 'clamp(60px, 12vh, 100px) clamp(16px, 5vw, 24px)', backgroundColor: '#ffffff' }}>
          <div className="fade-in-section" style={{ maxWidth: '800px', margin: '0 auto', minWidth: '320px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#6B7280',
                marginBottom: '32px',
                lineHeight: 1.8,
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%',
              }}
            >
              Our End Policy outlines the rights, responsibilities, and protections available to all users—both buyers and sellers—on our platform.
            </p>

            <p
              className="deco-heading"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                color: '#2C2C2C',
                lineHeight: 1.4,
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%',
              }}
            >
              We believe in doing e-commerce differently: with{' '}
              <span className="gold-accent">integrity</span>,{' '}
              <span style={{ color: '#8e2157' }}>accountability</span>, and{' '}
              <span className="gold-accent">user-first thinking</span>.
            </p>
          </div>
        </section>

        {/* Section 1: Buyer Protection */}
        <section className="geometric-pattern fade-in-section" style={{ padding: 'clamp(60px, 15vh, 120px) clamp(16px, 5vw, 24px)', position: 'relative' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', minWidth: '320px', position: 'relative' }}>
            <span className="section-number">01</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 24px)', marginBottom: 'clamp(32px, 8vh, 60px)', position: 'relative', zIndex: 1 }}>
              <div className="icon-wrapper" style={{
                width: 'clamp(56px, 12vw, 80px)',
                height: 'clamp(56px, 12vw, 80px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8e2157, #5c0931)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Shield style={{ width: 'clamp(28px, 6vw, 40px)', height: 'clamp(28px, 6vw, 40px)', color: '#ffffff', strokeWidth: 1.5 }} />
              </div>

              <h2
                className="deco-heading"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#2C2C2C',
                  margin: 0,
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                }}
              >
                Buyer Protection
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {[
                {
                  title: 'Authenticity Guarantee',
                  desc: 'All products sold on Aline Mart are screened for quality and authenticity. If any product is proven counterfeit or misrepresented, a full refund or replacement is guaranteed.',
                },
                {
                  title: 'Easy Returns',
                  desc: 'Buyers can return eligible items within 7 days of delivery (as per category rules), provided the item is unused, undamaged, and in original packaging.',
                },
                {
                  title: 'Secure Payments',
                  desc: 'All transactions are processed through verified and encrypted payment gateways. We do not store sensitive financial data.',
                },
                {
                  title: 'Dispute Resolution',
                  desc: 'In case of delivery delays, damaged goods, or wrong items, our support team is committed to resolving disputes fairly and promptly—usually within 48 hours.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="policy-card"
                  style={{
                    padding: '32px',
                    borderRadius: '4px',
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#2C2C2C',
                      marginBottom: '16px',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: '#6B7280',
                      lineHeight: 1.7,
                      fontSize: '0.9375rem',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%',
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Seller Policy */}
        <section className="fade-in-section" style={{ padding: 'clamp(60px, 15vh, 120px) clamp(16px, 5vw, 24px)', backgroundColor: '#F9FAFB' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', minWidth: '320px', position: 'relative' }}>
            <span className="section-number">02</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 24px)', marginBottom: 'clamp(32px, 8vh, 60px)', position: 'relative', zIndex: 1 }}>
              <div className="icon-wrapper" style={{
                width: 'clamp(56px, 12vw, 80px)',
                height: 'clamp(56px, 12vw, 80px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8e2157, #5c0931)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Store style={{ width: 'clamp(28px, 6vw, 40px)', height: 'clamp(28px, 6vw, 40px)', color: '#ffffff', strokeWidth: 1.5 }} />
              </div>

              <h2
                className="deco-heading"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#2C2C2C',
                  margin: 0,
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                }}
              >
                Seller Policy
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {[
                {
                  title: 'Fair Marketplace',
                  desc: 'Sellers must comply with Aline Mart\'s product quality, packaging, and service standards. Continuous violation may result in suspension or account termination.',
                },
                {
                  title: 'Timely Delivery',
                  desc: 'Sellers must ship all orders within the agreed timeline. Late shipments or fake tracking will be penalized.',
                },
                {
                  title: 'Transparent Commissions',
                  desc: 'Our platform charges a competitive, transparent commission model—no hidden fees.',
                },
                {
                  title: 'Support for Growth',
                  desc: 'We provide marketing, analytics, and training tools to help sellers grow their business efficiently.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="policy-card"
                  style={{
                    padding: '32px',
                    borderRadius: '4px',
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#2C2C2C',
                      marginBottom: '16px',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: '#6B7280',
                      lineHeight: 1.7,
                      fontSize: '0.9375rem',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%',
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Zero Tolerance */}
        <section className="geometric-pattern fade-in-section" style={{ padding: 'clamp(60px, 15vh, 120px) clamp(16px, 5vw, 24px)', position: 'relative' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', minWidth: '320px', position: 'relative' }}>
            <span className="section-number">03</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 24px)', marginBottom: 'clamp(32px, 8vh, 60px)', position: 'relative', zIndex: 1 }}>
              <div className="icon-wrapper" style={{
                width: 'clamp(56px, 12vw, 80px)',
                height: 'clamp(56px, 12vw, 80px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8e2157, #5c0931)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <AlertTriangle style={{ width: 'clamp(28px, 6vw, 40px)', height: 'clamp(28px, 6vw, 40px)', color: '#ffffff', strokeWidth: 1.5 }} />
              </div>

              <h2
                className="deco-heading"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#2C2C2C',
                  margin: 0,
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                }}
              >
                Zero Tolerance for Fraud
              </h2>
            </div>

            <p
              style={{
                fontSize: '1.125rem',
                color: '#4B5563',
                marginBottom: 'clamp(24px, 5vh, 40px)',
                lineHeight: 1.7,
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%',
              }}
            >
              We maintain a zero-tolerance policy against:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: 'clamp(32px, 6vh, 48px)' }}>
              {['Fake listings', 'Counterfeit products', 'Identity fraud', 'Manipulation of reviews or ratings'].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #8e2157, #D4AF37)', flexShrink: 0 }} />
                  <p
                    style={{
                      fontSize: '1rem',
                      color: '#2C2C2C',
                      fontWeight: 500,
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%',
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                borderLeft: '4px solid #D4AF37',
                paddingLeft: 'clamp(16px, 4vw, 32px)',
                paddingTop: 'clamp(16px, 3vh, 24px)',
                paddingBottom: 'clamp(16px, 3vh, 24px)',
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                borderRadius: '0 4px 4px 0',
              }}
            >
              <p
                style={{
                  fontSize: '1.125rem',
                  color: '#2C2C2C',
                  fontWeight: 600,
                  lineHeight: 1.7,
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                }}
              >
                Accounts involved in such activities will be permanently removed and may face legal action.
              </p>
            </div>
          </div>
        </section>

        {/* Sections 4 & 5: Condensed Side-by-Side */}
        <section className="fade-in-section" style={{ padding: 'clamp(60px, 15vh, 120px) clamp(16px, 5vw, 24px)', backgroundColor: '#F9FAFB' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', minWidth: '320px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(32px, 8vw, 60px)' }}>
            {/* Data Privacy */}
            <div style={{ position: 'relative' }}>
              <span className="section-number" style={{ fontSize: 'clamp(3rem, 8vw, 4rem)', top: '-10px' }}>04</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 16px)', marginBottom: 'clamp(16px, 3vh, 24px)', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 'clamp(48px, 10vw, 56px)',
                  height: 'clamp(48px, 10vw, 56px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8e2157, #5c0931)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Lock style={{ width: 'clamp(24px, 5vw, 28px)', height: 'clamp(24px, 5vw, 28px)', color: '#ffffff', strokeWidth: 1.5 }} />
                </div>
                <h2
                  className="deco-heading"
                  style={{
                    fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                    color: '#2C2C2C',
                    margin: 0,
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                  }}
                >
                  Data Privacy
                </h2>
              </div>
              <p
                style={{
                  color: '#4B5563',
                  lineHeight: 1.7,
                  fontSize: '1rem',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                }}
              >
                Aline Mart values your data privacy. We follow strict data protection practices and comply with international standards. Your personal information will never be sold or shared with third parties without consent.
              </p>
            </div>

            {/* Community Standards */}
            <div style={{ position: 'relative' }}>
              <span className="section-number" style={{ fontSize: 'clamp(3rem, 8vw, 4rem)', top: '-10px' }}>05</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 16px)', marginBottom: 'clamp(16px, 3vh, 24px)', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 'clamp(48px, 10vw, 56px)',
                  height: 'clamp(48px, 10vw, 56px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8e2157, #5c0931)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Users style={{ width: 'clamp(24px, 5vw, 28px)', height: 'clamp(24px, 5vw, 28px)', color: '#ffffff', strokeWidth: 1.5 }} />
                </div>
                <h2
                  className="deco-heading"
                  style={{
                    fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                    color: '#2C2C2C',
                    margin: 0,
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                  }}
                >
                  Community Standards
                </h2>
              </div>
              <p
                style={{
                  color: '#4B5563',
                  lineHeight: 1.7,
                  fontSize: '1rem',
                  marginBottom: '16px',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                }}
              >
                We are building more than just a platform—we are building a community.
              </p>
              <p
                style={{
                  color: '#2C2C2C',
                  fontWeight: 600,
                  lineHeight: 1.7,
                  fontSize: '1rem',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                }}
              >
                All users must interact respectfully. Hate speech, abuse, or harassment will not be tolerated under any circumstance.
              </p>
            </div>
          </div>
        </section>

        {/* Why We're Better */}
        <section className="fade-in-section art-deco-border" style={{ padding: 'clamp(60px, 15vh, 120px) clamp(16px, 5vw, 24px)', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', minWidth: '320px', textAlign: 'center' }}>
            <h2
              className="deco-heading"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                color: '#2C2C2C',
                marginBottom: '24px',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%',
              }}
            >
              Why Aline Mart is <span className="gold-accent">Different</span>
            </h2>

            <div
              style={{
                height: '2px',
                width: 'clamp(80px, 20vw, 120px)',
                background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                margin: '0 auto clamp(32px, 6vh, 48px)',
              }}
            />

            <p
              style={{
                fontSize: '1.125rem',
                color: '#6B7280',
                marginBottom: 'clamp(40px, 8vh, 60px)',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%',
              }}
            >
              Unlike other platforms, Aline Mart is:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(20px, 4vw, 32px)', textAlign: 'left' }}>
              {[
                'Locally rooted, globally focused',
                'Seller-friendly with low commission & real support',
                'Built for trust—not just transaction',
                'Faster dispute resolution & dedicated buyer care',
                'Committed to making Bangladesh\'s e-commerce global standard',
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <CheckCircle2 style={{ width: '24px', height: '24px', color: '#8e2157', flexShrink: 0, marginTop: '2px', strokeWidth: 2 }} />
                  <p
                    style={{
                      fontSize: '1.0625rem',
                      color: '#2C2C2C',
                      lineHeight: 1.6,
                      fontWeight: 500,
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%',
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Promise */}
        <section
          className="diagonal-section fade-in-section"
          style={{
            padding: 'clamp(60px, 15vh, 120px) clamp(16px, 5vw, 24px)',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', minWidth: '320px' }}>
            <div className="promise-quote">
              <p
                className="deco-heading"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#ffffff',
                  lineHeight: 1.3,
                  marginBottom: '32px',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                }}
              >
                This is not just policy. This is our promise.
              </p>
            </div>

            <p
              style={{
                fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                color: 'rgba(255, 255, 255, 0.95)',
                marginBottom: '24px',
                lineHeight: 1.6,
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%',
              }}
            >
              Aline Mart is here to lead, not follow.
            </p>

            <p
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                color: '#ffffff',
                fontWeight: 600,
                lineHeight: 1.5,
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%',
              }}
            >
              Welcome to a platform where every click counts—because <span className="gold-accent">you matter</span>.
            </p>

            <div
              style={{
                marginTop: 'clamp(32px, 6vh, 48px)',
                height: '2px',
                background: 'linear-gradient(90deg, #D4AF37, transparent)',
                maxWidth: 'clamp(250px, 60vw, 400px)',
              }}
            />
          </div>
        </section>
      </main>
    </>
  )
}

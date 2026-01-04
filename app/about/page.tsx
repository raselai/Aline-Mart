import { Metadata } from 'next'
import Image from 'next/image'
import { Target, Compass, Sparkles, Shield, Store, Ban, Lock, Users, Award, CheckCircle, Zap, Heart, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - Alinemart by Aline Global',
  description: 'Learn about Alinemart - the most trusted and seller-friendly e-commerce platform in South Asia, featuring Aline Fashion and premium brands from Bangladesh to the world.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-r from-burgundy to-plum flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <div className="h-1 w-16 bg-white/60 mx-auto mb-4" />
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6"
            style={{ color: '#ffffff' }}
          >
            About Alinemart
          </h1>
          <p
            className="text-lg md:text-xl font-light max-w-2xl mx-auto"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%'
            }}
          >
            More than just a marketplace—the future of e-commerce in South Asia
          </p>
        </div>

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
      </section>

      {/* About Alinemart Section */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto" style={{ minWidth: '320px' }}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-serif font-bold mb-6"
              style={{ color: '#2C2C2C' }}
            >
              The Alinemart Vision
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-burgundy to-plum mx-auto mb-8" />
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-12 space-y-6">
            <p
              className="text-xl lg:text-2xl font-serif italic leading-relaxed"
              style={{
                color: '#2C2C2C',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Alinemart is a proud sister concern of <span className="font-bold" style={{ color: '#8e2157' }}>Aline Global Ltd</span>, built with a bold vision: to become the most trusted and seller-friendly e-commerce platform in South Asia—starting right here in Bangladesh.
            </p>

            <p
              className="text-lg leading-relaxed"
              style={{
                color: '#4B5563',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              In a market where trust and service often fall short, Alinemart rises with a different approach. We are more than just an online marketplace—we are a <span className="font-semibold" style={{ color: '#2C2C2C' }}>mission-driven company</span> determined to redefine digital commerce in Bangladesh.
            </p>

            <p
              className="text-lg leading-relaxed"
              style={{
                color: '#4B5563',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Our goal is to create a seamless, transparent, and empowering platform for both sellers and buyers, where <span className="font-semibold" style={{ color: '#2C2C2C' }}>authenticity, speed, and reliability</span> are not just promises but standards.
            </p>

            <div
              className="border-l-4 pl-6 py-4 my-8"
              style={{
                borderColor: '#8e2157',
                backgroundColor: '#F5F5F5'
              }}
            >
              <p
                className="text-lg font-semibold"
                style={{
                  color: '#2C2C2C',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                We believe Bangladesh deserves a world-class e-commerce experience—homegrown, yet global in ambition. Alinemart is here to set that new standard.
              </p>
            </div>

            <p
              className="text-lg leading-relaxed"
              style={{
                color: '#4B5563',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              From luxury goods to everyday essentials, we connect people with products they can trust, while enabling local entrepreneurs and businesses to scale like never before. With <span className="font-semibold" style={{ color: '#2C2C2C' }}>innovation, integrity, and impact</span> at our core, we aim to lead Bangladesh&apos;s digital commerce revolution—and become the <span className="font-bold text-2xl" style={{ color: '#8e2157' }}>#1 e-commerce project in the country</span>.
            </p>

            <p
              className="text-2xl font-serif font-bold text-center mt-8 pt-8 border-t border-gray-200"
              style={{
                color: '#8e2157',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Join us. Let&apos;s build the future of e-commerce—together.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section
        className="py-20 lg:py-28 px-6 lg:px-12"
        style={{
          background: 'linear-gradient(to bottom, #F5F5F5, #ffffff)'
        }}
      >
        <div className="max-w-7xl mx-auto" style={{ minWidth: '320px' }}>
          <div className="text-center mb-16">
            <h2
              className="text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#2C2C2C' }}
            >
              Our Foundation
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-burgundy to-plum mx-auto mb-6" />
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Featuring Aline Fashion—our flagship brand setting global standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Vision */}
            <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h2
                  className="text-3xl lg:text-4xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  Vision Statement
                </h2>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-burgundy to-plum mb-6" />
              <p
                className="text-base lg:text-lg leading-relaxed"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                To become a globally recognized fashion brand born in Bangladesh—where quality meets elegance, comfort meets innovation, and every product tells a story of excellence.
              </p>
            </div>

            {/* Mission */}
            <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center">
                  <Compass className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h2
                  className="text-3xl lg:text-4xl font-serif font-bold"
                  style={{ color: '#2C2C2C' }}
                >
                  Mission Statement
                </h2>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-burgundy to-plum mb-6" />
              <ul className="space-y-4 text-base lg:text-lg leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-1.5 flex-shrink-0" style={{ color: '#8e2157' }}>•</span>
                  <span
                    style={{
                      color: '#6B7280',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%'
                    }}
                  >
                    To design and deliver high-quality, stylish, and comfortable fashion products that reflect global trends with a local soul.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 flex-shrink-0" style={{ color: '#8e2157' }}>•</span>
                  <span
                    style={{
                      color: '#6B7280',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%'
                    }}
                  >
                    To empower individuality and self-expression through fashion that fits every lifestyle.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 flex-shrink-0" style={{ color: '#8e2157' }}>•</span>
                  <span
                    style={{
                      color: '#6B7280',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      minWidth: '100%'
                    }}
                  >
                    To build a fully in-house, vertically integrated fashion brand—from design to production—that represents the future of sustainable and intelligent fashion from Bangladesh to the world.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto" style={{ minWidth: '320px' }}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#2C2C2C' }}
            >
              The Aline Fashion Story
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-burgundy to-plum mx-auto" />
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-12 space-y-6 leading-relaxed">
              <p
                className="text-xl lg:text-2xl font-serif italic mb-8"
                style={{
                  color: '#2C2C2C',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Aline Fashion is more than just a brand—it&apos;s the beginning of a new era in fashion.
              </p>

              <p
                style={{
                  color: '#4B5563',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                A proud sister concern of <span className="font-semibold" style={{ color: '#2C2C2C' }}>Aline Global Ltd</span>, we are launching a vision to place Bangladesh at the center of the global fashion map.
              </p>

              <p
                style={{
                  color: '#4B5563',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                We believe that fashion isn&apos;t just about what you wear—<span className="font-semibold" style={{ color: '#2C2C2C' }}>it&apos;s about how it makes you feel</span>. That&apos;s why every Aline Fashion product is designed to combine style, comfort, and uncompromising quality. From our first 6–7 flagship products to an expansive line of garments, every thread carries a promise of sophistication and care.
              </p>

              <p
                className="text-lg font-medium"
                style={{
                  color: '#2C2C2C',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                We&apos;re not chasing trends—we&apos;re setting them.
              </p>

              <p
                style={{
                  color: '#4B5563',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                By blending modern aesthetics with timeless elegance, and by investing in world-class R&D and ethical manufacturing, we aim to build a fashion ecosystem that&apos;s proudly Bangladeshi, yet globally loved.
              </p>

              <p
                style={{
                  color: '#4B5563',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Whether on the streets of Dhaka, runways of Paris, or stores in New York—<span className="font-semibold" style={{ color: '#2C2C2C' }}>Aline Fashion aspires to stand as a symbol of authenticity, luxury, and innovation</span>.
              </p>

              <div
                className="border-l-4 pl-6 py-4 my-8"
                style={{
                  borderColor: '#8e2157',
                  backgroundColor: '#F5F5F5'
                }}
              >
                <p
                  className="text-lg font-medium mb-2"
                  style={{
                    color: '#2C2C2C',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%'
                  }}
                >
                  This is not just the start of a fashion label.
                </p>
                <p
                  className="text-lg font-medium"
                  style={{
                    color: '#2C2C2C',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%'
                  }}
                >
                  This is the birth of a brand that&apos;s destined to be number one—nationally and globally.
                </p>
              </div>

              <p
                className="text-2xl lg:text-3xl font-serif font-bold text-center mt-12 mb-6"
                style={{
                  color: '#2C2C2C',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Welcome to Aline Fashion.
              </p>

              <p
                className="text-xl text-center font-semibold"
                style={{
                  color: '#8e2157',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Style. Comfort. Confidence—Redefined.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        className="py-20 lg:py-28 px-6 lg:px-12"
        style={{
          background: 'linear-gradient(to bottom, #F5F5F5, #ffffff)'
        }}
      >
        <div className="max-w-7xl mx-auto" style={{ minWidth: '320px' }}>
          <div className="text-center mb-16">
            <h2
              className="text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#2C2C2C' }}
            >
              What We Stand For
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-burgundy to-plum mx-auto mb-6" />
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              The core values that drive everything we create
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Quality */}
            <div className="text-center group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-serif font-bold text-white">Q</span>
              </div>
              <h3
                className="text-2xl font-serif font-bold mb-4"
                style={{ color: '#2C2C2C' }}
              >
                Quality
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Every product tells a story of excellence through uncompromising craftsmanship and premium materials.
              </p>
            </div>

            {/* Innovation */}
            <div className="text-center group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-serif font-bold text-white">I</span>
              </div>
              <h3
                className="text-2xl font-serif font-bold mb-4"
                style={{ color: '#2C2C2C' }}
              >
                Innovation
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Where comfort meets innovation through world-class R&D and intelligent design.
              </p>
            </div>

            {/* Authenticity */}
            <div className="text-center group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-serif font-bold text-white">A</span>
              </div>
              <h3
                className="text-2xl font-serif font-bold mb-4"
                style={{ color: '#2C2C2C' }}
              >
                Authenticity
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Proudly Bangladeshi, globally loved—blending local soul with international appeal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alinemart End Policy Section */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto" style={{ minWidth: '320px' }}>
          <div className="text-center mb-16">
            <h2
              className="text-4xl lg:text-5xl font-serif font-bold mb-6"
              style={{ color: '#2C2C2C' }}
            >
              Alinemart End Policy
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-burgundy to-plum mx-auto mb-8" />
            <p
              className="text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              At Alinemart, we are committed to building the most trusted, transparent, and customer-focused e-commerce platform in South Asia. Our End Policy outlines the rights, responsibilities, and protections available to all users—both buyers and sellers.
            </p>
            <p
              className="text-xl font-serif italic mt-6"
              style={{
                color: '#8e2157',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              We believe in doing e-commerce differently: with integrity, accountability, and user-first thinking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {/* Buyer Protection */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-burgundy to-plum flex items-center justify-center flex-shrink-0">
                  <Shield className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    className="text-2xl lg:text-3xl font-serif font-bold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Buyer Protection
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-burgundy to-plum" />
                </div>
              </div>
              <ul className="space-y-4 text-base leading-relaxed">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#8e2157' }} />
                  <div>
                    <span className="font-semibold" style={{ color: '#2C2C2C' }}>Authenticity Guarantee:</span>{' '}
                    <span style={{ color: '#6B7280' }}>All products screened for quality. Counterfeit or misrepresented items qualify for full refund or replacement.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#8e2157' }} />
                  <div>
                    <span className="font-semibold" style={{ color: '#2C2C2C' }}>Easy Returns:</span>{' '}
                    <span style={{ color: '#6B7280' }}>Return eligible items within 7 days of delivery (unused, undamaged, original packaging).</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#8e2157' }} />
                  <div>
                    <span className="font-semibold" style={{ color: '#2C2C2C' }}>Secure Payments:</span>{' '}
                    <span style={{ color: '#6B7280' }}>All transactions through verified, encrypted gateways. We never store sensitive financial data.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#8e2157' }} />
                  <div>
                    <span className="font-semibold" style={{ color: '#2C2C2C' }}>Dispute Resolution:</span>{' '}
                    <span style={{ color: '#6B7280' }}>Fair resolution for delays, damaged goods, or wrong items—usually within 48 hours.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Seller Policy */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-burgundy to-plum flex items-center justify-center flex-shrink-0">
                  <Store className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    className="text-2xl lg:text-3xl font-serif font-bold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Seller Policy
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-burgundy to-plum" />
                </div>
              </div>
              <ul className="space-y-4 text-base leading-relaxed">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#8e2157' }} />
                  <div>
                    <span className="font-semibold" style={{ color: '#2C2C2C' }}>Fair Marketplace:</span>{' '}
                    <span style={{ color: '#6B7280' }}>Comply with quality, packaging, and service standards. Violations may result in suspension.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#8e2157' }} />
                  <div>
                    <span className="font-semibold" style={{ color: '#2C2C2C' }}>Timely Delivery:</span>{' '}
                    <span style={{ color: '#6B7280' }}>Ship all orders within agreed timeline. Late shipments or fake tracking will be penalized.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#8e2157' }} />
                  <div>
                    <span className="font-semibold" style={{ color: '#2C2C2C' }}>Transparent Commissions:</span>{' '}
                    <span style={{ color: '#6B7280' }}>Competitive, transparent commission model—no hidden fees.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#8e2157' }} />
                  <div>
                    <span className="font-semibold" style={{ color: '#2C2C2C' }}>Support for Growth:</span>{' '}
                    <span style={{ color: '#6B7280' }}>Marketing, analytics, and training tools to help your business grow efficiently.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Zero Tolerance for Fraud */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-burgundy to-plum flex items-center justify-center flex-shrink-0">
                  <Ban className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    className="text-2xl lg:text-3xl font-serif font-bold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Zero Tolerance for Fraud
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-burgundy to-plum" />
                </div>
              </div>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#6B7280' }}>
                We maintain a zero-tolerance policy against:
              </p>
              <ul className="space-y-3 text-base leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-lg flex-shrink-0" style={{ color: '#8e2157' }}>✕</span>
                  <span style={{ color: '#6B7280' }}>Fake listings</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg flex-shrink-0" style={{ color: '#8e2157' }}>✕</span>
                  <span style={{ color: '#6B7280' }}>Counterfeit products</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg flex-shrink-0" style={{ color: '#8e2157' }}>✕</span>
                  <span style={{ color: '#6B7280' }}>Identity fraud</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg flex-shrink-0" style={{ color: '#8e2157' }}>✕</span>
                  <span style={{ color: '#6B7280' }}>Manipulation of reviews or ratings</span>
                </li>
              </ul>
              <p className="text-base leading-relaxed mt-6 font-semibold" style={{ color: '#2C2C2C' }}>
                Accounts involved in such activities will be permanently removed and may face legal action.
              </p>
            </div>

            {/* Data Privacy */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-burgundy to-plum flex items-center justify-center flex-shrink-0">
                  <Lock className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    className="text-2xl lg:text-3xl font-serif font-bold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Data Privacy
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-burgundy to-plum" />
                </div>
              </div>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#6B7280' }}>
                Alinemart values your data privacy. We follow strict data protection practices and comply with international standards.
              </p>
              <div
                className="border-l-4 pl-4 py-3"
                style={{
                  borderColor: '#8e2157',
                  backgroundColor: '#F9FAFB'
                }}
              >
                <p className="text-base font-semibold" style={{ color: '#2C2C2C' }}>
                  Your personal information will never be sold or shared with third parties without consent.
                </p>
              </div>
            </div>

            {/* Community Standards */}
            <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-burgundy to-plum flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    className="text-2xl lg:text-3xl font-serif font-bold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Community Standards
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-burgundy to-plum" />
                </div>
              </div>
              <p className="text-base lg:text-lg leading-relaxed" style={{ color: '#6B7280' }}>
                We are building more than just a platform—we are building a <span className="font-semibold" style={{ color: '#2C2C2C' }}>community</span>. All users must interact respectfully. Hate speech, abuse, or harassment will not be tolerated under any circumstance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Alinemart is Better */}
      <section
        className="py-20 lg:py-28 px-6 lg:px-12"
        style={{
          background: 'linear-gradient(135deg, #F5F5F5 0%, #ffffff 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto" style={{ minWidth: '320px' }}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center">
                <Award className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-serif font-bold mb-6"
              style={{ color: '#2C2C2C' }}
            >
              Why Alinemart is Better
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-burgundy to-plum mx-auto mb-8" />
            <p
              className="text-lg lg:text-xl max-w-2xl mx-auto"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Unlike other platforms, Alinemart is built differently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Locally Rooted */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Locally Rooted, Globally Focused
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                Built in Bangladesh, designed for the world
              </p>
            </div>

            {/* Seller Friendly */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Seller-Friendly
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                Low commission & real support for growth
              </p>
            </div>

            {/* Built for Trust */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Built for Trust
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                Not just transactions—building relationships
              </p>
            </div>

            {/* Faster Resolution */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Faster Resolution
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                48-hour dispute resolution & dedicated care
              </p>
            </div>
          </div>

          {/* Bottom Statement */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-burgundy to-plum rounded-2xl shadow-2xl p-8 lg:p-12">
              <p
                className="text-2xl lg:text-3xl font-serif font-bold mb-4"
                style={{ color: '#ffffff' }}
              >
                This is not just policy. This is our promise.
              </p>
              <p
                className="text-lg lg:text-xl font-light"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Alinemart is here to lead, not follow. Welcome to a platform where every click counts—because you matter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-burgundy to-plum px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center" style={{ minWidth: '320px' }}>
          <h2
            className="text-3xl lg:text-5xl font-serif font-bold mb-6"
            style={{ color: '#ffffff' }}
          >
            Join Us on This Journey
          </h2>
          <p
            className="text-lg lg:text-xl mb-10 max-w-2xl mx-auto"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%'
            }}
          >
            Experience fashion and e-commerce that redefines trust, quality, and innovation. Discover our latest collections and be part of the movement.
          </p>
          <a
            href="/products"
            className="inline-block px-10 py-4 font-semibold hover:bg-gray-100 transition-colors duration-300 text-lg rounded-lg shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: '#ffffff',
              color: '#8e2157'
            }}
          >
            Explore Our Collections
          </a>
        </div>
      </section>
    </main>
  )
}

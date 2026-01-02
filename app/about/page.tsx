'use client'

import { Heart, Award, Globe, Shield, Users, TrendingUp, Package, CheckCircle, Star, Clock } from 'lucide-react'

export default function AboutPage() {
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
              Our Story
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
            About Aline Mart
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
            Your trusted destination for authentic luxury fashion from the world&apos;s most prestigious brands.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block mb-4">
                <div
                  className="h-1 w-12"
                  style={{ background: 'linear-gradient(90deg, #8e2157 0%, #5c0931 100%)' }}
                />
              </div>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6"
                style={{ color: '#2C2C2C' }}
              >
                Curating Luxury Since Our Inception
              </h2>
              <p
                className="text-lg mb-6"
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
                Aline Mart was born from a simple yet powerful vision: to make the world&apos;s finest luxury brands accessible to discerning customers globally. What started as a passion for exceptional craftsmanship and timeless design has evolved into a premier multi-brand destination.
              </p>
              <p
                className="text-lg mb-6"
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
                Based in Dhaka, Bangladesh, we have built strong partnerships with authorized distributors and brand representatives worldwide. Every product in our collection is carefully selected for its quality, authenticity, and alignment with our commitment to excellence.
              </p>
              <p
                className="text-lg"
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
                Today, we serve customers across the globe, delivering not just products, but an experience of refinement, trust, and unparalleled service that defines true luxury shopping.
              </p>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div
                className="text-center p-6"
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '2px solid #E5E7EB',
                  minWidth: '140px'
                }}
              >
                <div
                  className="text-4xl md:text-5xl font-serif font-bold mb-2"
                  style={{ color: '#8e2157' }}
                >
                  20+
                </div>
                <p
                  className="text-sm font-semibold uppercase"
                  style={{
                    color: '#2C2C2C',
                    letterSpacing: '0.05em',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal'
                  }}
                >
                  Luxury Brands
                </p>
              </div>

              <div
                className="text-center p-6"
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '2px solid #E5E7EB',
                  minWidth: '140px'
                }}
              >
                <div
                  className="text-4xl md:text-5xl font-serif font-bold mb-2"
                  style={{ color: '#8e2157' }}
                >
                  150+
                </div>
                <p
                  className="text-sm font-semibold uppercase"
                  style={{
                    color: '#2C2C2C',
                    letterSpacing: '0.05em',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal'
                  }}
                >
                  Countries Served
                </p>
              </div>

              <div
                className="text-center p-6"
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '2px solid #E5E7EB',
                  minWidth: '140px'
                }}
              >
                <div
                  className="text-4xl md:text-5xl font-serif font-bold mb-2"
                  style={{ color: '#8e2157' }}
                >
                  100%
                </div>
                <p
                  className="text-sm font-semibold uppercase"
                  style={{
                    color: '#2C2C2C',
                    letterSpacing: '0.05em',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal'
                  }}
                >
                  Authentic Products
                </p>
              </div>

              <div
                className="text-center p-6"
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '2px solid #E5E7EB',
                  minWidth: '140px'
                }}
              >
                <div
                  className="text-4xl md:text-5xl font-serif font-bold mb-2"
                  style={{ color: '#8e2157' }}
                >
                  24/7
                </div>
                <p
                  className="text-sm font-semibold uppercase"
                  style={{
                    color: '#2C2C2C',
                    letterSpacing: '0.05em',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal'
                  }}
                >
                  Customer Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        className="py-12 md:py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)' }}
      >
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission */}
            <div
              className="p-8 md:p-10"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
              >
                <Heart className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-2xl md:text-3xl font-serif font-bold mb-4"
                style={{ color: '#2C2C2C' }}
              >
                Our Mission
              </h3>
              <p
                className="text-base leading-relaxed"
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
                To democratize access to luxury by providing a curated selection of authentic, premium products from the world&apos;s most prestigious brands. We strive to deliver an exceptional shopping experience that combines convenience, trust, and personalized service, making luxury accessible to discerning customers worldwide.
              </p>
            </div>

            {/* Vision */}
            <div
              className="p-8 md:p-10"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
              >
                <TrendingUp className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-2xl md:text-3xl font-serif font-bold mb-4"
                style={{ color: '#2C2C2C' }}
              >
                Our Vision
              </h3>
              <p
                className="text-base leading-relaxed"
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
                To become the leading global destination for luxury multi-brand shopping, recognized for our unwavering commitment to authenticity, quality, and customer satisfaction. We envision a world where luxury is not just about products, but about creating meaningful connections and unforgettable experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div
                className="h-1 w-12 mx-auto"
                style={{ background: 'linear-gradient(90deg, #8e2157 0%, #5c0931 100%)' }}
              />
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#2C2C2C' }}
            >
              Our Core Values
            </h2>
            <p
              className="text-lg mx-auto"
              style={{
                color: '#6B7280',
                maxWidth: '800px',
                minWidth: '280px',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal'
              }}
            >
              The principles that guide everything we do at Aline Mart
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Authenticity */}
            <div
              className="text-center p-8"
              style={{
                backgroundColor: '#F5F5F5',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#8e2157' }}
              >
                <Shield className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Authenticity
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                  lineHeight: '1.6'
                }}
              >
                Every product we sell is 100% authentic, sourced directly from authorized distributors and verified for genuineness.
              </p>
            </div>

            {/* Excellence */}
            <div
              className="text-center p-8"
              style={{
                backgroundColor: '#F5F5F5',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#8e2157' }}
              >
                <Award className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Excellence
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                  lineHeight: '1.6'
                }}
              >
                We maintain the highest standards in product quality, customer service, and every aspect of the luxury shopping experience.
              </p>
            </div>

            {/* Trust */}
            <div
              className="text-center p-8"
              style={{
                backgroundColor: '#F5F5F5',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#8e2157' }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Trust
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                  lineHeight: '1.6'
                }}
              >
                Building long-lasting relationships through transparency, reliability, and consistent delivery on our promises.
              </p>
            </div>

            {/* Customer Focus */}
            <div
              className="text-center p-8"
              style={{
                backgroundColor: '#F5F5F5',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#8e2157' }}
              >
                <Users className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Customer Focus
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                  lineHeight: '1.6'
                }}
              >
                Your satisfaction is our priority. We go above and beyond to ensure every interaction exceeds expectations.
              </p>
            </div>

            {/* Global Reach */}
            <div
              className="text-center p-8"
              style={{
                backgroundColor: '#F5F5F5',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#8e2157' }}
              >
                <Globe className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Global Reach
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                  lineHeight: '1.6'
                }}
              >
                Connecting luxury seekers worldwide with premium products through secure, reliable international shipping.
              </p>
            </div>

            {/* Innovation */}
            <div
              className="text-center p-8"
              style={{
                backgroundColor: '#F5F5F5',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#8e2157' }}
              >
                <Star className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Innovation
              </h3>
              <p
                className="text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%',
                  lineHeight: '1.6'
                }}
              >
                Continuously improving our platform, services, and processes to deliver the best luxury shopping experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        className="py-12 md:py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)' }}
      >
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div
                className="h-1 w-12 mx-auto"
                style={{ background: 'linear-gradient(90deg, #8e2157 0%, #5c0931 100%)' }}
              />
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#2C2C2C' }}
            >
              Why Choose Aline Mart?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Curated Selection */}
            <div
              className="flex items-start gap-4 p-6"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Package className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                </div>
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: '#2C2C2C' }}
                >
                  Curated Selection
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.6'
                  }}
                >
                  Every product is handpicked by our expert team to ensure it meets our stringent quality standards and represents the pinnacle of luxury craftsmanship.
                </p>
              </div>
            </div>

            {/* Authenticity Guarantee */}
            <div
              className="flex items-start gap-4 p-6"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Shield className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                </div>
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: '#2C2C2C' }}
                >
                  Authenticity Guarantee
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.6'
                  }}
                >
                  We source all products directly from authorized distributors and brand partners, with certificates of authenticity provided for luxury items.
                </p>
              </div>
            </div>

            {/* Secure Shopping */}
            <div
              className="flex items-start gap-4 p-6"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <CheckCircle className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                </div>
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: '#2C2C2C' }}
                >
                  Secure Shopping
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.6'
                  }}
                >
                  Your personal and payment information is protected with industry-leading SSL encryption and secure payment processing systems.
                </p>
              </div>
            </div>

            {/* Global Delivery */}
            <div
              className="flex items-start gap-4 p-6"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Globe className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                </div>
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: '#2C2C2C' }}
                >
                  Worldwide Shipping
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.6'
                  }}
                >
                  We deliver to over 150 countries with fully insured, trackable shipping. White-glove delivery service ensures your purchases arrive in perfect condition.
                </p>
              </div>
            </div>

            {/* Expert Support */}
            <div
              className="flex items-start gap-4 p-6"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Users className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                </div>
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: '#2C2C2C' }}
                >
                  Expert Support
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.6'
                  }}
                >
                  Our knowledgeable customer service team is available to provide personalized assistance, styling advice, and answer all your questions.
                </p>
              </div>
            </div>

            {/* Easy Returns */}
            <div
              className="flex items-start gap-4 p-6"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e2157' }}
                >
                  <Clock className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                </div>
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: '#2C2C2C' }}
                >
                  Hassle-Free Returns
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%',
                    lineHeight: '1.6'
                  }}
                >
                  Enjoy peace of mind with our 30-day return policy. Free exchanges and prepaid return labels make the process simple and convenient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
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
              Experience Luxury Shopping Redefined
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
              Join thousands of discerning customers who trust Aline Mart for their luxury shopping needs. Start your journey with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 font-semibold transition-all duration-300"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#8e2157'
                }}
              >
                Shop Now
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 font-semibold transition-all duration-300"
                style={{
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF'
                }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

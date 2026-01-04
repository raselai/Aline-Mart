import { Metadata } from 'next'
import { Rocket, TrendingUp, Lightbulb, Users, Globe, Mail, Briefcase, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Careers - Aline Mart',
  description: 'Build the future of e-commerce with Aline Mart. Join our team and be part of a movement to become Bangladesh\'s #1 e-commerce company.',
}

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] bg-gradient-to-r from-burgundy to-plum flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-block mb-6">
            <div className="h-1 w-16 bg-white/60 mx-auto mb-4" />
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6"
            style={{ color: '#ffffff' }}
          >
            Careers at Aline Mart
          </h1>
          <p
            className="text-xl md:text-2xl lg:text-3xl font-light mb-8"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%'
            }}
          >
            Build the Future of E-Commerce with Us
          </p>
          <p
            className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%'
            }}
          >
            At Aline Mart, we&apos;re not just building an e-commerce platform—we&apos;re building a movement.
          </p>
        </div>

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center" style={{ minWidth: '320px' }}>
          <div className="inline-flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center">
              <Rocket className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 lg:p-12 shadow-lg">
            <p
              className="text-xl lg:text-2xl font-semibold mb-6"
              style={{
                color: '#2C2C2C',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Our vision is bold:
            </p>
            <p
              className="text-2xl lg:text-3xl font-serif font-bold mb-6"
              style={{
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              To become Bangladesh&apos;s #1 e-commerce company, and rise as a trusted name across South Asia and beyond.
            </p>
            <p
              className="text-base lg:text-lg"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              To do this, we need more than employees—we need dreamers, doers, and future leaders.
            </p>
          </div>

          <p
            className="text-xl lg:text-2xl font-semibold mt-12"
            style={{
              color: '#2C2C2C',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%'
            }}
          >
            If you&apos;re passionate about innovation, digital transformation, and making a real impact—
            <span style={{ color: '#8e2157' }}> you belong here.</span>
          </p>
        </div>
      </section>

      {/* Why Join Section */}
      <section
        className="py-20 lg:py-28 px-6 lg:px-12"
        style={{
          background: 'linear-gradient(to bottom, #F5F5F5, #ffffff)'
        }}
      >
        <div className="max-w-6xl mx-auto" style={{ minWidth: '320px' }}>
          <div className="text-center mb-16">
            <h2
              className="text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#2C2C2C' }}
            >
              Why Join Aline Mart?
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-burgundy to-plum mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Purpose-Driven Culture */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center mb-6">
                <Rocket className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-4"
                style={{ color: '#2C2C2C' }}
              >
                Purpose-Driven Culture
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
                Every role here contributes to something bigger—reshaping how commerce works in Bangladesh.
              </p>
            </div>

            {/* Fast-Growth Environment */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-4"
                style={{ color: '#2C2C2C' }}
              >
                Fast-Growth Environment
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
                As a rising brand, your contributions won&apos;t get lost in the crowd. You&apos;ll grow with us.
              </p>
            </div>

            {/* Innovation & Ownership */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center mb-6">
                <Lightbulb className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-4"
                style={{ color: '#2C2C2C' }}
              >
                Innovation & Ownership
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
                We give you space to think, create, and lead. We don&apos;t hire people to follow—we hire to grow.
              </p>
            </div>

            {/* Diverse Opportunities */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-4"
                style={{ color: '#2C2C2C' }}
              >
                Diverse Opportunities
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
                From technology and operations to marketing and logistics—your career can evolve across departments.
              </p>
            </div>

            {/* Future-Ready Vision */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 md:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-burgundy to-plum flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-4"
                style={{ color: '#2C2C2C' }}
              >
                Future-Ready Vision
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
                We&apos;re building a company that competes globally, while staying proudly rooted in Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Look For Section */}
      <section className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto" style={{ minWidth: '320px' }}>
          <div className="text-center mb-16">
            <h2
              className="text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#2C2C2C' }}
            >
              Who We Look For
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-burgundy to-plum mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} strokeWidth={2} />
              <p
                className="text-base lg:text-lg"
                style={{
                  color: '#2C2C2C',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Ambitious minds with a strong work ethic
              </p>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} strokeWidth={2} />
              <p
                className="text-base lg:text-lg"
                style={{
                  color: '#2C2C2C',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Problem-solvers who love challenges
              </p>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} strokeWidth={2} />
              <p
                className="text-base lg:text-lg"
                style={{
                  color: '#2C2C2C',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Creatives, coders, marketers, and strategists
              </p>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} strokeWidth={2} />
              <p
                className="text-base lg:text-lg"
                style={{
                  color: '#2C2C2C',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Professionals who want to build something lasting
              </p>
            </div>

            <div className="flex gap-4 md:col-span-2">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} strokeWidth={2} />
              <p
                className="text-base lg:text-lg"
                style={{
                  color: '#2C2C2C',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                People who believe in excellence, ethics, and impact
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Career Starts Here Section */}
      <section
        className="py-20 lg:py-28 px-6 lg:px-12"
        style={{
          background: 'linear-gradient(to bottom, #F5F5F5, #ffffff)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center" style={{ minWidth: '320px' }}>
          <h2
            className="text-4xl lg:text-5xl font-serif font-bold mb-8"
            style={{ color: '#2C2C2C' }}
          >
            Your Career Starts Here
          </h2>

          <p
            className="text-lg lg:text-xl mb-12"
            style={{
              color: '#4B5563',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%'
            }}
          >
            Join us today. Be part of a mission that goes beyond profit—a mission to build a platform that changes lives, empowers sellers, and puts Bangladesh on the global e-commerce map.
          </p>

          <div
            className="border-l-4 pl-8 py-6 mb-12 inline-block"
            style={{
              borderColor: '#8e2157',
              backgroundColor: '#ffffff',
              textAlign: 'left'
            }}
          >
            <p
              className="text-xl lg:text-2xl font-serif font-bold italic"
              style={{
                color: '#2C2C2C',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Aline Mart isn&apos;t just a company. It&apos;s a destination for those who dare to lead.
            </p>
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto" style={{ minWidth: '320px' }}>
          <div className="bg-gradient-to-r from-burgundy to-plum rounded-lg p-8 lg:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <Mail className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>

            <h3
              className="text-3xl lg:text-4xl font-serif font-bold mb-6"
              style={{ color: '#ffffff' }}
            >
              Ready to Apply?
            </h3>

            <p
              className="text-lg lg:text-xl mb-8"
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Send your CV and cover letter to:
            </p>

            <a
              href="mailto:careers@alinemart.com"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 mb-8"
              style={{
                backgroundColor: '#ffffff',
                color: '#8e2157'
              }}
            >
              <Mail className="w-5 h-5" />
              careers@alinemart.com
            </a>

            <p
              className="text-sm mt-6"
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              We review all applications carefully and will contact qualified candidates.
            </p>
          </div>
        </div>
      </section>

      {/* Current Openings Section */}
      <section
        className="py-20 lg:py-28 px-6 lg:px-12"
        style={{
          backgroundColor: '#F5F5F5'
        }}
      >
        <div className="max-w-5xl mx-auto" style={{ minWidth: '320px' }}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-burgundy to-plum mb-6">
              <Briefcase className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h2
              className="text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#2C2C2C' }}
            >
              Current Openings
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-burgundy to-plum mx-auto mb-6" />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12 text-center">
            <p
              className="text-lg lg:text-xl mb-6"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              We&apos;re constantly looking for talented individuals to join our growing team.
            </p>
            <p
              className="text-base lg:text-lg"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Check back soon for specific job listings, or send us your CV at{' '}
              <a
                href="mailto:careers@alinemart.com"
                className="font-semibold hover:underline"
                style={{ color: '#8e2157' }}
              >
                careers@alinemart.com
              </a>
              {' '}to be considered for future opportunities.
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p
                className="text-sm italic"
                style={{
                  color: '#9CA3AF',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Specific job openings will be listed here as they become available.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

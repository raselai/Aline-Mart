'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock, ArrowRight } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    // TODO: Implement actual form submission logic
    console.log('Form submitted:', formData)

    setIsSubmitting(false)
    setSubmitStatus('success')

    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })

    // Clear success message after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000)
  }

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
              Get in Touch
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
            Contact Us
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
            We're here to assist you with any inquiries about our luxury collection, orders, or services.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section
        className="py-12 md:py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)' }}
      >
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">

            {/* Email Card */}
            <div
              className="group p-8 transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
              >
                <Mail className="w-7 h-7" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Email Us
              </h3>
              <p
                className="text-sm mb-4"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Send us an email anytime
              </p>
              <a
                href="mailto:info@alineglobalbd.com"
                className="font-medium inline-flex items-center gap-2 group/link"
                style={{
                  color: '#8e2157',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere'
                }}
              >
                info@alineglobalbd.com
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Phone Card */}
            <div
              className="group p-8 transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
              >
                <Phone className="w-7 h-7" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Call Us
              </h3>
              <p
                className="text-sm mb-4"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Speak with our team
              </p>
              <a
                href="tel:+8801345719410"
                className="font-medium inline-flex items-center gap-2 group/link"
                style={{ color: '#8e2157' }}
              >
                +880 1345-719410
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Address Card */}
            <div
              className="group p-8 transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
              >
                <MapPin className="w-7 h-7" style={{ color: '#FFFFFF' }} />
              </div>
              <h3
                className="text-xl font-serif font-bold mb-3"
                style={{ color: '#2C2C2C' }}
              >
                Visit Us
              </h3>
              <p
                className="text-sm mb-4"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  minWidth: '100%'
                }}
              >
                Our office location
              </p>
              <address
                className="not-italic font-medium leading-relaxed"
                style={{
                  color: '#8e2157',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal'
                }}
              >
                Borak Mehnur, 51/B<br />
                Kemal Ataturk Avenue<br />
                Banani, Dhaka-1213<br />
                Bangladesh
              </address>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left: Form Info */}
            <div className="space-y-8">
              <div>
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
                  Send us a message
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color: '#6B7280',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%'
                  }}
                >
                  Have a question or need assistance? Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>

              {/* Business Hours */}
              <div
                className="p-6 md:p-8"
                style={{
                  background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 100%)',
                  border: '2px solid #E5E7EB',
                  minWidth: '280px'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6" style={{ color: '#8e2157' }} />
                  <h3
                    className="text-xl font-serif font-bold"
                    style={{ color: '#2C2C2C' }}
                  >
                    Business Hours
                  </h3>
                </div>
                <div className="space-y-2" style={{ color: '#6B7280' }}>
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday:</span>
                    <span>Closed</span>
                  </div>
                  <p
                    className="text-sm mt-4 pt-4"
                    style={{
                      color: '#6B7280',
                      borderTop: '1px solid #E5E7EB',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal'
                    }}
                  >
                    Bangladesh Standard Time (GMT+6)
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div
                className="p-6 md:p-8"
                style={{
                  background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                  color: '#FFFFFF',
                  minWidth: '280px'
                }}
              >
                <h3 className="text-xl font-serif font-bold mb-3">
                  Need Immediate Assistance?
                </h3>
                <p
                  className="mb-4 text-sm"
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    minWidth: '100%'
                  }}
                >
                  For urgent inquiries or order-related questions, please call us directly during business hours.
                </p>
                <a
                  href="tel:+8801345719410"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#8e2157'
                  }}
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div
              className="p-8 md:p-10"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                minWidth: '280px'
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Full Name <span style={{ color: '#8e2157' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 focus:outline-none transition-colors"
                    style={{
                      borderColor: '#D1D5DB',
                      color: '#2C2C2C'
                    }}
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Email Address <span style={{ color: '#8e2157' }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 focus:outline-none transition-colors"
                    style={{
                      borderColor: '#D1D5DB',
                      color: '#2C2C2C'
                    }}
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 focus:outline-none transition-colors"
                    style={{
                      borderColor: '#D1D5DB',
                      color: '#2C2C2C'
                    }}
                    placeholder="+880 1234-567890"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Subject <span style={{ color: '#8e2157' }}>*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 focus:outline-none transition-colors"
                    style={{
                      borderColor: '#D1D5DB',
                      color: '#2C2C2C'
                    }}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="product">Product Information</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: '#2C2C2C' }}
                  >
                    Message <span style={{ color: '#8e2157' }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 focus:outline-none transition-colors resize-none"
                    style={{
                      borderColor: '#D1D5DB',
                      color: '#2C2C2C'
                    }}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group px-8 py-6 text-base font-semibold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90deg, #8e2157 0%, #5c0931 100%)',
                    color: '#FFFFFF',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Message
                      <Send className="w-5 h-5 inline-block group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div
                    className="p-4 text-center font-medium"
                    style={{
                      backgroundColor: '#F0FDF4',
                      border: '2px solid #22C55E',
                      color: '#166534',
                      minWidth: '100%',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal'
                    }}
                  >
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div
                    className="p-4 text-center font-medium"
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '2px solid #EF4444',
                      color: '#991B1B',
                      minWidth: '100%',
                      display: 'block',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal'
                    }}
                  >
                    Oops! Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser Section */}
      <section
        className="py-12 md:py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)' }}
      >
        <div
          className="mx-auto px-6 lg:px-12 text-center"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4"
            style={{ color: '#2C2C2C' }}
          >
            Looking for Quick Answers?
          </h2>
          <p
            className="text-lg mb-8 mx-auto"
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
            Check out our frequently asked questions for instant help with shipping, returns, sizing, and more.
          </p>
          <a
            href="/faq"
            className="group inline-flex items-center gap-2 px-8 py-6 font-medium rounded-none transition-all duration-500"
            style={{
              border: '2px solid #8e2157',
              color: '#8e2157',
              backgroundColor: 'transparent'
            }}
          >
            Visit FAQ
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  )
}

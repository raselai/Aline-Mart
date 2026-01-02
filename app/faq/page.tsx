'use client'

import { useState } from 'react'
import { ChevronDown, Search, Package, CreditCard, Truck, RefreshCw, Shield, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  icon: typeof Package
  items: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    title: 'Orders & Payment',
    icon: CreditCard,
    items: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. All transactions are secured with SSL encryption to protect your payment information.'
      },
      {
        question: 'How do I place an order?',
        answer: 'Browse our collection, select your desired items, choose size and color options, and add them to your cart. Proceed to checkout, enter your shipping information, and complete payment. You will receive an order confirmation email immediately.'
      },
      {
        question: 'Can I modify or cancel my order after placing it?',
        answer: 'You can modify or cancel your order within 2 hours of placing it by contacting our customer service team. After this window, orders enter our fulfillment process and cannot be modified.'
      },
      {
        question: 'Do you offer international shipping?',
        answer: 'Yes, we ship worldwide to over 150 countries. International shipping costs and delivery times vary by destination. You can view estimated shipping costs at checkout before completing your purchase.'
      },
      {
        question: 'Is it safe to use my credit card on your website?',
        answer: 'Absolutely. We use industry-standard SSL encryption and comply with PCI DSS security standards. Your payment information is never stored on our servers and is processed securely through trusted payment gateways.'
      }
    ]
  },
  {
    title: 'Shipping & Delivery',
    icon: Truck,
    items: [
      {
        question: 'How long does shipping take?',
        answer: 'Domestic orders typically arrive within 3-5 business days. International orders take 7-14 business days depending on the destination. Express shipping options are available at checkout for faster delivery.'
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order by logging into your account and viewing order history. Real-time tracking updates are available through our carrier partners.'
      },
      {
        question: 'What are the shipping costs?',
        answer: 'Shipping costs are calculated based on your location, order weight, and selected shipping method. Standard shipping is free for orders over $200. Exact costs will be displayed at checkout before you complete your purchase.'
      },
      {
        question: 'Do you ship to PO boxes?',
        answer: 'We can ship to PO boxes for standard delivery. However, express and signature-required shipments cannot be delivered to PO boxes and require a physical street address.'
      },
      {
        question: 'What if my package is lost or damaged?',
        answer: 'All shipments are fully insured. If your package is lost or arrives damaged, please contact us within 48 hours with photos of the damage. We will file a claim with the carrier and send you a replacement or full refund immediately.'
      }
    ]
  },
  {
    title: 'Returns & Exchanges',
    icon: RefreshCw,
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for unworn, unwashed items in original condition with all tags attached. Items must be returned in their original packaging. Certain items like intimate apparel and final sale items are not eligible for return.'
      },
      {
        question: 'How do I initiate a return?',
        answer: 'Log into your account, go to order history, and select the items you wish to return. Print the prepaid return label and ship the items back. Once we receive and inspect the items, your refund will be processed within 5-7 business days.'
      },
      {
        question: 'Can I exchange an item for a different size or color?',
        answer: 'Yes, we offer free exchanges for different sizes or colors. Simply initiate a return and place a new order for your preferred option. For faster service, contact our customer support team for direct exchange assistance.'
      },
      {
        question: 'Who pays for return shipping?',
        answer: 'We provide prepaid return labels for all domestic returns. International customers are responsible for return shipping costs unless the item is defective or we shipped the wrong item.'
      },
      {
        question: 'How long does it take to receive my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive and inspect your return. The refund will be credited to your original payment method. Depending on your bank, it may take an additional 3-5 business days to appear in your account.'
      }
    ]
  },
  {
    title: 'Products & Authenticity',
    icon: Shield,
    items: [
      {
        question: 'Are all products authentic?',
        answer: 'Yes, we guarantee 100% authenticity for all products sold on Aline Mart. We source directly from authorized distributors and brand partners. Every luxury item comes with a certificate of authenticity and original packaging.'
      },
      {
        question: 'How do I know what size to order?',
        answer: 'Each product page includes a detailed size guide with measurements. We recommend checking the specific brand size chart as sizing can vary between designers. If you need assistance, our customer service team can help you choose the perfect fit.'
      },
      {
        question: 'Do you restock sold-out items?',
        answer: 'We restock popular items based on availability from our brand partners. You can sign up for restock notifications on any sold-out product page. We will email you immediately when the item becomes available again.'
      },
      {
        question: 'Can I see products in person before buying?',
        answer: 'While we operate primarily online, we offer a virtual consultation service. Book an appointment with our style consultants who can provide detailed product information, styling advice, and answer all your questions via video call.'
      },
      {
        question: 'Do products come with warranty or guarantee?',
        answer: 'All products are covered by manufacturer warranties where applicable. Luxury watches and jewelry come with extended warranties. We also offer our 30-day satisfaction guarantee on all purchases.'
      }
    ]
  },
  {
    title: 'Account & Privacy',
    icon: HelpCircle,
    items: [
      {
        question: 'Do I need an account to make a purchase?',
        answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save items to your wishlist, manage addresses, and access exclusive member benefits and early sales.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page. Enter your email address and we will send you a password reset link. Follow the instructions in the email to create a new password.'
      },
      {
        question: 'Is my personal information secure?',
        answer: 'We take your privacy seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent. Please review our Privacy Policy for complete details.'
      },
      {
        question: 'How do I update my account information?',
        answer: 'Log into your account and navigate to "Account Settings." You can update your email, password, shipping addresses, and communication preferences. Changes are saved automatically.'
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can request account deletion by contacting our customer service team. Please note that deleting your account will remove all order history and wishlist items permanently.'
      }
    ]
  },
  {
    title: 'Customer Support',
    icon: Package,
    items: [
      {
        question: 'How can I contact customer service?',
        answer: 'You can reach us via email at info@alineglobalbd.com, call us at +880 1345-719410, or use the contact form on our Contact Us page. Our support team is available Monday-Friday 9:00 AM - 6:00 PM Bangladesh time.'
      },
      {
        question: 'Do you offer gift wrapping services?',
        answer: 'Yes, we offer complimentary luxury gift wrapping for all orders. Select the gift wrap option at checkout and include a personalized message. Your gift will arrive beautifully packaged in our signature presentation.'
      },
      {
        question: 'Can I use multiple discount codes on one order?',
        answer: 'Only one discount code can be applied per order. If you have multiple codes, the system will automatically apply the one that gives you the greatest savings.'
      },
      {
        question: 'Do you have a loyalty program?',
        answer: 'Yes, our VIP rewards program offers exclusive benefits including early access to sales, birthday gifts, free shipping, and points on every purchase. Join for free by creating an account.'
      },
      {
        question: 'What if I receive the wrong item?',
        answer: 'We sincerely apologize if you receive an incorrect item. Please contact us immediately with your order number and photos. We will arrange for immediate replacement shipping at no cost and provide a prepaid return label for the incorrect item.'
      }
    ]
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
  const [searchQuery, setSearchQuery] = useState('')

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const filteredData = faqData.map(category => ({
    ...category,
    items: category.items.filter(item =>
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

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
              Help Center
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
            Frequently Asked Questions
          </h1>
          <p
            className="text-lg md:text-xl mx-auto mb-8"
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
            Find answers to common questions about ordering, shipping, returns, and more.
          </p>

          {/* Search Box */}
          <div
            className="mx-auto"
            style={{ maxWidth: '600px', minWidth: '280px' }}
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 w-5 h-5"
                style={{
                  transform: 'translateY(-50%)',
                  color: '#6B7280'
                }}
              />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-base"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#2C2C2C',
                  border: 'none',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <p
                style={{
                  color: '#6B7280',
                  fontSize: '1.125rem',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal'
                }}
              >
                No results found for &quot;{searchQuery}&quot;. Try searching with different keywords.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredData.map((category, categoryIndex) => {
                const Icon = category.icon
                return (
                  <div key={categoryIndex}>
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                      </div>
                      <h2
                        className="text-2xl md:text-3xl font-serif font-bold"
                        style={{ color: '#2C2C2C' }}
                      >
                        {category.title}
                      </h2>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                      {category.items.map((item, itemIndex) => {
                        const key = `${categoryIndex}-${itemIndex}`
                        const isOpen = openItems[key]

                        return (
                          <div
                            key={itemIndex}
                            className="border-2 transition-all duration-300"
                            style={{
                              borderColor: isOpen ? '#8e2157' : '#E5E7EB',
                              backgroundColor: isOpen ? '#FFF5F9' : '#FFFFFF',
                              minWidth: '280px'
                            }}
                          >
                            {/* Question Button */}
                            <button
                              onClick={() => toggleItem(categoryIndex, itemIndex)}
                              className="w-full p-6 flex items-start justify-between gap-4 text-left transition-all duration-300"
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <span
                                className="font-semibold text-base md:text-lg flex-1"
                                style={{
                                  color: '#2C2C2C',
                                  display: 'block',
                                  whiteSpace: 'normal',
                                  wordBreak: 'normal',
                                  overflowWrap: 'normal'
                                }}
                              >
                                {item.question}
                              </span>
                              <ChevronDown
                                className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                                style={{
                                  color: '#8e2157',
                                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}
                              />
                            </button>

                            {/* Answer */}
                            {isOpen && (
                              <div
                                className="px-6 pb-6"
                                style={{
                                  borderTop: '1px solid #E5E7EB',
                                  paddingTop: '1.5rem'
                                }}
                              >
                                <p
                                  className="text-base leading-relaxed"
                                  style={{
                                    color: '#6B7280',
                                    display: 'block',
                                    whiteSpace: 'normal',
                                    wordBreak: 'normal',
                                    overflowWrap: 'normal',
                                    minWidth: '100%'
                                  }}
                                >
                                  {item.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section
        className="py-12 md:py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)' }}
      >
        <div
          className="mx-auto px-6 lg:px-12 text-center"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div
            className="mx-auto p-8 md:p-12"
            style={{
              maxWidth: '800px',
              minWidth: '280px',
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF'
            }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Still Have Questions?
            </h2>
            <p
              className="text-lg mb-8"
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Our customer support team is here to help. Get in touch with us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 font-semibold transition-all duration-300"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#8e2157'
                }}
              >
                Contact Us
              </a>
              <a
                href="tel:+8801345719410"
                className="inline-flex items-center justify-center px-8 py-4 font-semibold transition-all duration-300"
                style={{
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF'
                }}
              >
                Call +880 1345-719410
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

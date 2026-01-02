'use client'

import { useState } from 'react'
import { Ruler, User, Shirt, ShoppingBag, Watch, AlertCircle, ChevronDown, Info } from 'lucide-react'

type CategoryType = 'mens-clothing' | 'womens-clothing' | 'shoes' | 'accessories' | 'how-to-measure'

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('mens-clothing')

  const categories = [
    { id: 'mens-clothing' as CategoryType, label: "Men's Clothing", icon: Shirt },
    { id: 'womens-clothing' as CategoryType, label: "Women's Clothing", icon: ShoppingBag },
    { id: 'shoes' as CategoryType, label: 'Shoes', icon: User },
    { id: 'accessories' as CategoryType, label: 'Accessories', icon: Watch },
    { id: 'how-to-measure' as CategoryType, label: 'How to Measure', icon: Ruler },
  ]

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
              Perfect Fit Guide
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
            Size Guide
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
            Find your perfect fit with our comprehensive size charts and measurement guides for all luxury brands.
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
            <Info className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#92400E' }} />
            <div>
              <h3
                className="font-semibold mb-2"
                style={{ color: '#92400E' }}
              >
                Important Sizing Information
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
                Sizing may vary between designers and brands. Always refer to the specific brand size chart on each product page. If you are between sizes, we recommend ordering the larger size for a more comfortable fit. Need help? Our customer service team is available to assist you with personalized sizing advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8" style={{ backgroundColor: '#FFFFFF', borderBottom: '2px solid #E5E7EB' }}>
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-4 font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? '#8e2157' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#2C2C2C',
                    border: `2px solid ${isActive ? '#8e2157' : '#E5E7EB'}`,
                    cursor: 'pointer'
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm md:text-base">{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Size Charts Content */}
      <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div
          className="mx-auto px-6 lg:px-12"
          style={{ maxWidth: '1200px', minWidth: '320px' }}
        >
          {/* Men's Clothing */}
          {activeCategory === 'mens-clothing' && (
            <div>
              <h2
                className="text-3xl md:text-4xl font-serif font-bold mb-8"
                style={{ color: '#2C2C2C' }}
              >
                Men&apos;s Clothing Size Chart
              </h2>

              {/* Men's Tops/Shirts */}
              <div className="mb-12">
                <h3
                  className="text-xl md:text-2xl font-serif font-bold mb-6"
                  style={{ color: '#2C2C2C' }}
                >
                  Tops, Shirts & Jackets
                </h3>
                <div
                  className="overflow-x-auto"
                  style={{
                    border: '2px solid #E5E7EB',
                    minWidth: '280px'
                  }}
                >
                  <table className="w-full" style={{ minWidth: '700px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F5F5F5' }}>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Size</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>US</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>UK/EU</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Chest (inches)</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Waist (inches)</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Shoulder (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>XS</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>34</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>44</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>33-35</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>27-29</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>16.5</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>S</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>36</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>46</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>35-37</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>29-31</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>17</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>M</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>38-40</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>48-50</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>38-40</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32-34</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>17.5-18</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>L</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>42-44</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>52-54</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>41-43</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>35-37</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>18.5-19</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>XL</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>46-48</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>56-58</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>44-46</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>38-40</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>19.5-20</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C' }}>XXL</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>50</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>60</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>47-49</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>41-43</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>20.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Men's Pants */}
              <div>
                <h3
                  className="text-xl md:text-2xl font-serif font-bold mb-6"
                  style={{ color: '#2C2C2C' }}
                >
                  Pants & Trousers
                </h3>
                <div
                  className="overflow-x-auto"
                  style={{
                    border: '2px solid #E5E7EB',
                    minWidth: '280px'
                  }}
                >
                  <table className="w-full" style={{ minWidth: '600px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F5F5F5' }}>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Size</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>US</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>UK/EU</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Waist (inches)</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Inseam (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>XS</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>28-29</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>44</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>27-29</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>30-32</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>S</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>30-31</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>46</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>29-31</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>30-32</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>M</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32-33</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>48-50</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32-34</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32-34</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>L</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>34-36</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>52-54</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>35-37</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32-34</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>XL</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>38-40</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>56-58</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>38-40</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32-34</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C' }}>XXL</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>42-44</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>60</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>41-43</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>32-34</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Women's Clothing */}
          {activeCategory === 'womens-clothing' && (
            <div>
              <h2
                className="text-3xl md:text-4xl font-serif font-bold mb-8"
                style={{ color: '#2C2C2C' }}
              >
                Women&apos;s Clothing Size Chart
              </h2>

              {/* Women's Tops */}
              <div className="mb-12">
                <h3
                  className="text-xl md:text-2xl font-serif font-bold mb-6"
                  style={{ color: '#2C2C2C' }}
                >
                  Tops, Blouses & Dresses
                </h3>
                <div
                  className="overflow-x-auto"
                  style={{
                    border: '2px solid #E5E7EB',
                    minWidth: '280px'
                  }}
                >
                  <table className="w-full" style={{ minWidth: '700px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F5F5F5' }}>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Size</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>US</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>UK</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>EU</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Bust (inches)</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Waist (inches)</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Hips (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>XS</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>0-2</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>4-6</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32-34</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>31-33</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>24-26</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>34-36</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>S</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>4-6</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>8-10</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>36-38</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>33-35</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>26-28</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>36-38</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>M</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>8-10</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>12-14</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>40-42</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>35-37</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>28-30</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>38-40</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>L</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>12-14</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>16-18</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>44-46</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>38-40</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>31-33</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>41-43</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>XL</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>16-18</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>20-22</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>48-50</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>41-43</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>34-36</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>44-46</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C' }}>XXL</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>20</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>24</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>52</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>44-46</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>37-39</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>47-49</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Women's Bra Sizes */}
              <div>
                <h3
                  className="text-xl md:text-2xl font-serif font-bold mb-6"
                  style={{ color: '#2C2C2C' }}
                >
                  Bra Sizes
                </h3>
                <div
                  className="overflow-x-auto"
                  style={{
                    border: '2px solid #E5E7EB',
                    minWidth: '280px'
                  }}
                >
                  <table className="w-full" style={{ minWidth: '500px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F5F5F5' }}>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>US Size</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>UK Size</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>EU Size</th>
                        <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Band (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>32A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>70A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>28-30</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>34A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>34A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>75A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>30-32</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>36A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>36A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>80A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32-34</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>38A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>38A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>85A-D</td>
                        <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>34-36</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold" style={{ color: '#2C2C2C' }}>40A-D</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>40A-D</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>90A-D</td>
                        <td className="p-4" style={{ color: '#6B7280' }}>36-38</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Shoes */}
          {activeCategory === 'shoes' && (
            <div>
              <h2
                className="text-3xl md:text-4xl font-serif font-bold mb-8"
                style={{ color: '#2C2C2C' }}
              >
                Shoe Size Chart
              </h2>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Men's Shoes */}
                <div>
                  <h3
                    className="text-xl md:text-2xl font-serif font-bold mb-6"
                    style={{ color: '#2C2C2C' }}
                  >
                    Men&apos;s Shoes
                  </h3>
                  <div
                    className="overflow-x-auto"
                    style={{
                      border: '2px solid #E5E7EB',
                      minWidth: '280px'
                    }}
                  >
                    <table className="w-full" style={{ minWidth: '400px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F5F5F5' }}>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>US</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>UK</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>EU</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>CM</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>7</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>6.5</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>40</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>25</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>8</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>7.5</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>41</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>26</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>9</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>8.5</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>42</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>27</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>10</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>9.5</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>43</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>28</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>11</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>10.5</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>44</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>29</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C' }}>12</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>11.5</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>45</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>30</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Women's Shoes */}
                <div>
                  <h3
                    className="text-xl md:text-2xl font-serif font-bold mb-6"
                    style={{ color: '#2C2C2C' }}
                  >
                    Women&apos;s Shoes
                  </h3>
                  <div
                    className="overflow-x-auto"
                    style={{
                      border: '2px solid #E5E7EB',
                      minWidth: '280px'
                    }}
                  >
                    <table className="w-full" style={{ minWidth: '400px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F5F5F5' }}>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>US</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>UK</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>EU</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>CM</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>5</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>3</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>36</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>22</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>6</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>4</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>37</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>23</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>7</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>5</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>38</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>24</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>8</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>6</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>39</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>25</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>9</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>7</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>40</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>26</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C' }}>10</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>8</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>41</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>27</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accessories */}
          {activeCategory === 'accessories' && (
            <div>
              <h2
                className="text-3xl md:text-4xl font-serif font-bold mb-8"
                style={{ color: '#2C2C2C' }}
              >
                Accessories Size Guide
              </h2>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Ring Sizes */}
                <div>
                  <h3
                    className="text-xl md:text-2xl font-serif font-bold mb-6"
                    style={{ color: '#2C2C2C' }}
                  >
                    Ring Sizes
                  </h3>
                  <div
                    className="overflow-x-auto mb-6"
                    style={{
                      border: '2px solid #E5E7EB',
                      minWidth: '280px'
                    }}
                  >
                    <table className="w-full" style={{ minWidth: '400px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F5F5F5' }}>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>US</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>UK</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>EU</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Diameter (mm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>4</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>H</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>47</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>14.9</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>5</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>J</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>49</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>15.7</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>6</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>L</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>52</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>16.5</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>7</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>N</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>54</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>17.3</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>8</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>P</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>57</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>18.1</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C' }}>9</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>R</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>59</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>18.9</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    className="p-4"
                    style={{
                      backgroundColor: '#F5F5F5',
                      border: '2px solid #E5E7EB'
                    }}
                  >
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
                      <strong style={{ color: '#2C2C2C' }}>Tip:</strong> Measure your finger at the end of the day when it is largest. Your finger size can change depending on the time of day and weather.
                    </p>
                  </div>
                </div>

                {/* Belt Sizes */}
                <div>
                  <h3
                    className="text-xl md:text-2xl font-serif font-bold mb-6"
                    style={{ color: '#2C2C2C' }}
                  >
                    Belt Sizes
                  </h3>
                  <div
                    className="overflow-x-auto mb-6"
                    style={{
                      border: '2px solid #E5E7EB',
                      minWidth: '280px'
                    }}
                  >
                    <table className="w-full" style={{ minWidth: '400px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F5F5F5' }}>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Size</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Waist (inches)</th>
                          <th className="text-left p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '2px solid #E5E7EB' }}>Belt Length (inches)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>S</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>28-30</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32-34</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>M</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>32-34</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>36-38</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>L</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>36-38</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>40-42</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C', borderBottom: '1px solid #E5E7EB' }}>XL</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>40-42</td>
                          <td className="p-4" style={{ color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>44-46</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold" style={{ color: '#2C2C2C' }}>XXL</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>44-46</td>
                          <td className="p-4" style={{ color: '#6B7280' }}>48-50</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    className="p-4"
                    style={{
                      backgroundColor: '#F5F5F5',
                      border: '2px solid #E5E7EB'
                    }}
                  >
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
                      <strong style={{ color: '#2C2C2C' }}>Tip:</strong> For the most accurate fit, measure your waist where you normally wear your belt, not your pants size. Most belts should be ordered 2 inches larger than your pant waist size.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How to Measure */}
          {activeCategory === 'how-to-measure' && (
            <div>
              <h2
                className="text-3xl md:text-4xl font-serif font-bold mb-8"
                style={{ color: '#2C2C2C' }}
              >
                How to Measure
              </h2>

              <p
                className="text-lg mb-12"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  maxWidth: '800px'
                }}
              >
                For the most accurate measurements, have someone help you measure. Use a soft measuring tape and wear fitted clothing or undergarments. Keep the tape parallel to the floor and snug but not tight.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Body Measurements */}
                <div
                  className="p-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #E5E7EB',
                    minWidth: '280px'
                  }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <Ruler className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} />
                    <div>
                      <h3
                        className="text-xl font-serif font-bold mb-4"
                        style={{ color: '#2C2C2C' }}
                      >
                        Body Measurements
                      </h3>
                      <ul className="space-y-4">
                        <li>
                          <strong style={{ color: '#2C2C2C', display: 'block', marginBottom: '0.5rem' }}>Chest/Bust</strong>
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
                            Measure around the fullest part of your chest, keeping the tape parallel to the floor. For women, measure around the fullest part of your bust.
                          </p>
                        </li>
                        <li>
                          <strong style={{ color: '#2C2C2C', display: 'block', marginBottom: '0.5rem' }}>Waist</strong>
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
                            Measure around your natural waistline, typically the narrowest part of your torso, about 1 inch above your belly button.
                          </p>
                        </li>
                        <li>
                          <strong style={{ color: '#2C2C2C', display: 'block', marginBottom: '0.5rem' }}>Hips</strong>
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
                            Stand with feet together and measure around the fullest part of your hips and buttocks, keeping the tape parallel to the floor.
                          </p>
                        </li>
                        <li>
                          <strong style={{ color: '#2C2C2C', display: 'block', marginBottom: '0.5rem' }}>Inseam</strong>
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
                            Measure from the top of your inner thigh down to your ankle bone. For best results, measure while wearing shoes you will wear with the pants.
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Fit Tips */}
                <div
                  className="p-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #E5E7EB',
                    minWidth: '280px'
                  }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <AlertCircle className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: '#8e2157' }} />
                    <div>
                      <h3
                        className="text-xl font-serif font-bold mb-4"
                        style={{ color: '#2C2C2C' }}
                      >
                        Fit Tips
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-2">
                          <span style={{ color: '#8e2157', marginTop: '4px' }}>•</span>
                          <p
                            className="text-sm flex-1"
                            style={{
                              color: '#6B7280',
                              display: 'block',
                              whiteSpace: 'normal',
                              wordBreak: 'normal',
                              overflowWrap: 'normal'
                            }}
                          >
                            Always measure yourself in undergarments or fitted clothing for the most accurate results.
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <span style={{ color: '#8e2157', marginTop: '4px' }}>•</span>
                          <p
                            className="text-sm flex-1"
                            style={{
                              color: '#6B7280',
                              display: 'block',
                              whiteSpace: 'normal',
                              wordBreak: 'normal',
                              overflowWrap: 'normal'
                            }}
                          >
                            Keep the measuring tape snug but not tight. You should be able to fit one finger under the tape.
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <span style={{ color: '#8e2157', marginTop: '4px' }}>•</span>
                          <p
                            className="text-sm flex-1"
                            style={{
                              color: '#6B7280',
                              display: 'block',
                              whiteSpace: 'normal',
                              wordBreak: 'normal',
                              overflowWrap: 'normal'
                            }}
                          >
                            If you are between sizes, we recommend ordering the larger size for a more comfortable fit.
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <span style={{ color: '#8e2157', marginTop: '4px' }}>•</span>
                          <p
                            className="text-sm flex-1"
                            style={{
                              color: '#6B7280',
                              display: 'block',
                              whiteSpace: 'normal',
                              wordBreak: 'normal',
                              overflowWrap: 'normal'
                            }}
                          >
                            Different brands may fit differently. Always check the specific brand size guide on product pages.
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <span style={{ color: '#8e2157', marginTop: '4px' }}>•</span>
                          <p
                            className="text-sm flex-1"
                            style={{
                              color: '#6B7280',
                              display: 'block',
                              whiteSpace: 'normal',
                              wordBreak: 'normal',
                              overflowWrap: 'normal'
                            }}
                          >
                            For tailored or fitted items, consider having the garment professionally altered for the perfect fit.
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <span style={{ color: '#8e2157', marginTop: '4px' }}>•</span>
                          <p
                            className="text-sm flex-1"
                            style={{
                              color: '#6B7280',
                              display: 'block',
                              whiteSpace: 'normal',
                              wordBreak: 'normal',
                              overflowWrap: 'normal'
                            }}
                          >
                            Remeasure yourself every 6 months as body measurements can change over time.
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Tutorial Placeholder */}
              <div
                className="p-8 text-center"
                style={{
                  background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 100%)',
                  border: '2px solid #E5E7EB',
                  minWidth: '280px'
                }}
              >
                <Ruler className="w-16 h-16 mx-auto mb-4" style={{ color: '#8e2157' }} />
                <h3
                  className="text-2xl font-serif font-bold mb-4"
                  style={{ color: '#2C2C2C' }}
                >
                  Need Help with Measurements?
                </h3>
                <p
                  className="text-base mb-6"
                  style={{
                    color: '#6B7280',
                    maxWidth: '600px',
                    margin: '0 auto 1.5rem',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal'
                  }}
                >
                  Our customer service team is available to provide personalized sizing assistance. Contact us for expert advice on finding your perfect fit.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90deg, #8e2157 0%, #5c0931 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  Contact Us for Help
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

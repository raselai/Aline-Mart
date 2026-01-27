'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X, Upload, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface Brand {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
  parentId?: string | null
}

interface Vendor {
  id: string
  shopName: string
  status: 'ACTIVE' | 'INACTIVE'
}

interface ProductImage {
  url: string
  alt: string
  order: number
}

interface ProductVariant {
  color: string
  size: string
  sku: string
  stock: number
  priceModifier: number
  status: 'in' | 'out'
}

const buildCategoryTree = (categories: Category[]) => {
  const childrenByParent = new Map<string, Category[]>()
  const roots: Category[] = []

  categories.forEach((category) => {
    if (category.parentId) {
      const existing = childrenByParent.get(category.parentId) || []
      existing.push(category)
      childrenByParent.set(category.parentId, existing)
    } else {
      roots.push(category)
    }
  })

  const sortByName = (items: Category[]) =>
    [...items].sort((a, b) => a.name.localeCompare(b.name))

  return {
    roots: sortByName(roots),
    childrenByParent,
    sortByName,
  }
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const { roots: rootCategories, childrenByParent, sortByName } = buildCategoryTree(categories)

  // Form state
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent')
  const [discountValue, setDiscountValue] = useState('')
  const [brandId, setBrandId] = useState('')
  const [mainCategoryId, setMainCategoryId] = useState('')
  const [subCategoryId, setSubCategoryId] = useState('')
  const [inStock, setInStock] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [weight, setWeight] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [shippingFee, setShippingFee] = useState('')
  const [warranty, setWarranty] = useState('')
  const [vendor, setVendor] = useState('')
  const [productStatus, setProductStatus] = useState<'DRAFT' | 'ACTIVE'>('ACTIVE')
  const [images, setImages] = useState<ProductImage[]>([])
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [uploadingImages, setUploadingImages] = useState<{ [key: number]: boolean }>({})
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({})
  const subcategoryOptions = mainCategoryId
    ? sortByName(childrenByParent.get(mainCategoryId) || [])
    : []
  const selectedCategoryId = subCategoryId || mainCategoryId

  // Fetch brands and categories
  useEffect(() => {
    fetchBrandsAndCategories()
  }, [])

  useEffect(() => {
    if (!price || !discountValue) return
    const basePrice = parseFloat(price)
    const discount = parseFloat(discountValue)
    if (Number.isNaN(basePrice) || Number.isNaN(discount)) return

    const calculated = discountType === 'percent'
      ? basePrice - (basePrice * discount) / 100
      : basePrice - discount

    const safeValue = Math.max(0, calculated)
    setSalePrice(safeValue.toFixed(2))
  }, [price, discountType, discountValue])

  const fetchBrandsAndCategories = async () => {
    try {
      const [brandsRes, categoriesRes, vendorsRes] = await Promise.all([
        fetch('/api/brands'),
        fetch('/api/categories'),
        fetch('/api/admin/vendors?status=ACTIVE&limit=100')
      ])

      const brandsData = await brandsRes.json()
      const categoriesData = await categoriesRes.json()
      const vendorsData = await vendorsRes.json()

      // Fix: API returns data in 'data' property, not 'brands'/'categories'
      const brandsList = brandsData.data || []
      const categoriesList = categoriesData.data?.all || []
      const vendorsList = vendorsData.vendors || []

      console.log('Loaded brands:', brandsList.length, brandsList.slice(0, 3))
      console.log('Loaded categories:', categoriesList.length, categoriesList.slice(0, 3))
      console.log('Loaded vendors:', vendorsList.length)

      setBrands(brandsList)
      setCategories(categoriesList)
      setVendors(vendorsList)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value)
    // Only auto-generate slug if it hasn't been manually edited
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
    }
  }

  // Upload image to Supabase Storage
  const handleImageUpload = async (index: number, file: File) => {
    try {
      setUploadingImages(prev => ({ ...prev, [index]: true }))
      setUploadProgress(prev => ({ ...prev, [index]: 0 }))

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        // If bucket doesn't exist, show helpful error
        if (error.message.includes('not found')) {
          throw new Error('Storage bucket "product-images" not found. Please create it in Supabase Dashboard.')
        }
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      // Update image URL
      updateImage(index, 'url', publicUrl)

      setUploadProgress(prev => ({ ...prev, [index]: 100 }))
      setTimeout(() => {
        setUploadingImages(prev => ({ ...prev, [index]: false }))
        setUploadProgress(prev => ({ ...prev, [index]: 0 }))
      }, 1000)

    } catch (error: any) {
      console.error('Upload error:', error)
      alert(error.message || 'Failed to upload image')
      setUploadingImages(prev => ({ ...prev, [index]: false }))
      setUploadProgress(prev => ({ ...prev, [index]: 0 }))
    }
  }

  const addImage = () => {
    setImages([...images, { url: '', alt: '', order: images.length }])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const updateImage = (index: number, field: 'url' | 'alt', value: string) => {
    const updated = [...images]
    updated[index] = { ...updated[index], [field]: value }
    setImages(updated)
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: '', size: '', sku: '', stock: 0, priceModifier: 0, status: 'in' }
    ])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!name || !slug || !price || !brandId || !mainCategoryId) {
        const missing = []
        if (!name) missing.push('Product Name')
        if (!slug) missing.push('Slug')
        if (!price) missing.push('Price')
        if (!brandId) missing.push('Brand')
        if (!mainCategoryId) missing.push('Main Category')
        if (mainCategoryId && subcategoryOptions.length > 0 && !subCategoryId) {
          missing.push('Subcategory')
        }

        alert(`Please fill in all required fields:\n- ${missing.join('\n- ')}`)
        setLoading(false)
        return
      }

      const finalDescription = shortDescription.trim()
        ? `${shortDescription.trim()}\n\n${description.trim()}`
        : description

      const productData = {
        name,
        slug,
        description: finalDescription,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        discountType,
        discountValue: discountValue ? parseFloat(discountValue) : null,
        brandId, // Keep as string (database uses string IDs)
        categoryId: selectedCategoryId, // Keep as string (database uses string IDs)
        inStock,
        featured,
        isNew,
        weight: weight.trim() || null,
        dimensions: dimensions.trim() || null,
        shippingFee: shippingFee.trim() || null,
        warranty: warranty.trim() || null,
        vendor: vendor.trim() || null,
        status: productStatus,
        images: images.filter(img => img.url), // Only include images with URLs
        variants: variants
          .filter(v => v.sku)
          .map(v => ({
            color: v.color || null,
            size: v.size || null,
            sku: v.sku,
            stock: v.status === 'out' ? 0 : v.stock,
            priceModifier: Number.isFinite(v.priceModifier) ? v.priceModifier : 0,
          }))
      }

      console.log('Submitting product data:', productData)
      console.log('Brand ID:', brandId)
      console.log('Category ID:', selectedCategoryId)

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Server error response:', error)
        throw new Error(error.error || 'Failed to create product')
      }

      const result = await response.json()
      console.log('Product created successfully:', result)

      alert('Product created successfully!')
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error creating product:', error)
      alert(error.message || 'Failed to create product')
      setLoading(false)
    }
  }

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-4 hover:opacity-70 transition-opacity"
          style={{ color: '#6B7280' }}
        >
          <ArrowLeft size={20} />
          <span style={{ whiteSpace: 'nowrap' }}>Back to Products</span>
        </button>

        <h1
          className="text-3xl font-serif font-bold"
          style={{
            color: '#2C2C2C',
            display: 'block',
            whiteSpace: 'normal',
            wordBreak: 'normal'
          }}
        >
          Add New Product
        </h1>
        <p
          className="mt-2"
          style={{
            color: '#6B7280',
            display: 'block',
            whiteSpace: 'normal',
            wordBreak: 'normal',
            minWidth: '100%'
          }}
        >
          Create a new product in your catalog
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ minWidth: '280px', width: '100%' }}>
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ minWidth: '280px' }}>
          <h2
            className="text-xl font-serif font-bold mb-4"
            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
          >
            Basic Information
          </h2>

          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="Enter product name..."
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                URL Slug *
                <span className="ml-2 text-xs font-normal" style={{ color: '#10B981' }}>
                  (Auto-generated)
                </span>
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="luxury-watch-gold"
              />
              <p
                className="mt-1 text-sm"
                style={{
                  color: '#6B7280',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal'
                }}
              >
                This appears in the product URL (e.g., alinemart.com/products/<strong style={{ color: '#8e2157' }}>luxury-watch-gold</strong>).
                Auto-generated from product name, but you can customize it.
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="shortDescription"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Short Description
              </label>
              <textarea
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="Short summary for the product..."
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="Enter product description..."
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ minWidth: '280px' }}>
          <h2
            className="text-xl font-serif font-bold mb-4"
            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
          >
            Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Regular Price * ($)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                htmlFor="costPrice"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Cost Price ($)
              </label>
              <input
                type="number"
                id="costPrice"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                htmlFor="salePrice"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Sale Price ($)
              </label>
              <input
                type="number"
                id="salePrice"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label
                htmlFor="discountType"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Discount Type
              </label>
              <select
                id="discountType"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percent' | 'flat')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              >
                <option value="percent">Percent (%)</option>
                <option value="flat">Flat ($)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="discountValue"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Discount Value
              </label>
              <input
                type="number"
                id="discountValue"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder={discountType === 'percent' ? '0.00' : '0.00'}
              />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ minWidth: '280px' }}>
          <h2
            className="text-xl font-serif font-bold mb-4"
            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
          >
            Additional Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Weight (kg)
              </label>
              <input
                type="text"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="e.g., 1.25"
              />
            </div>

            <div>
              <label
                htmlFor="dimensions"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Dimensions (LxWxH)
              </label>
              <input
                type="text"
                id="dimensions"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="e.g., 30 x 20 x 10 cm"
              />
            </div>

            <div>
              <label
                htmlFor="shippingFee"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Shipping Fee
              </label>
              <input
                type="text"
                id="shippingFee"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="Free / Regular / Bulk / Weight-based / $10"
              />
            </div>

            <div>
              <label
                htmlFor="warranty"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Warranty
              </label>
              <input
                type="text"
                id="warranty"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
                placeholder="e.g., 1 year manufacturer warranty"
              />
            </div>

            <div>
              <label
                htmlFor="vendor"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Vendor / Supplier
              </label>
              <select
                id="vendor"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              >
                <option value="">Select a vendor...</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.shopName}>{v.shopName}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="productStatus"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Product Status
              </label>
              <select
                id="productStatus"
                value={productStatus}
                onChange={(e) => setProductStatus(e.target.value as 'DRAFT' | 'ACTIVE')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ minWidth: '280px' }}>
          <h2
            className="text-xl font-serif font-bold mb-4"
            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
          >
            Organization
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Brand *
              </label>
              <select
                id="brand"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              >
                <option value="">Select a brand...</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="mainCategory"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Main Category *
              </label>
              <select
                id="mainCategory"
                value={mainCategoryId}
                onChange={(e) => {
                  setMainCategoryId(e.target.value)
                  setSubCategoryId('')
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              >
                <option value="">Select a main category...</option>
                {rootCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="subcategory"
                className="block text-sm font-medium mb-2"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Subcategory {subcategoryOptions.length > 0 ? '*' : '(optional)'}
              </label>
              <select
                id="subcategory"
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                disabled={!mainCategoryId || subcategoryOptions.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              >
                <option value="">
                  {mainCategoryId
                    ? (subcategoryOptions.length > 0 ? 'Select a subcategory...' : 'No subcategories available')
                    : 'Select a main category first'}
                </option>
                {subcategoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ minWidth: '280px' }}>
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-xl font-serif font-bold"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Product Images
            </h2>
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-md text-sm"
              style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
            >
              <Plus size={16} />
              <span style={{ whiteSpace: 'nowrap' }}>Add Image</span>
            </button>
          </div>

          {images.length === 0 ? (
            <div
              className="text-center py-8 border-2 border-dashed rounded-lg"
              style={{ borderColor: '#E5E7EB' }}
            >
              <Upload size={48} className="mx-auto mb-3" style={{ color: '#9CA3AF' }} />
              <p style={{ color: '#6B7280' }}>No images added yet</p>
              <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>
                Click "Add Image" to upload from your computer or add a URL
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="p-4 border rounded-md" style={{ borderColor: '#E5E7EB' }}>
                  <div className="flex gap-4 items-start">
                    {/* Image Preview */}
                    {image.url && (
                      <div className="w-24 h-24 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={image.url}
                          alt={image.alt || 'Product image'}
                          fill
                          sizes="96px"
                          className="object-cover"
                          onError={(e) => {
                            // Fallback for broken images
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    <div className="flex-1 space-y-3">
                      {/* Upload Button */}
                      <div>
                        <label
                          htmlFor={`image-upload-${index}`}
                          className="inline-flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors text-sm"
                          style={{ borderColor: '#d1d5db', color: '#2C2C2C' }}
                        >
                          <Upload size={16} />
                          <span style={{ whiteSpace: 'nowrap' }}>
                            {uploadingImages[index] ? 'Uploading...' : 'Upload Image'}
                          </span>
                        </label>
                        <input
                          id={`image-upload-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(index, file)
                          }}
                          className="hidden"
                          disabled={uploadingImages[index]}
                        />
                        {uploadingImages[index] && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: `${uploadProgress[index] || 0}%`,
                                  background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* OR divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs" style={{ color: '#9CA3AF' }}>OR</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      {/* URL Input */}
                      <input
                        type="url"
                        value={image.url}
                        onChange={(e) => updateImage(index, 'url', e.target.value)}
                        placeholder="Enter image URL..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{ borderColor: '#d1d5db' }}
                        disabled={uploadingImages[index]}
                      />

                      {/* Alt Text */}
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => updateImage(index, 'alt', e.target.value)}
                        placeholder="Alt text (for SEO and accessibility)..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{ borderColor: '#d1d5db' }}
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      disabled={uploadingImages[index]}
                    >
                      <X size={20} style={{ color: '#DC2626' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Variants */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ minWidth: '280px' }}>
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-xl font-serif font-bold"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Product Variants
            </h2>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-md text-sm"
              style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
            >
              <Plus size={16} />
              <span style={{ whiteSpace: 'nowrap' }}>Add Variant</span>
            </button>
          </div>

          {variants.length === 0 ? (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '2rem 0' }}>
              No variants added yet
            </p>
          ) : (
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="p-4 border rounded-md" style={{ borderColor: '#E5E7EB' }}>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                    <select
                      value={variant.status}
                      onChange={(e) => {
                        const nextStatus = e.target.value as 'in' | 'out'
                        const updated = [...variants]
                        updated[index] = {
                          ...updated[index],
                          status: nextStatus,
                          stock: nextStatus === 'out' ? 0 : updated[index].stock
                        }
                        setVariants(updated)
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      style={{ borderColor: '#d1d5db' }}
                    >
                      <option value="in">In Stock</option>
                      <option value="out">Out of Stock</option>
                    </select>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => updateVariant(index, 'color', e.target.value)}
                      placeholder="Color..."
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      style={{ borderColor: '#d1d5db' }}
                    />
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => updateVariant(index, 'size', e.target.value)}
                      placeholder="Size..."
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      style={{ borderColor: '#d1d5db' }}
                    />
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                      >
                        SKU
                      </label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        placeholder="SKU *"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        style={{ borderColor: '#d1d5db' }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                      >
                        Variant Price
                      </label>
                      <input
                        type="number"
                        value={variant.priceModifier}
                        onChange={(e) => updateVariant(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        style={{ borderColor: '#d1d5db' }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                      >
                        Variant Stock
                      </label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        disabled={variant.status === 'out'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        style={{ borderColor: '#d1d5db' }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-sm flex items-center gap-1 hover:opacity-70"
                    style={{ color: '#DC2626' }}
                  >
                    <X size={16} />
                    Remove variant
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ minWidth: '280px' }}>
          <h2
            className="text-xl font-serif font-bold mb-4"
            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
          >
            Status
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-5 h-5"
              />
              <span style={{ color: '#2C2C2C' }}>In Stock</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5"
              />
              <span style={{ color: '#2C2C2C' }}>Featured Product</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-5 h-5"
              />
              <span style={{ color: '#2C2C2C' }}>Mark as New</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border rounded-md font-medium transition-colors hover:bg-gray-50"
            style={{
              borderColor: '#d1d5db',
              color: '#2C2C2C'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 text-white rounded-md font-medium transition-all"
            style={{
              background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

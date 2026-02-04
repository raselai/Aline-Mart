export interface EditableVariant {
  id?: string
  color?: string | null
  size?: string | null
  sku?: string | null
  stock?: number
  priceModifier?: number
}

export interface VariantValidationError {
  code: 'missingSku' | 'duplicateSku' | 'duplicateCombination' | 'invalidStock' | 'invalidPriceModifier'
  row: number
  message: string
}

export function normalizeVariantText(value?: string | null): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export function buildVariantCombinationKey(color?: string | null, size?: string | null): string {
  return `${(color || '').trim().toLowerCase()}::${(size || '').trim().toLowerCase()}`
}

export function parseVariantList(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    )
  )
}

export function buildVariantSku(
  slug: string,
  color?: string | null,
  size?: string | null,
  index = 0
): string {
  const base = (slug || 'variant')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const colorPart = (color || 'NA')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const sizePart = (size || 'NA')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${base}-${colorPart}-${sizePart}-${String(index + 1).padStart(2, '0')}`
}

export function validateVariants(variants: EditableVariant[]): VariantValidationError[] {
  const errors: VariantValidationError[] = []
  const skuRows = new Map<string, number>()
  const comboRows = new Map<string, number>()

  variants.forEach((variant, index) => {
    const row = index + 1
    const sku = variant.sku?.trim() || ''
    const color = normalizeVariantText(variant.color)
    const size = normalizeVariantText(variant.size)
    const comboKey = buildVariantCombinationKey(color, size)
    const stock = Number(variant.stock ?? 0)
    const priceModifier = Number(variant.priceModifier ?? 0)

    if (!sku) {
      errors.push({
        code: 'missingSku',
        row,
        message: `Row ${row}: SKU is required.`,
      })
    } else {
      const skuKey = sku.toLowerCase()
      const firstSkuRow = skuRows.get(skuKey)
      if (firstSkuRow !== undefined) {
        errors.push({
          code: 'duplicateSku',
          row,
          message: `Row ${row}: SKU duplicates row ${firstSkuRow + 1}.`,
        })
      } else {
        skuRows.set(skuKey, index)
      }
    }

    const firstComboRow = comboRows.get(comboKey)
    if (firstComboRow !== undefined) {
      errors.push({
        code: 'duplicateCombination',
        row,
        message: `Row ${row}: color/size duplicates row ${firstComboRow + 1}.`,
      })
    } else {
      comboRows.set(comboKey, index)
    }

    if (!Number.isFinite(stock) || stock < 0) {
      errors.push({
        code: 'invalidStock',
        row,
        message: `Row ${row}: stock must be 0 or greater.`,
      })
    }

    if (!Number.isFinite(priceModifier)) {
      errors.push({
        code: 'invalidPriceModifier',
        row,
        message: `Row ${row}: price modifier must be a valid number.`,
      })
    }
  })

  return errors
}

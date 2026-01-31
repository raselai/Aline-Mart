'use client'

interface PaymentMethodChartProps {
  data: Array<{ method: string; amount: number; count: number }>
}

const METHOD_COLORS: Record<string, string> = {
  PAYSTATION: '#8e2157',
  COD: '#D97706',
  Unknown: '#9CA3AF',
}

export default function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const total = data.reduce((sum, d) => sum + d.amount, 0)

  if (data.length === 0 || total === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-serif font-bold mb-4" style={{ color: '#2C2C2C' }}>
          Payment Methods
        </h3>
        <div className="flex items-center justify-center h-48" style={{ color: '#9CA3AF' }}>
          No payment data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-serif font-bold mb-4" style={{ color: '#2C2C2C' }}>
        Payment Methods
      </h3>

      {/* Simple horizontal bars */}
      <div className="space-y-4">
        {data.map((item) => {
          const percentage = total > 0 ? (item.amount / total) * 100 : 0
          const color = METHOD_COLORS[item.method] || '#6B7280'
          return (
            <div key={item.method}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium" style={{ color: '#2C2C2C' }}>
                  {item.method}
                </span>
                <span className="text-sm" style={{ color: '#6B7280' }}>
                  {item.count} orders ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full h-6 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                <div
                  className="h-full rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                  style={{
                    width: `${Math.max(percentage, 2)}%`,
                    backgroundColor: color,
                  }}
                >
                  <span className="text-xs text-white font-medium">
                    ৳{item.amount.toLocaleString('en-BD', { minimumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

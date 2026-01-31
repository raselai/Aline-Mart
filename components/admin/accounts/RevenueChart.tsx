'use client'

interface RevenueChartProps {
  data: Array<{ date: string; amount: number }>
}

export default function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-serif font-bold mb-4" style={{ color: '#2C2C2C' }}>
          Revenue Trend
        </h3>
        <div className="flex items-center justify-center h-48" style={{ color: '#9CA3AF' }}>
          No revenue data available
        </div>
      </div>
    )
  }

  const maxAmount = Math.max(...data.map((d) => d.amount))
  const chartHeight = 200

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-serif font-bold mb-4" style={{ color: '#2C2C2C' }}>
        Revenue Trend
      </h3>
      <div className="flex items-end gap-1 overflow-x-auto" style={{ height: chartHeight + 40 }}>
        {data.map((item, idx) => {
          const barHeight = maxAmount > 0 ? (item.amount / maxAmount) * chartHeight : 0
          const dateLabel = new Date(item.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
          })
          return (
            <div key={idx} className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 36 }}>
              <div className="relative group">
                <div
                  className="rounded-t transition-all duration-200"
                  style={{
                    height: Math.max(barHeight, 2),
                    width: 28,
                    background: 'linear-gradient(180deg, #8e2157 0%, #5c0931 100%)',
                  }}
                />
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ backgroundColor: '#2C2C2C' }}
                >
                  ৳{item.amount.toLocaleString('en-BD', { minimumFractionDigits: 0 })}
                </div>
              </div>
              <span className="text-xs mt-1 transform -rotate-45 origin-top-left" style={{ color: '#9CA3AF' }}>
                {dateLabel}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

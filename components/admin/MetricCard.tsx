import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = '#8e2157',
  iconBgColor = '#fdf2f8'
}: MetricCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
      style={{
        borderColor: '#e5e7eb',
        minWidth: '200px'
      }}
    >
      <div className="flex items-center justify-between">
        {/* Text Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            className="text-sm font-medium mb-1"
            style={{
              color: '#6B7280',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </p>
          <p
            className="text-3xl font-bold mb-1"
            style={{
              color: '#2C2C2C',
              whiteSpace: 'nowrap'
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className="text-xs"
              style={{
                color: '#6B7280',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                display: 'block',
                overflowWrap: 'normal'
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center ml-4"
          style={{
            backgroundColor: iconBgColor,
            minWidth: '48px',
            flexShrink: 0
          }}
        >
          <Icon
            className="w-6 h-6"
            style={{ color: iconColor }}
          />
        </div>
      </div>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#F5F5F5' }}
    >
      {/* Minimal header with logo */}
      <div className="w-full py-6 flex justify-center">
        <Link href="/">
          <Image
            src="/Logo.png"
            alt="Aline Mart"
            width={200}
            height={60}
            className="h-14 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-12">
        {children}
      </div>

      {/* Minimal footer */}
      <div className="py-6 text-center">
        <p
          className="text-xs"
          style={{
            color: '#6B7280',
            whiteSpace: 'normal',
            wordBreak: 'normal',
            overflowWrap: 'normal',
          }}
        >
          &copy; {new Date().getFullYear()} Aline Mart. All rights reserved.
        </p>
      </div>
    </div>
  )
}

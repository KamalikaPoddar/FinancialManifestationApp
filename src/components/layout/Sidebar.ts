// src/components/layouts/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FaHome, 
  FaChartLine, 
  FaWallet, 
  FaCog, 
  FaQuestionCircle 
} from 'react-icons/fa'

const MENU_ITEMS = [
  { 
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: <FaHome /> 
  },
  { 
    label: 'Goals', 
    href: '/goals', 
    icon: <FaChartLine /> 
  },
  { 
    label: 'Transactions', 
    href: '/transactions', 
    icon: <FaWallet /> 
  },
  { 
    label: 'Settings', 
    href: '/settings', 
    icon: <FaCog /> 
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">
          Manifestation
        </h1>
      </div>
      <nav className="mt-10">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center px-6 py-3 
              ${pathname === item.href 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-neutral-600 hover:bg-neutral-100'}
              transition-colors duration-200
            `}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Link 
          href="/help" 
          className="flex items-center text-neutral-500 hover:text-primary-600"
        >
          <FaQuestionCircle className="mr-2" />
          Help & Support
        </Link>
      </div>
    </aside>
  )
}

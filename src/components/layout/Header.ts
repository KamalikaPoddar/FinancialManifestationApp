// src/components/layouts/Header.tsx
'use client'

import { useState } from 'react'
import { 
  FaBell, 
  FaUser, 
  FaSearch, 
  FaMoon, 
  FaSun 
} from 'react-icons/fa'
import { useTheme } from 'next-themes'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md mr-6">
          <input 
            type="text"
            placeholder="Search goals, transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="text-neutral-600 hover:text-primary-600"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          {/* Notifications */}
          <button className="relative text-neutral-600 hover:text-primary-600">
            <FaBell />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile */}
          <button className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <FaUser className="text-primary-600" />
            </div>
            <span className="text-sm font-medium">John Doe</span>
          </button>
        </div>
      </div>
    </header>
  )
}

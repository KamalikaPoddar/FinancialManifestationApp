// src/components/ui/Modal.tsx
'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title 
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center 
      bg-black bg-opacity-50 p-4 overflow-y-auto"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md bg-white rounded-lg shadow-xl"
        >
          {title && (
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button 
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <FaTimes />
              </button>
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

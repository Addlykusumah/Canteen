'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image 
              src="/image/kanan.png" 
              alt="Godby Logo" 
              width={200} 
              height={200}
              className="h-35 w-35"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <a href="#home" className="text-sm text-foreground hover:text-red-600 transition">Home</a>
            <a href="#about" className="text-sm text-foreground hover:text-red-600 transition">About</a>
            <a href="#services" className="text-sm text-foreground hover:text-red-600 transition">Services</a>
            <a href="#testimonials" className="text-sm text-foreground hover:text-red-600 transition">Testimonials</a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm">
              Order Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col gap-3">
              <a href="#home" className="text-sm text-foreground hover:text-red-600 py-2">Home</a>
              <a href="#about" className="text-sm text-foreground hover:text-red-600 py-2">About</a>
              <a href="#services" className="text-sm text-foreground hover:text-red-600 py-2">Services</a>
              <a href="#testimonials" className="text-sm text-foreground hover:text-red-600 py-2">Testimonials</a>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm w-full mt-2">
                Order Now
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

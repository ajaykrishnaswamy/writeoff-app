'use client'

import Link from 'next/link'
import { useState } from 'react'
import { WaitlistModal } from "@/components/modals/WaitlistModal"

export default function Navigation() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="brand-name text-xl font-semibold text-gray-900">
                WriteOff
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('problem')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Problem
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('reviews')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Reviews
            </button>
          </div>

          {/* Join Beta Waitlist Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsWaitlistModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200"
            >
              Join Beta Waitlist
            </button>
          </div>
        </div>
      </div>

      <WaitlistModal 
        isOpen={isWaitlistModalOpen} 
        onClose={() => setIsWaitlistModalOpen(false)} 
      />
    </nav>
  )
}
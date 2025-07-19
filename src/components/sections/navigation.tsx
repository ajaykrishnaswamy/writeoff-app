"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WaitlistModal } from '@/components/modals/waitlist-modal';

export default function Navigation() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              WriteOff
            </Link>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/" 
                className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                href="/problem" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Problem
              </Link>
              <Link 
                href="/features" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Features
              </Link>
              <Link 
                href="/how-it-works" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                How It Works
              </Link>
              <Link 
                href="/reviews" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Reviews
              </Link>
            </div>
          </div>

          {/* Get Started Button */}
          <div className="flex items-center">
            <WaitlistModal 
              open={isWaitlistOpen}
              onOpenChange={setIsWaitlistOpen}
            />
            <Button
              onClick={() => setIsWaitlistOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Join Beta Waitlist
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
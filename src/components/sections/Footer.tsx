"use client";

import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { WaitlistModal } from "@/components/modals/WaitlistModal";

export default function Footer() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  return (
    <footer className="bg-[#3A4F6B] text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="brand-name text-xl font-semibold text-white">WriteOff</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              The AI-powered tax assistant that works year-round to help freelancers and gig workers save money.
            </p>
            <div className="flex gap-3 mt-5">
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors cursor-pointer">
                <Facebook size={16} />
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors cursor-pointer">
                <Twitter size={16} />
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors cursor-pointer">
                <Linkedin size={16} />
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors cursor-pointer">
                <Youtube size={16} />
              </div>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-white mb-3">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="text-gray-300 text-sm hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Get Started Column */}
          <div>
            <h3 className="font-semibold text-white mb-3">Get Started</h3>
            <p className="text-gray-300 text-sm mb-3 leading-relaxed">
              Ready to stop overpaying taxes? Join thousands of freelancers already saving money.
            </p>
            <button 
              className="bg-[#FCD34D] hover:bg-[#F59E0B] text-black font-medium px-5 py-2 rounded-lg text-sm transition-colors w-full"
              onClick={() => setIsWaitlistModalOpen(true)}
            >
              Join Beta Waitlist
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 mt-8 pt-5">
          <div className="text-center">
            <p className="text-gray-400 text-sm">© 2024 <span className="brand-name font-medium text-gray-300">WriteOff</span>. All rights reserved.</p>
          </div>
        </div>
      </div>

      <WaitlistModal 
        isOpen={isWaitlistModalOpen} 
        onClose={() => setIsWaitlistModalOpen(false)} 
      />
    </footer>
  );
}
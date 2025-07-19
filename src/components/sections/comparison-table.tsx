"use client";

import { useState } from "react";

export default function ComparisonTable() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      title: "Income Tracking",
      turbotax: "Manual upload of W-2s, 1099s. User must categorize income manually",
      writeoff: "Auto-pulls income data via bank integrations + detects type (freelance, payroll, rent)"
    },
    {
      title: "Deductions & Expenses",
      turbotax: "Long checklist — user must know what applies and no feedback until tax time",
      writeoff: "AI auto-tracks expenses year-round with real-time savings alerts"
    },
    {
      title: "Business/Side Hustle",
      turbotax: "Manual entry of all expense categories, % splits. User guesses amounts",
      writeoff: "Auto-builds Schedule C from real-time transactions. AI suggests smart % splits and files for you"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            TurboTax vs WriteOff: <span className="text-blue-600">Side-by-Side</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Built for content creators and small business owners who need smarter tax tools
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="p-6 font-semibold text-gray-900">Feature</div>
              <div className="p-6 font-semibold text-gray-900 border-l border-gray-200">TurboTax</div>
              <div className="p-6 font-semibold text-gray-900 border-l border-gray-200">WriteOff</div>
            </div>
            
            {features.map((feature, index) => (
              <div key={index} className="grid grid-cols-3 border-b border-gray-200 last:border-b-0">
                <div className="p-6 font-medium text-gray-900 bg-gray-50">
                  {feature.title}
                </div>
                <div className="p-6 text-gray-600 border-l border-gray-200">
                  {feature.turbotax}
                </div>
                <div className="p-6 text-gray-600 border-l border-gray-200 bg-blue-50">
                  {feature.writeoff}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Swipeable Cards */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {features.map((feature, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                    </div>
                    
                    <div className="p-4 border-b border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">TurboTax</h5>
                      <p className="text-gray-600 text-sm">{feature.turbotax}</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50">
                      <h5 className="font-medium text-gray-900 mb-2">WriteOff</h5>
                      <p className="text-gray-600 text-sm">{feature.writeoff}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="text-center mt-4 text-gray-500 text-sm">
            Swipe left to see more comparisons →
          </div>
        </div>

        {/* The Bottom Line */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">The Bottom Line</h3>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto mb-4">
            WriteOff simplifies or skips the most painful parts of tax filing by working year-round. No more hunting for receipts, guessing deductions, or dealing with aggressive upsells.
          </p>
          <p className="text-gray-700 font-medium">
            Automatic, transparent, and built for modern workers
          </p>
        </div>
      </div>
    </section>
  );
}
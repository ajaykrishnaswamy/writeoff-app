"use client";

import { useState } from "react";

const ComparisonSection = () => {
  const comparisonData = [
    {
      id: "expense-tracking",
      title: "Expense Tracking",
      turbotax: "Manual entry of expenses. No automatic tracking",
      keepertax: "Manual review of expenses. No real-time alerts",
      writeoff: "Auto-detects write-offs via Plaid integrations with real-time AI alerts"
    },
    {
      id: "tax-filing", 
      title: "Tax Filing",
      turbotax: "Full-featured tax filing (upsells apply)",
      keepertax: "Offers tax filing as an add-on",
      writeoff: "Auto-builds Schedule C from real-time data with full filing included"
    },
    {
      id: "user-interface",
      title: "User Interface",
      turbotax: "Traditional form-based UI, built for desktop",
      keepertax: "Basic mobile app, SMS interaction with bookkeeper",
      writeoff: "Sleek, swipe-based modern mobile UI built for all"
    },
    {
      id: "real-time-guidance",
      title: "Real-Time Guidance",
      turbotax: "Mostly passive until tax season",
      keepertax: "Expense suggestions via SMS, not dynamic or contextual",
      writeoff: "In-app AI assistant that adapts to your work type and automtically tracks writeoff expenses"
    },
    {
      id: "custom-work-types",
      title: "Custom Work Types",
      turbotax: "General coverage — W-2s, 1099s, SMB",
      keepertax: "General freelancer coverage",
      writeoff: "Tailored onboarding for creators, gig workers, students, W-2s, SMBs, and more"
    },

  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 mb-3">
            <span className="brand-name text-gray-900 font-semibold">TurboTax</span> vs <span className="brand-name text-gray-900 font-semibold">Keeper Tax</span> vs <span className="brand-name text-blue-500 font-semibold">WriteOff</span>
          </h2>
          <p className="text-lg text-gray-600">
            Built for content creators and small business owners who need smarter tax tools
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">Feature</h3>
            </div>
            <div className="p-5 border-l border-gray-200">
              <h3 className="brand-name text-lg font-semibold text-gray-900">TurboTax</h3>
            </div>
            <div className="p-5 border-l border-gray-200">
              <h3 className="brand-name text-lg font-semibold text-gray-900">Keeper Tax</h3>
            </div>
            <div className="p-5 border-l border-gray-200">
              <h3 className="brand-name text-lg font-semibold text-gray-900">WriteOff</h3>
            </div>
          </div>

          {/* Comparison Rows */}
          {comparisonData.map((row, index) => (
            <div key={row.id} className={index !== 0 ? "border-t border-gray-200" : ""}>
              <div className="grid grid-cols-4">
                <div className="p-5">
                  <h4 className="text-lg font-medium text-gray-900">{row.title}</h4>
                </div>
                <div className="p-5 border-l border-gray-200">
                  <div className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <p className="text-sm font-medium text-red-600 leading-relaxed">{row.turbotax}</p>
                  </div>
                </div>
                <div className="p-5 border-l border-gray-200">
                  <div className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <p className="text-sm font-medium text-red-600 leading-relaxed">{row.keepertax}</p>
                  </div>
                </div>
                <div className="p-5 border-l border-gray-200">
                  <div className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <p className="text-sm font-medium text-green-600 leading-relaxed">{row.writeoff}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="horizontal-scroll-container scrollbar-hide">
            <div className="flex gap-4 pb-4">
              {comparisonData.map((row, index) => (
                <div key={row.id} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm p-5">
                  <h4 className="text-lg font-semibold text-gray-900 mb-5 text-center">{row.title}</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <h5 className="brand-name font-semibold text-gray-900 mb-2">TurboTax</h5>
                      <div className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <p className="text-sm font-medium text-red-600 leading-relaxed">{row.turbotax}</p>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-3 rounded-lg">
                      <h5 className="brand-name font-semibold text-gray-900 mb-2">Keeper Tax</h5>
                      <div className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <p className="text-sm font-medium text-red-600 leading-relaxed">{row.keepertax}</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h5 className="brand-name font-semibold text-gray-900 mb-2">WriteOff</h5>
                      <div className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <p className="text-sm font-medium text-green-600 leading-relaxed">{row.writeoff}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-3 text-sm text-gray-500">
            Swipe left to see more comparisons →
          </div>
        </div>

        {/* Bottom Line Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-5">The Bottom Line</h3>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-5">
              <span className="brand-name font-medium text-gray-900">WriteOff</span> simplifies or skips the most painful parts of tax filing by working year-round. 
              No more hunting for receipts, guessing deductions, or dealing with aggressive upsells.
            </p>
            <p className="text-lg font-medium text-gray-900">
              Automatic, transparent, and built for modern workers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
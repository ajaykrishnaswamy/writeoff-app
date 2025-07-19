'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WaitlistModal } from '@/components/modals/waitlist-modal';

const steps = [
  {
    number: '01',
    title: 'Connect Your Accounts',
    description: 'Securely link your bank and credit card accounts in under 2 minutes. We use Plaid and MX with 256-bit encryption and read only access - your data stays safe.',
    bullets: [
      'Fast + easy setup',
      '256-bit encryption',
      'Plaid and MX integrations'
    ]
  },
  {
    number: '02',
    title: 'AI Learns Your Patterns',
    description: 'Our AI instantly scans your transactions and learns your spending patterns. It identifies and categorizes which expenses are business related vs personal in real time.',
    bullets: [
      'Smart categorization',
      'Merchant & industry recognition',
      'Location-based detection'
    ]
  },
  {
    number: '03',
    title: 'Approve & Send',
    description: 'Get real time alerts when a new write-off is detected. Your tax saving updates instantly - no spreadsheets needed. File directly through our built-in tax partner or export your write-offs as a Schedule C summary.',
    bullets: [
      'One-tap approvals',
      'Live tax saving tracker',
      'Auto-ready for filing'
    ]
  }
];

export default function HowItWorksSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollProgress = container.scrollLeft / (container.scrollWidth - container.clientWidth);
        const stepIndex = Math.round(scrollProgress * (steps.length - 1));
        setCurrentStep(stepIndex);
        
        if (container.scrollLeft > 0) {
          setShowScrollHint(false);
        }
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleJoinBeta = () => {
    setIsWaitlistOpen(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How WriteOff Works
          </h2>
          <p className="text-lg text-gray-600">
            Three simple steps to transform your tax situation from stressful to automatic
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-12 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-blue-600">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
              <ul className="space-y-2">
                {step.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Swipeable View */}
        <div className="md:hidden">
          <div className="relative">
            {showScrollHint && (
              <div className="absolute top-4 right-4 z-10 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                Swipe left to see all steps →
              </div>
            )}
            
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {steps.map((step, index) => (
                <div key={index} className="flex-shrink-0 w-80 snap-start">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-4">
                        <span className="text-lg font-bold text-blue-600">{step.number}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                    <ul className="space-y-2">
                      {step.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                          <span className="text-gray-700">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => {
                    const container = scrollContainerRef.current;
                    if (container) {
                      const scrollTo = (index / (steps.length - 1)) * (container.scrollWidth - container.clientWidth);
                      container.scrollTo({ left: scrollTo, behavior: 'smooth' });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <WaitlistModal 
            open={isWaitlistOpen}
            onOpenChange={setIsWaitlistOpen}
          />
          <Button
            onClick={handleJoinBeta}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm"
          >
            Join Beta Waitlist
          </Button>
        </div>
      </div>
    </section>
  );
}
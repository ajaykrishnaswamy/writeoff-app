'use client';

import { useState, useRef, useEffect } from 'react';

interface ProblemCard {
  emoji: string;
  title: string;
  description: string;
}

const problemCards: ProblemCard[] = [
  {
    emoji: '📝',
    title: 'Forgotten Deductions',
    description: 'You miss everyday expenses - software, subscriptions, travel - because you didn\'t track them in real time'
  },
  {
    emoji: '📊',
    title: 'Spreadsheet Hell',
    description: 'Hours wasted manually organizing receipts, categorizing expenses, and guessing what counts, just to pay your CPA after'
  },
  {
    emoji: '⏰',
    title: 'The April Rush',
    description: 'Scrambling at tax time to find documents, invoices, donations, and calculate deductions'
  },
  {
    emoji: '💸',
    title: 'Overpaying The IRS',
    description: 'Most individuals leave $$$ on the table every year by missing ELIGIBLE write-offs'
  }
];

export default function ProblemStatement() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 320; // Width of each card plus gap
      const index = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            The first full stack tax autopilot for modern workers.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Most individuals overpay taxes simply because traditional tax tools only show up in April — when it's already too late.
          </p>
        </div>

        {/* Swipe Instruction */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            ← Swipe left to see more problems →
          </p>
        </div>

        {/* Problem Cards */}
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {problemCards.map((card, index) => (
              <div
                key={index}
                className="flex-none w-80 bg-white rounded-xl p-8 shadow-soft border border-gray-100 snap-center"
              >
                <div className="text-4xl mb-4">{card.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {problemCards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-16">
          <p className="text-xl text-gray-900 font-medium">
            WriteOff fixes all of this — automatically. For your convenience.
          </p>
        </div>
      </div>
    </section>
  );
}
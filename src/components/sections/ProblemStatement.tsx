"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TextReveal } from "@/components/blocks/text-animations/smooth-text-reveal";
import { SectionAnimation } from "@/components/blocks/text-animations/section-reveal";
import { StaggeredAnimationContainer } from "@/components/blocks/text-animations/staggered-container";

const APPLE_EASING = [0.165, 0.84, 0.44, 1] as const;

const problemCards = [
  {
    title: "Forgotten Deductions",
    description: "You miss everyday expenses - software, subscriptions, travel - simply because you didn't track them in real time",
    icon: "📝"
  },
  {
    title: "Spreadsheet Hell", 
    description: "You waste hours sorting receipts, guessing categories, and organizing expenses... just to hand it off to your CPA",
    icon: "📊"
  },
  {
    title: "The April Rush",
    description: "Tax time hits and you're stuck digging for invoices, donation receipts, and deduction records",
    icon: "⏰"
  },
  {
    title: "Overpaying The IRS",
    description: "Every year, most people miss ELIGIBLE write-offs - leaving thousands on the table",
    icon: "💸"
  }
];

export default function ProblemStatement() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % problemCards.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % problemCards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + problemCards.length) % problemCards.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="problem" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <TextReveal
            variant="heading"
            className="text-gray-900 mb-5 max-w-4xl mx-auto"
            delay={0.2}
            staggerDelay={0.03}
          >
            The first full stack tax autopilot for modern workers.
          </TextReveal>
          <SectionAnimation delay={1.0} variant="slide">
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Most individuals overpay taxes simply because traditional tax tools only show up in April — when it's already too late.
            </p>
          </SectionAnimation>
        </div>

        <SectionAnimation delay={1.4} variant="fade">
          <div className="relative">
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <motion.button
                onClick={prevSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Previous slide"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </motion.button>
              
              <motion.button
                onClick={nextSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Next slide"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {/* Mobile Swipe Indicator */}
            <motion.div 
              className="md:hidden text-center mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6, ease: APPLE_EASING }}
            >
              <span className="text-sm text-gray-500">← Swipe left to see more problems →</span>
            </motion.div>

            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {problemCards.map((card, index) => (
                <motion.div
                  key={index}
                  layout
                  className={`bg-white rounded-lg p-6 shadow-lg border-2 transition-all duration-500 cursor-pointer ${
                    index === currentSlide 
                      ? 'border-blue-500 shadow-xl' 
                      : 'border-gray-200 opacity-60'
                  }`}
                  onClick={() => goToSlide(index)}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2, ease: APPLE_EASING }
                  }}
                  animate={{
                    scale: index === currentSlide ? 1.05 : 1,
                    opacity: index === currentSlide ? 1 : 0.6,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: APPLE_EASING,
                  }}
                >
                  <div className="text-center mb-3">
                    <motion.div 
                      className="text-4xl mb-3"
                      animate={{
                        scale: index === currentSlide ? 1.1 : 1,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: APPLE_EASING,
                      }}
                    >
                      {card.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Horizontal Scroll Layout */}
            <div className="md:hidden horizontal-scroll-container scrollbar-hide mb-6">
              <motion.div 
                className="flex gap-4 pb-4"
                style={{ width: `${problemCards.length * 288 + (problemCards.length - 1) * 16}px` }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.8, ease: APPLE_EASING }}
              >
                {problemCards.map((card, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg p-5 shadow-lg border border-gray-200 flex-shrink-0"
                    style={{ width: '288px' }}
                    whileInView={{ 
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.1, duration: 0.6, ease: APPLE_EASING }
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">{card.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Desktop Dot Navigation */}
            <div className="hidden md:flex justify-center space-x-2 mb-8">
              {problemCards.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-blue-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400 w-3'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </SectionAnimation>

        <SectionAnimation delay={2.0} variant="scale">
          <div className="text-center">
            <motion.div 
              className="inline-flex items-center bg-green-50 rounded-full px-4 sm:px-6 py-3 border border-green-200"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2, ease: APPLE_EASING }
              }}
            >
              <motion.div 
                className="w-4 h-4 bg-green-500 rounded-full mr-3"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: APPLE_EASING,
                }}
              />
              <span className="text-green-700 font-semibold text-sm sm:text-base">
                <span className="brand-name font-semibold text-green-700">WriteOff</span> fixes all of this — automatically. For your convenience.
              </span>
            </motion.div>
          </div>
        </SectionAnimation>
      </div>
    </section>
  );
}
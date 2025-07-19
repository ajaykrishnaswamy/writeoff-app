"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { TextReveal } from "@/components/blocks/text-animations/smooth-text-reveal";
import { SectionAnimation } from "@/components/blocks/text-animations/section-reveal";
import { WaitlistModal } from "@/components/modals/WaitlistModal";

const APPLE_EASING = [0.165, 0.84, 0.44, 1] as const;

export default function Hero() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  return (
    <section id="hero" className="bg-gradient-to-r from-blue-50 to-green-50 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="mb-5">
          <TextReveal 
            variant="hero"
            className="text-gray-900 leading-tight"
            delay={0.1}
            staggerDelay={0.02}
          >
            Stop Overpaying Taxes.
          </TextReveal>
          <div className="leading-tight">
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease: APPLE_EASING }}
            >
              <span className="brand-name text-blue-600 font-bold">WriteOff</span> <span className="text-gray-900 font-bold">Finds Every Deduction</span>.
            </motion.h1>
          </div>
        </div>
        
        <SectionAnimation delay={0.6} variant="slide" className="mb-6">
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            The first <span className="font-bold text-blue-600">AI-powered</span> tax autopilot that finds, categorizes, and tracks every business expense in real-time. 
            Turn your smartphone into a tax-saving machine.
          </p>
        </SectionAnimation>
        
        <SectionAnimation delay={0.8} variant="scale">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-700 transition-colors"
              onClick={() => setIsWaitlistModalOpen(true)}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2, ease: APPLE_EASING }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1, ease: APPLE_EASING }
              }}
            >
              Join Beta Waitlist
            </motion.button>
          </div>
        </SectionAnimation>
      </div>

      <WaitlistModal 
        isOpen={isWaitlistModalOpen} 
        onClose={() => setIsWaitlistModalOpen(false)} 
      />
    </section>
  );
}
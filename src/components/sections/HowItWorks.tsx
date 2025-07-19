"use client";

import { useState } from "react";
import { Check } from 'lucide-react';
import { motion } from "framer-motion";
import { TextReveal } from "@/components/blocks/text-animations/smooth-text-reveal";
import { SectionAnimation } from "@/components/blocks/text-animations/section-reveal";
import { StaggeredAnimationContainer } from "@/components/blocks/text-animations/staggered-container";
import { WaitlistModal } from "@/components/modals/WaitlistModal";

const APPLE_EASING = [0.165, 0.84, 0.44, 1] as const;

export default function HowItWorks() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const steps = [
    {
      number: "01",
      title: "Connect Your Accounts", 
      description: "Securely link your bank and credit card accounts in under 2 minutes. We use Plaid and MX with 256-bit encryption and read only access - your data stays safe.",
      features: [
        "Fast + easy setup",
        "256-bit encryption", 
        "Plaid and MX integrations"
      ]
    },
    {
      number: "02",
      title: "AI Learns Your Patterns",
      description: "Our AI instantly scans your transactions and learns your spending patterns. It identifies and categorizes which expenses are business related vs personal in real time.",
      features: [
        "Smart categorization",
        "Merchant & industry recognition",
        "Location-based detection"
      ]
    },
    {
      number: "03", 
      title: "Approve & Send",
      description: "Get real time alerts when a new write-off is detected. Your tax saving updates instantly - no spreadsheets needed. File directly through our built-in tax partner or export your write-offs as a Schedule C summary.",
      features: [
        "One-tap approvals",
        "Live tax saving tracker",
        "Auto-ready for filing"
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.165, 0.84, 0.44, 1] }}
        >
          How it Works
        </motion.h2>
        <SectionAnimation delay={0.3} variant="slide">
          <p className="text-lg text-gray-600">
            Three simple steps to transform your tax situation from stressful to automatic
          </p>
        </SectionAnimation>
      </div>

      {/* Desktop Grid */}
      <StaggeredAnimationContainer 
        className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        delay={0.4}
        staggerDelay={0.1}
        variant="slide"
      >
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.2, ease: APPLE_EASING }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.05, ease: APPLE_EASING }
            }}
          >
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0">
                <motion.div 
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "#3b82f6",
                    transition: { duration: 0.15, ease: APPLE_EASING }
                  }}
                >
                  {step.number}
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {step.description}
                </p>
                <ul className="space-y-1">
                  {step.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex} 
                      className="flex items-center gap-2 text-gray-600"
                      whileHover={{ 
                        x: 5,
                        transition: { duration: 0.15, ease: APPLE_EASING }
                      }}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </StaggeredAnimationContainer>

      {/* Mobile Horizontal Scroll */}
      <div className="lg:hidden mb-12">
        <div className="horizontal-scroll-container scrollbar-hide">
          <motion.div 
            className="flex gap-5 pb-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: APPLE_EASING }}
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="flex-shrink-0 w-80 bg-white rounded-lg p-5 shadow-sm border border-gray-100"
                whileInView={{ 
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.05, duration: 0.3, ease: APPLE_EASING }
                }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2, ease: APPLE_EASING }
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div 
                    className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: "#3b82f6",
                      transition: { duration: 0.15, ease: APPLE_EASING }
                    }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                  {step.description}
                </p>
                <ul className="space-y-1">
                  {step.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex} 
                      className="flex items-center gap-2 text-gray-600 text-sm"
                      whileHover={{ 
                        x: 5,
                        transition: { duration: 0.15, ease: APPLE_EASING }
                      }}
                    >
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="text-center text-sm text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3, ease: APPLE_EASING }}
        >
          Swipe left to see all steps →
        </motion.div>
      </div>

      <SectionAnimation delay={0.8} variant="scale">
        <div className="text-center">
          <motion.button 
            className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            onClick={() => setIsWaitlistModalOpen(true)}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.15, ease: APPLE_EASING }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.05, ease: APPLE_EASING }
            }}
          >
            Join Beta Waitlist
          </motion.button>
        </div>
      </SectionAnimation>

      <WaitlistModal 
        isOpen={isWaitlistModalOpen} 
        onClose={() => setIsWaitlistModalOpen(false)} 
      />
    </section>
  );
}
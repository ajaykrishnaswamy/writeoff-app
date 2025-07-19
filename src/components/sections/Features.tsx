"use client";

import { Shield, Zap, Activity, FileText, Camera, BarChart3 } from 'lucide-react';
import { motion } from "motion/react";
import { TextReveal } from "@/components/blocks/text-animations/smooth-text-reveal";
import { SectionAnimation } from "@/components/blocks/text-animations/section-reveal";
import { StaggeredAnimationContainer } from "@/components/blocks/text-animations/staggered-container";

const APPLE_EASING = [0.165, 0.84, 0.44, 1] as const;

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Securely connect all your spending accounts via Plaid or MX. All your data is encrypted and protected 24/7.',
      badge: 'Secure'
    },
    {
      icon: Zap,
      title: 'AI-Powered Write-Offs',
      description: 'Automatically detects deductible expenses using merchant, location, and other transaction behaviors.',
      badge: 'AI-Powered'
    },
    {
      icon: Activity,
      title: 'Real-time Tax Savings',
      description: 'Watch your refund grow live - see savings update instantly with every logged expense.',
      badge: 'Live Updates'
    },
    {
      icon: FileText,
      title: 'Auto-Generated Tax Summary',
      description: 'Export a clean PDF or CSV of your deductions - or file your taxes directly in the app.',
      badge: 'One-Click'
    },
    {
      icon: Camera,
      title: 'Audit-Ready Records',
      description: 'Upload receipts (optional), auto-organized by category - ready if the IRS comes knocking.',
      badge: 'Audit-Ready'
    },
    {
      icon: BarChart3,
      title: ' Smart Financial Reports',
      description: 'Get monthly insights and reminders to stay organized, save more, and stay tax ready year-round.',
      badge: 'Smart Reports'
    }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <TextReveal
            variant="heading"
            className="text-gray-900 mb-3"
            delay={0.2}
            staggerDelay={0.04}
          >
            Everything You Need for Tax Success
          </TextReveal>
          <SectionAnimation delay={1.0} variant="slide">
            <p className="text-gray-600 text-lg">
              Built for side hustlers. Trusted by creators. Designed to feel like magic.
            </p>
          </SectionAnimation>
        </div>

        {/* Desktop Grid */}
        <StaggeredAnimationContainer 
          className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          delay={1.4}
          staggerDelay={0.15}
          variant="slide"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3, ease: APPLE_EASING }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1, ease: APPLE_EASING }
              }}
            >
              <div className="flex items-center mb-3">
                <motion.div 
                  className="p-3 bg-blue-50 rounded-lg mr-4"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "#dbeafe",
                    transition: { duration: 0.2, ease: APPLE_EASING }
                  }}
                >
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </motion.div>
                <motion.span 
                  className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "#f3f4f6",
                    transition: { duration: 0.2, ease: APPLE_EASING }
                  }}
                >
                  {feature.badge}
                </motion.span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </StaggeredAnimationContainer>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="horizontal-scroll-container scrollbar-hide">
            <motion.div 
              className="flex gap-5 pb-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.8, ease: APPLE_EASING }}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex-shrink-0 w-72 bg-white p-5 rounded-lg shadow-sm border border-gray-100"
                  whileInView={{ 
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.6, ease: APPLE_EASING }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.3, ease: APPLE_EASING }
                  }}
                >
                  <div className="flex items-center mb-3">
                    <motion.div 
                      className="p-3 bg-blue-50 rounded-lg mr-4"
                      whileHover={{ 
                        scale: 1.1,
                        backgroundColor: "#dbeafe",
                        transition: { duration: 0.2, ease: APPLE_EASING }
                      }}
                    >
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </motion.div>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <motion.div 
            className="text-center mt-3 text-sm text-gray-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.6, ease: APPLE_EASING }}
          >
            Swipe left to see more features →
          </motion.div>
        </div>
      </div>
    </section>
  );
}
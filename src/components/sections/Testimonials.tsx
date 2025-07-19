"use client";

import { motion } from "framer-motion";
import { TextReveal } from "@/components/blocks/text-animations/smooth-text-reveal";
import { SectionAnimation } from "@/components/blocks/text-animations/section-reveal";
import { StaggeredAnimationContainer } from "@/components/blocks/text-animations/staggered-container";

const APPLE_EASING = [0.165, 0.84, 0.44, 1] as const;

export default function Testimonials() {
  const testimonials = [
    {
      icon: "💼",
      title: "Small Business Owner",
      quote: "I run my business, not a spreadsheet — WriteOff does the rest.",
      description: "As a small business owner, I was drowning in receipts, spreadsheets, and missed deductions. WriteOff changed everything. It automatically tracks my business expenses, flags write-offs I didn't know existed, and even builds my Schedule C. This year alone, it saved me $4,100 in taxes — and probably 40 hours of busywork. I finally feel like I'm in control of my finances without hiring a bookkeeper.",
      name: "Lila Freeman",
      role: "Owner of Bloom & Bark Studios",
      initials: "LF"
    },
    {
      icon: "📱",
      title: "TikToker / Content Creator",
      quote: "I didn't know snacks and camera gear were tax-deductible until WriteOff showed me.",
      description: "I started creating on TikTok and Instagram last year, and no one teaches you how to handle taxes. I was shocked when WriteOff flagged things like makeup, studio lights, and even props as valid deductions. It helped me recover $3,200 from last year alone. It's like having a tax-savvy manager who knows exactly how creators spend.",
      name: "Jordan Ellis",
      role: "Beauty Content Creator",
      initials: "JE"
    },
    {
      icon: "🚗",
      title: "Uber/Lyft/Instacart Driver",
      quote: "Mileage, gas, car washes — WriteOff caught it all.",
      description: "Before WriteOff, I was guessing my business miles and forgetting half my expenses. Now, everything's automatic. It tracks my trips in real time, categorizes my spending, and gives me weekly savings updates. Last year, I saved $1,580 just from better mileage tracking and gas write-offs. It's a no-brainer if you drive for work.",
      name: "Carlos Mendoza",
      role: "Rideshare & Delivery Driver",
      initials: "CM"
    },
    {
      icon: "👔",
      title: "W-2 Worker with a Side Hustle",
      quote: "I thought I couldn't deduct anything with a W-2 job — I was wrong.",
      description: "I work full-time in marketing but freelance on the side. WriteOff helped me track side hustle income separately, organize my expenses, and find write-offs like my laptop, Wi-Fi, and software. I ended up saving $2,200 I didn't expect. I love the peace of mind that my taxes are getting handled while I focus on the work itself.",
      name: "Ashley Kim",
      role: "Marketing Analyst & Side Hustler",
      initials: "AK"
    }
  ];

  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <TextReveal
            variant="heading"
            className="text-gray-800 mb-3"
            delay={0.2}
            staggerDelay={0.04}
          >
            Trusted by Tax Savers Everywhere
          </TextReveal>
          <SectionAnimation delay={1.0} variant="slide">
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              See how WriteOff is helping people across different industries maximize their refunds.
            </p>
          </SectionAnimation>
        </div>

        {/* Mobile Swipe Indicator */}
        <motion.div 
          className="md:hidden text-center mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6, ease: APPLE_EASING }}
        >
          <span className="text-sm text-gray-500">← Swipe left to see more reviews →</span>
        </motion.div>
        
        {/* Desktop 2x2 Grid Layout */}
        <StaggeredAnimationContainer 
          className="hidden md:grid grid-cols-2 gap-6 max-w-4xl mx-auto"
          delay={1.4}
          staggerDelay={0.2}
          variant="slide"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-5 border border-gray-100"
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
                <span className="text-xl mr-3">{testimonial.icon}</span>
                <h3 className="font-medium text-gray-800 text-sm">{testimonial.title}</h3>
              </div>
              <blockquote className="text-blue-600 font-medium mb-3 text-base leading-relaxed">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: APPLE_EASING }}
                  viewport={{ once: true }}
                >
                  "{testimonial.quote}"
                </motion.span>
              </blockquote>
              <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: APPLE_EASING }}
                  viewport={{ once: true }}
                >
                  {testimonial.description}
                </motion.span>
              </p>
              <div className="flex items-center">
                <motion.div 
                  className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2, ease: APPLE_EASING }
                  }}
                >
                  {testimonial.initials}
                </motion.div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggeredAnimationContainer>

        {/* Mobile Horizontal Scroll Layout */}
        <div className="md:hidden horizontal-scroll-container scrollbar-hide">
          <motion.div 
            className="flex gap-4 pb-4"
            style={{ width: `${testimonials.length * 320 + (testimonials.length - 1) * 16}px` }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.8, ease: APPLE_EASING }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-5 border border-gray-100 flex-shrink-0"
                style={{ width: '320px' }}
                whileInView={{ 
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.15, duration: 0.6, ease: APPLE_EASING }
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
                  <span className="text-xl mr-2">{testimonial.icon}</span>
                  <h3 className="font-semibold text-gray-800 text-sm">{testimonial.title}</h3>
                </div>
                <blockquote className="text-blue-600 font-medium mb-3 text-base leading-relaxed">
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: APPLE_EASING }}
                    viewport={{ once: true }}
                  >
                    "{testimonial.quote}"
                  </motion.span>
                </blockquote>
                <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: APPLE_EASING }}
                    viewport={{ once: true }}
                  >
                    {testimonial.description}
                  </motion.span>
                </p>
                <div className="flex items-center">
                  <motion.div 
                    className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.2, ease: APPLE_EASING }
                    }}
                  >
                    {testimonial.initials}
                  </motion.div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { Shield, Zap, Clock, FileText, ShieldCheck, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
}

const features: Feature[] = [
  {
    icon: <Shield className="w-8 h-8 text-blue-600" />,
    title: "Bank-Grade Integrations",
    description: "Securely connect all your spending accounts via Plaid or MX. Your data is encrypted and protected 24/7.",
    badge: "Secure"
  },
  {
    icon: <Zap className="w-8 h-8 text-blue-600" />,
    title: "Smart Write-off Detection",
    description: "AI categorizes expenses as deductible or not based on merchant, location, and transaction behavior.",
    badge: "AI-Powered"
  },
  {
    icon: <Clock className="w-8 h-8 text-blue-600" />,
    title: "Real-time Tax Savings",
    description: "See your estimated refund increase every time a write-off is logged. Watch your savings grow.",
    badge: "Live Updates"
  },
  {
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    title: "Auto-Generated Tax Summary",
    description: "Export a clean PDF or CSV of your deductions — or file directly through the app.",
    badge: "One-Click"
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
    title: "Audit Protection & Receipts",
    description: "Optional photo uploads, auto-organized by category for extra peace of mind.",
    badge: "Audit-Ready"
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
    title: "Personalized Insights",
    description: "Monthly reports and reminders to keep your finances optimized and tax-ready.",
    badge: "Smart Reports"
  }
];

export default function FeaturesGrid() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth / 3;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  const scrollToFeature = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / 3;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth"
      });
      setCurrentIndex(index);
    }
  };

  const nextFeature = () => {
    const nextIndex = (currentIndex + 1) % features.length;
    scrollToFeature(nextIndex);
  };

  const prevFeature = () => {
    const prevIndex = (currentIndex - 1 + features.length) % features.length;
    scrollToFeature(prevIndex);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Tax Success
          </h2>
          <p className="text-lg text-gray-600">
            Built for freelancers. Trusted by creators. Designed to feel like magic.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-8 shadow-lg border border-gray-100 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {feature.icon}
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {feature.badge}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet Horizontal Scroll */}
        <div className="lg:hidden">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
            onScroll={handleScroll}
            style={{ scrollSnapType: "x mandatory" }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 bg-white rounded-lg p-6 shadow-lg border border-gray-100"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={prevFeature}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextFeature}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={currentIndex === features.length - 1}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToFeature(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Swipe Hint */}
            <div className="text-sm text-gray-500">
              Swipe left to see more features →
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
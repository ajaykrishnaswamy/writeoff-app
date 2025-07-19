import Navigation from '@/components/sections/navigation'
import HeroSection from '@/components/sections/Hero'
import ProblemStatement from '@/components/sections/ProblemStatement'
import SolutionOverview from '@/components/sections/solution-overview'
import FeaturesGrid from '@/components/sections/Features'
import ComparisonTable from '@/components/sections/Comparison'
import HowItWorksSection from '@/components/sections/HowItWorks'
import TestimonialsSection from '@/components/sections/Testimonials'
import Footer from '@/components/sections/Footer'
import { WaitlistForm } from '@/components/forms/waitlist-form'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        
        {/* Waitlist Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Join the Beta Waitlist
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Be among the first to experience WriteOff and maximize your tax deductions. 
                Get early access and special beta pricing.
              </p>
            </div>
            
            <div className="flex justify-center">
              <WaitlistForm className="w-full max-w-md" />
            </div>
          </div>
        </section>
        
        <ProblemStatement />
        <SolutionOverview />
        <FeaturesGrid />
        <ComparisonTable />
        <HowItWorksSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
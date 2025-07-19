import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WaitlistForm } from "@/components/forms/waitlist-form";

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40">
      {/* Back to main site link */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-medium-gray hover:text-dark-gray transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to WriteOff</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-blue to-indigo-600 rounded-full mb-4">
              <span className="text-2xl font-bold text-white">W</span>
            </div>
            
            <h1 className="text-3xl font-bold text-dark-gray">
              Join the WriteOff Waitlist
            </h1>
            
            <p className="text-lg text-medium-gray leading-relaxed">
              Be the first to know when WriteOff launches. Get early access to the smartest way to maximize your tax deductions.
            </p>
          </div>

          {/* Value proposition */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-soft border border-gray-100 space-y-4">
            <h3 className="text-lg font-semibold text-dark-gray">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-medium-gray">
              <li className="flex items-start gap-2">
                <span className="text-primary-blue">✓</span>
                <span>Early access before public launch</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-blue">✓</span>
                <span>Exclusive onboarding and setup support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-blue">✓</span>
                <span>Special launch pricing for waitlist members</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-blue">✓</span>
                <span>Updates on new features and improvements</span>
              </li>
            </ul>
          </div>

          {/* Waitlist form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-soft border border-gray-100">
            <WaitlistForm />
          </div>

          {/* Footer text */}
          <div className="text-center">
            <p className="text-sm text-medium-gray">
              No spam, ever. We'll only send you updates about WriteOff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
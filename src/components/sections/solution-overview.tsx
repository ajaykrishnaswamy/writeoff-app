import React from 'react';

export default function SolutionOverview() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-light-blue">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-dark-gray mb-4">
          WriteOff fixes all of this — automatically.
        </h1>
        <p className="text-lg text-medium-gray mb-4">
          For your convenience.
        </p>
        
        <h2 className="text-3xl md:text-4xl font-bold text-dark-gray mb-4">
          Everything You Need for Tax Success
        </h2>
        
        <p className="text-lg text-medium-gray mb-16">
          Built for freelancers. Trusted by creators. Designed to feel like magic.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-soft">
            <div className="text-2xl mb-4">🔒</div>
            <h3 className="text-xl font-medium text-dark-gray mb-3">
              Bank-Grade Integrations
            </h3>
            <p className="text-medium-gray">
              Securely connect all your spending accounts via Plaid or MX. Your data is encrypted and protected 27x4.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-soft">
            <div className="text-2xl mb-4">🤖</div>
            <h3 className="text-xl font-medium text-dark-gray mb-3">
              Smart Write-off Detection
            </h3>
            <p className="text-medium-gray">
              AI categorizes expenses as deductible or not based on merchant, location, and transaction behavior.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-soft">
            <div className="text-2xl mb-4">⚡</div>
            <h3 className="text-xl font-medium text-dark-gray mb-3">
              Real-time Tax Savings
            </h3>
            <p className="text-medium-gray">
              See your estimated refund increase every time a write-off is logged. Watch your savings grow.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-soft">
            <div className="text-2xl mb-4">📄</div>
            <h3 className="text-xl font-medium text-dark-gray mb-3">
              Auto-Generated Tax Summary
            </h3>
            <p className="text-medium-gray">
              Export a clean PDF or CSV of your deductions — or file directly through the app.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-soft">
            <div className="text-2xl mb-4">🛡️</div>
            <h3 className="text-xl font-medium text-dark-gray mb-3">
              Audit Protection & Receipts
            </h3>
            <p className="text-medium-gray">
              Optional photo uploads, auto-organized by category for extra peace of mind.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-soft">
            <div className="text-2xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-dark-gray mb-3">
              Personalized Insights
            </h3>
            <p className="text-medium-gray">
              Monthly reports and reminders to keep your finances optimized and tax-ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
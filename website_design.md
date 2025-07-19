<high_level_design>
1. **Brand & Art Direction Overview**
   Clean, modern SaaS design with smooth gradients, rounded corners, and professional typography. Features a light background with subtle gradients transitioning from white to very light blue/purple tones, creating a trustworthy financial software aesthetic.

2. **Color Palette** (Clone Exactly)
   | Token | HEX / RGB | Usage | Notes |
   |-------|-----------|-------|-------|
   | Primary Blue | #4F46E5 | CTA buttons, links, brand accents | Primary brand color |
   | Dark Blue | #3B4B66 | Footer background, dark sections | Deep navy for contrast |
   | Light Gray | #F8F9FB | Background sections, cards | Subtle background tint |
   | White | #FFFFFF | Main background, card backgrounds | Clean base |
   | Dark Gray | #1F2937 | Headlines, body text | Primary text color |
   | Medium Gray | #6B7280 | Secondary text, descriptions | Supporting text |
   | Light Blue | #EFF6FF | Gradient backgrounds | Subtle accent |
   | Yellow | #FCD34D | CTA buttons in footer | Secondary action color |

3. **Typography Scale** (Clone Exactly)
   - Primary: System font stack (likely Inter or similar)
   - Hero H1: ~48px, bold weight
   - Section H2: ~32px, bold weight
   - Cards H3: ~20px, medium weight
   - Body text: ~16px, regular weight
   - Small text: ~14px, regular weight

4. **Spacing & Layout Grid** (Clone Exactly)
   - Max width: 1200px container
   - Section padding: 80px vertical
   - Card spacing: 24px gaps
   - Button padding: 12px horizontal, 8px vertical
   - Navigation height: ~60px

5. **Visual Effects & Treatments** (Clone Exactly)
   - Subtle gradient backgrounds
   - Rounded corners: 8px for cards, 6px for buttons
   - Soft shadows: 0 4px 6px rgba(0, 0, 0, 0.1)
   - Smooth transitions on hover states
   - Horizontal scroll sections with swipe indicators

6. **Component Styles** (Clone Exactly)
   - Navigation: Clean top bar with logo left, menu center, CTA right
   - Cards: White background with subtle shadows and rounded corners
   - Buttons: Solid fills with rounded corners, hover effects
   - Feature grids: 2-3 column layouts with emoji icons
   - Testimonial cards: Quote format with avatars and job titles

7. **Site sections** (Clone Exactly)
   - Navigation header with logo and menu
   - Hero section with headline and CTA
   - Problem statement section with swipeable cards
   - Solution overview section
   - Features grid section (swipeable)
   - Comparison table section (TurboTax vs WriteOff)
   - How it works step-by-step section
   - Testimonials section (swipeable)
   - Footer with links and branding
</high_level_design>

<sections>
  <clone_section>
    <file_path>src/components/sections/navigation.tsx</file_path>
    <design_instructions>
      Clone the navigation header with "WriteOff" logo on the left, center menu items (Home, Problem, Features, How It Works, Reviews), and blue "Get Started" button on the right, matching the clean white background and spacing.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/hero.tsx</file_path>
    <design_instructions>
      Clone the hero section with large "Stop Overpaying Taxes." headline, subtitle about AI-powered tax autopilot, and "Join Beta Waitlist" button, featuring the light gradient background and centered layout.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/problem-statement.tsx</file_path>
    <design_instructions>
      Clone the problem statement section with "The first full stack tax autopilot for modern workers" headline, explanation text, and horizontally swipeable cards showing tax problems (Forgotten Deductions, Spreadsheet Hell, April Rush, Overpaying IRS) with emoji icons and descriptions.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/solution-overview.tsx</file_path>
    <design_instructions>
      Clone the solution overview section with "WriteOff fixes all of this — automatically" headline and "Everything You Need for Tax Success" subheading, featuring the clean typography and spacing.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/features-grid.tsx</file_path>
    <design_instructions>
      Clone the features grid section with "Built for freelancers. Trusted by creators. Designed to feel like magic." tagline and horizontally swipeable feature cards including Bank-Grade Integrations, Smart Write-off Detection, Real-time Tax Savings, Auto-Generated Tax Summary, Audit Protection, and Personalized Insights.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/comparison-table.tsx</file_path>
    <design_instructions>
      Clone the comparison table section with "TurboTax vs WriteOff: Side-by-Side" headline, feature comparison table showing Income Tracking, Deductions & Expenses, and Business/Side Hustle comparisons, with swipeable mobile layout and "The Bottom Line" summary.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/how-it-works.tsx</file_path>
    <design_instructions>
      Clone the "How WriteOff Works" section with three numbered steps: Connect Your Accounts, AI Learns Your Patterns, and Approve & Send, each with descriptions and bullet points, featuring the swipeable horizontal layout and "Join Beta Waitlist" CTA.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/testimonials.tsx</file_path>
    <design_instructions>
      Clone the testimonials section with "Trusted by Tax Savers Everywhere" headline and horizontally swipeable testimonial cards featuring quotes from Sarah Chen, Marcus Rodriguez, Jennifer Walsh, and David Park, with their job titles and profile initials.
    </design_instructions>
  </clone_section>

  <clone_section>
    <file_path>src/components/sections/footer.tsx</file_path>
    <design_instructions>
      Clone the dark blue footer with WriteOff logo and tagline on the left, Product/Resources/Get Started columns in the center, social media icons, yellow "Start Free Trial" button, and copyright/legal links at the bottom.
    </design_instructions>
  </clone_section>
</sections>
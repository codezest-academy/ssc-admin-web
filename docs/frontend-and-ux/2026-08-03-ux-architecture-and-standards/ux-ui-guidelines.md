# Code Zest SSC: UX/UI Design Architecture & Guidelines

**Date:** 2026-08-03

As a premium Educational Platform, Code Zest SSC strictly adheres to industry-best practices for UI/UX design. To ensure a cohesive, accessible, and performant user experience across our entire ecosystem, we have instituted robust architectural paradigms.

## 1. The Two Distinct Paradigms

We strictly decouple our styling logic into two specific paradigms based on the target audience.

### Paradigm A: "The Great Flattening" (Admin Web)
The `ssc-admin-web` is a dense data-entry, content-creation, and operational tool used by staff and administrators.
- **Guideline:** Flat, Clean, and Purposeful.
- **Rules:**
  - **No heavy drop shadows, blur effects, or glassmorphism.** These cause cognitive fatigue over long operational sessions.
  - Standardize on crisp 1px borders (`border-border`) and flat card backgrounds (`bg-card`).
  - **60-30-10 Rule:** 60% Neutral Canvas (`bg-background`), 30% Structural elements (`border-border`, typography), and 10% Brand Accents (CTAs only).

### Paradigm B: "Floating Bento" (Client Web)
The `ssc-client` is the student-facing learning portal. It must feel immersive, encouraging, and premium.
- **Guideline:** Tactile, Immersive, and Focused.
- **Rules:**
  - Utilize soft, oversized diffused shadows to emphasize depth and hierarchy (e.g., separating primary learning content from the background canvas).
  - Heavily rounded corners (`rounded-3xl` where appropriate) to feel approachable.
  - Borderless cards to prioritize visual space and content appetite.

## 2. Industry Standard Color Spaces (True OKLCH)

We mandate the use of **True Native OKLCH** color spaces for all CSS variables across both repositories.

**Why OKLCH?**
OKLCH provides mathematical perceptual uniformity. A blue with 65% lightness will have the exact same perceived visual weight as a green with 65% lightness. This is an absolute necessity for our **Subject Badging System** (Quant, English, Reasoning, Science, GA) to ensure no single subject visually overpowers the others on the dashboard.

- **Primary Colors:** Engineered for trust and focus (e.g., CodeZest Indigo for learning).
- **Backgrounds:** We avoid pure white or highly saturated tints. The Admin uses a **Crisp Alabaster** (`oklch(0.98 0.01 250)`) light mode and a **Deep Slate** (`oklch(0.18 0.02 250)`) dark mode to dramatically reduce eye strain for users working 8+ hour shifts.
  - **Admin Pattern Rule:** Admin backgrounds utilize a highly subtle grid pattern (`bg-grid-pattern` at 2-4% opacity) to add professional depth without distracting from data. No decorative gradients or blur-xl circles are permitted on operational pages. Decorative backgrounds must be excluded from print views.
  - **Client Ambient Rule:** The Client portal uses contextual ambient blur gradients (e.g., `bg-ambient-quant`). These are strictly context-aware and isolate a single subject color at a time to reinforce the visual architecture without muddling the palette.
- **Animations:** All animated UI elements (e.g., progress stripes) must respect the user's OS-level accessibility settings via `@media (prefers-reduced-motion: reduce)`.

## 3. Layout & Spacing (8-Point Grid)

We strictly enforce the **8-Point Grid System** for vertical and horizontal rhythm.
- All spacing classes must be multiples of 8px (e.g., `p-4` [16px], `gap-2` [8px], `space-y-6` [24px]).
- Usage of odd-numbered spacing utilities (e.g., `p-3`, `gap-5`) is considered a violation of the design system.

### Density Formatting
- **Dashboards & Tables:** Use tighter spacing (`space-y-6`) for high data density.
- **Forms & Settings:** Use looser spacing (`space-y-8`) to provide breathing room during complex data entry.

## 4. Information Architecture & Scanning Patterns

Pages must be laid out according to how the human eye naturally scans interfaces.

- **The F-Pattern (Dashboards, Question Banks, Tables):** 
  - Users scan horizontally across the top, then down the left edge, branching right when they find a target.
  - **Rule:** Keep primary navigation and row labels left-aligned. Align numerical data right.
- **The Z-Pattern (Login, Exam Settings, Forms):** 
  - The eye travels top-left to top-right, down diagonally to bottom-left, and ends bottom-right.
  - **Rule:** The primary "Save", "Submit", or "Next" button must always be placed at the bottom-right of the form or card.

## 5. Strict Card Anatomy

For the Admin interface ("The Great Flattening"):
- **Internal Spacing:** Must be `p-6` (24px) for consistency.
- **Border Radius:** Must be exactly `rounded-xl`. (Do not mix with `rounded-lg` or `rounded-2xl`).
- **Text Truncation:** Text wrapping inside flex containers must use `flex-1 min-w-0` to prevent layout breaking on long strings (e.g., long question titles).

## 6. Accessibility (A11y)

- **Contrast Validation:** All primary text against its background must satisfy **WCAG AA (4.5:1)** contrast ratios minimum.
- **Touch Targets:** Any interactive element must have a minimum touch target size of 44x44px.
- **Reduced Motion:** All structural animations must respect the `prefers-reduced-motion` media query for users with vestibular disorders.

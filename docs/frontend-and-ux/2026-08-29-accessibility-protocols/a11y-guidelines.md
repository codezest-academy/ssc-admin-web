# Accessibility (a11y) Guidelines

**Date:** 2026-08-29
**Status:** 🟢 Active

---

## 1. Core Principles
Admin dashboards are heavily data-dense. Accessibility is critical for efficiency, not just compliance.

## 2. Keyboard Navigation
- Every interactive element (buttons, links, form fields, dropdowns) must be reachable via the `Tab` key.
- Custom components (e.g., a custom Select or Drag-and-Drop list) must implement standard keyboard controls (Arrows, Enter, Space, Esc).
- **Focus States:** Never remove `outline: none` without providing a clear alternative. Rely on the global `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` semantic tokens.

## 3. ARIA Roles and Attributes
- Use semantic HTML (`<button>`, `<nav>`, `<main>`) whenever possible. It reduces the need for ARIA attributes.
- Use `aria-label` for icon-only buttons (e.g., an 'Edit' pencil icon).
- Use `aria-expanded` and `aria-controls` for dropdowns and accordions.
- Use `aria-invalid` on form inputs that fail validation, and link the error message with `aria-describedby`.

## 4. Screen Reader Testing
Before merging complex UI components (like the Question Builder), developers should test the flow using:
- VoiceOver (macOS) or NVDA (Windows).
- Ensure the reading order is logical and dynamic updates (like a toast notification) are announced using `aria-live="polite"` or `"assertive"`.

## 5. Color Contrast
- Our semantic theme system enforces accessible contrast ratios. 
- Do not hardcode colors outside of the design tokens to ensure compliance remains intact.

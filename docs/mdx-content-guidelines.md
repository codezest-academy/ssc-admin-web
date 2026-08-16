# SSC Content Seeding & MDX Guidelines

This document outlines the standard procedures, component usage, and layout guidelines for seeding theory articles and lesson content in the Code Zest SSC platform. Because our platform uses a custom MDX renderer (`markdown-to-jsx`), there are strict rules to follow to ensure the content renders beautifully and correctly in the new LMS design.

---

## 1. General Typography & Layout Rules

Our LMS design philosophy is **"Clean, Sleek, and Premium"**. We avoid massive "walls of text" and instead break down content using structured, visually distinct components.

*   **Semantic Tokens:** Do not hardcode colors in content. The UI already uses semantic CSS variables (`bg-info`, `text-destructive`, `text-primary`, etc.) linked to Tailwind utility classes.
*   **Headings:** Use standard markdown headings (`##`, `###`). The global typography plugin automatically applies sizing, margins, and borders (e.g., `##` gets a bottom border). 
    *   *Rule:* Never use `#` (H1) inside the content body, as the article title is already rendered as the page's main H1. Start with `##` (H2).
*   **Spacing:** Standard paragraphs get optimized line heights and margins.

---

## 2. Custom MDX Components

To make the content engaging, always wrap specialized content into one of the three primary custom components: `<Callout>`, `<DefinitionBlock>`, and `<Timeline>`.

### A. Callout

Used for emphasizing notes, warnings, exam-specific tips, and pro-tips. It adds a background tint, border, and a specific icon.

**Variants available:** `info` (default), `warning`, `exam`, `tip`.

**Syntax:**
```html
<Callout variant="exam" title="Key Historical Figures & Discoveries">
  Content goes here.
</Callout>
```

**⚠️ CRITICAL RULE FOR LISTS INSIDE COMPONENTS:**
`markdown-to-jsx` has a known parsing quirk. If you use standard markdown lists (e.g., `- Item 1`) inside a custom component, the parser breaks the component prematurely and renders the list outside of the box. 

**Always use explicit HTML `<ul>` and `<li>` tags inside custom components.**

*Incorrect:*
```html
<Callout variant="exam" title="List of Kings">
  - Ashoka
  - Chandragupta
</Callout>
```

*Correct:*
```html
<Callout variant="exam" title="List of Kings">
  <ul className="list-disc pl-5">
    <li>Ashoka</li>
    <li>Chandragupta</li>
  </ul>
</Callout>
```

### B. DefinitionBlock

Used for highlighting definitions, etymologies, or highly specific terms.

**Syntax:**
```html
<DefinitionBlock term="Epigraphy">
  Study of inscriptions is called Epigraphy.
</DefinitionBlock>
```

### C. Timeline & TimelineItem

Used to present chronological data, phases, or hierarchical lists with a beautiful vertical timeline line and nodes.

**Syntax:**
```html
<Timeline>
  <TimelineItem period="500,000 – 10,000 BCE" title="Palaeolithic age (Old Stone Age)">
    Optional content here.
  </TimelineItem>
  <TimelineItem title="Middle Palaeolithic Age">
    Content without a period.
  </TimelineItem>
</Timeline>
```

**⚠️ CRITICAL RULES FOR TIMELINES:**
1.  **NO Self-Closing Tags:** The parser does not support self-closing tags like `<TimelineItem />`. You **must** use explicit closing tags, otherwise the parser will nest all items inside each other like a staircase.
    *   *Incorrect:* `<TimelineItem title="Iron Age" />`
    *   *Correct:* `<TimelineItem title="Iron Age"></TimelineItem>`
2.  **No Markdown Lists:** Just like with Callouts, if you have bullet points inside a `TimelineItem`, you must use HTML `<ul>` and `<li>` tags.

---

## 3. Creating and Updating Seed Files

When writing seed scripts (e.g., in `ssc-api/prisma/seed.ts`), follow these steps:

1.  Write the content as a multiline template string (`` `...` ``).
2.  Ensure that all custom components start at the beginning of the line to prevent markdown indentation from breaking the JSX parser.
3.  Use Prisma's `upsert` method so the seed script can be run repeatedly without duplicating content.

**Example Seed Script Structure:**
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ARTICLE_HTML = `
## Introduction

This is standard markdown text.

<Callout variant="info" title="Principle of Uniformity">
  Past is a key to the present.
</Callout>

<Timeline>
  <TimelineItem title="Pre-History">
    No written script or records existed.
  </TimelineItem>
</Timeline>
`;

async function main() {
  await prisma.lesson.upsert({
    where: {
      chapterId_slug: { chapterId: "...", slug: "theory" },
    },
    update: {
      articleHtml: ARTICLE_HTML,
    },
    create: {
      // ... create payload
      articleHtml: ARTICLE_HTML,
    },
  });
}
```

## 4. Troubleshooting UI Glitches

*   **Component is breaking into multiple pieces:** You likely used a markdown list (`- item`) or markdown heading (`# title`) inside the custom component. Switch to HTML tags (`<ul><li>`, `<strong>`) inside the component.
*   **Timeline items are stair-stepping (nesting):** You likely used a self-closing `<TimelineItem />`. Change it to `<TimelineItem></TimelineItem>`.
*   **Icon is misaligned with the title text:** This occurs when standard HTML heading tags (like `<h4>`) are used inside components, triggering the global Tailwind typography margins. Ensure the component's internal code uses `<div>` with typography utility classes (e.g., `font-bold text-lg`) instead of raw heading tags.

## When to Use What Format

To maintain a consistent and highly readable learning experience, follow these guidelines when deciding how to present information:

### 1. Markdown Tables (`| Column 1 | Column 2 |`)
**Best For:** Structured data, comparisons, and lists of items with attributes (e.g., historical sites with locations and characteristics, formulas, lists of kings with reigns).
**Why:** Tables organize data neatly, making it easy for students to scan and compare properties. Do not use Callouts for tabular data.
**Example:**
```markdown
| Site | Location | Characteristics / Significance |
| :--- | :--- | :--- |
| **Mehrgarh** | Balochistan | Earliest Neolithic site. |
```

### 2. Timelines (`<Timeline>`)
**Best For:** Chronological sequences of events, classification of periods, or step-by-step processes.
**Why:** Gives a clear visual flow of time or progression.
**Example:**
```jsx
<Timeline>
  <TimelineItem period="500k – 10k BCE" title="Palaeolithic age"></TimelineItem>
</Timeline>
```

### 3. Definition Blocks (`<DefinitionBlock>`)
**Best For:** Introducing new terminology, concepts, or etymology (e.g., origin of the word "History", definition of "Epigraphy").
**Why:** Draws attention to key terms that students must memorize.

### 4. Callouts (`<Callout>`)
**Best For:** Highlighting specific insights, tips, or exam-focused warnings.
**Variants:**
- `info` (Blue): For interesting facts or general principles (e.g., "Principle of Uniformity").
- `tip` (Green): For helpful hints or shortcuts.
- `exam` (Red/Destructive): **Use Sparingly.** Only for highly critical exam alerts (e.g., "This topic accounts for 2-3 questions every year in SSC CGL"). Do **not** use the `exam` variant for general lists of data, as the red color implies a warning/error.

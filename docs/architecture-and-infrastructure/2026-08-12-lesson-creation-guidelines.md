# Lesson Creation & Pagination Guidelines

**Date**: 2026-08-12

## 1. Lesson Slug Uniqueness
- **IMPORTANT**: The `slug` field for a Lesson is **only unique per Chapter**. It is no longer globally unique.
- This means that when an admin creates a lesson, they can safely name it something generic like "theory" (slug: `theory`), even if another chapter already has a lesson with the exact same name and slug.
- The routing strictly checks the parent chapter and subject slugs to find the correct lesson.

## 2. Article Pagination via `<hr/>`
- **CRITICAL**: The client application uses a **Frontend-Driven Pagination Strategy** for Article lessons.
- When an admin is writing the HTML content for an article lesson in the WYSIWYG editor, they MUST insert an `<hr/>` (Horizontal Rule) tag wherever they want a page break.
- The frontend client splits the HTML by `<hr/>` tags to create discrete pages for the user to click through ("Next Page").
- This allows students to digest long-form content in small chunks, reducing cognitive overload.

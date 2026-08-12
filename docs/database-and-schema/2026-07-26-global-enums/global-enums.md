# Global Enums & Role Reference

**Date:** 2026-07-26
**Status:** ✅ Approved
**Author:** CVS Charan
**Source:** `ssc-api` → `prisma/schema.prisma`

---

## Purpose

This document mirrors the enums and status values defined in the API schema so the admin-web frontend stays in sync. When the API schema changes, this document must be updated.

---

## Roles

```typescript
enum Role {
  SUPER_ADMIN  // Full platform control
  ADMIN        // Content and user management
  STUDENT      // Student-facing app (not visible in admin-web)
}
```

---

## Exam Types

```typescript
enum ExamType {
  SSC_CGL    // Combined Graduate Level
  SSC_CHSL   // Combined Higher Secondary Level
  SSC_MTS    // Multi Tasking Staff
  SSC_CPO    // Central Police Organisations
  SSC_GD     // General Duty Constable
}
```

---

## Difficulty

```typescript
enum Difficulty {
  EASY
  MEDIUM
  HARD
}
```

---

## Lesson Types

```typescript
enum LessonType {
  VIDEO
  ARTICLE
  PDF
}
```

---

## Attempt Status

```typescript
enum AttemptStatus {
  IN_PROGRESS   // Student has started but not submitted
  SUBMITTED     // Scored and finalized
  EXPIRED       // Timer ran out without submission
}
```

---

## Subscription Tier

```typescript
enum SubscriptionTier {
  FREE
  PRO
  ELITE
}
```

---

## Access Tier

```typescript
enum AccessTier {
  FREE
  PRO
  EXCLUSIVE
}
```

---

## Language

```typescript
enum Language {
  EN   // English
  HI   // Hindi
}
```

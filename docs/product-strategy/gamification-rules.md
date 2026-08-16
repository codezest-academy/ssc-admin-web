# Gamification & XP Rules

This document outlines the rules for XP progression, consistency streaks, and rank tiers within the SSC CGL learning platform.

## 1. Rank Tiers & Requirements
Ranks represent a student's dedication and progress. Ranks are determined by two factors: Total XP Points and the current active Daily Streak. If a student loses their daily streak, they retain their XP but may drop in Rank Tier until the streak is rebuilt.

| Rank Level | Tier Name | Required XP | Required Streak | Description |
|---|---|---|---|---|
| Level 1 | **ASPIRANT** | 0 | None | The starting point of the journey. |
| Level 2 | **CHALLENGER** | 10,000 | None | Requires dedication and a solid amount of practice. |
| Level 3 | **ACHIEVER** | 50,000 | 7 Days | Proves you are both capable and consistent. |
| Level 4 | **MASTER** | 250,000 | 30 Days | Displaying the discipline required to clear the exam. |
| Level 5 | **LEGEND** | 1,000,000 | 90 Days | The ultimate rank. Fully prepared to conquer SSC CGL. |

## 2. Earning XP
XP is earned dynamically based on the student's performance in practice tests, PYQs, and Mock Exams.

*   **Base Score:** +100 XP per mark obtained.
*   **Accuracy Bonus:** Up to +5,000 XP based on the accuracy percentage of the submitted test. (e.g., `accuracy * 50`).

## 3. Implementation Details
*   **Database:** `RankTier` Enum in Prisma (`ASPIRANT`, `CHALLENGER`, `ACHIEVER`, `MASTER`, `LEGEND`). Default is `ASPIRANT`.
*   **Backend:** Evaluated on every test submission in `gamification.service.ts` using `processTestCompletion`.
*   **Frontend:** Displayed globally in the header and via dual progress bars (XP & Streak) in the Analytics Dashboard's Gamification Profile Card.

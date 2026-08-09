# Product Engineering Roadmap: Strategy to Implementation

This roadmap translates the Market Research opportunities into concrete software engineering tasks for our three repositories: `ssc-api` (Backend), `ssc-admin-web` (Admin), and `ssc-client` (Student Portal).

---

## 1. Better Performance Diagnosis (Mock Tests)
**Strategy:** Competitors just give a score. We will provide actionable diagnostics (time-wasting analysis, weak subjects).

*   **`ssc-api` (Backend):**
    *   Enhance the `TestAttempt` and `QuestionAttempt` models to track `timeSpentMs` per question.
    *   Create an aggregation endpoint (`GET /analytics/test/:attemptId`) that calculates average time spent on correct vs. incorrect questions, and groups accuracy by `subjectId` and `chapterId`.
*   **`ssc-client` (Frontend):**
    *   Build an advanced Post-Test Analytics Dashboard.
    *   Use `recharts` to build a "Time vs. Accuracy Quadrant" (e.g., High Time/Low Accuracy = "Danger Zones").
    *   Add a "Compare with Topper" widget.

## 2. Topic-wise PYQ Learning
**Strategy:** Aspirants want to practice Previous Year Questions (PYQs) systematically, not just by reading random papers.

*   **`ssc-api`:**
    *   We already have `isPYQ` and `pyqYear` in the `Question` model.
    *   Add a specialized endpoint (`GET /practice/pyq?chapterId=...`) that generates an infinite-scroll or 20-question randomized practice set exclusively pulling from PYQs of a specific chapter.
*   **`ssc-admin-web`:**
    *   Ensure the Question Bulk Importer easily tags questions with the exact exam shift and year.
*   **`ssc-client`:**
    *   Create a "PYQ Explorer" UI. Users select a Subject -> Chapter, and the app instantly spins up a mini-test of only PYQs for that topic.

## 3. Daily 10-Minute Revision (Current Affairs/Vocab)
**Strategy:** Capitalize on micro-learning to build daily habits and improve retention (increasing Daily Active Users - DAU).

*   **`ssc-api`:**
    *   Create a `DailyQuiz` model (essentially a micro-PracticeSet).
    *   Implement a `UserStreak` model to track consecutive active days.
*   **`ssc-client`:**
    *   Add a "Daily Streak" counter (🔥) to the top navigation.
    *   Build a "Daily 10-Min Target" widget on the main dashboard that unlocks exactly at midnight. Gamify completion with animations (like Duolingo).

## 4. Explain *Why* the Answer is Wrong (Solutions)
**Strategy:** Most platforms just provide the right answer. We will explain the trap behind the wrong options.

*   **`ssc-api` & `ssc-admin-web`:**
    *   Modify the `Question` model to include `distractorRationale` (a JSON object mapping wrong options to explanations, e.g., "If you chose B, you probably forgot to convert cm to meters").
    *   Update the `questions/editor.tsx` in Admin to allow content creators to input these specific rationales.
*   **`ssc-client`:**
    *   In the Test Review screen, if the user selects a wrong option, immediately show the personalized rationale for *why* they fell into that specific trap.

## 5. Weak-Topic Improvement (Rankings / Competition)
**Strategy:** Global ranks demotivate average students. Focus on localized improvement.

*   **`ssc-api`:**
    *   Build a chron-job or dynamic aggregation that calculates a user's "Bottom 3 Chapters" based on their last 3 mock tests.
    *   Create a `/recommendations/weak-areas` endpoint.
*   **`ssc-client`:**
    *   Instead of a generic leaderboard, present a "Target 160+" dashboard.
    *   "You are losing 12 marks in *Geometry*. Click here to practice Geometry." -> Clicking it dynamically generates a practice set for that chapter.

## 6. Personalized Study Plan
**Strategy:** Overcome "Information Overload" by telling the student exactly what to do today.

*   **`ssc-api`:**
    *   Create a `StudyPlan` module that links to a user's target exam date.
    *   Dynamically generate a daily agenda based on syllabus completion status.
*   **`ssc-client`:**
    *   A "Today's Agenda" view. (e.g., 1. Watch Percentage Video, 2. Take Percentage Quiz, 3. Review yesterday's Mock Test mistakes).
    *   Users check off items to progress a daily progress bar.

## 7. Free Structured Learning Path (Courses)
**Strategy:** Use premium, highly structured free courses as a funnel to paid mock tests and advanced analytics.

*   **`ssc-admin-web`:**
    *   Build a "Course Builder" (similar to our Product/Practice Set builders). Allow dragging and dropping Videos, PDFs, and Quizzes into sequential Modules/Lessons.
*   **`ssc-client`:**
    *   Build a sleek, Netflix-style course consumption interface. Track progress percentage per module.

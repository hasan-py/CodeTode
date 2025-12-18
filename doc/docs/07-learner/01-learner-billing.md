---
sidebar_position: 1
title: Learner Billing
description: Learner billing
---

## Step 1: Learner Billing API Implementation

We already developed the API in the last section. Now, we will implement the billing API for learners to view their active courses and billing history.

### Types, Endpoints, and Query Hook

- Add the `ICourseEnrollmentSummary` type in course definitions.
- Create the endpoint `frontend/src/api/endpoints/learner.ts` named `getLearnerBillingSummaryApi`.
- Create a query hook in `frontend/src/hooks/query/course/learner.ts` named `useGetLearnerBillingSummaryQuery()`.

### UI Implementation

- Create a new page: `frontend/src/routes/learner/_layout/billing.tsx`.
- You may notice that the billing page is not accessible by clicking on the sidebar link.
- Add `isAdmin={false}` in the learner layout sidebar component so that it retrieves learner routes and makes the sidebar clickable.
- A table is needed to display the billing history.
- Create a common reusable table component: `frontend/src/components/common/table.tsx`.
- Explain the table component props and usage.
- Use the table component on the billing page.
- Directly call the `useGetLearnerBillingSummaryQuery()` hook on the billing page to fetch the data.
- Explain the billing page code and logic, including the use case of the table component.
- If you encounter an API error (404), it is likely because the route was not added to the `CourseEnrollmentRoutes` constructor.
  The issue can be resolved by adding the route in the constructor: `this.learnerRoutes()`.
- Once the route is added, the API should work correctly.
- Add the `authenticateLearner` middleware to the route to ensure only authenticated learners can access it.
- Test and verify the billing page and the invoice link. That's it for the billing page.

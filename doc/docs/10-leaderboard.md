---
sidebar_position: 10
title: Leaderboard in website
---

## Step 1: Leaderboard Page Implementation

### Backend: Services, Controller, and Routes

- Start by creating a new service in `backend/src/services/learningProgress/learnerStatistics.ts` named `getLeaderboard()`.
- Create the controller for this in `backend/src/controllers/learningProgress/learnerActivity.ts`.
- Add the route in the existing router file. Since this is public, add it to `backend/src/routes/learningProgress/learnerActivity.ts` inside the `publicRoutes` method with `LearnerActivityPublicRouter`.
- Initialize the route in the main route file: `backend/src/routes/index.ts`.
- Create the type in `packages/definitions/src/types/user.ts` as `ILeaderboard`.

### Frontend: Endpoints and Query Hook

- Add a new endpoint in `frontend/src/api/endpoints/learner.ts` named `getLeaderboardApi()`.
- Add a new query hook in `frontend/src/hooks/query/course/learner.ts` named `useGetLeaderboardQuery()`.
- Add the corresponding type as well.

### Frontend: UI Pages and Chart Components

- Create the route page in `frontend/src/routes/(website)/_layout/leaderboard.tsx`.
- Fetch the data using the query hook to ensure the correct data is returned.
- Sort the data by XP in descending order:

```typescript
const sortedUsers = data?.length
  ? [...data].sort((a, b) => (a.totalXp > b.totalXp ? -1 : 1))
  : [];
```

- Bind the data to the UI elements.
- Test the UI to ensure everything is working correctly.

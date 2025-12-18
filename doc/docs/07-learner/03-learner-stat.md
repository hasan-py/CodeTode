---
sidebar_position: 3
title: Learner Statistics
---

## Step 1: Learner Header Info Backend Implementation

### Backend

- Create a new service in `backend/src/services/learningProgress/learnerStatistics.ts`.
- Update `backend/src/services/account/user.ts` to include `learnerStatisticsService.getLearnerStatistics` and bind the information in the response body.

### Frontend

- Test the API and the frontend component to ensure the correct values are displayed in the `learnerInfoHeader` component.

## Step 2: Learner Activity Graph Backend Implementation

### Backend: API Implementation

- Create a new service in `backend/src/services/learningProgress/learnerActivity.ts` with the `getLearnerActivityGraph()` method. See the diagram below.

```mermaid
sequenceDiagram
    participant Client as Client (Frontend/API)
    participant Service as LearnerActivityService
    participant Repo as LearnerActivityRepository
    participant DB as Database

    Client->>Service: getLearnerActivityGraph(userId, year?)
    Service->>Service: Determine targetYear (default: current year)
    Service->>Repo: createQueryBuilder('activity')
    Repo->>DB: Query activity table
    DB-->>Repo: Return grouped activity data (by date)
    Repo-->>Service: Return raw activityData[]
    Service->>Service: Map activityData to formattedActivityData[]
    Service-->>Client: Return formattedActivityData[]
```

- Create a new controller in `backend/src/controllers/learningProgress/learnerActivity.ts` with the `getLearnerActivityGraph()` method.
- Add a new route in `backend/src/routes/learningProgress/learnerActivity.ts` to bind the controller method.
- No validation is needed, as it defaults to the current year if no year is provided.

### Frontend: Activity Graph Component

- Create the endpoint `getLearnerActivityGraphApi()` in `frontend/src/api/endpoints/learner.ts`.
- Create the type for the returned data named `IActivityGraph` in `packages/definitions/src/types/user.ts`.
- Create the query `useGetLearnerActivityGraphQuery()` in `frontend/src/hooks/query/course/learner.ts`.
- Before returning the data, modify it for the component:
  - Add the method `convertDatesWithTimezoneArray(dateString: string): Date` in `frontend/src/utilities/helper/convertDateWithTimezone.ts`.
  - This will convert the date string to the start of the day in the user's timezone.
  - Use it when returning the data in the query hook.
- Update older methods to invalidate queries when a user completes a lesson or earns XP. In the method `useLessonCompleteMutation()`:
  - Invalidate `PROFILE_KEYS.userData` so it refetches.
  - Invalidate `LEARNER_KEYS.leaderBoard` so it refetches.
- Create a new component `ActivityGraph` in `frontend/src/components/learner/course/activityGraph.tsx`.
- Explain the diagram as shown below.

```mermaid
sequenceDiagram
    participant User
    participant Component as ActivityGraph Component
    participant Data as Data Processing
    participant Grid as Grid Rendering
    participant UI as User Interface

    User->>Component: Provides activity data & year
    Note over Component: Component receives props: data[], year?

    Component->>Data: Process raw activity data
    Data->>Data: Filter data for specific year
    Data->>Data: Generate all dates (Jan 1 - Dec 31)
    Data->>Data: Fill missing dates with zero activity
    Data->>Data: Calculate activity levels (0-4) based on XP
    Data->>Data: Group days into weeks (7 days per column)
    Data-->>Component: Return processed weeks array

    Component->>Component: Calculate month labels & positions
    Note over Component: Determine where to place Jan, Feb, Mar, etc.

    Component->>Grid: Render activity squares
    Grid->>Grid: Create 7-row grid (Sun-Sat)
    Grid->>Grid: Map each week as a column
    Grid->>Grid: Apply colors based on activity level
    Note over Grid: w-3 h-3 squares with emerald colors

    Grid-->>UI: Display activity heatmap
    UI->>UI: Show month labels above columns
    UI->>UI: Show day labels (Mon, Wed, Fri) on left
    UI->>UI: Add color legend (Less → More)

    User->>UI: Clicks on activity square
    UI->>Component: Handle day selection
    Component->>Component: Update selectedDay state
    Component-->>UI: Show day details panel
    Note over UI: Display date, XP earned, lessons completed

    User->>UI: Hovers over squares
    UI-->>User: Show tooltip with activity info
```

- Add the query hook to fetch the data and pass it to the component.
- Add this component to the `frontend/src/routes/learner/_layout/courses/index.tsx` page.
- Test the UI by completing a lesson and verifying that the graph updates.

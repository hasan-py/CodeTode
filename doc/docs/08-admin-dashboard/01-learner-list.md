---
sidebar_position: 1
title: Admin Learner List
---

## Step 1: Admin Learner List

### Backend: Service, Controller, and Route

- Create a new service in `backend/src/services/account/user.ts` named `getAllActiveLearner()`. Explain its functionality.
- Create a new controller in `backend/src/controllers/account/user.ts` named `getAllActiveLearner()`. Explain its functionality.
- Add an admin route in `backend/src/routes/account/user.ts` since the service will only be accessible by admin users. Explain its purpose.
- Create a new route `/api/admin/user` and add the `AdminUserRouter` to the main routes file in `backend/src/routes/index.ts`.

### Frontend: Endpoint, Schemas, Query Hook

- Create a new endpoint in `frontend/src/api/endpoints/user.ts` named `getAllActiveLearnerApi()`. Explain its functionality.
- Create a new query hook in `frontend/src/hooks/query/account/user.ts` named `useGetAllActiveLearnersQuery()`. Explain its functionality.

  - Add types in `packages/definitions/src/types/user.ts` for `TLearnerStats`.
  - Create a data modifier helper named `formattedLearnerStats()` in `frontend/src/utilities/helper/learnerStats.ts`. Explain its functionality.

    ```mermaid
    sequenceDiagram
        participant Caller as Caller (Component/Service)
        participant Func as formattedLearnerStats
        participant Map as UserMap (Map)
        participant Output as FormattedUserList

        Caller->>Func: Call formattedLearnerStats(data[])
        Func->>Map: For each record, check if user exists
        alt New user
            Func->>Map: Create new aggregated user profile
            Map->>Map: Add user to Map
        else Existing user
            Func->>Map: Retrieve user from Map
        end
        Func->>Map: Add course info, update totalSpent
        loop For all records
            Func->>Map: Repeat aggregation
        end
        Func->>Output: Format aggregated users
        Output-->>Func: Return formatted user profiles
        Func-->>Caller: Return formattedUserList[]
    ```

    - Add other types that will be used in the helper function.
    - `TFormattedLearnerInfo` and `TAggregatedLearnerStats`.
    - Complete the hook `useGetAllLearnerQuery` and explain its functionality.

### Frontend: Page and Component

- Create a new page in `frontend/src/routes/admin/_layout/learners.tsx`.
- Create a component for the learner list.
- Create a new component `LearnerList` in `frontend/src/components/admin/learnerList.tsx`. Explain its functionality.
- Add the component to the learner list page and call the query hook to fetch the data.
- Explain the code and logic of the page and component.
- Test the page and its functionality. That's it for the learner list page.

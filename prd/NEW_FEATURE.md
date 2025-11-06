# PRD: Real-time Polls with a Refresh Button

## 1. Background

The QuickPoll application currently displays a list of active polls when the page is first loaded. However, if new polls are created by other users, a user has to perform a full browser page refresh to see them. This is not an ideal user experience and can be confusing. To improve the application's dynamism and usability, we need a way for users to manually fetch the latest polls from the database without a disruptive full-page reload.

## 2. Goals

*   Improve the user experience by allowing users to see the latest polls on demand.
*   Reduce the need for full-page reloads, making the application feel faster and more modern.
*   Provide a foundation for future real-time features (e.g., automatic updates via WebSockets).

## 3. User Stories

*   As a user, I want to be able to refresh the list of active polls so that I can see any new polls that have been created since I loaded the page.
*   As a user, I want to see a clear indication that the polls are being updated so I know the application is responding to my action.

## 4. Requirements

### Functional Requirements

*   A "Refresh" button must be added to the "Active Polls" section of the user interface.
*   The button should be clearly visible and intuitively designed (e.g., using a standard refresh icon).
*   When the user clicks the refresh button, the application must make an API call to the backend to fetch the latest list of polls.
*   The list of polls displayed on the page must be updated with the data returned from the API. This update must happen without a full page reload (i.e., it should be a client-side update).
*   A visual loading indicator (e.g., a spinner icon next to the button or a subtle loading bar) must be displayed while the new poll data is being fetched.
*   If the API call fails, the user should be gracefully notified (e.g., a temporary error message), and the existing list of polls should remain visible.

### Non-Functional Requirements

*   **Performance:** The refresh operation (from button click to UI update) should complete in under 2 seconds on a standard internet connection.
*   **Usability:** The button should be placed in an intuitive location on the page, easily accessible to the user.

## 5. Implementation Details

### Frontend (`frontend/src/App.jsx`)

1.  **Add a Refresh Button:**
    *   Introduce a new `<button>` element next to the "Active Polls" heading.
    *   Style the button for good visibility. An icon-based button (e.g., using an SVG for a refresh icon) is preferred.
2.  **State Management:**
    *   Introduce a new state variable, `loading`, initialized to `false`.
    *   `const [loading, setLoading] = useState(false);`
3.  **API Call Logic:**
    *   Create a new asynchronous function, `handleRefresh`, that will be triggered by the button's `onClick` event.
    *   Inside `handleRefresh`:
        *   Set `loading` to `true`.
        *   Make a `GET` request to the `/` endpoint of the backend API.
        *   On a successful response, update the `polls` state with the new data.
        *   Use a `try...catch...finally` block to handle potential network errors and ensure `loading` is set back to `false` after the request completes (either successfully or in error).
4.  **UI Feedback:**
    *   Conditionally render a loading spinner or message based on the `loading` state.
    *   Disable the refresh button while a refresh is in progress to prevent multiple concurrent requests.

### Backend (`backend/main.py`)

*   The existing `GET /` endpoint (which is mapped to `read_polls`) already fetches and returns the complete list of polls. No changes are required on the backend for this feature. The endpoint is sufficient to serve the frontend's refresh request.

## 6. Success Metrics

*   **Feature Adoption:** Track the number of clicks on the refresh button to understand user engagement with the new feature.
*   **Performance:** Monitor the average latency of the `GET /` API call from the Cloud Run logs to ensure it meets performance requirements.
*   **User Feedback:** Positive user feedback regarding the ability to see new polls without a full page refresh.

# Specification

## Summary
**Goal:** Add an authenticated, admin-only Admin page to view canister-stored messages (text + timestamp) with clear access control and UI feedback.

**Planned changes:**
- Add a new `/admin` route rendered within the existing AppShell layout, alongside existing routes.
- Implement an Admin page that fetches messages via React Query using a new admin-only backend query, and displays them in a readable list/table with human-readable timestamps.
- Add loading, empty, and error states, including “Access denied” for unauthorized users and a prompt to sign in with Internet Identity when not authenticated.
- Add a manual “Refresh” action to re-fetch messages (React Query refetch/invalidation).
- Update the backend Motoko actor to include a hardcoded admin principal allowlist and a new admin-only query method (e.g., `getMessagesAdmin`) that returns messages or an explicit error when unauthorized, without changing existing public methods.
- Expose an “Admin” navigation link in the header that only appears when the user is authenticated and their principal matches a frontend allowlist aligned with the backend.
- Add i18n keys (English minimum) for the Admin nav label and Admin page text using the existing translation structure, ensuring safe fallback/no missing-key crashes.

**User-visible outcome:** Authorized admins can navigate to `/admin` to view and refresh stored canister messages with timestamps; non-admins see an access-denied message, and unauthenticated users are prompted to sign in.

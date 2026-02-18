# Specification

## Summary
**Goal:** Let admins view all collected user submissions with stable IDs and timestamps, and delete submissions from the Admin dashboard.

**Planned changes:**
- Update backend message storage so each submission has a stable unique identifier and timestamp, and expose an admin-protected list API returning (messageId, messageText, timestamp).
- Add admin-protected backend delete APIs to remove a submission by id (and optionally delete all), with clear errors for unauthorized access or missing ids.
- Update the Admin page (/admin) to fetch and display the submission list from the backend (timestamp + content) with an English empty state and working Refresh.
- Add per-row Delete controls with confirmation, showing English error messages on failure and refreshing the list after successful deletion without full page reload.
- Update React Query hooks to query the admin list (including ids) and perform delete mutations using the existing admin session stored in sessionStorage, invalidating/refetching after deletes.
- Add/adjust English i18n strings for delete actions and confirmation prompts, with no references to Internet Identity.

**User-visible outcome:** After admin login, the Admin dashboard shows a live list of collected submissions (with timestamps) and the admin can delete individual submissions (with confirmation), with the list updating immediately after changes.

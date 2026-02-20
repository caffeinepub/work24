# Specification

## Summary
**Goal:** Fix the admin dashboard to properly display activity data submitted from any device by debugging backend storage and frontend data retrieval.

**Planned changes:**
- Debug and fix backend message storage to ensure cross-device activities are persisted in stable storage
- Add comprehensive backend logging for message storage and retrieval operations
- Verify and fix ActivityFeed and MessagesTab components to fetch all backend data without client-side filtering
- Add error boundaries and network diagnostics to surface backend query failures

**User-visible outcome:** Admin dashboard will display all activity data regardless of which device submitted it, with clear error messages if data retrieval fails.

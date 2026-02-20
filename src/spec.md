# Specification

## Summary
**Goal:** Fix the admin dashboard to display all user activities while removing the activity feed from the main home page.

**Planned changes:**
- Remove the ActivityFeed component from the main home page (HomeServices.tsx)
- Update the admin dashboard Messages tab to display all user activities including worker registrations, material listings, and requirement submissions
- Modify the backend getAllMessages query to return all message records without filtering

**User-visible outcome:** Regular users no longer see an activity feed on the home page. Admins can view all user activities (worker registrations, material listings, requirements) in the admin dashboard Messages tab.

# Specification

## Summary
**Goal:** Rebuild Work24 from scratch as a complete worker marketplace platform with multi-language support, admin dashboard, and platform-mediated contact system.

**Planned changes:**
- Create home page with service category navigation
- Implement service detail pages showing workers filtered by category
- Build worker submission form (name, skill, service category, location, profile image, minimum 3 work images)
- Build material seller submission form (name, category, description, location, images)
- Create materials listing page with grid display and contact buttons
- Implement career application form for job seekers
- Create architect project submission form with file uploads
- Build admin dashboard with authentication (username: Bharat1213, password: Bharat1213) featuring three tabs: materials, workers, and messages with submitter attribution
- Implement contact flow where customers contact workers/materials through Work24 platform (no direct contact info exposed)
- Add onboarding flow collecting user name and language preference
- Create contact us page with Work24 phone number and email
- Implement multi-language support (English, Hindi, Gujarati) with language switcher and localStorage persistence
- Apply consistent visual design theme with off-white base, orange primary, and green accent colors using OKLCH color system with light and dark mode support
- Use single-actor Motoko backend with role-based access control for admin operations
- Store all images in base64 format with submitter attribution tracking

**User-visible outcome:** Users can browse service categories, view workers by category, submit worker/material profiles, apply for careers, submit architect projects, and contact workers/materials through the Work24 platform. Admins can log in to view and manage all submissions. The application supports English, Hindi, and Gujarati languages with persistent user preferences.

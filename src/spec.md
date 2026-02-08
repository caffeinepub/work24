# Specification

## Summary
**Goal:** Add a “Contact Us” item to the header navigation that links to the existing `/contact` page and uses the existing i18n label.

**Planned changes:**
- Add a new “Contact Us” navigation item to the desktop header navbar that routes to `/contact`.
- Add the same “Contact Us” item to the mobile (sheet) navigation menu.
- Source the navigation label from i18n using the existing key `nav.contact` (no hardcoded label).

**User-visible outcome:** Users see a “Contact Us” item in both desktop and mobile navigation; selecting it navigates to the existing Contact Us page at `/contact`.

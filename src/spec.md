# Specification

## Summary
**Goal:** Make Admin dashboard submissions readable by formatting JSON message content into a structured, human-friendly layout while still allowing access to the raw JSON.

**Planned changes:**
- Update the Admin dashboard “Message” table cell rendering to detect when a message text is a JSON object string, parse it client-side, and display a structured labels + values view instead of raw JSON.
- Keep current behavior for non-JSON message text (display as plain text).
- Add a per-row toggle for JSON-parsable messages to switch between “Formatted” and “Raw JSON” views without affecting other rows and without refetching.
- In formatted view, display commonly useful fields when present (type, customerName/name, mobile, requirement/message/details, location, budget, skills, experience, timestamp, image/file counts) and show remaining keys under an “Other fields” section.
- Ensure the formatted layout is responsive (wrap long text, avoid overflow in the table cell) and raw JSON is shown as a wrapped monospaced block.
- Add/adjust i18n keys for any new Admin UI text (e.g., Formatted, Raw JSON, Other fields) with English as the default.

**User-visible outcome:** Admins see submissions in a clean, readable format within the message table, can toggle any JSON-based row between formatted and raw views, and non-JSON messages remain unchanged.

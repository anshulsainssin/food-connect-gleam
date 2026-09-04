# Food Waste Connect receiver and tracking views

## What will be added
- Add a receiver view with sample food donation cards, urgency labels, distances, pickup deadlines, locations, and claim actions.
- Add simple Nearby, Vegetarian, Non-vegetarian, and Urgent filters that update the visible sample cards locally.
- Add a pickup details view with donor, receiver, location, deadline, current status, a five-step timeline, and stage-appropriate sample actions.
- Add an impact view with the requested totals and clear visual progress indicators.
- Add a profile view with sample personal and organization details plus an edit-profile interaction.

## Shared experience
- Refactor the current top bar, desktop sidebar, and mobile navigation into a shared app frame so all views feel like one product.
- Connect navigation to real pages and preserve the existing donor dashboard and donation form.
- Keep the selected warm editorial styling, typography, compact corners, spacing, and responsive behavior.

## Technical details
- Create separate frontend pages for receiver donations, pickup tracking, impact, and profile, each with unique page metadata.
- Use local React state only for filters, claim/status demonstrations, and profile editing.
- Do not add Cloud, authentication, maps, APIs, or persistent storage.
- Verify desktop and narrow mobile layouts, interactions, overflow, and the final app health.

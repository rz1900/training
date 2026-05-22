# Workload Approval Prototype Design

## Purpose

Build `last-task`, a runnable front-end prototype for the workload approval management system described in `5.20-5.22培训准备(1).docx`.

The prototype is for training demonstration. It must show the core workflow and preserve screenshots of key nodes. It will not implement a real Spring Boot backend, MySQL, Redis, or authentication server.

## Scope

The system uses local mock data and runs entirely in the browser. It presents three roles:

- Product Manager: sees only assigned requirements and submits final approved workload.
- Development Administrator: imports requirements, tracks progress, sends reminders, and views statistics.
- System Administrator: views and manages user and role status in a simulated management screen.

The prototype must include:

- Dashboard with status counts, workload totals, reduction totals, and grouped summaries.
- Requirement management list with filters and full requirement fields.
- Batch import simulation with template download affordance, row-level validation feedback, and notification result.
- Product manager workload submission flow with automatic reduction calculation.
- Reminder flow with retained reminder records.
- User and role management screen.
- Saved screenshots under `last-task/screenshots`.

## Out Of Scope

- Real Excel parsing.
- Real database persistence.
- Real login, password handling, or server-side RBAC.
- Real message delivery.
- Java/Spring Boot service scaffolding.
- MySQL or Redis setup.

## Architecture

Use a lightweight static front-end in `last-task`.

Recommended structure:

- `index.html`: application shell.
- `src/styles.css`: visual system and responsive layout.
- `src/app.js`: mock data, state transitions, filters, and UI rendering.
- `screenshots/`: captured key-node screenshots.

The app should run with a simple local static server or by opening `index.html` if browser security permits. If a dev server is needed for screenshots, use an available local port and document the command.

## UX Model

Use an operational dashboard layout:

- Left navigation for Dashboard, Requirements, Import, My Workload, Reminders, Users.
- Top bar with role switcher to demonstrate permission differences.
- Dense cards and tables with clear status tags.
- Dialog or panel interactions for final workload submission and reminder actions.

The design should be restrained, professional, and scannable. Chinese labels should match the source document and target business users.

## Data Model

Requirement records contain:

- `id`
- `name`
- `description`
- `productManager`
- `system`
- `initialWorkload`
- `initialAmount`
- `finalWorkload`
- `reductionWorkload`
- `status`: `待填写`, `已填写`, or `已核定`
- `updatedAt`

Reminder records contain:

- `id`
- `requirementId`
- `requirementName`
- `productManager`
- `sentBy`
- `sentAt`
- `message`

Users contain:

- `id`
- `name`
- `role`
- `department`
- `status`

## Core Behaviors

- Requirement filters update the visible list by status, product manager, and system.
- Final workload submission updates `finalWorkload`, computes `reductionWorkload = initialWorkload - finalWorkload`, and changes status to `已填写`.
- Reminder action creates a reminder record for a `待填写` requirement.
- Import simulation shows both successful rows and failed rows with concrete row numbers and reasons.
- Role switcher changes visible affordances enough to demonstrate RBAC intent.

## Screenshots

Capture at least these screenshots:

- `01-dashboard.png`
- `02-requirements.png`
- `03-import-result.png`
- `04-submit-workload.png`
- `05-reminders.png`
- `06-users-roles.png`

Screenshots must be placed in `last-task/screenshots`.

## Testing And Verification

Manual verification:

- App loads in browser without console-breaking errors.
- Navigation works across all core screens.
- Filters update requirement list.
- Workload submission changes status and recalculates reduction.
- Reminder action appends a reminder record.
- Screenshots exist in the expected folder.

Automated verification, if practical:

- Use a browser tool to open the local app and capture screenshots.
- Check key text appears on each page before screenshot capture.

## Risks

- Static mock data does not prove backend integration. The prototype should make that explicit in copy or documentation.
- Browser screenshot automation may require serving files through a local HTTP server rather than opening the file directly.
- If a package-based build is chosen, dependency installation may add avoidable time. Prefer static files unless the workspace already provides a suitable front-end scaffold.

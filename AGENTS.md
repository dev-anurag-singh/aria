# Project Rules

## Tech Stack

- **Framework**: Latest Next.js — always read `node_modules/next/dist/docs/` before writing code
- **Styling**: TailwindCSS only
- **Animation**: `motion` library only
- **UI Components**: shadcn/ui — download components via CLI, do not hand-write them

## Code Organization

- `components/` — UI layer only, no business logic
- `hooks/` — all business logic lives here as custom hooks
- Named exports by default; default exports only when Next.js requires it (pages, layouts, etc.)

## Behavior Rules

- **Always ask for direction** before making assumptions — never guess intent, never assume a design/feature direction
- **Never remove working code** because it's broken — investigate and fix it; if something exists, it's needed
- **Never use outdated library APIs** — search for latest changes before using a new library or feature
- **Commits**: simple messages, one concern per commit (e.g. `Implemented chat feature`)

## Comments

- Short and precise — explain _why_, not _what_
- No block comments narrating entire functions

## Ongoing

- As the project grows, suggest new rules, file structure improvements, and coding guidelines proactively

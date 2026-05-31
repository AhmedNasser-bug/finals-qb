# finals-qb

A dark-first, game-like educational quiz platform built with Next.js, TypeScript, Tailwind CSS, and a custom “Mastery Protocol” game system.

Live app: ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Overview

`finals-qb` is a quiz and revision platform focused on making question practice feel like an interactive game session rather than a static test bank. The project includes:
- multiple quiz/game modes
- a session-based game engine
- achievements and progression
- flashcards and terminology review
- local persistence for runs and unlocks
- a dark neo-brutalist UI system

The repository is primarily TypeScript, with supporting CSS and small amounts of JavaScript and shell. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- localStorage-based persistence
- Geist fonts

The repo includes standard Next/Tailwind project files such as `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`, and `components.json`. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Repository Structure

Top-level folders and key files include: ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

```text
app/                  # App Router pages, layout, globals
components/           # UI and feature components
docs/                 # Project docs
lib/                  # Types, engines, stores, utilities
public/               # Static assets
scripts/              # Utility scripts
styles/               # Styling support

AGENTS.md             # Agent/source-of-truth project documentation
DEVELOPER_GUIDE.md    # Developer-facing guide
README.md             # Repository overview
package.json          # Scripts and dependencies
docker-compose.yml    # Container/dev setup
test-runner.mjs       # Test runner entry
proxy.ts              # Project proxy/middleware-related entry
```

## Core Product Areas

Based on the project structure and internal documentation, the app is organized around:
- a home/setup flow
- a game session runner
- question answering modes
- flashcard review
- achievements
- run history and performance tracking
- subject-driven content loading

The codebase includes dedicated `app`, `components`, and `lib` layers, plus internal documentation intended to guide contributors and agents. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Getting Started

### Prerequisites

Use one of:
- Node.js 18+
- npm or pnpm

### Install

```bash
npm install
```

or

```bash
pnpm install
```

### Run locally

```bash
npm run dev
```

or

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Available Files You Should Read First

If you are contributing, read these before making changes:
- `AGENTS.md`
- `DEVELOPER_GUIDE.md`
- `lib/` shared types and engine files
- `components/` feature entry points

These files are present in the repo root and are intended to document architecture and contribution expectations. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Development Notes

This project appears to be structured for:
- App Router-based UI organization under `app/`
- component-driven feature development under `components/`
- shared logic and state in `lib/`
- project documentation in `docs/` and root markdown files

Because the app includes both `package-lock.json` and `pnpm-lock.yaml`, use one package manager consistently in your local workflow. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Running with Docker

A `docker-compose.yml` file is included in the repository. If your team uses Docker-based development, you can adapt your workflow around that file. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Deployment

The repository links to a deployed app on Vercel. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make focused changes
4. Test locally
5. Open a pull request

The repository currently has pull requests enabled and is publicly accessible on GitHub. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Notes

- The repo is public. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))
- The main branch is `main`. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))
- The project includes extensive internal guidance files for contributors. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## License

Add your project license here if you want distribution terms to be explicit.

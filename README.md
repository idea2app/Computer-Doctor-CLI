# Computer-Doctor-CLI

AI command line toolkit for Computer Repairing.

## MVP Framework

This repository now includes a TypeScript 6 + PNPM 11 oriented CLI framework with:

- `commander-jsx` command tree (JSX-defined CLI)
- React/JSX terminal rendering via `ink`
- Unified internal command execution via `zx`
- Vercel AI SDK planning skeleton (with controlled action allowlist)
- TypeORM + SQLite local persistence
- Core abstractions for platform / diagnostic / planning / action / session / report
- Platform adapter layout for Windows (first adapter), Linux, and macOS
- End-to-end MVP flow: session -> diagnostic -> plan -> action -> sqlite -> markdown reports

## Usage

```bash
npm install
npm run debug -- --verbose
```

Generated artifacts:

- `computer-doctor.sqlite`
- `reports/<session-id>/diagnostic.md`
- `reports/<session-id>/plan.md`
- `reports/<session-id>/repair.md`
- `reports/<session-id>/rollback.md`

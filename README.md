# aipatterns

Interactive patterns for how AI products should look, feel and behave.

**[See it live →](https://rajanubhuti.github.io/aipatterns/)**

Every AI product is figuring out the same problems: how to show an answer that's still being written, how to say "I'm not sure", how to let people undo something an agent did. This is my growing collection of those patterns. Each one is a small live demo you can play with, plus a few notes on why it works.

## Patterns

| | Pattern | What it shows |
|---|---|---|
| 01 | **Streaming text** | Show the answer as it's written, with a Stop button that keeps what was said. Compare it with waiting for the whole answer at once. |

Coming next: thinking states, showing sources, undo for AI actions, showing uncertainty, agent progress.

## Built with

React, TypeScript and Tailwind CSS, bundled with Vite. Brutalist terminal style in Courier, pure black and white, dark by default with a light mode. Deployed to GitHub Pages on every push.

The caret and spinner stop moving if your device is set to reduce motion.

## Run it locally

```bash
git clone https://github.com/rajanubhuti/aipatterns.git
cd aipatterns
npm install
npm run dev
```

## How it's organised

```
src/
├── App.tsx                  the page: intro, patterns, notes
├── index.css                colours, themes and fonts in one place
└── patterns/
    └── streaming/
        ├── useStream.ts     fakes a model answering word by word
        └── StreamingDemo.tsx  the interactive demo
```

Each new pattern gets its own folder in `patterns/`.

---

Made by [Anubhuti Raj](https://rajanubhuti.github.io/portfolio/).

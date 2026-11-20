import { MotionConfig } from 'motion/react'
import { StreamingDemo } from './patterns/streaming/StreamingDemo'

const NOTES = [
  {
    title: 'Show something within a second',
    body: 'Streaming cuts the wait people feel. Try "All at once": the answer takes about as long to finish, but you stare at nothing the whole time.',
  },
  {
    title: 'Stop is the most important button',
    body: 'While the AI is talking, give people a way out in the same spot they pressed Ask. If the answer is going the wrong way, they should not have to wait for it to end.',
  },
  {
    title: 'Keep what was written',
    body: 'Stopping should not erase anything. Half an answer is often enough, and throwing it away punishes people for being in control.',
  },
  {
    title: 'A calm caret, not a spinner',
    body: 'Once words are flowing, a small blinking caret says "still going" without pulling attention away from the text.',
  },
  {
    title: "Don't move the page under the reader",
    body: 'Follow the text down only if the reader is already at the bottom. Scroll up while it streams: it lets you stay and reread.',
  },
]

const COMING = ['Thinking states', 'Showing sources', 'Undo for AI actions', 'Showing uncertainty', 'Agent progress']

export default function App() {
  return (
    // "user" means: if the visitor turned motion off on their device, animations calm down
    <MotionConfig reducedMotion="user">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-14 sm:pt-20">
        <header>
          <p className="font-display text-lg font-semibold">
            ai<span className="text-accent">patterns</span>
          </p>
          <h1 className="mt-10 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            How AI products should look, feel and behave.
          </h1>
          <p className="mt-5 max-w-[58ch] text-lg text-muted">
            A growing set of interactive patterns for AI interfaces. Each one is a small live demo you can play with,
            plus a few notes on why it works.
          </p>
        </header>

        <section className="mt-16" aria-labelledby="streaming">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-sm font-semibold text-accent">01</span>
            <h2 id="streaming" className="font-display text-2xl font-semibold tracking-tight">
              Streaming text
            </h2>
          </div>
          <p className="mt-2 mb-6 max-w-[58ch] text-muted">
            Show the answer as it is written instead of making people wait for all of it. Switch between the two
            modes and feel the difference.
          </p>

          <StreamingDemo />

          <ol className="mt-10 grid gap-6 sm:grid-cols-2">
            {NOTES.map((n, i) => (
              <li key={n.title} className="border-t border-line pt-4">
                <p className="text-sm font-medium">
                  <span className="mr-2 text-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {n.title}
                </p>
                <p className="mt-1.5 text-[15px] leading-6 text-muted">{n.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 border-t border-line pt-8">
          <h2 className="text-sm font-medium">Coming next</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {COMING.map((c) => (
              <li key={c} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
                {c}
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-20 text-sm text-muted">
          Made by{' '}
          <a href="https://rajanubhuti.github.io/portfolio/" className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
            Anubhuti Raj
          </a>
          .
        </footer>
      </div>
    </MotionConfig>
  )
}

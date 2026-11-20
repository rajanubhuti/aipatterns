import { useEffect, useState } from 'react'
import { StreamingDemo } from './patterns/streaming/StreamingDemo'

const NOTES = [
  ['Show something within a second', 'Streaming cuts the wait people feel. Try "all at once": the answer takes about as long to finish, but you stare at nothing the whole time.'],
  ['Stop is the most important button', 'While the AI is talking, put the way out in the same spot people pressed ask. If the answer is heading the wrong way, they should not have to sit through it.'],
  ['Keep what was written', 'Stopping should never erase anything. Half an answer is often enough, and throwing it away punishes people for being in control.'],
  ['A calm caret, not a spinner', 'Once words are flowing, a small block caret says "still going" without pulling attention away from the text.'],
  ["Don't move the page under the reader", 'Follow the text down only if the reader is already at the bottom. Scroll up while it streams: it lets you stay and reread.'],
]

const COMING = [
  ['Thinking states', 'What to show in the seconds before an answer starts.'],
  ['Showing sources', 'Citations people can actually check without leaving the answer.'],
  ['Undo for AI actions', 'A way back when an agent changes something it should not have.'],
  ['Showing uncertainty', 'How a model can say "I am not sure" without losing trust.'],
  ['Agent progress', 'Long tasks with many steps, shown so people stay in the loop.'],
]

// A tiny chart in the corner: words arriving over time
const TOKEN_CHART = ` tok │          ▄▄█
     │      ▄▄█████
     │  ▄▄█████████
     └──────────────── t
   stream ✓   wait: 0.6s`

const PIPELINE = `"how do I make chai?"
       ↓ model starts writing
[Start] [with] [water] [and] …
       ↓ each word sent the moment it exists
Start with water and ▌
       ↓ reader can stop at any point
[stopped · kept]`

export default function App() {
  // Dark by default, like a terminal.
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const nav = [
    ['#whoami', 'Whoami'],
    ['#streaming', 'Streaming'],
    ['#next', 'Next'],
    ['#contact', 'Contact'],
    ['https://github.com/rajanubhuti/aipatterns', 'Source'],
  ]

  return (
    <div className="mx-auto max-w-[960px]">
      <nav className="sticky top-0 z-10 mb-12 flex flex-wrap items-center gap-x-8 gap-y-1 border-4 border-fg bg-bg px-4 py-3 text-[12.8px] font-bold uppercase">
        {nav.map(([href, label]) => (
          <a key={href} href={href} className="underline-offset-4 hover:underline">
            {label}
          </a>
        ))}
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="ml-auto uppercase underline-offset-4 hover:underline">
          ◑ {theme === 'dark' ? 'light' : 'dark'}
        </button>
      </nav>

      <header className="mb-12 flex items-start justify-between gap-6 border-b-4 border-fg pb-6">
        <div>
          <h1 className="text-[22px] font-bold uppercase leading-tight">AI Patterns</h1>
          <p className="mt-2 text-[13px]">
            <b>Interaction patterns</b> <span className="text-dim">· for AI interfaces ·</span> by <b>Anubhuti Raj</b>
          </p>
        </div>
        <pre className="hidden text-[11px] leading-[1.3] text-dim sm:block" aria-hidden>
          {TOKEN_CHART}
        </pre>
      </header>

      <section id="whoami" className="mb-16 scroll-mt-24">
        <h2 className="label">Whoami</h2>
        <p>
          A growing set of <b>live demos</b> for how AI products should look, feel and behave. Every AI product runs into
          the same problems: how to show an answer that is still being written, how to say "I'm not sure", how to let
          people undo something an agent did.
        </p>
        <p className="mt-2">
          Each pattern is something you can play with, plus a few notes on why it works. Made by a UX designer learning
          to build what she designs.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="tag">React</span>
          <span className="tag">TypeScript</span>
          <span className="tag">Tailwind</span>
          <span className="tag">AI UX</span>
        </div>

        <div className="window mt-6">
          <div className="window-bar" aria-hidden>
            <i className="bg-[#ff5f56]" />
            <i className="bg-[#ffbd2e]" />
            <i className="bg-[#27c93f]" />
          </div>
          <pre className="overflow-x-auto px-7 py-5 text-[12px] leading-[1.5] text-dim">{PIPELINE}</pre>
        </div>
      </section>

      <section id="streaming" className="mb-16 scroll-mt-24">
        <h2 className="label">Streaming text</h2>
        <p className="mb-6">
          Show the answer <b>as it is written</b> instead of making people wait for all of it. Switch modes and feel the
          difference.
        </p>

        <StreamingDemo />

        <div className="mt-10 space-y-8">
          {NOTES.map(([title, body]) => (
            <div key={title} className="entry">
              <p className="font-bold uppercase">{title}</p>
              <p className="mt-1">
                <b>&gt;</b> {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="next" className="mb-16 scroll-mt-24">
        <h2 className="label">Coming next</h2>
        <div>
          {COMING.map(([title, body], i) => (
            <div key={title} className={`py-4 ${i > 0 ? 'border-t-4 border-fg' : ''}`}>
              <div className="flex items-center">
                <span className="font-bold uppercase">{title}</span>
                <span className="leader" aria-hidden />
                <span className="text-[12px] text-dim">★ planned</span>
              </div>
              <p className="mt-1 text-dim">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mb-16 scroll-mt-24">
        <h2 className="label">Contact</h2>
        <p>
          <b>&gt;</b>{' '}
          <a href="https://rajanubhuti.github.io/portfolio/" className="underline underline-offset-4">
            portfolio
          </a>
          <span className="text-dim"> · </span>
          <a href="https://github.com/rajanubhuti" className="underline underline-offset-4">
            github
          </a>
          <span className="text-dim"> · </span>
          <a href="https://www.linkedin.com/in/anubhutiraj-ux" className="underline underline-offset-4">
            linkedin
          </a>
        </p>
      </section>

      <footer className="flex justify-between border-t-4 border-fg pt-4 text-[12px] text-dim">
        <span>rajanubhuti.github.io/aipatterns</span>
        <span>© 2026</span>
      </footer>
    </div>
  )
}

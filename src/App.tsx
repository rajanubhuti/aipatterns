import { useEffect, useState } from 'react'
import { StreamingDemo } from './patterns/streaming/StreamingDemo'

const NOTES = [
  ['show something within a second', 'Streaming cuts the wait people feel. Try "all at once": the answer takes about as long to finish, but you stare at nothing the whole time.'],
  ['stop is the most important button', 'While the AI is talking, put the way out in the same spot people pressed ask. If the answer is heading the wrong way, they should not have to sit through it.'],
  ['keep what was written', 'Stopping should never erase anything. Half an answer is often enough, and throwing it away punishes people for being in control.'],
  ['a calm caret, not a spinner', 'Once words are flowing, a small block caret says "still going" without pulling attention away from the text.'],
  ["don't move the page under the reader", 'Follow the text down only if the reader is already at the bottom. Scroll up while it streams: it lets you stay and reread.'],
]

const COMING = ['thinking states', 'showing sources', 'undo for ai actions', 'showing uncertainty', 'agent progress']

const DIAGRAM = `  prompt ───▶ ┌─────────┐ ───▶ start  with  water  and  milk ▌
              │  model  │        t₁     t₂    t₃     t₄   t₅
              └─────────┘
                           one token at a time, shown as it arrives`

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark',
  )
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="mx-auto max-w-[760px] px-5 pb-20 pt-8">
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-dim">
        <a href="#top" className="text-fg">
          aipatterns
        </a>
        <a href="#streaming" className="hover:text-fg">
          patterns
        </a>
        <a href="#about" className="hover:text-fg">
          about
        </a>
        <a href="https://github.com/rajanubhuti/aipatterns" className="hover:text-fg">
          source
        </a>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="ml-auto hover:text-fg">
          ◐ {theme}
        </button>
      </nav>

      <header id="top" className="mt-16">
        <h1 className="text-[22px] font-semibold leading-snug">aipatterns</h1>
        <p className="mt-1 text-dim">interaction patterns for ai interfaces · by anubhuti raj</p>
        <pre className="mt-8 overflow-x-auto text-[12px] leading-[1.6] text-faint" aria-hidden>
          {DIAGRAM}
        </pre>
        <p className="mt-8 max-w-[64ch] leading-[1.75]">
          Every AI product runs into the same problems: how to show an answer that is still being written, how to say
          "I'm not sure", how to let people undo something an agent did. This is a growing set of those patterns. Each
          one is a small live demo plus a few notes on why it works.
        </p>
      </header>

      <Section id="streaming" index="01" title="streaming text">
        <p className="mb-5 max-w-[64ch] leading-[1.75] text-dim">
          Show the answer as it is written instead of making people wait for all of it. Switch modes and feel the
          difference.
        </p>
        <StreamingDemo />
        <ol className="mt-8 space-y-4">
          {NOTES.map(([title, body], i) => (
            <li key={title} className="grid grid-cols-[3ch_1fr] gap-x-[1ch] leading-[1.75]">
              <span className="text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p>{title}</p>
                <p className="max-w-[64ch] text-dim">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="next" index="··" title="coming next">
        <ul className="leading-[1.9] text-dim">
          {COMING.map((c, i) => (
            <li key={c}>
              <span className="text-faint">{String(i + 2).padStart(2, '0')} </span>
              {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="about" index="~" title="about">
        <p className="max-w-[64ch] leading-[1.75] text-dim">
          Made by{' '}
          <a href="https://rajanubhuti.github.io/portfolio/" className="text-fg underline decoration-faint underline-offset-4 hover:decoration-accent">
            Anubhuti Raj
          </a>
          , a UX designer learning to build what she designs. Built with React, Tailwind and IBM Plex Mono. The demos
          fake the model right in your browser, so nothing is sent anywhere.
        </p>
      </Section>

      <footer className="mt-20 flex justify-between border-t border-line pt-4 text-faint">
        <span>rajanubhuti.github.io/aipatterns</span>
        <span>2026</span>
      </footer>
    </div>
  )
}

function Section({ id, index, title, children }: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-20 scroll-mt-8" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="mb-5 flex items-center gap-[1ch]">
        <span className="text-accent">{index}</span>
        <span className="font-semibold">{title}</span>
        <span className="h-px flex-1 bg-line" aria-hidden />
      </h2>
      {children}
    </section>
  )
}

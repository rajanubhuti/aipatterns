import { useEffect, useState } from 'react'
import { StreamingDemo } from './patterns/streaming/StreamingDemo'

const PATTERNS = [
  { file: 'streaming', live: true },
  { file: 'thinking', live: false },
  { file: 'sources', live: false },
  { file: 'undo', live: false },
  { file: 'uncertainty', live: false },
  { file: 'agents', live: false },
]

const RULES = [
  ['Show the first words within a second.', 'Make people stare at a spinner until the whole answer is ready.'],
  ['Put stop exactly where ask was.', 'Hide the way out, or make people sit through a wrong answer.'],
  ['Keep what was written when someone stops.', 'Wipe the half answer. It is often all they needed.'],
  ['Use a calm caret while words are flowing.', 'Keep a spinner running next to text that is already moving.'],
  ['Follow the text only if the reader is at the bottom.', 'Pull people down while they scroll up to reread.'],
]

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="lg:flex">
      {/* Sidebar, like a file tree in a code editor */}
      <aside className="border-b border-line px-6 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[260px] lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <a href="#" className="text-[15px] font-semibold">
          <span className="text-accent">●</span> aipatterns
        </a>
        <p className="mt-2 text-dim">How AI products should look, feel and behave.</p>

        <p className="mt-8 text-faint">patterns/</p>
        <ul className="mt-1">
          {PATTERNS.map((p) => (
            <li key={p.file} className={`flex items-center gap-2 ${p.live ? '' : 'text-faint'}`}>
              <span className={p.live ? 'text-accent' : ''}>{p.live ? '●' : '○'}</span>
              <span className={p.live ? 'border-b border-accent' : ''}>{p.file}.tsx</span>
              {!p.live && <span className="ml-auto text-[11px]">soon</span>}
            </li>
          ))}
        </ul>

        <div className="mt-8 space-y-1 text-dim lg:mt-auto">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="block hover:text-fg">
            theme: {theme} ⇄
          </button>
          <a href="https://github.com/rajanubhuti/aipatterns" className="block hover:text-fg">
            source ↗
          </a>
          <a href="https://rajanubhuti.github.io/portfolio/" className="block hover:text-fg">
            by anubhuti raj ↗
          </a>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-6 py-10 lg:px-14 lg:py-14">
        <div className="max-w-[1080px]">
          <p className="text-faint">patterns / streaming.tsx</p>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.03em]">Streaming text</h1>
          <p className="mt-4 max-w-[60ch] text-dim">
            Show the answer as it is being written, instead of making people wait for all of it. Switch the mode, hit
            ask, and watch the live state on the right.
          </p>

          <div className="mt-10">
            <StreamingDemo />
          </div>

          <h2 className="mt-16 text-faint">// guidelines</h2>
          <div className="mt-4 border-t border-line">
            {RULES.map(([doThis, dont]) => (
              <div key={doThis} className="grid gap-x-10 gap-y-1 border-b border-line py-4 md:grid-cols-2">
                <p>
                  <span className="mr-2 text-accent">do</span>
                  {doThis}
                </p>
                <p className="text-dim">
                  <span className="mr-2 text-faint">don't</span>
                  {dont}
                </p>
              </div>
            ))}
          </div>

          <footer className="mt-20 flex flex-wrap justify-between gap-2 text-faint">
            <span>aipatterns · a design engineering side project</span>
            <span>2026</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

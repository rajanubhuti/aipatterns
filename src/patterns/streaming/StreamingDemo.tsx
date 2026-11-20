import { useEffect, useRef, useState } from 'react'
import { useStream } from './useStream'

const QUESTION = 'How do I make a really good cup of masala chai?'

const ANSWER = `Start with water and milk in about equal parts, around one cup each for two people.

Crush your spices first: two green cardamom pods, a small piece of ginger, two cloves and a pinch of black pepper. Crushing them releases far more flavour than dropping them in whole.

Bring the water to a boil with the spices and let it bubble for two minutes. Add two teaspoons of strong loose tea, like Assam CTC, and boil for one more minute.

Pour in the milk and sugar, then let it rise to a boil twice. That second boil is what makes it taste properly "kadak".

Strain, pour from a little height for some froth, and drink it while it's hot.`

const TOTAL_WORDS = ANSWER.match(/\S+/g)?.length ?? 0
const SPEEDS = { slow: 140, natural: 55, fast: 18 } as const
type Speed = keyof typeof SPEEDS
type Mode = 'stream' | 'block'

export function StreamingDemo() {
  const [mode, setMode] = useState<Mode>('stream')
  const [speed, setSpeed] = useState<Speed>('natural')
  const { shown, status, start, stop, reset } = useStream(ANSWER, {
    speed: SPEEDS[speed],
    allAtOnce: mode === 'block',
  })

  // Measure how long people wait before they see the first word.
  const startedAt = useRef(0)
  const [firstWordAfter, setFirstWordAfter] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const ask = () => {
    startedAt.current = performance.now()
    setFirstWordAfter(null)
    setElapsed(0)
    start()
  }

  useEffect(() => {
    if (shown && firstWordAfter === null && startedAt.current) {
      setFirstWordAfter((performance.now() - startedAt.current) / 1000)
    }
  }, [shown, firstWordAfter])

  // A live clock while anything is happening.
  const busy = status === 'waiting' || status === 'streaming'
  useEffect(() => {
    if (!busy) return
    const id = window.setInterval(() => setElapsed((performance.now() - startedAt.current) / 1000), 100)
    return () => window.clearInterval(id)
  }, [busy])

  // Changing a setting starts fresh, so comparisons are fair.
  useEffect(() => {
    reset()
    setFirstWordAfter(null)
    setElapsed(0)
  }, [mode, speed, reset])

  // Follow the text as it grows, but only if the reader is already at the bottom.
  const box = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef(true)
  const [pinned, setPinned] = useState(true)
  useEffect(() => {
    const el = box.current
    if (el && pinnedRef.current) el.scrollTop = el.scrollHeight
  }, [shown])
  const onScroll = () => {
    const el = box.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24
    pinnedRef.current = atBottom
    setPinned(atBottom)
  }

  const wordsShown = shown.match(/\S+/g)?.length ?? 0

  return (
    <div className="grid border border-line lg:grid-cols-[1fr_250px]">
      {/* The demo */}
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-line px-5 py-3">
          <Choice label="mode" value={mode} onChange={setMode} options={[['stream', 'stream'], ['block', 'all at once']]} />
          <Choice label="speed" value={speed} onChange={setSpeed} options={(Object.keys(SPEEDS) as Speed[]).map((s) => [s, s])} />
        </div>

        <div ref={box} onScroll={onScroll} className="canvas h-[360px] overflow-y-auto px-5 py-6 sm:px-8">
          <div className="ml-auto w-fit max-w-[85%] border border-line bg-bg px-4 py-2.5">{QUESTION}</div>

          <div className="mt-6 max-w-[64ch]">
            {status === 'idle' && <span className="text-faint">Press ask to see the answer arrive.</span>}
            {status === 'waiting' && <Thinking long={mode === 'block'} />}
            {shown && (
              <p className="whitespace-pre-wrap">
                {shown}
                {status === 'streaming' && <span className="caret" aria-hidden />}
              </p>
            )}
            {status === 'stopped' && <p className="mt-3 text-dim">Stopped. What was written is kept.</p>}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3">
          <span className="text-dim">{mode === 'stream' ? 'Words appear as they are written.' : 'Nothing shows until the answer is done.'}</span>
          {busy ? (
            <button onClick={stop} className="flex shrink-0 items-center gap-2 border border-fg px-4 py-1.5 transition-colors hover:bg-fg hover:text-bg">
              <span className="size-2 bg-current" aria-hidden /> stop
            </button>
          ) : (
            <button onClick={ask} className="shrink-0 bg-accent px-4 py-1.5 text-white transition-opacity hover:opacity-85">
              {status === 'idle' ? 'ask' : 'ask again'} ↵
            </button>
          )}
        </div>
      </div>

      {/* Live state: what the code is doing right now */}
      <aside className="border-t border-line bg-panel px-5 py-4 lg:border-l lg:border-t-0" aria-label="Live state">
        <p className="mb-3 text-dim">// live state</p>
        <dl className="space-y-1.5">
          <Row k="status" v={status} accent={busy} />
          <Row k="words" v={`${wordsShown} / ${TOTAL_WORDS}`} />
          <Row k="elapsed" v={`${elapsed.toFixed(1)}s`} />
          <Row k="first word" v={firstWordAfter === null ? '·' : `${firstWordAfter.toFixed(1)}s`} />
          <Row k="follow scroll" v={pinned ? 'on' : 'paused'} />
        </dl>
        <Bar value={wordsShown} total={TOTAL_WORDS} />
        <p className="mt-5 text-[12px] leading-relaxed text-faint">
          Scroll up in the answer while it streams and watch "follow scroll" pause.
        </p>
      </aside>
    </div>
  )
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-dim">{k}</dt>
      {/* key={v} replays the flash animation every time the value changes */}
      <dd key={v} className={`flash tabular-nums ${accent ? 'text-accent' : ''}`}>
        {v}
      </dd>
    </div>
  )
}

// Progress drawn with characters, 20 cells wide.
function Bar({ value, total }: { value: number; total: number }) {
  const cells = 20
  const filled = total ? Math.round((value / total) * cells) : 0
  return (
    <p className="mt-4 tracking-[-0.05em]" aria-hidden>
      <span className="text-accent">{'█'.repeat(filled)}</span>
      <span className="text-faint">{'░'.repeat(cells - filled)}</span>
    </p>
  )
}

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

function Thinking({ long }: { long: boolean }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setI((n) => (n + 1) % FRAMES.length), 80)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="text-dim">
      <span className="text-accent">{FRAMES[i]}</span> {long ? 'writing the full answer…' : 'thinking…'}
    </span>
  )
}

type ChoiceProps<T extends string> = {
  label: string
  value: T
  onChange: (v: T) => void
  options: [T, string][]
}

// Inline options; the chosen one is underlined in the accent colour.
function Choice<T extends string>({ label, value, onChange, options }: ChoiceProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-3">
      <span className="text-faint">{label}</span>
      {options.map(([v, text]) => {
        const active = v === value
        return (
          <button
            key={v}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={`underline-offset-[6px] ${active ? 'text-fg underline decoration-accent decoration-2' : 'text-dim hover:text-fg'}`}
          >
            {text}
          </button>
        )
      })}
    </div>
  )
}

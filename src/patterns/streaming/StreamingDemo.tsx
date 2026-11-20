import { useEffect, useRef, useState } from 'react'
import { useStream } from './useStream'

const QUESTION = 'how do I make a really good cup of masala chai?'

const ANSWER = `Start with water and milk in about equal parts, around one cup each for two people.

Crush your spices first: two green cardamom pods, a small piece of ginger, two cloves and a pinch of black pepper. Crushing them releases far more flavour than dropping them in whole.

Bring the water to a boil with the spices and let it bubble for two minutes. Add two teaspoons of strong loose tea, like Assam CTC, and boil for one more minute.

Pour in the milk and sugar, then let it rise to a boil twice. That second boil is what makes it taste properly "kadak".

Strain, pour from a little height for some froth, and drink it while it's hot.`

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

  // A live "waiting" counter, so the cost of not streaming is visible.
  useEffect(() => {
    if (status !== 'waiting') return
    const id = window.setInterval(() => setElapsed((performance.now() - startedAt.current) / 1000), 100)
    return () => window.clearInterval(id)
  }, [status])

  // Changing a setting starts fresh, so comparisons are fair.
  useEffect(() => {
    reset()
    setFirstWordAfter(null)
  }, [mode, speed, reset])

  // Follow the text as it grows, but only if the reader is already at the bottom.
  const box = useRef<HTMLDivElement>(null)
  const pinned = useRef(true)
  useEffect(() => {
    const el = box.current
    if (el && pinned.current) el.scrollTop = el.scrollHeight
  }, [shown])
  const onScroll = () => {
    const el = box.current
    if (el) pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24
  }

  const busy = status === 'waiting' || status === 'streaming'

  // Space or Enter anywhere in the demo asks or stops, like a real terminal.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter') (busy ? stop : ask)()
  }

  return (
    <div className="border border-line" tabIndex={0} onKeyDown={onKey} aria-label="Streaming text demo">
      {/* Title bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line px-4 py-2.5 text-dim">
        <Toggle
          label="mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'stream', label: 'stream' },
            { value: 'block', label: 'all at once' },
          ]}
        />
        <Toggle
          label="speed"
          value={speed}
          onChange={setSpeed}
          options={(Object.keys(SPEEDS) as Speed[]).map((s) => ({ value: s, label: s }))}
        />
      </div>

      {/* Conversation */}
      <div ref={box} onScroll={onScroll} className="h-[340px] overflow-y-auto px-4 py-5 leading-[1.75]">
        <p>
          <span className="text-dim">you ›</span> {QUESTION}
        </p>

        <div className="mt-4 flex gap-[1ch]">
          <span className="shrink-0 text-accent">ai ›</span>
          <div className="min-w-0 max-w-[64ch]">
            {status === 'idle' && <span className="text-faint">press ask, or hit enter</span>}
            {status === 'waiting' && <Thinking long={mode === 'block'} />}
            {shown && (
              <p className="whitespace-pre-wrap">
                {shown}
                {status === 'streaming' && <span className="caret" aria-hidden />}
              </p>
            )}
            {status === 'stopped' && <p className="mt-3 text-dim">[stopped · what was written is kept]</p>}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5">
        <p className="text-dim tabular-nums" aria-live="polite">
          <span className="text-faint">status</span> {status}
          <span className="text-faint"> · </span>
          {firstWordAfter !== null ? (
            <>
              <span className="text-faint">first words</span> {firstWordAfter.toFixed(1)}s
            </>
          ) : status === 'waiting' ? (
            <>
              <span className="text-faint">waiting</span> {elapsed.toFixed(1)}s
            </>
          ) : (
            <span className="text-faint">{mode === 'stream' ? 'words appear as they are written' : 'nothing shows until it is done'}</span>
          )}
        </p>
        {busy ? (
          <button onClick={stop} className="shrink-0 border border-fg px-3 py-1 transition-colors hover:bg-fg hover:text-bg">
            ■ stop
          </button>
        ) : (
          <button onClick={ask} className="shrink-0 border border-accent px-3 py-1 text-accent transition-colors hover:bg-accent hover:text-bg">
            {status === 'idle' ? 'ask ↵' : 'ask again ↵'}
          </button>
        )}
      </div>
    </div>
  )
}

// A spinner made of text, so it matches the terminal look.
const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

function Thinking({ long }: { long: boolean }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = window.setInterval(() => setI((n) => (n + 1) % FRAMES.length), 80)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="text-dim">
      <span className="text-accent">{FRAMES[i]}</span> {long ? 'writing the full answer' : 'thinking'}
    </span>
  )
}

type ToggleProps<T extends string> = {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}

// Options shown inline, the chosen one in [brackets].
function Toggle<T extends string>({ label, value, onChange, options }: ToggleProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-[1ch]">
      <span className="text-faint">{label}</span>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={active ? 'text-fg' : 'text-dim hover:text-fg'}
          >
            {active ? `[${o.label}]` : ` ${o.label} `}
          </button>
        )
      })}
    </div>
  )
}

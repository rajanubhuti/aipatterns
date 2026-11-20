import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStream } from './useStream'

const QUESTION = 'How do I make a really good cup of masala chai?'

const ANSWER = `Start with water and milk in about equal parts, around one cup each for two people.

Crush your spices first: two green cardamom pods, a small piece of ginger, two cloves and a pinch of black pepper. Crushing them releases far more flavour than dropping them in whole.

Bring the water to a boil with the spices and let it bubble for two minutes. Add two teaspoons of strong loose tea, like Assam CTC, and boil for one more minute.

Pour in the milk and sugar, then let it rise to a boil twice. That second boil is what makes it taste properly "kadak".

Strain, pour from a little height for some froth, and drink it while it's hot.`

const SPEEDS = { Slow: 140, Natural: 55, Fast: 18 } as const
type Speed = keyof typeof SPEEDS
type Mode = 'stream' | 'block'

export function StreamingDemo() {
  const [mode, setMode] = useState<Mode>('stream')
  const [speed, setSpeed] = useState<Speed>('Natural')
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
  // Yanking someone back down while they scroll up to reread is a classic mistake.
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

  return (
    <div className="rounded-3xl border border-line bg-white shadow-[0_1px_0_rgba(0,0,0,0.03),0_20px_40px_-24px_rgba(0,0,0,0.18)]">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
        <Segmented
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'stream', label: 'Stream' },
            { value: 'block', label: 'All at once' },
          ]}
        />
        <Segmented
          label="Speed"
          value={speed}
          onChange={setSpeed}
          options={(Object.keys(SPEEDS) as Speed[]).map((s) => ({ value: s, label: s }))}
        />
        <div className="ml-auto text-sm text-muted tabular-nums" aria-live="polite">
          {firstWordAfter !== null
            ? `First words after ${firstWordAfter.toFixed(1)}s`
            : status === 'waiting'
              ? `Waiting ${elapsed.toFixed(1)}s`
              : ' '}
        </div>
      </div>

      {/* Conversation */}
      <div ref={box} onScroll={onScroll} className="h-[360px] overflow-y-auto px-5 py-6 sm:px-8">
        <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[15px] text-white">
          {QUESTION}
        </div>

        <div className="mt-6 max-w-[62ch] text-[15px] leading-7">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.p key="idle" className="text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Press Ask to see the answer arrive.
              </motion.p>
            )}
            {status === 'waiting' && (
              <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Thinking long={mode === 'block'} />
              </motion.div>
            )}
          </AnimatePresence>

          {shown && (
            <p className="whitespace-pre-wrap">
              {shown}
              {status === 'streaming' && <span className="caret" aria-hidden />}
            </p>
          )}

          {status === 'stopped' && (
            <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-muted">
              Stopped. What was written so far is kept.
            </motion.p>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
        <p className="text-sm text-muted">
          {mode === 'stream' ? 'Words appear as the model writes them.' : 'Nothing shows until the whole answer is ready.'}
        </p>
        <AnimatePresence mode="popLayout" initial={false}>
          {busy ? (
            <motion.button
              key="stop"
              onClick={stop}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm font-medium transition-colors hover:bg-ink hover:text-white"
            >
              <span className="size-2.5 rounded-[2px] bg-current" aria-hidden />
              Stop
            </motion.button>
          ) : (
            <motion.button
              key="ask"
              onClick={ask}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03] active:scale-[0.97]"
            >
              {status === 'idle' ? 'Ask' : 'Ask again'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Thinking({ long }: { long: boolean }) {
  return (
    <div className="flex items-center gap-2 text-muted">
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-muted"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </span>
      <span className="text-sm">{long ? 'Writing the full answer…' : 'Thinking…'}</span>
    </div>
  )
}

type SegmentedProps<T extends string> = {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}

function Segmented<T extends string>({ label, value, onChange, options }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="relative flex rounded-full bg-paper p-1">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`relative rounded-full px-3.5 py-1.5 text-sm transition-colors ${active ? 'text-ink' : 'text-muted hover:text-ink'}`}
          >
            {active && (
              <motion.span
                layoutId={`pill-${label}`}
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

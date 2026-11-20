import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/*
  useStream fakes an AI model answering, word by word.

  A real model sends its answer in small pieces ("tokens") over the network.
  Here we split a prepared answer into words and reveal them on a timer,
  so the demo works without an API key and feels the same every time.
*/

export type StreamStatus = 'idle' | 'waiting' | 'streaming' | 'done' | 'stopped'

type Options = {
  /** Average milliseconds between words. Lower is faster. */
  speed: number
  /** How long the "model" thinks before the first word appears. */
  firstWordDelay?: number
  /** If true, hide everything until the whole answer is ready (the old way). */
  allAtOnce?: boolean
}

export function useStream(fullText: string, { speed, firstWordDelay = 600, allAtOnce = false }: Options) {
  const [shown, setShown] = useState('')
  const [status, setStatus] = useState<StreamStatus>('idle')
  const timer = useRef<number | undefined>(undefined)

  // Split into words but keep the spaces and line breaks attached,
  // so joining them back gives the exact original text.
  const words = useMemo(() => fullText.match(/\S+\s*/g) ?? [], [fullText])

  const clear = () => window.clearTimeout(timer.current)

  const start = useCallback(() => {
    clear()
    setShown('')
    setStatus('waiting')

    if (allAtOnce) {
      // The old way: wait for the whole answer, then show it in one go.
      const totalTime = firstWordDelay + words.length * speed
      timer.current = window.setTimeout(() => {
        setShown(fullText)
        setStatus('done')
      }, totalTime)
      return
    }

    let i = 0
    const next = () => {
      i += 1
      setShown(words.slice(0, i).join(''))
      setStatus(i >= words.length ? 'done' : 'streaming')
      if (i < words.length) {
        // A little randomness makes it feel like a real model, not a typewriter.
        const jitter = speed * (0.4 + Math.random() * 1.2)
        timer.current = window.setTimeout(next, jitter)
      }
    }
    timer.current = window.setTimeout(next, firstWordDelay)
  }, [fullText, speed, firstWordDelay, allAtOnce, words])

  const stop = useCallback(() => {
    clear()
    setStatus('stopped')
  }, [])

  const reset = useCallback(() => {
    clear()
    setShown('')
    setStatus('idle')
  }, [])

  // Clean up the timer if the component disappears mid answer.
  useEffect(() => clear, [])

  return { shown, status, start, stop, reset }
}

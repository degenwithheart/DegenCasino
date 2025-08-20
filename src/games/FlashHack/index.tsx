import { GambaUi, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import {
  EnhancedWagerInput,
  EnhancedButton,
  EnhancedPlayButton,
  MobileControls,
  OptionSelector,
  DesktopControls,
} from '../../components'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { FLASH_HACK_CONFIG } from './constants'
import { motion, AnimatePresence } from 'framer-motion'

// ------------------------------------------------------------
// Hacker Vibe Constants
// ------------------------------------------------------------
const SIDES = FLASH_HACK_CONFIG

type Side = keyof typeof SIDES

type SoundKey = 'type' | 'buzz' | 'alarm'

const HACK_LOGS = [
  'initializing kernel exploit…',
  'fingerprinting target OS…',
  'spoofing MAC address…',
  'injecting payload…',
  'escalating privileges…',
  'bypassing ICE protocol…',
  'mounting /shadow volume…',
  'seeding backdoor key…',
  'decrypting vault sectors…',
  'rerouting traffic via onion relays…',
  'neutralizing IDS signatures…',
  'patching libc stubs…',
  'exfiltrating packets…',
  'disabling tripwires…',
]

// Utility: load VT323 font once for terminal feel
function useVT323Font() {
  React.useEffect(() => {
    const id = 'vt323-font-link'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap'
    document.head.appendChild(link)
  }, [])
}

// ------------------------------------------------------------
// TypingText – animates characters one by one
// ------------------------------------------------------------
function TypingText({
  text,
  onDone,
  speed = 18,
  sound,
  className,
}: {
  text: string
  onDone?: () => void
  speed?: number // ms per char
  sound?: HTMLAudioElement | null
  className?: string
}) {
  const [shown, setShown] = React.useState('')
  React.useEffect(() => {
    setShown('')
    let i = 0
    const id = setInterval(() => {
      i++
      setShown(text.slice(0, i))
      if (sound) {
        try {
          sound.currentTime = 0
          sound.play().catch(() => {})
        } catch {}
      }
      if (i >= text.length) {
        clearInterval(id)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(id)
  }, [text])
  return <span className={className}>{shown}</span>
}

// ------------------------------------------------------------
// Scanline & CRT overlays
// ------------------------------------------------------------
function Vignette() {
  return (
    <div className="pointer-events-none absolute inset-0" style={{
      boxShadow: 'inset 0 0 200px rgba(0,0,0,0.6)'
    }} />
  )
}

function Scanlines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(0,255,0,0.06) 0px, rgba(0,255,0,0.06) 1px, transparent 2px, transparent 3px)'
      }}
    />
  )
}

function Flicker() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0.05 }}
      animate={{ opacity: [0.05, 0.12, 0.05, 0.1, 0.06] }}
      transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
      style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(10,255,80,0.05) 100%)' }}
    />
  )
}

// ------------------------------------------------------------
// Sound system (placeholders) – supply your own audio files in public/sounds
// ------------------------------------------------------------
function useSounds() {
  const refs = React.useRef<Record<SoundKey, HTMLAudioElement | null>>({
    type: null,
    buzz: null,
    alarm: null,
  })
  React.useEffect(() => {
    refs.current.type = new Audio('/sounds/type.mp3')
    refs.current.buzz = new Audio('/sounds/electric-buzz.mp3')
    refs.current.alarm = new Audio('/sounds/alarm.mp3')
    if (refs.current.buzz) {
      refs.current.buzz.loop = true
      refs.current.buzz.volume = 0.25
    }
  }, [])
  return refs
}

// ------------------------------------------------------------
// Matrix Rain Overlay (win effect)
// ------------------------------------------------------------
function MatrixRain({ active }: { active: boolean }) {
  const ref = React.useRef<HTMLCanvasElement | null>(null)
  React.useEffect(() => {
    if (!active) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let animationFrame: number
    let columns: number
    let drops: number[] = []
    const glyphs = 'アカサタナハマヤラワ0123456789$#+=-｡ﾊﾐﾑﾒ'

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const fontSize = 16
      columns = Math.floor(canvas.width / fontSize)
      drops = new Array(columns).fill(1)
      ctx.font = `${fontSize}px VT323, ui-monospace, SFMono-Regular, Menlo, monospace`
    }

    function draw() {
      if (!canvas) return
      ctx.fillStyle = 'rgba(0,0,0,0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < drops.length; i++) {
        const text = glyphs.charAt(Math.floor(Math.random() * glyphs.length))
        ctx.fillStyle = '#42ff78'
        ctx.fillText(text, i * 16, drops[i] * 16)
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      animationFrame = requestAnimationFrame(draw)
    }

    resize()
    draw()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animationFrame)
      ro.disconnect()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [active])

  return (
    <canvas
      ref={ref}
      className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${active ? 'opacity-70' : 'opacity-0'}`}
    />
  )
}

// ------------------------------------------------------------
// ASCII Skull Overlay (win)
// ------------------------------------------------------------
function AsciiSkull({ active }: { active: boolean }) {
  const skull = `
            .ed"""" """"ed.
          .e"  .eeeeeeee.  "e.
        .e" .e"        "e.  "e.
       /  .e"  .eeeeee.  "e.  \
      /  /   .e"      "e.  \   \
     |  |   |  .eeee.  |   |   |
     |  |   |  |\\  //| |   |   |
     |  |   |  | \\// | |   |   |
     |  |   |  |  \/  | |   |   |
      \  \   \  \____/  /   /  /
       \  "e.  "-.__.-"  .e"  /
        "e.  """""""""  .e"
          "e.          .e"
            """"""""""`
  return (
    <pre className={`absolute inset-0 flex items-center justify-center text-green-400 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl tracking-tighter font-[VT323] transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
      {skull}
    </pre>
  )
}

// ------------------------------------------------------------
// Glitchy Hack Icon (SVG) – data bars + flowing streams
// ------------------------------------------------------------
function FlashHackIcon({ hacking, win, fail }: { hacking: boolean; win: boolean; fail: boolean }) {
  const statusColor = win ? '#42ff78' : fail ? '#f87171' : '#00c6ff'
  const bars = new Array(12).fill(0)
  return (
    <div className="flex items-center justify-center h-64 w-full">
      <motion.svg
        width="360"
        height="180"
        viewBox="0 0 360 180"
        initial={false}
        animate={{ scale: hacking ? 1.03 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="drop-shadow-[0_0_20px_rgba(0,255,160,0.15)]"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Terminal bezel */}
        <rect x="10" y="10" width="340" height="120" rx="8" fill="#0b0f0c" stroke={statusColor} strokeWidth="2" filter="url(#glow)" />

        {/* Flowing data streams */}
        {bars.map((_, i) => (
          <motion.rect
            key={i}
            x={20 + i * 26}
            y={20}
            width="14"
            height="100"
            rx="3"
            fill={statusColor}
            opacity={0.35}
            animate={hacking ? { height: [20, 80, 50, 100, 30, 60], y: [100, 40, 60, 20, 90, 50] } : { height: 40, y: 80 }}
            transition={{ repeat: Infinity, duration: 1.6 + (i % 5) * 0.15, ease: 'easeInOut' }}
          />
        ))}

        {/* Glitch sweep */}
        <motion.rect
          x="10"
          y="10"
          width="340"
          height="120"
          rx="8"
          fill="transparent"
          stroke={statusColor}
          strokeWidth="1"
          opacity={0.18}
          animate={hacking ? { x: [10, 12, 8, 10] } : { x: 10 }}
          transition={{ repeat: Infinity, duration: 0.25 }}
        />

        {/* Status light */}
        <motion.circle cx="330" cy="140" r="6" fill={statusColor} animate={{ opacity: hacking ? [0.2, 1, 0.4] : 1 }} transition={{ repeat: Infinity, duration: 1.2 }} />
        <text x="20" y="145" fill={statusColor} fontFamily="VT323, ui-monospace, monospace" fontSize="16">
          {win ? 'ACCESS GRANTED' : fail ? 'ACCESS DENIED' : 'READY'}
        </text>
      </motion.svg>
    </div>
  )
}

// ------------------------------------------------------------
// Main Component
// ------------------------------------------------------------
function FlashHack() {
  useVT323Font()

  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [hacking, setHacking] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [fail, setFail] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState<number | null>(null)
  const [side, setSide] = React.useState<Side>('hack')
  const [wager, setWager] = useWagerInput()

  const [consoleLog, setConsoleLog] = React.useState<string>('Ready to initiate system breach.')
  const [logQueue, setLogQueue] = React.useState<string[]>([])

  const sounds = useSounds()

  // Rotate logs while hacking
  React.useEffect(() => {
    let id: number | undefined
    if (hacking) {
      // start buzz
      sounds.current.buzz?.play().catch(() => {})
      setLogQueue(shuffle(HACK_LOGS).slice(0, 6))
      setConsoleLog('breach.exe running…')
      id = window.setInterval(() => {
        setLogQueue((q) => {
          if (q.length === 0) return q
          const [head, ...rest] = q
          setConsoleLog(head)
          return rest
        })
      }, 900)
    } else {
      sounds.current.buzz?.pause()
      sounds.current.buzz && (sounds.current.buzz.currentTime = 0)
    }
    return () => {
      if (id) window.clearInterval(id)
    }
  }, [hacking])

  React.useEffect(() => {
    if (fail) {
      sounds.current.alarm?.play().catch(() => {})
    }
  }, [fail])

  const play = async () => {
    try {
      setWin(false)
      setFail(false)
      setHacking(true)

      await game.play({
        bet: [...(SIDES[side] as number[])],
        wager,
        metadata: [side],
      })

      const result = await game.result()
      setResultIndex(result.resultIndex)

      if (result.payout > 0) {
        setWin(true)
      } else {
        setFail(true)
      }
    } finally {
      setHacking(false)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameScreenFrame
          {...(useGameMeta('flashhack') && {
            title: useGameMeta('flashhack')!.name,
            description: useGameMeta('flashhack')!.description,
          })}
        >
          {/* CRT BACKDROP */}
          <div className="relative min-h-[420px] w-full overflow-hidden rounded-2xl"
               style={{ background: 'radial-gradient(1200px 600px at 50% -20%, #0a0a0a 20%, #050505 60%, #000 100%)' }}>
            <Scanlines />
            <Vignette />
            <Flicker />

            {/* Glitchy heading */}
            <motion.h2
              className="absolute top-4 left-4 text-green-400 tracking-widest text-xl md:text-2xl font-[VT323] select-none"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              SYSTEM BREACH INTERFACE
            </motion.h2>

            {/* Failure flashing border */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: '0 0 0 2px rgba(248,113,113,0.0), 0 0 30px rgba(248,113,113,0.0) inset' }}
              animate={fail ? { boxShadow: ['0 0 0 2px rgba(248,113,113,0.6), 0 0 40px rgba(248,113,113,0.45) inset', '0 0 0 2px rgba(248,113,113,0.0), 0 0 10px rgba(248,113,113,0.0) inset'] } : {}}
              transition={{ repeat: fail ? Infinity : 0, duration: 0.6, ease: 'easeInOut' }}
            />

            {/* Main content */}
            <div className="relative flex flex-col items-center justify-center px-4 pt-16 pb-6">
              <FlashHackIcon hacking={hacking} win={win} fail={fail} />

              {/* Terminal Output (typed) */}
              <div className="mt-3 text-green-300 font-[VT323] text-lg md:text-xl">
                <TypingText text={`> ${consoleLog}`} sound={sounds.current.type} />
              </div>

              <AnimatePresence>
                {win && !hacking && (
                  <motion.div
                    key="win"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-green-400 font-bold text-xl mt-4 font-[VT323] tracking-widest"
                  >
                    {'>'} ACCESS GRANTED — Data Extracted!
                  </motion.div>
                )}
                {fail && !hacking && (
                  <motion.div
                    key="fail"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 font-bold text-xl mt-4 font-[VT323] tracking-widest"
                  >
                    {'>'} ACCESS DENIED — Firewall Triggered!
                  </motion.div>
                )}
                {!hacking && !win && !fail && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-green-600/70 mt-3 font-[VT323]"
                  >
                    {'>'} Ready to initiate system breach.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Overlays for win state */}
              <MatrixRain active={win && !hacking} />
              <AsciiSkull active={win && !hacking} />
            </div>

            {/* Audio elements not visible – optional if you want native controls */}
            {/* <audio src="/sounds/type.mp3" preload="auto" /> */}
          </div>
        </GameScreenFrame>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={gamba.isPlaying || hacking}
          playText="Hack"
        >
          <OptionSelector
            label="Action"
            options={[
              { value: 'hack', label: 'Hack' },
              { value: 'locked', label: 'Locked' },
            ]}
            selected={side}
            onSelect={setSide}
            disabled={gamba.isPlaying || hacking}
          />
        </MobileControls>
        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <EnhancedButton
            disabled={gamba.isPlaying || hacking}
            onClick={() => setSide(side === 'hack' ? 'locked' : 'hack')}
          >
            {side === 'hack' ? 'Hack' : 'Locked'}
          </EnhancedButton>
          <EnhancedPlayButton onClick={play} disabled={gamba.isPlaying || hacking}>
            Hack
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}

export default FlashHack

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

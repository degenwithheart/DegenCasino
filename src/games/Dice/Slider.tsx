import React, { useRef, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'

interface SliderProps {
  min: number
  max: number
  // If value is a tuple this is a range slider
  value: number | [number, number]
  onChange: (value: number | [number, number]) => void
  disabled?: boolean
}

const Container = styled.div`
  position: relative;
  width: 100%;
  user-select: none;
`

const Track = styled.div`
  position: relative;
  height: 14px;
  border-radius: 10px;
  background: rgba(255,255,255,0.06);
  overflow: visible;
`

const RangeFill = styled.div`
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg,#48bb78,#38a169);
  border-radius: 10px;
`

const Thumb = styled.div<{ $left: number; $active?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid rgba(0,0,0,0.25);
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  transition: box-shadow .12s ease, transform .08s ease;
  cursor: pointer;
  left: ${p => p.$left}%;

  ${p => p.$active && css`
    transform: translate(-50%, -50%) scale(1.06);
    box-shadow: 0 6px 20px rgba(0,0,0,0.32);
  `}
`

const Label = styled.div<{ $left: number; $active?: boolean }>`
  position: absolute;
  top: -28px;
  transform: translateX(-50%);
  left: ${p => p.$left}%;
  background: rgba(50,41,67,0.12);
  padding: 4px 8px;
  border-radius: 8px;
  color: #ff949f;
  font-size: 12px;
  min-width: 28px;
  text-align: center;
  ${p => p.$active && css` color: #94ff94; `}
`

export default function Slider({ min, max, value, onChange, disabled }: SliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState<null | 'min' | 'max'>(null)
  const isRange = Array.isArray(value)
  const [localMin, localMax] = isRange ? value as [number, number] : [min, value as number]

  // Helper to convert clientX -> percent
  const clientXToPct = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return 0
    let pct = ((clientX - rect.left) / rect.width) * 100
    pct = Math.max(0, Math.min(100, pct))
    console.debug('[SLIDER-DEBUG] clientXToPct:', { clientX, pct, rect: { left: rect.left, width: rect.width } })
    return pct
  }

  useEffect(() => {
    if (disabled) return
    let move: ((e: PointerEvent) => void) | null = null
    let up: ((e: PointerEvent) => void) | null = null

    move = (e: PointerEvent) => {
      console.debug('[SLIDER-DEBUG] pointermove event', { active, clientX: e.clientX })
      if (!active) return
      const pct = clientXToPct(e.clientX)
      const valueSpan = max - min
      const val = Math.round(min + (pct / 100) * valueSpan)
      console.debug('[SLIDER-DEBUG] computed', { pct, val, localMin, localMax })
      if (active === 'min') {
        const next = Math.min(val, localMax - 1)
        console.debug('[SLIDER-DEBUG] set min ->', next)
        onChange([Math.max(min, next), localMax])
      } else {
        const next = Math.max(val, localMin + 1)
        console.debug('[SLIDER-DEBUG] set max ->', next)
        onChange([localMin, Math.min(max, next)])
      }
    }

    up = () => {
      console.debug('[SLIDER-DEBUG] pointerup')
      setActive(null)
      if (move) window.removeEventListener('pointermove', move)
      if (up) window.removeEventListener('pointerup', up)
    }

    if (active) {
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    }

    return () => {
      if (move) window.removeEventListener('pointermove', move)
      if (up) window.removeEventListener('pointerup', up)
    }
  }, [active, localMin, localMax, min, max, onChange, disabled])

  // Decide which thumb is closest when clicking the track; only grab if within threshold
  const handlePointerDownOnTrack = (e: React.PointerEvent) => {
    console.debug('[SLIDER-DEBUG] track pointerdown', { clientX: e.clientX, isRange, disabled })
    if (!isRange || disabled) return
    const pct = clientXToPct(e.clientX)
    const valueSpan = max - min
    const clickedVal = Math.round(min + (pct / 100) * valueSpan)
    const distMin = Math.abs(clickedVal - localMin)
    const distMax = Math.abs(clickedVal - localMax)
    const threshold = Math.max(2, valueSpan * 0.06) // 6% of span or min 2 units
    console.debug('[SLIDER-DEBUG] track hit testing', { pct, clickedVal, distMin, distMax, threshold })
    if (distMin <= threshold && distMin <= distMax) {
      console.debug('[SLIDER-DEBUG] grabbing min')
      setActive('min')
    } else if (distMax <= threshold) {
      console.debug('[SLIDER-DEBUG] grabbing max')
      setActive('max')
    } else {
      console.debug('[SLIDER-DEBUG] track click ignored (not near a thumb)')
      // Don't jump thumbs when clicking the track
    }
  }

  const pctOf = (v: number) => ((v - min) / (max - min)) * 100

  return (
    <Container>
      <div ref={containerRef} onPointerDown={handlePointerDownOnTrack}>
        <Track>
          {isRange ? (
            <>
              <RangeFill style={{ left: `${pctOf(localMin)}%`, width: `${pctOf(localMax) - pctOf(localMin)}%` }} />
              <Thumb
                $left={pctOf(localMin)}
                $active={active === 'min'}
                onPointerDown={(e) => { e.stopPropagation(); console.debug('[SLIDER-DEBUG] thumb min pointerdown', { clientX: (e as any).clientX }); setActive('min') }}
              />
              <Thumb
                $left={pctOf(localMax)}
                $active={active === 'max'}
                onPointerDown={(e) => { e.stopPropagation(); console.debug('[SLIDER-DEBUG] thumb max pointerdown', { clientX: (e as any).clientX }); setActive('max') }}
              />
            </>
          ) : (
            <>
              <RangeFill style={{ left: 0, width: `${pctOf(value as number)}%` }} />
              <Thumb $left={pctOf(value as number)} $active={false} onPointerDown={(e) => { e.stopPropagation(); console.debug('[SLIDER-DEBUG] single thumb pointerdown') }} />
            </>
          )}
        </Track>
      </div>

      {/* Labels - 5 ticks */}
      {Array.from({ length: 5 }).map((_, i) => {
        const labelVal = Math.round(min + (i / 4) * (max - min))
        const left = pctOf(labelVal)
        return (
          <Label key={i} $left={left} $active={(isRange ? (localMin <= labelVal) : (value as number) >= labelVal)}>
            {labelVal}
          </Label>
        )
      })}
    </Container>
  )
}

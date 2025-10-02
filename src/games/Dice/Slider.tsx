import React, { useRef, useState, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'
import DICE_THEME from './theme'

type DiceMode = 'under' | 'over' | 'between' | 'outside'

interface SliderProps {
  min: number
  max: number
  // If value is a tuple this is a range slider
  value: number | [number, number]
  onChange: (value: number | [number, number]) => void
  disabled?: boolean
  mode?: DiceMode
  // optional external ref to the container (keeps existing code using sliderRef happy)
  containerRef?: React.RefObject<HTMLDivElement>
}

// Small centralized theme tokens (kept local to this component for now)
const THEME = DICE_THEME.colors

const Container = styled.div`
  position: relative;
  width: 100%;
  user-select: none;
`

const Track = styled.div`
  position: relative;
  height: 18px;
  border-radius: 12px;
  background: ${THEME.trackBg};
  overflow: visible;
`

const GreenFill = styled.div`
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, ${THEME.greenStart}, ${THEME.greenEnd});
  border-radius: 12px;
`

const RedFill = styled.div`
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, ${THEME.redStart}, ${THEME.redEnd});
  border-radius: 12px;
`

const Thumb = styled.div<{ $left: number; $active?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(180deg, ${THEME.thumbLightStart}, ${THEME.thumbLightEnd});
  border: 2px solid ${THEME.thumbBorder};
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
  transition: box-shadow .12s ease, transform .08s ease;
  cursor: pointer;
  left: ${p => p.$left}%;

  ${p => p.$active && css`
    transform: translate(-50%, -50%) scale(1.06);
    box-shadow: 0 8px 28px rgba(0,0,0,0.36);
  `}
`

const Label = styled.div<{ $left: number; $active?: boolean }>`
  position: absolute;
  top: -28px;
  transform: translateX(-50%);
  left: ${p => p.$left}%;
  background: ${THEME.labelBg};
  padding: 4px 8px;
  border-radius: 8px;
  color: ${THEME.labelColor};
  font-size: 12px;
  min-width: 28px;
  text-align: center;
  ${p => p.$active && css` color: ${THEME.activeLabelColor}; `}
`

const floatIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -6px) scale(0.96); }
  to   { opacity: 1; transform: translate(-50%, 0) scale(1); }
`

const Tooltip = styled.div<{ $left: number }>`
  position: absolute;
  top: -48px;
  transform: translateX(-50%);
  left: ${p => p.$left}%;
  background: rgba(20,20,30,0.95);
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 6px 18px rgba(0,0,0,0.4);
  animation: ${floatIn} 120ms ease-out;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(20,20,30,0.95);
  }
`

export default function Slider({ min, max, value, onChange, disabled, mode, containerRef: externalRef }: SliderProps) {
  const internalRef = useRef<HTMLDivElement | null>(null)
  const containerRef = externalRef ?? internalRef
  const [active, setActive] = useState<null | 'min' | 'max' | 'single'>(null)
  const isRange = Array.isArray(value)
  const [localMin, localMax] = isRange ? (value as [number, number]) : [min, value as number]

  // Helper to convert clientX -> percent
  const clientXToPct = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return 0
    let pct = ((clientX - rect.left) / rect.width) * 100
    pct = Math.max(0, Math.min(100, pct))
    return pct
  }

  useEffect(() => {
    if (disabled) return
    let move: ((e: PointerEvent) => void) | null = null
    let up: ((e: PointerEvent) => void) | null = null

    move = (e: PointerEvent) => {
      if (!active) return
      const pct = clientXToPct(e.clientX)
      const valueSpan = max - min
      const val = Math.round(min + (pct / 100) * valueSpan)

      if (isRange) {
        if (active === 'min') {
          const next = Math.min(val, localMax - 1)
          onChange([Math.max(min, next), localMax])
        } else if (active === 'max') {
          const next = Math.max(val, localMin + 1)
          onChange([localMin, Math.min(max, next)])
        }
      } else {
        // single thumb
        const next = Math.max(min, Math.min(max, val))
        onChange(next)
      }
    }

    up = () => {
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
  }, [active, localMin, localMax, min, max, onChange, disabled, isRange])

  // Decide which thumb is closest when clicking the track; only grab if within threshold
  const handlePointerDownOnTrack = (e: React.PointerEvent) => {
    if (disabled) return
    const pct = clientXToPct(e.clientX)
    const valueSpan = max - min
    const clickedVal = Math.round(min + (pct / 100) * valueSpan)

    if (!isRange) {
      // single mode: jump to value and begin dragging
      onChange(clickedVal)
      setActive('single')
      return
    }

    const distMin = Math.abs(clickedVal - localMin)
    const distMax = Math.abs(clickedVal - localMax)
    const threshold = Math.max(2, valueSpan * 0.06) // 6% of span or min 2 units
    if (distMin <= threshold && distMin <= distMax) {
      setActive('min')
    } else if (distMax <= threshold) {
      setActive('max')
    } else {
      // ignore track click if not near a thumb
    }
  }

  const pctOf = (v: number) => ((v - min) / (max - min)) * 100

  return (
    <Container>
      <div ref={containerRef} onPointerDown={handlePointerDownOnTrack}>
        <Track>
          {/* Mode-aware fills */}
          {isRange ? (
            <>
              {mode === 'outside' ? (
                <>
                  {/* left outer green area: from 0 to localMin */}
                  <GreenFill style={{ left: 0, width: `${pctOf(localMin)}%` }} />
                  {/* right outer green area: from localMax to 100 */}
                  <GreenFill style={{ left: `${pctOf(localMax)}%`, width: `${100 - pctOf(localMax)}%` }} />
                  {/* middle red area: from localMin to localMax */}
                  <RedFill style={{ left: `${pctOf(localMin)}%`, width: `${pctOf(localMax) - pctOf(localMin)}%` }} />
                </>
              ) : (
                <>
                  <GreenFill style={{ left: `${pctOf(localMin)}%`, width: `${pctOf(localMax) - pctOf(localMin)}%` }} />
                  <RedFill style={{ left: 0, width: `${pctOf(localMin)}%` }} />
                  <RedFill style={{ left: `${pctOf(localMax)}%`, width: `${100 - pctOf(localMax)}%` }} />
                </>
              )}

              <Thumb
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={localMin}
                $left={pctOf(localMin)}
                $active={active === 'min'}
                onPointerDown={(e) => { e.stopPropagation(); setActive('min') }}
              />
              {active === 'min' && <Tooltip $left={pctOf(localMin)}>{localMin}</Tooltip>}
              <Thumb
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={localMax}
                $left={pctOf(localMax)}
                $active={active === 'max'}
                onPointerDown={(e) => { e.stopPropagation(); setActive('max') }}
              />
              {active === 'max' && <Tooltip $left={pctOf(localMax)}>{localMax}</Tooltip>}
            </>
          ) : (
            <>
              {mode === 'over' ? (
                <>
                  <GreenFill style={{ left: `${pctOf(value as number)}%`, width: `${100 - pctOf(value as number)}%` }} />
                  <RedFill style={{ left: 0, width: `${pctOf(value as number)}%` }} />
                </>
              ) : (
                <>
                  <GreenFill style={{ left: 0, width: `${pctOf(value as number)}%` }} />
                  <RedFill style={{ left: `${pctOf(value as number)}%`, width: `${100 - pctOf(value as number)}%` }} />
                </>
              )}

              <Thumb
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value as number}
                $left={pctOf(value as number)}
                $active={active === 'single'}
                onPointerDown={(e) => { e.stopPropagation(); setActive('single') }}
              />
              {active === 'single' && <Tooltip $left={pctOf(value as number)}>{value as number}</Tooltip>}
            </>
          )}
        </Track>
      </div>

      {/* Labels - 5 ticks */}
      {Array.from({ length: 5 }).map((_, i) => {
        const labelVal = Math.round(min + (i / 4) * (max - min))
        const left = pctOf(labelVal)
        return (
          <Label key={i} $left={left} $active={(isRange ? (localMin <= labelVal && labelVal <= localMax) : (value as number) >= labelVal)}>
            {labelVal}
          </Label>
        )
      })}
    </Container>
  )
}
